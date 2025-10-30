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
    express.static(path.join(__dirname, '../..'), {
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
