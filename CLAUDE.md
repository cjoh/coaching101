# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains both **web applications** and **training content** for three Core Values Recovery professional development programs:

1. **Coaching 101** - Core Values Foundations for Recovery Coaches (3 days, 21 hours)
2. **Intervention Training** - Advanced Crisis Intervention Professional Development (3 days + 40-week mentorship)
3. **Family Recovery Coach Training** - Family Systems Recovery Coaching (3 days)

All programs use the Core Values Recovery framework, bridging state Peer Support Specialist and CCAR Recovery Coach Academy curricula with an experiential, values-driven approach.

## Repository Structure

```
coaching101/
├── apps/                          # Web applications
│   ├── coaching101/               # Coaching 101 web app
│   ├── intervention/              # Intervention training web app
│   ├── families/                  # Family coaching web app
│   ├── admin/                     # Admin dashboard
│   ├── server/                    # Backend (Express + SQLite)
│   └── shared/                    # Shared resources (JS, CSS, images)
│
├── content/                       # Training content
│   ├── coaching101/               # Coaching 101 materials
│   │   ├── manuals/               # Facilitator & participant manuals
│   │   ├── schedules/             # Day schedules
│   │   ├── requirements/          # Requirements packet
│   │   └── other/                 # Supporting documents
│   ├── intervention/              # Intervention training materials
│   │   ├── manuals/               # All manual formats
│   │   │   ├── consolidated/      # Single-file manuals
│   │   │   ├── modular/           # Session-by-session breakdowns
│   │   │   └── guides/            # Day-specific facilitator guides
│   │   ├── schedules/             # Training schedules
│   │   ├── case-studies/          # Ethics dilemmas & scenarios
│   │   ├── assessment-tools/      # Rubrics and assessments
│   │   └── other/                 # Supporting documents
│   └── families/                  # Family coaching materials
│       ├── manuals/               # Family coaching manual
│       ├── schedules/             # Training schedules
│       └── other/                 # Supporting documents
│
└── scripts/                       # Utility scripts (Python image generators)
```

### Working with Applications vs Content

**When working on web applications:**
- All app code is in `apps/` directory
- Shared resources (CSS, JS, images) are in `apps/shared/`
- Backend server is in `apps/server/`
- Module-specific code is in respective app directories

**When working on training content:**
- All content is in `content/` directory organized by course
- Manuals are separated from schedules and other materials
- Use the appropriate subdirectory based on content type

## Core Deliverables (All Programs)

1. **Facilitator Manuals** - Complete lesson plans, scripts, and materials for trainers
2. **Participant Manuals (Workbooks)** - Learner guides with reflection exercises and case studies
3. **Training Schedules** - Hour-by-hour curriculum for each program
4. **Digital Learning Platform** - Interactive web applications for each training program

## Brand & Design Standards

**Core Values Recovery Identity:**
- **Colors:** #1D4486 (navy), #D4AA4C (gold), white
- **Fonts:** Bebas Neue (headings), Roboto Condensed (body)
- **Icons:** Mirror 🪞, Compass 🧭, Lighthouse 🗼, Tree 🌳
- **Tone:** Minimalist, values-based, dignified, experiential over lecture-based
- **Version headers** required on every page

## Key Philosophical Frameworks

When creating content, incorporate these Core Values Recovery concepts:

- **"Guide not Guru"** - Coaching stance vs. directive advice-giving
- **Coach as Mirror** - Reflection over prescription
- **Values vs Comfort** - Core framework for decision-making
- **Scripts & Blocks** - Communication patterns and barriers
- **Listening & Presence** - Foundational coaching skills
- **Ethics & Boundaries** - Scope of practice and professional limits
- **Cultural Humility** - Awareness and language sensitivity

## Coaching 101 Training Structure

**Day 1 - Foundations & Identity** (7 hours)
- Welcome, history, role of coach, Core Values framework, listening & presence

**Day 2 - Skills & Structures** (7 hours)
- Communication, 3-hour Ethics & Boundaries Lab with roleplays, documentation, resource mapping

**Day 3 - Practice & Integration** (7 hours)
- Cultural humility, GROW model, coaching triads practicum, certification pathways, action planning

**Facilitation ratio:** 1 trainer per 12 participants (max 20)

## Intervention Training Structure

**3-Day Intensive + 40-Week Mentorship:**
- Day 1: Awareness (Understanding crisis, intervention continuum, family systems)
- Day 2: Coordination (First call assessment, family engagement, resistance strategies)
- Day 3: Care (Aftercare planning, self-care, professional boundaries, integration)

## Family Recovery Coach Training Structure

**3-Day Program:**
- Focus on family systems, codependency, enabling vs. support, family values alignment
- 52-week workbook integration for ongoing family coaching

## Document Format Requirements

**Facilitator Manual:**
- PDF + editable Markdown/Word
- Hour-by-hour lesson plans with timing
- Facilitation scripts for openings, transitions, debriefs
- Activity instructions with materials lists
- Assessment rubrics for listening, presence, engagement, boundaries
- Appendices: State pathways (UT/OH/TX), Core Values Cards guide, glossary, FAQ

**Participant Manual:**
- Minimalist layout with ample white space
- Each module opens with Core Values quote or metaphor
- Interactive fields for digital use; print-friendly version
- Worksheets: GROW model, Values chart, Listening journal, Boundaries map, Resource mapping
- Case studies: 3 ethics dilemmas + 2 communication scenarios
- Final page: Certificate of Completion with Core Values seal

## State Certification Context

The training serves as an on-ramp to state certification programs:
- **Utah:** 40-hour CPSS (Certified Peer Support Specialist)
- **Ohio:** 40-hour PRS (Peer Recovery Supporter)
- **Texas:** CORE + 250-hour supervision

Include state pathway information in appendices and Day 3 certification briefing.

## Content Development Guidelines

1. **Experiential focus** - Prioritize activities, roleplays, and reflection over lectures
2. **Safety in vulnerability** - Include proper debrief protocols for sensitive content
3. **Elicit vs. tell** - Design prompts that draw out participant insight rather than deliver information
4. **Scope differentiation** - Clearly distinguish peer coaching from therapy, clinical work, and sponsorship
5. **Gray-area ethics** - Include realistic dilemmas without clear right answers for discussion
6. **Action-oriented** - Every module should lead to practical application and next steps

## When Creating New Materials

**For Coaching 101:**
- Reference: `content/coaching101/requirements/Coaching_101_Requirements_Packet.md`
- Manuals location: `content/coaching101/manuals/`
- Maintain alignment with 21-hour total contact time

**For Intervention Training:**
- Manuals location: `content/intervention/manuals/`
- Case studies: `content/intervention/case-studies/`
- Assessment tools: `content/intervention/assessment-tools/`

**For Family Coaching:**
- Manuals location: `content/families/manuals/`

**General Guidelines:**
- Use placeholders for quotes, illustrations, and diagrams when layout isn't final
- Return drafts in Markdown or Word before final PDF layout
- Preserve the Core Values Recovery brand voice throughout all materials
- Images and values cards are in `apps/shared/images/values/`

## When Working on Web Applications

**Server:**
- Backend: `apps/server/index.js` (Express server)
- Database: `apps/server/db.js` (SQLite schema)
- Auth: `apps/server/auth.js` (JWT authentication)

**Frontend:**
- Shared code: `apps/shared/` (app.js, apiClient.js, styles.css)
- Module-specific: `apps/[module-name]/` (index.html, content.js, etc.)
- Admin dashboard: `apps/admin/`

**Running the application:**
- Start server: `node apps/server/index.js` or `npm start`
- Access modules:
  - Coaching 101: http://localhost:3000/
  - Intervention: http://localhost:3000/intervention
  - Families: http://localhost:3000/families
  - Admin: http://localhost:3000/admin

## Adding a New Course

### Quick Method: Use the Script

The easiest way to add a new course is to use the automated script:

```bash
./scripts/create-course.sh <course-id> "<course-name>"
```

**Example:**
```bash
./scripts/create-course.sh executive "Executive Recovery Coaching"
```

This script will:
- ✅ Create all necessary directories (apps and content)
- ✅ Generate a basic web app template
- ✅ Register the module in the database
- ✅ Add the server route
- ✅ Create placeholder README files for content

After running the script:
1. Restart the server: `npm start`
2. Visit your new course at: `http://localhost:3000/<course-id>`
3. Customize the web app in `apps/<course-id>/index.html`
4. Add training materials to `content/<course-id>/`

### Manual Method: Step-by-Step

If you prefer to add a new training course manually (e.g., "Executive Coaching"), follow these steps:

### 1. Create Directory Structure

Create the following directories:

```bash
# Application directories
mkdir -p apps/[course-id]
mkdir -p apps/[course-id]/content  # if using content modules

# Content directories
mkdir -p content/[course-id]/manuals
mkdir -p content/[course-id]/schedules
mkdir -p content/[course-id]/other
```

Example for "Executive Coaching" (course-id: `executive`):
```bash
mkdir -p apps/executive
mkdir -p content/executive/{manuals,schedules,other}
```

### 2. Register Module in Database

Edit `apps/server/db.js` and add your module to the `modules` array (around line 79):

```javascript
const modules = [
    { id: 'coaching101', name: 'Coaching 101' },
    { id: 'families', name: 'Family Recovery Coach Training' },
    { id: 'intervention', name: 'Intervention Skill Lab' },
    { id: 'executive', name: 'Executive Recovery Coaching' }  // NEW
];
```

### 3. Add Server Route

Edit `apps/server/index.js` and add a route for your module (around line 467):

```javascript
app.get('/executive', (req, res) => {
    return res.sendFile(path.join(__dirname, '../executive/index.html'));
});
```

### 4. Create Web App Files

Create these files in `apps/[course-id]/`:

**Minimum required:**
- `index.html` - Main HTML structure
  - Reference shared CSS: `<link rel="stylesheet" href="../shared/styles.css">`
  - Reference shared JS: `<script src="../shared/apiClient.js"></script>` and `<script src="../shared/app.js"></script>`
  - Set moduleId: `window.CORE_VALUES_CONFIG = { moduleId: '[course-id]' };`
- Optional: `content.js` - Course-specific content
- Optional: `styles.css` - Course-specific styles

**Copy/modify from existing module:**
The easiest approach is to copy an existing module's files and modify them:
```bash
cp apps/coaching101/index.html apps/executive/index.html
# Then edit to customize content
```

### 5. Create Content Files

Add training materials in `content/[course-id]/`:

**Manuals directory:**
- Facilitator manuals (`.md` or `.docx`)
- Participant manuals/workbooks
- If complex like intervention, use subdirectories: `consolidated/`, `modular/`, `guides/`

**Schedules directory:**
- `Day1_Schedule.md`, `Day2_Schedule.md`, etc.
- `Quick_Reference_Schedule.md`

**Other directory:**
- Training overviews
- Requirements packets
- Supporting documents

### 6. Update CLAUDE.md (Optional)

Add a section for your new course in CLAUDE.md with:
- Course description and duration
- Training structure overview
- Any course-specific guidelines

### Example: Complete New Course Setup

```bash
# 1. Create directories
mkdir -p apps/executive content/executive/{manuals,schedules,other}

# 2. Copy template files from existing course
cp apps/coaching101/index.html apps/executive/index.html

# 3. Edit apps/executive/index.html
#    - Change title, heading, moduleId
#    - Customize content sections

# 4. Add module to apps/server/db.js
#    Add: { id: 'executive', name: 'Executive Recovery Coaching' }

# 5. Add route to apps/server/index.js
#    Add: app.get('/executive', (req, res) => {...});

# 6. Create content files
#    Add manuals, schedules to content/executive/

# 7. Restart server
npm start

# 8. Access at http://localhost:3000/executive
```

### Current Limitations & Potential Improvements

**Current system requires manual changes for each new course:**
1. Hardcoded routes in `apps/server/index.js`
2. Hardcoded modules in `apps/server/db.js`

**Potential improvements for easier course creation:**
1. **Dynamic module loading** - Read from a `courses.json` config file
2. **Course template generator** - Script to scaffold new course structure
3. **Auto-discovery** - Server automatically detects apps/[course-id] directories
4. **Module metadata** - Store course info (duration, prerequisites, etc.) in database

If you're planning to add many courses, consider refactoring to use a configuration-driven approach.
