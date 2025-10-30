#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, convertInchesToTwip } = require('docx');

const dbPath = path.join(__dirname, '..', 'apps', 'data', 'coaching101.db');
const outputDir = path.join(__dirname, '..', 'output');

// Core Values Recovery brand colors
const BRAND_COLORS = {
    navy: '1D4486',
    gold: 'D4AA4C'
};

// Database helper functions
const db = new sqlite3.Database(dbPath);

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

// Parse markdown to docx elements
function parseMarkdownToDocx(markdown) {
    if (!markdown) return [];

    const paragraphs = [];
    const lines = markdown.split('\n');

    let inCodeBlock = false;
    let listLevel = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code blocks
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }

        if (inCodeBlock) {
            paragraphs.push(new Paragraph({
                text: line,
                style: 'code',
                spacing: { before: 100, after: 100 }
            }));
            continue;
        }

        // Headers
        if (line.startsWith('# ')) {
            paragraphs.push(new Paragraph({
                text: line.substring(2),
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
                thematicBreak: true
            }));
        } else if (line.startsWith('## ')) {
            paragraphs.push(new Paragraph({
                text: line.substring(3),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 150 }
            }));
        } else if (line.startsWith('### ')) {
            paragraphs.push(new Paragraph({
                text: line.substring(4),
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 200, after: 100 }
            }));
        }
        // Bullet lists
        else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const text = line.trim().substring(2);
            paragraphs.push(new Paragraph({
                text: text,
                bullet: { level: 0 },
                spacing: { before: 50, after: 50 }
            }));
        }
        // Numbered lists
        else if (line.match(/^\d+\.\s/)) {
            const text = line.replace(/^\d+\.\s/, '');
            paragraphs.push(new Paragraph({
                text: text,
                numbering: { reference: 'default-numbering', level: 0 },
                spacing: { before: 50, after: 50 }
            }));
        }
        // Block quotes
        else if (line.trim().startsWith('> ')) {
            paragraphs.push(new Paragraph({
                text: line.substring(2),
                italics: true,
                indent: { left: convertInchesToTwip(0.5) },
                spacing: { before: 100, after: 100 },
                border: {
                    left: {
                        color: BRAND_COLORS.gold,
                        space: 1,
                        style: BorderStyle.SINGLE,
                        size: 6
                    }
                }
            }));
        }
        // Horizontal rules
        else if (line.trim() === '---' || line.trim() === '***') {
            paragraphs.push(new Paragraph({
                text: '',
                thematicBreak: true,
                spacing: { before: 200, after: 200 }
            }));
        }
        // Empty lines
        else if (line.trim() === '') {
            paragraphs.push(new Paragraph({
                text: '',
                spacing: { before: 100, after: 100 }
            }));
        }
        // Regular paragraphs with inline formatting
        else {
            const children = parseInlineFormatting(line);
            paragraphs.push(new Paragraph({
                children: children,
                spacing: { before: 100, after: 100 }
            }));
        }
    }

    return paragraphs;
}

// Parse inline markdown formatting (bold, italic, code)
function parseInlineFormatting(text) {
    const children = [];
    let currentText = '';
    let i = 0;

    while (i < text.length) {
        // Bold (**text** or __text__)
        if (text.substring(i, i + 2) === '**' || text.substring(i, i + 2) === '__') {
            if (currentText) {
                children.push(new TextRun(currentText));
                currentText = '';
            }

            const marker = text.substring(i, i + 2);
            const endIndex = text.indexOf(marker, i + 2);
            if (endIndex !== -1) {
                const boldText = text.substring(i + 2, endIndex);
                children.push(new TextRun({ text: boldText, bold: true }));
                i = endIndex + 2;
                continue;
            }
        }
        // Italic (*text* or _text_)
        else if ((text[i] === '*' || text[i] === '_') && text[i + 1] !== text[i]) {
            if (currentText) {
                children.push(new TextRun(currentText));
                currentText = '';
            }

            const marker = text[i];
            const endIndex = text.indexOf(marker, i + 1);
            if (endIndex !== -1) {
                const italicText = text.substring(i + 1, endIndex);
                children.push(new TextRun({ text: italicText, italics: true }));
                i = endIndex + 1;
                continue;
            }
        }
        // Inline code (`text`)
        else if (text[i] === '`') {
            if (currentText) {
                children.push(new TextRun(currentText));
                currentText = '';
            }

            const endIndex = text.indexOf('`', i + 1);
            if (endIndex !== -1) {
                const codeText = text.substring(i + 1, endIndex);
                children.push(new TextRun({
                    text: codeText,
                    font: 'Courier New',
                    shading: { fill: 'F5F5F5' }
                }));
                i = endIndex + 1;
                continue;
            }
        }

        currentText += text[i];
        i++;
    }

    if (currentText) {
        children.push(new TextRun(currentText));
    }

    return children.length > 0 ? children : [new TextRun(text)];
}

// Create title page
function createTitlePage(courseName, courseDescription) {
    return [
        new Paragraph({
            text: '',
            spacing: { before: convertInchesToTwip(2) }
        }),
        new Paragraph({
            text: courseName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
            color: BRAND_COLORS.navy
        }),
        new Paragraph({
            text: 'Coaches Manual',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            color: BRAND_COLORS.gold
        }),
        new Paragraph({
            text: courseDescription || '',
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 }
        }),
        new Paragraph({
            text: '',
            spacing: { after: convertInchesToTwip(2) }
        }),
        new Paragraph({
            text: 'Core Values Recovery',
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
            color: BRAND_COLORS.navy
        }),
        new Paragraph({
            text: 'Professional Development Series',
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 400 }
        }),
        new Paragraph({
            text: '',
            pageBreakBefore: true
        })
    ];
}

// Generate manual for a course
async function generateManual(courseId) {
    console.log(`\nGenerating Coaches Manual for: ${courseId}`);

    // Get course information
    const course = await get('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (!course) {
        throw new Error(`Course not found: ${courseId}`);
    }

    console.log(`  Course: ${course.name}`);

    // Get all days for the course
    const days = await all(
        'SELECT * FROM course_days WHERE course_id = ? ORDER BY day_number',
        [courseId]
    );

    console.log(`  Days: ${days.length}`);

    // Build document sections
    const sections = [];

    // Title page
    sections.push(...createTitlePage(course.name, course.description));

    // Table of Contents placeholder
    sections.push(new Paragraph({
        text: 'Table of Contents',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
    }));
    sections.push(new Paragraph({
        text: '(Table of contents will be generated when opened in Word)',
        italics: true,
        spacing: { before: 100, after: 400 }
    }));
    sections.push(new Paragraph({
        text: '',
        pageBreakBefore: true
    }));

    // Process each day
    for (const day of days) {
        console.log(`  Processing ${day.title}...`);

        // Day header
        sections.push(new Paragraph({
            text: day.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            color: BRAND_COLORS.navy,
            pageBreakBefore: true
        }));

        if (day.description) {
            sections.push(new Paragraph({
                text: day.description,
                spacing: { before: 100, after: 200 }
            }));
        }

        // Day schedule if available
        if (day.schedule_markdown) {
            sections.push(new Paragraph({
                text: 'Schedule',
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 150 }
            }));
            sections.push(...parseMarkdownToDocx(day.schedule_markdown));
        }

        // Get sessions for this day
        const sessions = await all(
            'SELECT * FROM course_sessions WHERE day_id = ? ORDER BY sort_order, session_number',
            [day.id]
        );

        console.log(`    Sessions: ${sessions.length}`);

        // Process each session
        for (const session of sessions) {
            console.log(`    - ${session.session_number}: ${session.title}`);

            // Session header
            sections.push(new Paragraph({
                text: `Session ${session.session_number}: ${session.title}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 150 }
            }));

            if (session.duration_minutes && session.duration_minutes > 0) {
                sections.push(new Paragraph({
                    text: `Duration: ${session.duration_minutes} minutes`,
                    italics: true,
                    spacing: { before: 50, after: 100 }
                }));
            }

            // Get coaches manual content for this session
            const content = await get(
                'SELECT * FROM session_content WHERE session_id = ? AND content_type = ?',
                [session.id, 'coaches_manual']
            );

            if (content && content.markdown_content) {
                sections.push(...parseMarkdownToDocx(content.markdown_content));
            } else {
                sections.push(new Paragraph({
                    text: '(No content available for this session)',
                    italics: true,
                    color: '999999',
                    spacing: { before: 100, after: 100 }
                }));
            }
        }
    }

    // Create document
    const doc = new Document({
        sections: [{
            properties: {},
            children: sections
        }],
        numbering: {
            config: [{
                reference: 'default-numbering',
                levels: [
                    {
                        level: 0,
                        format: 'decimal',
                        text: '%1.',
                        alignment: AlignmentType.LEFT,
                        style: {
                            paragraph: {
                                indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) }
                            }
                        }
                    }
                ]
            }]
        },
        styles: {
            paragraphStyles: [
                {
                    id: 'code',
                    name: 'Code',
                    basedOn: 'Normal',
                    run: {
                        font: 'Courier New',
                        size: 20
                    },
                    paragraph: {
                        spacing: { line: 276 },
                        shading: { fill: 'F5F5F5' }
                    }
                }
            ]
        }
    });

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate filename
    const filename = `${courseId}_coaches_manual_${new Date().toISOString().split('T')[0]}.docx`;
    const filepath = path.join(outputDir, filename);

    // Write document
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filepath, buffer);

    console.log(`\n✅ Manual generated successfully!`);
    console.log(`   Output: ${filepath}`);
    console.log(`   Size: ${(buffer.length / 1024).toFixed(2)} KB\n`);

    return filepath;
}

// Main CLI handler
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('\n📚 Core Values Recovery - Coaches Manual Generator\n');
        console.log('Usage: node generate-manual.js <course-id>\n');
        console.log('Available courses:');

        const courses = await all('SELECT id, name FROM courses WHERE is_active = 1 ORDER BY name');
        courses.forEach(course => {
            console.log(`  - ${course.id.padEnd(20)} ${course.name}`);
        });

        console.log('\nExample: node generate-manual.js coaching101\n');
        process.exit(0);
    }

    const courseId = args[0];

    try {
        await generateManual(courseId);
    } catch (error) {
        console.error('\n❌ Error generating manual:', error.message);
        process.exit(1);
    } finally {
        db.close();
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

// Export for use as module
module.exports = { generateManual };
