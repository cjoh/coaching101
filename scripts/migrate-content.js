#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'apps', 'data', 'coaching101.db');
const contentRoot = path.join(__dirname, '..', 'content');

const db = new sqlite3.Database(dbPath);

// Helper functions for database operations
const run = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });

const get = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });

const all = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

// Course definitions based on existing modules
const courses = [
    {
        id: 'coaching101',
        name: 'Coaching 101',
        description: 'Core Values Foundations for Recovery Coaches',
        duration_days: 3
    },
    {
        id: 'intervention',
        name: 'Intervention Training',
        description: 'Advanced Crisis Intervention Professional Development',
        duration_days: 3
    },
    {
        id: 'families',
        name: 'Family Recovery Coach Training',
        description: 'Family Systems Recovery Coaching',
        duration_days: 3
    }
];

// Read file content safely
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.warn(`  Warning: Could not read ${filePath}`);
        return '';
    }
}

// Extract session info from markdown filename
function parseSessionFilename(filename) {
    // Match patterns like "01 - Session_1.1_Welcome.md" or "Session_1.2_Topic.md"
    const sessionMatch = filename.match(/Session[_\s]+([\d.]+)[_:\s]+(.+)\.md$/i);
    if (sessionMatch) {
        return {
            sessionNumber: sessionMatch[1],
            title: sessionMatch[2].replace(/_/g, ' ')
        };
    }

    // Match patterns like "01 - Welcome_and_Foundations.md"
    const numberMatch = filename.match(/^(\d+)\s*-\s*(.+)\.md$/);
    if (numberMatch) {
        return {
            sessionNumber: numberMatch[1],
            title: numberMatch[2].replace(/_/g, ' ')
        };
    }

    return null;
}

// Parse duration from session header (e.g., "# Session 1.1: Welcome (60 minutes)")
function parseDuration(content) {
    const match = content.match(/\((\d+)\s*minutes?\)/i);
    return match ? parseInt(match[1]) : 60;
}

// Migrate Intervention course (most structured)
async function migrateIntervention() {
    console.log('\nMigrating Intervention Training...');

    const courseId = 'intervention';
    const coursePath = path.join(contentRoot, courseId);

    // Create course days
    for (let dayNum = 1; dayNum <= 3; dayNum++) {
        console.log(`  Processing Day ${dayNum}...`);

        // Read schedule
        const schedulePath = path.join(coursePath, 'schedules', `Day${dayNum}_Schedule.md`);
        const schedule = readFile(schedulePath);

        // Create day
        const dayResult = await run(
            'INSERT INTO course_days (course_id, day_number, title, description, schedule_markdown) VALUES (?, ?, ?, ?, ?)',
            [courseId, dayNum, `Day ${dayNum}`, '', schedule]
        );
        const dayId = dayResult.lastID;

        // Read sessions from modular/dayN
        const dayPath = path.join(coursePath, 'manuals', 'modular', `day${dayNum}`);
        if (!fs.existsSync(dayPath)) {
            console.warn(`    Warning: ${dayPath} not found`);
            continue;
        }

        const files = fs.readdirSync(dayPath)
            .filter(f => f.endsWith('.md') && !f.startsWith('00') && f.includes('Session'))
            .sort();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const sessionInfo = parseSessionFilename(file);

            if (!sessionInfo) {
                console.warn(`    Warning: Could not parse ${file}`);
                continue;
            }

            const content = readFile(path.join(dayPath, file));
            const duration = parseDuration(content);

            console.log(`    Creating session ${sessionInfo.sessionNumber}: ${sessionInfo.title}`);

            // Create session
            const sessionResult = await run(
                `INSERT INTO course_sessions
                 (course_id, day_id, session_number, title, duration_minutes, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [courseId, dayId, sessionInfo.sessionNumber, sessionInfo.title, duration, i]
            );
            const sessionId = sessionResult.lastID;

            // For now, put all content in coaches_manual
            // Admin can later split it through the UI
            await run(
                `INSERT INTO session_content
                 (session_id, content_type, markdown_content)
                 VALUES (?, ?, ?)`,
                [sessionId, 'coaches_manual', content]
            );

            // Create empty facilitator guide and worksheet placeholders
            await run(
                `INSERT INTO session_content
                 (session_id, content_type, markdown_content)
                 VALUES (?, ?, ?)`,
                [sessionId, 'facilitator_guide', '']
            );

            await run(
                `INSERT INTO session_content
                 (session_id, content_type, markdown_content)
                 VALUES (?, ?, ?)`,
                [sessionId, 'worksheet', '']
            );
        }

        // Read day-level facilitator guide if it exists
        const guidePath = path.join(coursePath, 'manuals', 'guides', `Interventionist_Day${dayNum}_Guide.md`);
        if (fs.existsSync(guidePath)) {
            const guideContent = readFile(guidePath);

            // Store day-level facilitator guide as session 0 (overview)
            const overviewResult = await run(
                `INSERT INTO course_sessions
                 (course_id, day_id, session_number, title, duration_minutes, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [courseId, dayId, `${dayNum}.0`, `Day ${dayNum} Facilitator Guide`, 0, -1]
            );
            const overviewId = overviewResult.lastID;

            await run(
                `INSERT INTO session_content
                 (session_id, content_type, markdown_content)
                 VALUES (?, ?, ?)`,
                [overviewId, 'facilitator_guide', guideContent]
            );

            await run(
                `INSERT INTO session_content
                 (session_id, content_type, markdown_content)
                 VALUES (?, ?, ?)`,
                [overviewId, 'coaches_manual', '']
            );

            await run(
                `INSERT INTO session_content
                 (session_id, content_type, markdown_content)
                 VALUES (?, ?, ?)`,
                [overviewId, 'worksheet', '']
            );
        }
    }
}

// Migrate Coaching 101 course
async function migrateCoaching101() {
    console.log('\nMigrating Coaching 101...');

    const courseId = 'coaching101';
    const coursePath = path.join(contentRoot, courseId);

    // Create 3 days with schedules
    for (let dayNum = 1; dayNum <= 3; dayNum++) {
        console.log(`  Processing Day ${dayNum}...`);

        // Try to read schedule
        const schedulePath = path.join(coursePath, 'schedules', `Day${dayNum}_Schedule.md`);
        const schedule = fs.existsSync(schedulePath) ? readFile(schedulePath) : '';

        // Create day
        const dayResult = await run(
            'INSERT INTO course_days (course_id, day_number, title, description, schedule_markdown) VALUES (?, ?, ?, ?, ?)',
            [courseId, dayNum, `Day ${dayNum}`, '', schedule]
        );
        const dayId = dayResult.lastID;

        // Create placeholder session
        const sessionResult = await run(
            `INSERT INTO course_sessions
             (course_id, day_id, session_number, title, duration_minutes, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [courseId, dayId, `${dayNum}.1`, `Day ${dayNum} Content`, 420, 0]
        );
        const sessionId = sessionResult.lastID;

        // Create empty content placeholders
        for (const contentType of ['facilitator_guide', 'coaches_manual', 'worksheet']) {
            await run(
                `INSERT INTO session_content
                 (session_id, content_type, markdown_content)
                 VALUES (?, ?, ?)`,
                [sessionId, contentType, '']
            );
        }
    }

    // Import main manuals if they exist
    const facilManualPath = path.join(coursePath, 'manuals', 'Facilitator_Manual.md');
    const partManualPath = path.join(coursePath, 'manuals', 'Participant_Manual.md');

    if (fs.existsSync(facilManualPath) || fs.existsSync(partManualPath)) {
        console.log('  Note: Main manuals exist but need manual session breakdown');
    }
}

// Migrate Family Recovery Coach Training
async function migrateFamilies() {
    console.log('\nMigrating Family Recovery Coach Training...');

    const courseId = 'families';
    const coursePath = path.join(contentRoot, courseId);

    // Create 3 days with schedules
    for (let dayNum = 1; dayNum <= 3; dayNum++) {
        console.log(`  Processing Day ${dayNum}...`);

        // Try to read schedule
        const schedulePath = path.join(coursePath, 'schedules', `Day${dayNum}_Schedule.md`);
        const schedule = fs.existsSync(schedulePath) ? readFile(schedulePath) : '';

        // Create day
        const dayResult = await run(
            'INSERT INTO course_days (course_id, day_number, title, description, schedule_markdown) VALUES (?, ?, ?, ?, ?)',
            [courseId, dayNum, `Day ${dayNum}`, '', schedule]
        );
        const dayId = dayResult.lastID;

        // Create placeholder session
        const sessionResult = await run(
            `INSERT INTO course_sessions
             (course_id, day_id, session_number, title, duration_minutes, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [courseId, dayId, `${dayNum}.1`, `Day ${dayNum} Content`, 420, 0]
        );
        const sessionId = sessionResult.lastID;

        // Create empty content placeholders
        for (const contentType of ['facilitator_guide', 'coaches_manual', 'worksheet']) {
            await run(
                `INSERT INTO session_content
                 (session_id, content_type, markdown_content)
                 VALUES (?, ?, ?)`,
                [sessionId, contentType, '']
            );
        }
    }
}

// Create new tables
async function createTables() {
    console.log('\nCreating content management tables...');

    await run('PRAGMA foreign_keys = ON');

    await run(`
        CREATE TABLE IF NOT EXISTS courses (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            duration_days INTEGER NOT NULL DEFAULT 3,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_by INTEGER,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS course_days (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id TEXT NOT NULL,
            day_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            schedule_markdown TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            UNIQUE (course_id, day_number)
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS course_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id TEXT NOT NULL,
            day_id INTEGER NOT NULL,
            session_number TEXT NOT NULL,
            title TEXT NOT NULL,
            duration_minutes INTEGER DEFAULT 60,
            sort_order INTEGER NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            FOREIGN KEY (day_id) REFERENCES course_days(id) ON DELETE CASCADE,
            UNIQUE (course_id, session_number)
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS session_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            content_type TEXT NOT NULL CHECK(content_type IN ('facilitator_guide', 'coaches_manual', 'worksheet')),
            markdown_content TEXT NOT NULL DEFAULT '',
            version INTEGER NOT NULL DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_by INTEGER,
            FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE CASCADE,
            FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
            UNIQUE (session_id, content_type)
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS user_course_access (
            user_id INTEGER NOT NULL,
            course_id TEXT NOT NULL,
            granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            granted_by INTEGER,
            expires_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
            PRIMARY KEY (user_id, course_id)
        )
    `);

    console.log('Tables created successfully');
}

// Main migration function
async function migrate() {
    try {
        console.log('Starting content migration...');
        console.log('Database:', dbPath);
        console.log('Content root:', contentRoot);

        // Create tables first
        await createTables();

        // Create courses
        console.log('\nCreating courses...');
        for (const course of courses) {
            console.log(`  Creating ${course.name}...`);
            await run(
                `INSERT INTO courses (id, name, description, duration_days, is_active)
                 VALUES (?, ?, ?, ?, 1)`,
                [course.id, course.name, course.description, course.duration_days]
            );
        }

        // Migrate each course
        await migrateIntervention();
        await migrateCoaching101();
        await migrateFamilies();

        // Show summary
        console.log('\n=== Migration Summary ===');
        const coursesCount = await all('SELECT id, name FROM courses');
        for (const course of coursesCount) {
            const days = await all('SELECT COUNT(*) as count FROM course_days WHERE course_id = ?', [course.id]);
            const sessions = await all('SELECT COUNT(*) as count FROM course_sessions WHERE course_id = ?', [course.id]);
            console.log(`${course.name}:`);
            console.log(`  ${days[0].count} days`);
            console.log(`  ${sessions[0].count} sessions`);
        }

        console.log('\nMigration completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Review imported content in admin interface');
        console.log('2. Split unified content into facilitator/manual/worksheet as needed');
        console.log('3. Add any missing session content through the UI');

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        db.close();
    }
}

// Run migration
migrate().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
