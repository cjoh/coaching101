# INTERVENTION CASE SIMULATOR - SPECIFICATION

**Core Values Recovery | Interventionist Training Tool**

Version 1.0 | January 2025

---

## Purpose

A standalone AI-powered case simulation tool that generates unique, realistic family intervention scenarios for training professional interventionists. The simulator removes trainer bias by creating fresh scenarios on-the-fly that neither trainer nor participants have seen before, fostering authentic discovery and discussion.

---

## Design Philosophy

### Visual Identity (Match Intervention Workbook)

**Brand Standards:**
- **Colors:** Navy (#1D4486), Gold (#D4AA4C), White, Light Gray (#f8f9fa)
- **Typography:** Bebas Neue (headings), Roboto Condensed (body)
- **Layout:** Clean, spacious, modern single-page application
- **Tone:** Professional, educational, values-based

**UI Consistency:**
- Same card-based layout as intervention workbook
- Same button styles (navy primary, gold secondary)
- Same form field styling (rounded, subtle borders)
- Same info-box styling (light backgrounds, left border accents)
- Same responsive design principles

### Core Values Recovery Framework Integration

All generated scenarios must align with:
- **5-Mode Intervention Continuum:** Collaborative, Structured, Planned, Crisis, Individual
- **11 Core Tools in 3 Categories:**
  - MEETINGS: Planning/Running Meetings, Safety Planning, Family Meetings, Intervention Rehearsals
  - RESOURCE COORDINATION: Treatment Options, Aftercare Support, Core Values Recovery Model
  - TOOLS FOR RECOVERY: Motivational Interviewing, Impact Letters, Emergency Response, One-on-One Support
- **Language:** "Pivot Person" (not addict), "Healthy Choices" (not boundaries)
- **Philosophy:** Invitation over coercion, collaboration over control, dignity and respect

---

## Application Structure

### File Organization

```
intervention-simulator/
├── index.html           # Single-page application structure
├── styles.css           # All styling (match workbook aesthetic)
├── app.js               # Application logic and AI integration
├── README.md            # User guide for trainers
├── LICENSE.md           # MIT License
└── images/              # Core Values branding assets
    └── logo.png
```

### Technology Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **AI Integration:** Anthropic Claude API (Claude 3.5 Sonnet)
- **Storage:** Browser localStorage for API key and session state
- **Dependencies:** None (no frameworks, runs entirely client-side)
- **Deployment:** Static hosting (GitHub Pages, Netlify, Vercel)

---

## Feature Specifications

### 1. Scenario Generator

**Purpose:** Generate unique family intervention scenarios with variable complexity

**Inputs:**
- **Complexity Selector:** Dropdown with 3 options
  - Moderate: 1-2 clear complications, appropriate for practicing basic skills
  - Complex: Multiple dynamics, ambiguous decisions, realistic gray areas
  - Crisis: Immediate safety concerns, urgent decisions, high stakes
- **API Key:** Password field with browser-only localStorage persistence
- **Optional Customization (v2):**
  - Substance type (alcohol, opioids, stimulants, polysubstance, gambling)
  - Family structure (nuclear, blended, single parent, extended family, LGBTQ+)
  - Cultural context (specify cultural/ethnic background for authentic representation)

**Outputs:**
- **Scenario Card:** Structured family profile
  - Family name (culturally diverse surnames)
  - Pivot Person details (name, age, substance use disorder, current situation)
  - Family members (3-6 people with distinct roles, ages, dynamics)
  - Background narrative (2-3 paragraphs describing situation)
  - Safety concerns (bulleted list)
  - Family dynamics assessment (relational capacity, communication patterns)

**Generation Prompt Strategy:**
```
Prompt engineering for educational value:
- Realistic, not stereotypical family dynamics
- Cultural diversity and authentic representation
- Gray-area decisions with no single "right" answer
- Alignment with 5-mode continuum and 11 tools
- Rich teaching opportunities embedded in complexity
- 4-5 micro-decision points per scenario
```

**AI Model Configuration:**
- Model: Claude 3.5 Sonnet (claude-sonnet-4-5-20250929)
- Max Tokens: 4096
- Temperature: 1.0 (for creative diversity)
- Response Format: JSON structured output

### 2. Micro-Decision System

**Purpose:** Present specific intervention moments requiring professional judgment

**Decision Point Structure:**
Each scenario includes 4-5 decision points with:
- **Situation Description:** "The family meeting has been going for 20 minutes when..."
- **Question:** "What intervention mode or tool should you use?"
- **3 Options (A, B, C):** Each with:
  - Clear action statement
  - Rationale explaining why someone might choose this
  - Implied intervention mode or tool being applied
- **Teaching Point:** What this decision teaches about intervention practice
- **Group Discussion Field:** Auto-saving textarea for trainer notes

**Decision Timing:**
- Appears progressively (reveal one at a time or all at once, configurable)
- Can be re-randomized for different groups using same base scenario

**Pedagogical Design:**
- No "correct" answers highlighted by default
- Options should reflect realistic professional judgment calls
- Teaching points appear after group discussion (optional toggle)
- Focus on process, not just outcomes

### 3. Follow-Up "What If" Generator

**Purpose:** Introduce complications to existing scenarios for adaptive practice

**Trigger:** Button appears after initial scenario is generated

**Follow-Up Types:**
- **Pivot Person Response:** Change of heart (positive or negative), new resistance, sudden willingness
- **Family Dynamics Shift:** Member reveals new information, alliance changes, conflict emerges
- **External Crisis:** Medical emergency, legal issue, treatment facility closes, insurance denial
- **Opportunity:** Treatment bed opens unexpectedly, Pivot Person asks for help, family unity emerges

**Outputs:**
- Twist description (what changed)
- Updated narrative (how situation evolved)
- 2-3 new micro-decisions specific to the complication
- Integration with original scenario (builds on, doesn't replace)

**UI Treatment:**
- Visually distinct (gold border, "FOLLOW-UP" header)
- Can generate multiple follow-ups to same scenario
- Each follow-up auto-saves separately

### 4. Session Management

**Purpose:** Organize and persist simulation sessions

**Features:**
- **Session Naming:** Trainer can name each simulation session (e.g., "January 2025 Cohort", "Advanced Practice Group")
- **Auto-Save:** All generated scenarios and discussion notes save to localStorage
- **Session List:** View past sessions with timestamps
- **Export Session:** Download complete session as JSON (scenario + all discussion notes)
- **Print View:** Clean printable version for handouts
- **Clear Session:** Remove session from localStorage (with confirmation)

**Session Data Structure:**
```json
{
  "session_id": "uuid",
  "session_name": "January 2025 Cohort",
  "created_at": "2025-01-15T10:30:00Z",
  "complexity": "complex",
  "scenario": { /* full scenario JSON */ },
  "follow_ups": [ /* array of follow-up scenarios */ ],
  "decision_notes": {
    "decision-0-notes": "Group chose option B because...",
    "decision-1-notes": "Split decision, discussed...",
    ...
  }
}
```

### 5. Trainer Dashboard

**Purpose:** Control interface for training session

**Layout:** Single-page with collapsible sections

**Sections:**

1. **Generate Scenario** (always visible)
   - Complexity selector
   - API key input (with show/hide toggle)
   - Generate button (large, prominent)
   - Loading indicator during generation

2. **Current Scenario** (appears after generation)
   - Scenario display card
   - Micro-decisions section
   - Follow-up generator button
   - Export/Print/Clear buttons

3. **Session History** (collapsible sidebar)
   - List of past sessions
   - Quick load functionality
   - Delete session option

4. **Settings** (collapsible footer)
   - Display options (show teaching points immediately vs. after discussion)
   - Decision reveal mode (progressive vs. all at once)
   - Cultural diversity preferences
   - API usage stats (tokens used, cost estimate)

### 6. Privacy & Security

**API Key Management:**
- Stored only in browser localStorage
- Never transmitted except directly to Anthropic API
- Can be cleared anytime
- Password field with show/hide toggle
- Link to console.anthropic.com for key generation

**Data Privacy:**
- All data client-side only
- No backend server, no data collection
- Export/import for portability
- Clear guidance on professional confidentiality

**Cost Management:**
- Estimate: ~$0.10-0.30 per scenario (3-5K tokens)
- Display token usage per session
- Running total for trainer awareness
- Recommendation: Set API key spending limits at Anthropic console

---

## User Experience Flow

### First-Time User Flow

1. **Landing:** Welcome screen with tool explanation
2. **Setup:** Enter API key (with guidance on obtaining one)
3. **Tutorial:** Optional 2-minute walkthrough of features
4. **Generate:** First scenario generation with complexity selection
5. **Practice:** Work through micro-decisions with group
6. **Extend:** Generate follow-up to practice adaptive thinking
7. **Save:** Session auto-saved, can export for records

### Returning User Flow

1. **Quick Start:** API key auto-loaded from localStorage
2. **Choose:** Generate new scenario OR load previous session
3. **Customize:** Select complexity based on group readiness
4. **Facilitate:** Use micro-decisions to guide group discussion
5. **Archive:** Export completed sessions for training records

---

## UI Components & Styling

### Header

```html
<header class="simulator-header">
  <div class="header-content">
    <h1>Intervention Case Simulator</h1>
    <p class="subtitle">Core Values Recovery Training Tool</p>
  </div>
  <div class="header-actions">
    <button class="btn-secondary" onclick="toggleHistory()">📋 History</button>
    <button class="btn-secondary" onclick="toggleSettings()">⚙️ Settings</button>
  </div>
</header>
```

**Styling:**
- Navy background (#1D4486)
- White text
- Gold accent on subtitle
- Fixed header with shadow

### Scenario Card

```html
<div class="scenario-card">
  <div class="scenario-header">
    <h2>{Family Name}</h2>
    <span class="complexity-badge {complexity}">{Complexity Level}</span>
  </div>

  <div class="scenario-section">
    <h3>Pivot Person</h3>
    <p><strong>Name:</strong> {name}, {age}</p>
    <p><strong>Substance:</strong> {substance}</p>
    <p><strong>Current Situation:</strong> {situation}</p>
  </div>

  <div class="scenario-section">
    <h3>Family Members</h3>
    <ul class="family-list">
      <!-- Dynamic list of family members -->
    </ul>
  </div>

  <div class="scenario-section">
    <h3>Background</h3>
    <p>{narrative}</p>
  </div>

  <div class="scenario-section safety-section">
    <h3>⚠️ Safety Concerns</h3>
    <ul class="safety-list">
      <!-- Dynamic list of safety factors -->
    </ul>
  </div>

  <div class="scenario-section">
    <h3>Family Dynamics</h3>
    <p>{dynamics_description}</p>
  </div>
</div>
```

**Styling:**
- White background
- Subtle shadow
- Navy section headers
- Gold left border on safety section
- Rounded corners (8px)
- Generous padding (20px)

### Decision Point Card

```html
<div class="decision-card">
  <div class="decision-header">
    <h4>Decision Point {number}</h4>
  </div>

  <div class="decision-situation">
    <p><strong>Situation:</strong> {situation_description}</p>
  </div>

  <div class="decision-question">
    <p>{question}</p>
  </div>

  <div class="decision-options">
    <div class="option">
      <span class="option-label">A)</span>
      <p>{option_a}</p>
    </div>
    <div class="option">
      <span class="option-label">B)</span>
      <p>{option_b}</p>
    </div>
    <div class="option">
      <span class="option-label">C)</span>
      <p>{option_c}</p>
    </div>
  </div>

  <div class="teaching-point" style="display: none;">
    <p><em>💡 Teaching Point: {teaching_point}</em></p>
  </div>

  <div class="discussion-notes">
    <label>Group Discussion Notes:</label>
    <textarea id="decision-{number}-notes" rows="3" placeholder="What did the group decide and why..."></textarea>
  </div>
</div>
```

**Styling:**
- Light gray background (#f8f9fa)
- Gold left border (4px)
- Navy decision number
- Indented options
- Auto-expanding textarea
- Teaching point toggles visibility

### Buttons

**Primary Button (Navy):**
```css
.btn-primary {
  background-color: #1D4486;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:hover {
  background-color: #152f5e;
}
```

**Secondary Button (Gold):**
```css
.btn-secondary {
  background-color: #D4AA4C;
  color: #1D4486;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-secondary:hover {
  background-color: #c59a3c;
}
```

### Form Fields

```css
input[type="password"],
input[type="text"],
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #1D4486;
}
```

---

## API Integration Specifications

### Anthropic Claude API

**Endpoint:** `https://api.anthropic.com/v1/messages`

**Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'x-api-key': userApiKey,
  'anthropic-version': '2023-06-01'
}
```

**Request Body (Scenario Generation):**
```javascript
{
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  temperature: 1.0,
  messages: [{
    role: 'user',
    content: scenarioPrompt
  }]
}
```

**Scenario Prompt Template:**

```
You are an expert interventionist trainer creating realistic case study scenarios for professional intervention training.

Generate a unique, realistic family intervention scenario with {complexity_description}.

The scenario should follow the Core Values Recovery intervention framework:
- 5-Mode Intervention Continuum: Collaborative, Structured, Planned, Crisis, Individual
- 11 Core Tools organized in 3 categories:
  * MEETINGS: Planning/Running Meetings, Safety Planning, Family Meetings, Intervention Rehearsals
  * RESOURCE COORDINATION: Treatment Options, Aftercare Support, Core Values Recovery Model
  * TOOLS FOR RECOVERY: Motivational Interviewing, Impact Letters, Emergency Response, One-on-One Support

Create a scenario with:
1. Family background (Pivot Person, family members, substance use situation)
2. Current crisis or presenting problem
3. Family dynamics and relational capacity
4. Safety assessment factors
5. 4-5 specific micro-decision points where students must choose which intervention mode or tools to use

IMPORTANT GUIDELINES:
- Use "Pivot Person" terminology (not "addict" or "identified patient")
- Create culturally diverse, authentic families (not stereotypes)
- Include realistic gray-area decisions with no single "right" answer
- Embed teaching opportunities in each decision point
- Ensure safety concerns are realistic and specific
- Family dynamics should reflect real relational patterns

Format your response as JSON with this structure:
{
  "family_name": "The [Surname] Family",
  "pivot_person": {
    "name": "First name",
    "age": number,
    "substance": "type of substance use disorder",
    "situation": "current crisis or situation"
  },
  "family_members": [
    {
      "relationship": "Mother/Father/Sibling/Spouse/etc",
      "name": "Name",
      "age": number,
      "dynamic": "brief description of their role and stance in the family system"
    }
  ],
  "background": "2-3 paragraph narrative describing the family situation, history, and what led to this intervention moment",
  "safety_concerns": [
    "specific safety factor",
    "another safety concern"
  ],
  "family_dynamics": "description of relational patterns, communication style, and family's capacity for constructive engagement",
  "micro_decisions": [
    {
      "situation": "specific moment in the intervention process when a decision is needed",
      "question": "What should you do?",
      "options": {
        "a": "option with rationale for why someone might choose this approach",
        "b": "different option with its own valid rationale",
        "c": "third option representing another reasonable path"
      },
      "teaching_point": "what this decision teaches about intervention practice, modes, or tools"
    }
  ]
}

Make the scenario realistic, culturally diverse, and rich with teaching opportunities.
```

**Follow-Up Prompt Template:**

```
Based on this intervention scenario:

Family: {family_name}
Pivot Person: {pivot_person_name}
Situation: {background}

Generate a "what if" follow-up scenario that introduces a NEW complication or twist.

This could be:
- Pivot Person has a change of heart (positive or negative)
- A family member reveals new information that changes the dynamic
- An unexpected crisis or opportunity emerges
- External factors change (insurance denial, treatment bed opens, legal issue, medical emergency)

The twist should:
- Feel realistic and plausible given the original scenario
- Create new teaching opportunities
- Require adaptive thinking from the interventionist
- Maintain alignment with Core Values Recovery framework

Create 2-3 new micro-decision points showing how to adapt the intervention plan.

Format as JSON with this structure:
{
  "twist": "description of what changed",
  "new_situation": "updated narrative explaining how things evolved",
  "micro_decisions": [
    {
      "situation": "specific moment requiring a new decision",
      "question": "What should you do now?",
      "options": {
        "a": "adaptive option",
        "b": "different adaptive approach",
        "c": "third reasonable response"
      },
      "teaching_point": "what this teaches about flexibility and adaptive intervention"
    }
  ]
}
```

**Response Parsing:**
```javascript
// Extract JSON from Claude's response (handles markdown code blocks)
const jsonMatch = responseText.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  throw new Error('Could not parse scenario data from API response');
}
const scenario = JSON.parse(jsonMatch[0]);
```

**Error Handling:**
- Invalid API key: Clear error message with link to console.anthropic.com
- Rate limits: "Please wait a moment and try again"
- Network errors: "Connection failed. Check your internet and try again"
- Malformed response: "Unexpected response format. Please try generating again"
- Token limits: "Response too long. Try a simpler complexity level"

---

## Development Roadmap

### Version 1.0 (MVP) - Initial Release
- ✅ Basic scenario generation (3 complexity levels)
- ✅ Micro-decision system with group discussion notes
- ✅ Follow-up generator
- ✅ Session auto-save to localStorage
- ✅ Export session as JSON
- ✅ Print-friendly view
- ✅ API key management
- ✅ Responsive design (desktop and tablet)

### Version 1.1 - Enhanced Customization
- ⏳ Substance type selector
- ⏳ Family structure selector
- ⏳ Cultural context input
- ⏳ Session naming and organization
- ⏳ Session history sidebar
- ⏳ Multiple export formats (JSON, PDF, DOCX)

### Version 1.2 - Teaching Features
- ⏳ Teaching point visibility toggle
- ⏳ Progressive decision reveal mode
- ⏳ Trainer notes field (separate from group discussion)
- ⏳ Decision voting system (students vote before discussion)
- ⏳ Debriefing guide generator

### Version 2.0 - Advanced Features
- ⏳ Multi-scenario comparison view
- ⏳ Scenario difficulty rating system
- ⏳ Custom scenario templates
- ⏳ Scenario library (save/share favorites)
- ⏳ Integration with intervention workbook
- ⏳ Mobile app version

---

## Deployment & Distribution

### Hosting Options

**Recommended:** GitHub Pages (free, simple)
```
1. Create repository: intervention-simulator
2. Push code to main branch
3. Enable GitHub Pages in repository settings
4. Access at: https://{username}.github.io/intervention-simulator
```

**Alternatives:**
- Netlify (free tier, automatic deployments)
- Vercel (free tier, excellent performance)
- Core Values Recovery website (if integrated)

### Installation Guide for Trainers

**Option 1: Online Use (Recommended)**
1. Navigate to simulator URL
2. Bookmark for easy access
3. No installation needed

**Option 2: Local Download**
1. Download ZIP from repository
2. Extract to folder
3. Open index.html in modern browser
4. Works offline (except AI generation)

**Browser Requirements:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### License

MIT License - Free for educational and commercial use

---

## User Documentation

### Trainer Quick Start Guide

**Before Training Session:**
1. Get Anthropic API key (https://console.anthropic.com/)
2. Set spending limit ($5-10 should cover multiple sessions)
3. Bookmark simulator URL
4. Test scenario generation with different complexity levels
5. Prepare facilitation questions for group discussion

**During Training Session:**
1. Open simulator and enter API key
2. Select complexity based on group experience
3. Click "Generate New Scenario"
4. Project scenario for group to read (5-10 minutes)
5. Facilitate discussion on each micro-decision
6. Record group consensus in discussion notes
7. Generate follow-up if time allows
8. Export session at end for training records

**Best Practices:**
- Let scenario surprise you (don't preview)
- Allow silence for students to think
- Ask "Why?" for each choice
- Explore trade-offs between options
- Use teaching points as debrief, not answers
- Save sessions for future reference
- Generate new scenarios for each cohort

### Troubleshooting

**Common Issues:**

1. **"API key invalid" error**
   - Verify key copied correctly (no extra spaces)
   - Check key is active at console.anthropic.com
   - Ensure spending limits not exceeded

2. **Slow generation (>30 seconds)**
   - Normal for complex scenarios
   - Check internet connection
   - Try refreshing and regenerating

3. **Scenario doesn't load**
   - Clear browser cache
   - Try different browser
   - Check browser console for errors

4. **Can't see previous sessions**
   - localStorage may be disabled
   - Check browser privacy settings
   - Export sessions as backup

---

## Success Metrics

### Educational Effectiveness

**Measure:**
- Scenario realism (trainer ratings 1-5)
- Decision quality (gray-area vs. obvious answers)
- Cultural diversity (representation across scenarios)
- Teaching point relevance (alignment with learning objectives)

**Target:**
- 4.5+ average realism rating
- 80%+ decisions rated as "no clear right answer"
- 50%+ scenarios feature non-white families
- 90%+ teaching points rated "very relevant"

### Technical Performance

**Measure:**
- Generation success rate
- Average generation time
- API cost per scenario
- Browser compatibility

**Target:**
- 95%+ successful generations
- <20 seconds average generation time
- <$0.30 per scenario
- Works on all major browsers

### Adoption & Usage

**Measure:**
- Trainers using tool
- Scenarios generated per month
- Sessions exported
- Repeat usage rate

**Target:**
- 50+ trainers within 6 months
- 200+ scenarios generated per month
- 80%+ of sessions exported (indicating value)
- 70%+ trainers use multiple times

---

## Support & Feedback

**For Trainers:**
- GitHub Issues: Report bugs or request features
- Email: support@corevaluesrecovery.com
- Documentation: README.md in repository

**For Developers:**
- Contribution guidelines in CONTRIBUTING.md
- Code review process for pull requests
- Development setup in DEVELOPMENT.md

---

## Appendix: Sample Outputs

### Sample Scenario (Moderate Complexity)

```json
{
  "family_name": "The Nguyen Family",
  "pivot_person": {
    "name": "Linh",
    "age": 34,
    "substance": "alcohol use disorder",
    "situation": "recent DUI arrest, family discovering extent of drinking"
  },
  "family_members": [
    {
      "relationship": "Husband",
      "name": "James",
      "age": 36,
      "dynamic": "Supportive but overwhelmed, has been covering for Linh's drinking"
    },
    {
      "relationship": "Mother",
      "name": "Hoa",
      "age": 62,
      "dynamic": "Traditional values, sees addiction as shameful, wants to handle privately"
    },
    {
      "relationship": "Sister",
      "name": "Mai",
      "age": 29,
      "dynamic": "Frustrated by repeated promises, wants firm consequences"
    }
  ],
  "background": "Linh emigrated from Vietnam at age 12 with her family. She's a successful pharmacist who has been hiding her drinking for the past 3 years. The family was shocked by her DUI arrest two weeks ago, which revealed that Linh has been drinking daily. James has been making excuses for her absences and covering bills she's missed. Hoa is deeply concerned about family reputation and wants to solve this \"quietly.\" Mai has watched this pattern for years and is advocating for immediate intervention.",
  "safety_concerns": [
    "Access to medications at work (pharmacist)",
    "Driving under the influence",
    "Increased tolerance suggesting escalating use",
    "Depression and isolation"
  ],
  "family_dynamics": "Strong cultural value around saving face creating tension with need for outside help. Enabling pattern from James. Multi-generational communication gaps. Family has financial resources but limited understanding of addiction treatment.",
  "micro_decisions": [
    {
      "situation": "Hoa insists any intervention must be private, family-only, no professionals",
      "question": "How do you respond to this request?",
      "options": {
        "a": "Respect the cultural value and start with a family-only meeting, introducing professional support gradually as trust builds",
        "b": "Explain that professional guidance is essential for success, but offer to find a culturally-sensitive interventionist who understands Vietnamese family dynamics",
        "c": "Begin with educational resources about addiction for the family, allowing them to make informed decisions about professional involvement"
      },
      "teaching_point": "Cultural humility requires balancing respect for family values with evidence-based practices. Mode selection may need to be gradual."
    }
  ]
}
```

---

**END OF SPECIFICATION**

Questions, feedback, or contributions welcome at https://github.com/corevaluesrecovery/intervention-simulator
