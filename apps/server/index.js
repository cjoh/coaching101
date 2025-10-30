const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs').promises;
const { marked } = require('marked');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {
    run,
    get,
    all
} = require('./db');
const {
    hashPassword,
    verifyPassword,
    signToken,
    setAuthCookie,
    clearAuthCookie,
    authenticate,
    requireAdmin
} = require('./auth');
const { getSections, getAllSections } = require('./sectionParser');
const { generateManual } = require('../../scripts/generate-manual');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(',').map(url => url.trim()) : '*',
        credentials: true
    }
});
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || null;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

const normalizeEmail = email => (email || '').trim().toLowerCase();
const isAdminEmail = email => ADMIN_EMAILS.includes(normalizeEmail(email));

const syncUserRole = async user => {
    if (!user) return null;
    if (!ADMIN_EMAILS.length) return user;

    const shouldBeAdmin = isAdminEmail(user.email);
    const desiredRole = shouldBeAdmin ? 'admin' : 'participant';

    if (user.role !== desiredRole) {
        await run('UPDATE users SET role = ? WHERE id = ?', [desiredRole, user.id]);
        return {
            ...user,
            role: desiredRole
        };
    }

    return user;
};

app.disable('x-powered-by');
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }

            if (!FRONTEND_ORIGIN) {
                return callback(null, true);
            }

            const allowedOrigins = FRONTEND_ORIGIN.split(',').map(url => url.trim());
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true
    })
);

const sanitizeUser = user => {
    if (!user) return null;
    const { password_hash, ...rest } = user;
    return rest;
};

const ensureModuleExists = async moduleId => {
    const moduleRow = await get('SELECT id FROM modules WHERE id = ?', [moduleId]);
    if (!moduleRow) {
        const error = new Error('Module not found');
        error.statusCode = 404;
        throw error;
    }
};

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const normalizedEmail = normalizeEmail(email);

        const existingUser = await get('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
        if (existingUser) {
            return res.status(409).json({ message: 'A user with that email already exists' });
        }

        const userCountRow = await get('SELECT COUNT(*) AS count FROM users');
        const isFirstUser = userCountRow?.count === 0;
        const isConfiguredAdmin = isAdminEmail(normalizedEmail);
        const role = isFirstUser || isConfiguredAdmin ? 'admin' : 'participant';

        const passwordHash = await hashPassword(password);

        await run(
            'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
            [normalizedEmail, passwordHash, name.trim(), role]
        );

        const user = await get(
            'SELECT id, email, name, role, created_at FROM users WHERE email = ?',
            [normalizedEmail]
        );

        const syncedUser = await syncUserRole(user) || user;

        const token = signToken(syncedUser);
        setAuthCookie(res, token);

        return res.status(201).json({ user: syncedUser });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Failed to register user' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = normalizeEmail(email);
        const user = await get('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let syncedUser = user;
        if (ADMIN_EMAILS.length) {
            syncedUser = await syncUserRole({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                created_at: user.created_at
            }) || syncedUser;
        }

        const token = signToken({ ...user, role: syncedUser.role });
        setAuthCookie(res, token);

        return res.json({ user: sanitizeUser({ ...user, role: syncedUser.role }) });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Failed to login' });
    }
});

app.post('/api/auth/logout', authenticate, async (req, res) => {
    clearAuthCookie(res);
    try {
        await run('DELETE FROM active_sessions WHERE user_id = ?', [req.user.id]);
    } catch (error) {
        console.warn('Error clearing active session on logout:', error);
    }
    return res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        let user = await get('SELECT id, email, name, role, created_at FROM users WHERE id = ?', [req.user.id]);
        if (user) {
            user = await syncUserRole(user) || user;
        }
        return res.json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Failed to fetch user' });
    }
});

app.get('/api/modules', authenticate, async (req, res) => {
    try {
        const modules = await all('SELECT id, name FROM modules ORDER BY name ASC');
        return res.json({ modules });
    } catch (error) {
        console.error('Error fetching modules:', error);
        return res.status(500).json({ message: 'Failed to fetch modules' });
    }
});

app.get('/api/modules/:moduleId/sections', authenticate, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { day } = req.query;

        await ensureModuleExists(moduleId);

        if (day) {
            // Get sections for a specific day
            const sections = await getSections(moduleId, parseInt(day, 10));
            return res.json({ day: parseInt(day, 10), sections });
        } else {
            // Get all sections for all days
            const allSections = await getAllSections(moduleId);
            return res.json({ sections: allSections });
        }
    } catch (error) {
        console.error('Error fetching sections:', error);
        return res.status(500).json({ message: 'Failed to fetch sections' });
    }
});

app.get('/api/progress/:moduleId', authenticate, async (req, res) => {
    try {
        const { moduleId } = req.params;
        await ensureModuleExists(moduleId);

        const progress = await get(
            `SELECT state_json, progress, updated_at
             FROM module_progress
             WHERE user_id = ? AND module_id = ?`,
            [req.user.id, moduleId]
        );

        if (!progress) {
            return res.json({ state: null, progress: 0, updatedAt: null });
        }

        return res.json({
            state: JSON.parse(progress.state_json),
            progress: progress.progress,
            updatedAt: progress.updated_at
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ message: error.message });
        }
        console.error('Error loading progress:', error);
        return res.status(500).json({ message: 'Failed to load progress' });
    }
});

app.put('/api/progress/:moduleId', authenticate, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { state, progress } = req.body;

        if (!state || typeof state !== 'object') {
            return res.status(400).json({ message: 'State payload must be an object' });
        }

        await ensureModuleExists(moduleId);

        await run(`DELETE FROM active_sessions WHERE updated_at < datetime('now', '-1 day')`);

        const normalizedProgress = Number.isFinite(progress)
            ? Math.min(100, Math.max(0, Math.round(progress)))
            : 0;

        await run(
            `INSERT INTO module_progress (user_id, module_id, state_json, progress)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(user_id, module_id) DO UPDATE SET
                state_json = excluded.state_json,
                progress = excluded.progress,
                updated_at = CURRENT_TIMESTAMP`,
            [req.user.id, moduleId, JSON.stringify(state), normalizedProgress]
        );

        return res.json({ message: 'Progress saved', progress: normalizedProgress });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ message: error.message });
        }
        console.error('Error saving progress:', error);
        return res.status(500).json({ message: 'Failed to save progress' });
    }
});

app.post('/api/engagement/:moduleId', authenticate, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { eventType, metadata } = req.body;

        if (!eventType) {
            return res.status(400).json({ message: 'eventType is required' });
        }

        await ensureModuleExists(moduleId);

        await run(
            `INSERT INTO engagement_events (user_id, module_id, event_type, metadata_json)
             VALUES (?, ?, ?, ?)`,
            [req.user.id, moduleId, eventType, metadata ? JSON.stringify(metadata) : null]
        );

        return res.status(201).json({ message: 'Engagement logged' });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ message: error.message });
        }
        console.error('Error logging engagement:', error);
        return res.status(500).json({ message: 'Failed to record engagement' });
    }
});

app.post('/api/session/presence', authenticate, async (req, res) => {
    try {
        const {
            moduleId,
            sectionId,
            sectionLabel,
            subsectionId,
            subsectionLabel,
            progress
        } = req.body;

        if (!moduleId) {
            return res.status(400).json({ message: 'moduleId is required' });
        }

        await ensureModuleExists(moduleId);

        const normalizedProgress = Number.isFinite(progress)
            ? Math.min(100, Math.max(0, Math.round(progress)))
            : 0;

        await run(
            `INSERT INTO active_sessions (
                user_id,
                module_id,
                section_id,
                section_label,
                subsection_id,
                subsection_label,
                progress
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id, module_id) DO UPDATE SET
                section_id = excluded.section_id,
                section_label = excluded.section_label,
                subsection_id = excluded.subsection_id,
                subsection_label = excluded.subsection_label,
                progress = excluded.progress,
                updated_at = CURRENT_TIMESTAMP`,
            [
                req.user.id,
                moduleId,
                sectionId || null,
                sectionLabel || null,
                subsectionId || null,
                subsectionLabel || null,
                normalizedProgress
            ]
        );

        return res.json({ message: 'Presence updated' });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ message: error.message });
        }
        // Handle foreign key constraint (likely invalid user_id from stale token)
        if (error.code === 'SQLITE_CONSTRAINT' && error.errno === 19) {
            console.warn('Foreign key constraint failed - likely stale auth token');
            return res.status(401).json({ message: 'Session invalid, please login again' });
        }
        console.error('Error updating session presence:', error);
        return res.status(500).json({ message: 'Failed to update presence' });
    }
});

app.get('/api/admin/progress', authenticate, requireAdmin, async (req, res) => {
    try {
        const rows = await all(
            `SELECT
                mp.id,
                mp.module_id,
                m.name AS module_name,
                mp.progress,
                mp.updated_at,
                u.id AS user_id,
                u.email,
                u.name
             FROM module_progress mp
             JOIN users u ON u.id = mp.user_id
             JOIN modules m ON m.id = mp.module_id
             ORDER BY mp.updated_at DESC`
        );

        return res.json({ progress: rows });
    } catch (error) {
        console.error('Error fetching progress overview:', error);
        return res.status(500).json({ message: 'Failed to fetch progress overview' });
    }
});

app.get('/api/admin/engagement', authenticate, requireAdmin, async (req, res) => {
    try {
        const rows = await all(
            `SELECT
                ee.id,
                ee.module_id,
                m.name AS module_name,
                ee.event_type,
                ee.metadata_json,
                ee.created_at,
                u.id AS user_id,
                u.email,
                u.name
             FROM engagement_events ee
             JOIN users u ON u.id = ee.user_id
             JOIN modules m ON m.id = ee.module_id
             ORDER BY ee.created_at DESC
             LIMIT 200`
        );

        const formatted = rows.map(row => ({
            ...row,
            metadata: row.metadata_json ? JSON.parse(row.metadata_json) : null
        }));

        return res.json({ events: formatted });
    } catch (error) {
        console.error('Error fetching engagement events:', error);
        return res.status(500).json({ message: 'Failed to fetch engagement events' });
    }
});

app.get('/api/admin/active-sessions', authenticate, requireAdmin, async (req, res) => {
    try {
        const rows = await all(
            `SELECT
                s.id,
                s.user_id,
                s.module_id,
                s.section_id,
                s.section_label,
                s.subsection_id,
                s.subsection_label,
                s.progress,
                s.updated_at,
                u.email,
                u.name,
                m.name AS module_name
             FROM active_sessions s
             JOIN users u ON u.id = s.user_id
             JOIN modules m ON m.id = s.module_id
             WHERE s.updated_at >= datetime('now', '-10 minutes')
             ORDER BY s.updated_at DESC`
        );

        return res.json({ sessions: rows });
    } catch (error) {
        console.error('Error fetching active sessions:', error);
        return res.status(500).json({ message: 'Failed to fetch active sessions' });
    }
});

app.get('/api/broadcast-position/:moduleId', authenticate, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const position = await get(
            `SELECT bp.*, u.name as updated_by_name
             FROM broadcast_position bp
             LEFT JOIN users u ON u.id = bp.updated_by
             WHERE bp.module_id = ?`,
            [moduleId]
        );

        if (!position) {
            return res.json({ position: null });
        }

        return res.json({ position });
    } catch (error) {
        console.error('Error fetching broadcast position:', error);
        return res.status(500).json({ message: 'Failed to fetch broadcast position' });
    }
});

app.post('/api/broadcast-position', authenticate, requireAdmin, async (req, res) => {
    try {
        const { moduleId, day, sectionId, sectionLabel, facilitatorGuideFile } = req.body;

        if (!moduleId || !day) {
            return res.status(400).json({ message: 'moduleId and day are required' });
        }

        await ensureModuleExists(moduleId);

        await run(
            `INSERT INTO broadcast_position (module_id, day, section_id, section_label, facilitator_guide_file, updated_by)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(module_id) DO UPDATE SET
                day = excluded.day,
                section_id = excluded.section_id,
                section_label = excluded.section_label,
                facilitator_guide_file = excluded.facilitator_guide_file,
                updated_by = excluded.updated_by,
                updated_at = CURRENT_TIMESTAMP`,
            [moduleId, day, sectionId, sectionLabel, facilitatorGuideFile, req.user.id]
        );

        const position = await get(
            `SELECT bp.*, u.name as updated_by_name
             FROM broadcast_position bp
             LEFT JOIN users u ON u.id = bp.updated_by
             WHERE bp.module_id = ?`,
            [moduleId]
        );

        io.emit('position-update', { moduleId, position });

        return res.json({ message: 'Position broadcast', position });
    } catch (error) {
        console.error('Error broadcasting position:', error);
        return res.status(500).json({ message: 'Failed to broadcast position' });
    }
});

app.get('/api/facilitator-guide/:moduleId', authenticate, requireAdmin, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { day, section } = req.query;

        if (!day) {
            return res.status(400).json({ message: 'Day parameter required' });
        }

        const contentBase = path.join(__dirname, '../../content', moduleId);
        let possiblePaths = [];

        // Universal search pattern for all modules:
        // 1. Session-specific guides (if section provided)
        // 2. Day-specific guides
        // 3. Day schedules
        // 4. Facilitator manuals

        if (section) {
            // Try to find session-specific guides in modular directory
            const modularBase = path.join(contentBase, 'manuals', 'modular', `day${day}`);
            const sectionClean = section.trim();

            // Pattern 1: Session number like "1.1" matches "Session_1.1_..."
            possiblePaths.push(path.join(modularBase, `*Session*${day}.${sectionClean}*.md`));

            // Pattern 2: Topic name like "Professional Boundaries"
            possiblePaths.push(path.join(modularBase, `*${sectionClean.replace(/\s+/g, '_')}*.md`));

            // Pattern 3: Numeric index like "01", "02"
            if (sectionClean.match(/^\d+$/)) {
                const paddedSection = sectionClean.padStart(2, '0');
                possiblePaths.push(path.join(modularBase, `${paddedSection} - *.md`));
                possiblePaths.push(path.join(modularBase, `${paddedSection}*.md`));
            }
        }

        // Fallback 1: Day-specific guides in manuals/guides/
        // Try multiple naming patterns to support different modules
        const guidesDir = path.join(contentBase, 'manuals', 'guides');
        possiblePaths.push(path.join(guidesDir, `*Day${day}_Guide.md`));
        possiblePaths.push(path.join(guidesDir, `*Day_${day}*.md`));

        // Fallback 2: Day schedules
        possiblePaths.push(path.join(contentBase, 'schedules', `Day${day}_Schedule.md`));

        // Fallback 3: General facilitator manual
        possiblePaths.push(path.join(contentBase, 'manuals', 'Facilitator_Manual.md'));
        possiblePaths.push(path.join(contentBase, 'manuals', '*manual.md'));

        // Try to read the first file that exists
        let content = null;
        let foundPath = null;

        for (const pathPattern of possiblePaths) {
            try {
                // Check if path contains glob pattern
                if (pathPattern.includes('*')) {
                    const glob = require('glob');
                    const matches = glob.sync(pathPattern);
                    if (matches.length > 0) {
                        // Take the first match
                        foundPath = matches[0];
                        content = await fs.readFile(foundPath, 'utf-8');
                        break;
                    }
                } else {
                    // Direct path check
                    if (!pathPattern.startsWith(path.join(__dirname, '../../content'))) {
                        continue; // Skip unsafe paths
                    }
                    content = await fs.readFile(pathPattern, 'utf-8');
                    foundPath = pathPattern;
                    break;
                }
            } catch (error) {
                // File doesn't exist, try next option
                continue;
            }
        }

        if (!content) {
            return res.status(404).json({
                message: 'Facilitator guide not found',
                searched: possiblePaths
            });
        }

        const html = marked(content);
        const fileName = path.basename(foundPath);

        return res.json({
            markdown: content,
            html,
            fileName
        });
    } catch (error) {
        console.error('Error reading facilitator guide:', error);
        return res.status(500).json({ message: 'Failed to read facilitator guide' });
    }
});

app.post('/api/questions', authenticate, async (req, res) => {
    try {
        const { moduleId, questionText } = req.body;

        if (!moduleId || !questionText || !questionText.trim()) {
            return res.status(400).json({ message: 'moduleId and questionText are required' });
        }

        await ensureModuleExists(moduleId);

        await run(
            `INSERT INTO student_questions (user_id, user_name, module_id, question_text)
             VALUES (?, ?, ?, ?)`,
            [req.user.id, req.user.name, moduleId, questionText.trim()]
        );

        const question = await get(
            `SELECT * FROM student_questions WHERE id = last_insert_rowid()`
        );

        io.emit('new-question', { moduleId, question });

        return res.status(201).json({ message: 'Question submitted', question });
    } catch (error) {
        console.error('Error submitting question:', error);
        return res.status(500).json({ message: 'Failed to submit question' });
    }
});

app.get('/api/questions/:moduleId', authenticate, requireAdmin, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const questions = await all(
            `SELECT * FROM student_questions
             WHERE module_id = ?
             ORDER BY created_at DESC`,
            [moduleId]
        );

        return res.json({ questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        return res.status(500).json({ message: 'Failed to fetch questions' });
    }
});

app.put('/api/questions/:id/answer', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { answerText } = req.body;

        await run(
            `UPDATE student_questions
             SET is_answered = 1, answered_at = CURRENT_TIMESTAMP, answer_text = ?
             WHERE id = ?`,
            [answerText, id]
        );

        const question = await get(`SELECT * FROM student_questions WHERE id = ?`, [id]);
        io.emit('question-answered', { question });

        return res.json({ message: 'Question answered', question });
    } catch (error) {
        console.error('Error answering question:', error);
        return res.status(500).json({ message: 'Failed to answer question' });
    }
});

// ============================================================================
// CONTENT MANAGEMENT API ROUTES
// ============================================================================

// Courses
app.get('/api/admin/courses', authenticate, requireAdmin, async (req, res) => {
    try {
        const courses = await all(`
            SELECT c.*, COUNT(DISTINCT cd.id) as day_count, COUNT(DISTINCT cs.id) as session_count
            FROM courses c
            LEFT JOIN course_days cd ON c.id = cd.course_id
            LEFT JOIN course_sessions cs ON c.id = cs.course_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `);
        return res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        return res.status(500).json({ message: 'Failed to fetch courses' });
    }
});

app.get('/api/admin/courses/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const course = await get('SELECT * FROM courses WHERE id = ?', [id]);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        return res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        return res.status(500).json({ message: 'Failed to fetch course' });
    }
});

app.post('/api/admin/courses', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id, name, description, duration_days } = req.body;

        if (!id || !name) {
            return res.status(400).json({ message: 'Course ID and name are required' });
        }

        // Check if course ID already exists
        const existing = await get('SELECT id FROM courses WHERE id = ?', [id]);
        if (existing) {
            return res.status(409).json({ message: 'Course ID already exists' });
        }

        await run(
            'INSERT INTO courses (id, name, description, duration_days, created_by) VALUES (?, ?, ?, ?, ?)',
            [id, name, description || '', duration_days || 3, req.user.id]
        );

        // Auto-create days based on duration
        const days = duration_days || 3;
        for (let i = 1; i <= days; i++) {
            await run(
                'INSERT INTO course_days (course_id, day_number, title, description) VALUES (?, ?, ?, ?)',
                [id, i, `Day ${i}`, '']
            );
        }

        const course = await get('SELECT * FROM courses WHERE id = ?', [id]);
        return res.status(201).json(course);
    } catch (error) {
        console.error('Error creating course:', error);
        return res.status(500).json({ message: 'Failed to create course' });
    }
});

app.put('/api/admin/courses/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, duration_days, is_active } = req.body;

        const course = await get('SELECT * FROM courses WHERE id = ?', [id]);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await run(
            `UPDATE courses
             SET name = ?, description = ?, duration_days = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [name, description, duration_days, is_active !== undefined ? (is_active ? 1 : 0) : course.is_active, id]
        );

        const updated = await get('SELECT * FROM courses WHERE id = ?', [id]);
        return res.json(updated);
    } catch (error) {
        console.error('Error updating course:', error);
        return res.status(500).json({ message: 'Failed to update course' });
    }
});

app.delete('/api/admin/courses/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const course = await get('SELECT * FROM courses WHERE id = ?', [id]);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await run('DELETE FROM courses WHERE id = ?', [id]);
        return res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        return res.status(500).json({ message: 'Failed to delete course' });
    }
});

// Days
app.get('/api/admin/courses/:courseId/days', authenticate, requireAdmin, async (req, res) => {
    try {
        const { courseId } = req.params;

        const days = await all(`
            SELECT cd.*, COUNT(cs.id) as session_count
            FROM course_days cd
            LEFT JOIN course_sessions cs ON cd.id = cs.day_id
            WHERE cd.course_id = ?
            GROUP BY cd.id
            ORDER BY cd.day_number ASC
        `, [courseId]);

        return res.json(days);
    } catch (error) {
        console.error('Error fetching days:', error);
        return res.status(500).json({ message: 'Failed to fetch days' });
    }
});

app.get('/api/admin/days/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const day = await get('SELECT * FROM course_days WHERE id = ?', [id]);

        if (!day) {
            return res.status(404).json({ message: 'Day not found' });
        }

        return res.json(day);
    } catch (error) {
        console.error('Error fetching day:', error);
        return res.status(500).json({ message: 'Failed to fetch day' });
    }
});

app.put('/api/admin/days/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, schedule_markdown } = req.body;

        const day = await get('SELECT * FROM course_days WHERE id = ?', [id]);
        if (!day) {
            return res.status(404).json({ message: 'Day not found' });
        }

        await run(
            `UPDATE course_days
             SET title = ?, description = ?, schedule_markdown = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [title, description, schedule_markdown, id]
        );

        const updated = await get('SELECT * FROM course_days WHERE id = ?', [id]);
        return res.json(updated);
    } catch (error) {
        console.error('Error updating day:', error);
        return res.status(500).json({ message: 'Failed to update day' });
    }
});

// Sessions
app.get('/api/admin/days/:dayId/sessions', authenticate, requireAdmin, async (req, res) => {
    try {
        const { dayId } = req.params;

        const sessions = await all(
            `SELECT * FROM course_sessions
             WHERE day_id = ?
             ORDER BY sort_order ASC, session_number ASC`,
            [dayId]
        );

        return res.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return res.status(500).json({ message: 'Failed to fetch sessions' });
    }
});

app.get('/api/admin/sessions/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const session = await get('SELECT * FROM course_sessions WHERE id = ?', [id]);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        return res.json(session);
    } catch (error) {
        console.error('Error fetching session:', error);
        return res.status(500).json({ message: 'Failed to fetch session' });
    }
});

app.post('/api/admin/days/:dayId/sessions', authenticate, requireAdmin, async (req, res) => {
    try {
        const { dayId } = req.params;
        const { session_number, title, duration_minutes } = req.body;

        if (!session_number || !title) {
            return res.status(400).json({ message: 'Session number and title are required' });
        }

        const day = await get('SELECT * FROM course_days WHERE id = ?', [dayId]);
        if (!day) {
            return res.status(404).json({ message: 'Day not found' });
        }

        // Get next sort order
        const lastSession = await get(
            'SELECT MAX(sort_order) as max_order FROM course_sessions WHERE day_id = ?',
            [dayId]
        );
        const sortOrder = (lastSession?.max_order ?? -1) + 1;

        const result = await run(
            `INSERT INTO course_sessions
             (course_id, day_id, session_number, title, duration_minutes, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [day.course_id, dayId, session_number, title, duration_minutes || 60, sortOrder]
        );

        const sessionId = result.lastID;

        // Create empty content placeholders
        for (const contentType of ['facilitator_guide', 'coaches_manual', 'worksheet']) {
            await run(
                'INSERT INTO session_content (session_id, content_type, markdown_content) VALUES (?, ?, ?)',
                [sessionId, contentType, '']
            );
        }

        const session = await get('SELECT * FROM course_sessions WHERE id = ?', [sessionId]);
        return res.status(201).json(session);
    } catch (error) {
        console.error('Error creating session:', error);
        return res.status(500).json({ message: 'Failed to create session' });
    }
});

app.put('/api/admin/sessions/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { session_number, title, duration_minutes, sort_order } = req.body;

        const session = await get('SELECT * FROM course_sessions WHERE id = ?', [id]);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        await run(
            `UPDATE course_sessions
             SET session_number = ?, title = ?, duration_minutes = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [session_number, title, duration_minutes, sort_order !== undefined ? sort_order : session.sort_order, id]
        );

        const updated = await get('SELECT * FROM course_sessions WHERE id = ?', [id]);
        return res.json(updated);
    } catch (error) {
        console.error('Error updating session:', error);
        return res.status(500).json({ message: 'Failed to update session' });
    }
});

app.delete('/api/admin/sessions/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const session = await get('SELECT * FROM course_sessions WHERE id = ?', [id]);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        await run('DELETE FROM course_sessions WHERE id = ?', [id]);
        return res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Error deleting session:', error);
        return res.status(500).json({ message: 'Failed to delete session' });
    }
});

// Session Content
app.get('/api/admin/sessions/:sessionId/content/:type', authenticate, requireAdmin, async (req, res) => {
    try {
        const { sessionId, type } = req.params;

        if (!['facilitator_guide', 'coaches_manual', 'worksheet'].includes(type)) {
            return res.status(400).json({ message: 'Invalid content type' });
        }

        const content = await get(
            'SELECT * FROM session_content WHERE session_id = ? AND content_type = ?',
            [sessionId, type]
        );

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        return res.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        return res.status(500).json({ message: 'Failed to fetch content' });
    }
});

app.put('/api/admin/sessions/:sessionId/content/:type', authenticate, requireAdmin, async (req, res) => {
    try {
        const { sessionId, type } = req.params;
        const { markdown_content } = req.body;

        if (!['facilitator_guide', 'coaches_manual', 'worksheet'].includes(type)) {
            return res.status(400).json({ message: 'Invalid content type' });
        }

        await run(
            `UPDATE session_content
             SET markdown_content = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
             WHERE session_id = ? AND content_type = ?`,
            [markdown_content || '', req.user.id, sessionId, type]
        );

        const content = await get(
            'SELECT * FROM session_content WHERE session_id = ? AND content_type = ?',
            [sessionId, type]
        );

        return res.json(content);
    } catch (error) {
        console.error('Error updating content:', error);
        return res.status(500).json({ message: 'Failed to update content' });
    }
});

// ============================================================================
// USER MANAGEMENT API ROUTES
// ============================================================================

app.get('/api/admin/users', authenticate, requireAdmin, async (req, res) => {
    try {
        const users = await all(`
            SELECT
                u.id, u.email, u.name, u.role, u.created_at,
                (SELECT MAX(updated_at) FROM active_sessions WHERE user_id = u.id) as last_seen
            FROM users u
            ORDER BY u.created_at DESC
        `);

        return res.json(users.map(sanitizeUser));
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Failed to fetch users' });
    }
});

app.put('/api/admin/users/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const user = await get('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is already taken by another user
        if (email !== user.email) {
            const existing = await get('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
            if (existing) {
                return res.status(409).json({ message: 'Email already in use' });
            }
        }

        await run(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, id]
        );

        const updated = await get('SELECT * FROM users WHERE id = ?', [id]);
        return res.json(sanitizeUser(updated));
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Failed to update user' });
    }
});

app.post('/api/admin/users/:id/reset-password', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await get('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-10);
        const passwordHash = await hashPassword(tempPassword);

        await run('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);

        return res.json({
            message: 'Password reset successfully',
            tempPassword: tempPassword
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Failed to reset password' });
    }
});

app.put('/api/admin/users/:id/role', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['admin', 'participant'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await get('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't allow changing your own role
        if (parseInt(id) === req.user.id) {
            return res.status(403).json({ message: 'Cannot change your own role' });
        }

        await run('UPDATE users SET role = ? WHERE id = ?', [role, id]);

        const updated = await get('SELECT * FROM users WHERE id = ?', [id]);
        return res.json(sanitizeUser(updated));
    } catch (error) {
        console.error('Error updating role:', error);
        return res.status(500).json({ message: 'Failed to update role' });
    }
});

app.get('/api/admin/users/:id/courses', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await get('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const access = await all(
            `SELECT uca.*, c.name as course_name
             FROM user_course_access uca
             JOIN courses c ON uca.course_id = c.id
             WHERE uca.user_id = ?`,
            [id]
        );

        return res.json(access);
    } catch (error) {
        console.error('Error fetching user courses:', error);
        return res.status(500).json({ message: 'Failed to fetch user courses' });
    }
});

app.put('/api/admin/users/:id/courses', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { courseIds } = req.body;

        const user = await get('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove existing access
        await run('DELETE FROM user_course_access WHERE user_id = ?', [id]);

        // Add new access
        for (const courseId of courseIds) {
            await run(
                'INSERT INTO user_course_access (user_id, course_id, granted_by) VALUES (?, ?, ?)',
                [id, courseId, req.user.id]
            );
        }

        const access = await all(
            `SELECT uca.*, c.name as course_name
             FROM user_course_access uca
             JOIN courses c ON uca.course_id = c.id
             WHERE uca.user_id = ?`,
            [id]
        );

        return res.json(access);
    } catch (error) {
        console.error('Error updating user courses:', error);
        return res.status(500).json({ message: 'Failed to update user courses' });
    }
});

// Admin API - Generate coaches manual
app.post('/api/admin/courses/:courseId/generate-manual', authenticate, requireAdmin, async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await get('SELECT * FROM courses WHERE id = ?', [courseId]);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Generate the manual
        const filepath = await generateManual(courseId);

        // Send the file
        return res.download(filepath, path.basename(filepath), (err) => {
            if (err) {
                console.error('Error sending file:', err);
                if (!res.headersSent) {
                    return res.status(500).json({ message: 'Failed to download manual' });
                }
            }
        });
    } catch (error) {
        console.error('Error generating manual:', error);
        return res.status(500).json({ message: 'Failed to generate manual', error: error.message });
    }
});

const blockedStaticPrefixes = ['/server', '/data', '/node_modules', '/package', '/package-lock'];

app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }

    if (blockedStaticPrefixes.some(prefix => req.path.startsWith(prefix))) {
        return res.status(404).end();
    }

    return next();
});

app.use(
    express.static(path.join(__dirname, '..'), {
        index: false
    })
);

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, '../coaching101/index.html'));
});

app.get('/intervention', (req, res) => {
    return res.sendFile(path.join(__dirname, '../intervention/index.html'));
});

app.get('/families', (req, res) => {
    return res.sendFile(path.join(__dirname, '../families/index.html'));
});

app.get('/admin', (req, res) => {
    return res.sendFile(path.join(__dirname, '../admin/index.html'));
});

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    return res.sendFile(path.join(__dirname, '../coaching101/index.html'));
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || 'Server error' });
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Coaching backend listening on http://localhost:${PORT}`);
    console.log('WebSocket server ready for real-time updates');
});
