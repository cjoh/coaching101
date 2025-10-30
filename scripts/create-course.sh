#!/bin/bash

# Script to create a new course module for Core Values Recovery training platform
# Usage: ./scripts/create-course.sh <course-id> <course-name>
# Example: ./scripts/create-course.sh executive "Executive Recovery Coaching"

set -e  # Exit on error

# Check arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: ./scripts/create-course.sh <course-id> <course-name>"
    echo "Example: ./scripts/create-course.sh executive \"Executive Recovery Coaching\""
    exit 1
fi

COURSE_ID="$1"
COURSE_NAME="$2"

echo "=========================================="
echo "Creating new course: $COURSE_NAME"
echo "Course ID: $COURSE_ID"
echo "=========================================="

# Step 1: Create directory structure
echo ""
echo "📁 Step 1: Creating directory structure..."
mkdir -p "apps/$COURSE_ID"
mkdir -p "content/$COURSE_ID/manuals"
mkdir -p "content/$COURSE_ID/schedules"
mkdir -p "content/$COURSE_ID/other"
echo "   ✓ Created apps/$COURSE_ID/"
echo "   ✓ Created content/$COURSE_ID/manuals/"
echo "   ✓ Created content/$COURSE_ID/schedules/"
echo "   ✓ Created content/$COURSE_ID/other/"

# Step 2: Create basic web app HTML
echo ""
echo "🌐 Step 2: Creating web app template..."
cat > "apps/$COURSE_ID/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$COURSE_NAME: Digital Workbook | Core Values Recovery</title>
    <link rel="stylesheet" href="../shared/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="app-header">
        <div class="header-content">
            <h1>$COURSE_NAME</h1>
            <p class="subtitle">Core Values Recovery Professional Development</p>
        </div>
        <div class="header-icons">
            <span class="icon">🪞</span>
            <span class="icon">🧭</span>
            <span class="icon">🗼</span>
            <span class="icon">🌳</span>
        </div>
    </header>

    <!-- Progress Bar -->
    <div class="progress-container">
        <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
        <p class="progress-text" id="progressText">0% Complete</p>
    </div>

    <!-- Main Navigation -->
    <nav class="main-nav" id="mainNav">
        <button class="nav-btn active" data-section="welcome">Welcome</button>
        <button class="nav-btn" data-section="day1">Day 1</button>
        <button class="nav-btn" data-section="day2">Day 2</button>
        <button class="nav-btn" data-section="day3">Day 3</button>
        <button class="nav-btn" data-section="resources">Resources</button>
    </nav>

    <!-- Main Content Area -->
    <main class="content-container">
        <!-- WELCOME SECTION -->
        <section id="welcome" class="section active">
            <div class="section-header">
                <h2>Welcome to Your Journey</h2>
                <p class="version">Version 1.0 | Core Values Recovery</p>
            </div>

            <div class="content-card">
                <h3>Welcome to $COURSE_NAME</h3>
                <p>Welcome to your professional development journey! This digital workbook is your personal companion for the training program.</p>

                <div class="info-box">
                    <h4>What This Training Is:</h4>
                    <ul>
                        <li>An experiential professional development program</li>
                        <li>Grounded in the Core Values Recovery framework</li>
                        <li>A space to explore, practice, and grow</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h4>How to Use This Digital Workbook:</h4>
                    <ul>
                        <li>Type your responses directly into the forms</li>
                        <li>Your work is automatically saved as you type</li>
                        <li>Complete reflection exercises honestly</li>
                        <li>Navigate using the tabs above</li>
                        <li>Export your completed workbook at any time</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- DAY 1 SECTION -->
        <section id="day1" class="section">
            <div class="section-header">
                <h2>Day 1</h2>
                <p class="version">Version 1.0 | Core Values Recovery</p>
            </div>
            <div class="content-card">
                <h3>Day 1 Content</h3>
                <p>Add your Day 1 content here.</p>
            </div>
        </section>

        <!-- DAY 2 SECTION -->
        <section id="day2" class="section">
            <div class="section-header">
                <h2>Day 2</h2>
                <p class="version">Version 1.0 | Core Values Recovery</p>
            </div>
            <div class="content-card">
                <h3>Day 2 Content</h3>
                <p>Add your Day 2 content here.</p>
            </div>
        </section>

        <!-- DAY 3 SECTION -->
        <section id="day3" class="section">
            <div class="section-header">
                <h2>Day 3</h2>
                <p class="version">Version 1.0 | Core Values Recovery</p>
            </div>
            <div class="content-card">
                <h3>Day 3 Content</h3>
                <p>Add your Day 3 content here.</p>
            </div>
        </section>

        <!-- RESOURCES SECTION -->
        <section id="resources" class="section">
            <div class="section-header">
                <h2>Resources</h2>
                <p class="version">Version 1.0 | Core Values Recovery</p>
            </div>
            <div class="content-card">
                <h3>Resources</h3>
                <p>Add your resources here.</p>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
        <div class="footer-actions">
            <button class="btn btn-secondary" onclick="saveWorkbook()">💾 Save Progress</button>
            <button class="btn btn-secondary" onclick="exportWorkbook()">📥 Export Workbook</button>
            <button class="btn btn-secondary" onclick="printWorkbook()">🖨️ Print Version</button>
        </div>
        <p class="footer-text">Core Values Recovery | $COURSE_NAME v1.0</p>
    </footer>

    <script>
        window.CORE_VALUES_CONFIG = {
            moduleId: '$COURSE_ID'
        };
    </script>
    <script src="../shared/apiClient.js"></script>
    <script src="../shared/app.js"></script>
</body>
</html>
EOF
echo "   ✓ Created apps/$COURSE_ID/index.html"

# Step 3: Update database configuration
echo ""
echo "💾 Step 3: Updating database configuration..."

# Create backup
cp apps/server/db.js apps/server/db.js.backup

# Add module to db.js - first add comma to intervention line, then add new module
sed -i "/{ id: 'intervention', name: 'Intervention Skill Lab' }/s/}$/},/" apps/server/db.js
sed -i "/{ id: 'intervention', name: 'Intervention Skill Lab' },/a\\        { id: '$COURSE_ID', name: '$COURSE_NAME' }" apps/server/db.js

echo "   ✓ Updated apps/server/db.js"
echo "   ✓ Created backup: apps/server/db.js.backup"

# Step 4: Update server routes
echo ""
echo "🚀 Step 4: Updating server routes..."

# Create backup
cp apps/server/index.js apps/server/index.js.backup

# Add route after the admin route (before the wildcard catch-all)
sed -i "/app.get('\/admin', (req, res) => {/,/^});/{
    /^});/a\\
\\
app.get('/$COURSE_ID', (req, res) => {\\
    return res.sendFile(path.join(__dirname, '../$COURSE_ID/index.html'));\\
});
}" apps/server/index.js

echo "   ✓ Updated apps/server/index.js"
echo "   ✓ Created backup: apps/server/index.js.backup"

# Step 5: Create placeholder content files
echo ""
echo "📝 Step 5: Creating placeholder content files..."

cat > "content/$COURSE_ID/manuals/README.md" << EOF
# $COURSE_NAME - Manuals

Add your training manuals here:
- Facilitator manuals
- Participant workbooks
- Any other instructional materials

## Suggested Structure

- \`Facilitator_Manual.md\` - Complete facilitator guide
- \`Participant_Manual.md\` - Participant workbook
EOF

cat > "content/$COURSE_ID/schedules/README.md" << EOF
# $COURSE_NAME - Schedules

Add your training schedules here:
- Day-by-day schedules
- Quick reference schedules

## Suggested Files

- \`Day1_Schedule.md\`
- \`Day2_Schedule.md\`
- \`Day3_Schedule.md\`
- \`Quick_Reference_Schedule.md\`
EOF

cat > "content/$COURSE_ID/other/README.md" << EOF
# $COURSE_NAME - Supporting Materials

Add supporting materials here:
- Training overview
- Requirements packets
- Case studies
- Assessment tools
- Any other documentation
EOF

echo "   ✓ Created content/$COURSE_ID/manuals/README.md"
echo "   ✓ Created content/$COURSE_ID/schedules/README.md"
echo "   ✓ Created content/$COURSE_ID/other/README.md"

# Done!
echo ""
echo "=========================================="
echo "✅ Course created successfully!"
echo "=========================================="
echo ""
echo "📍 Course URL: http://localhost:3000/$COURSE_ID"
echo ""
echo "Next steps:"
echo "  1. Restart the server: npm start"
echo "  2. Visit: http://localhost:3000/$COURSE_ID"
echo "  3. Add content to:"
echo "     - apps/$COURSE_ID/index.html (customize web app)"
echo "     - content/$COURSE_ID/manuals/ (add training manuals)"
echo "     - content/$COURSE_ID/schedules/ (add schedules)"
echo ""
echo "Backups created:"
echo "  - apps/server/db.js.backup"
echo "  - apps/server/index.js.backup"
echo ""
