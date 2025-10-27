/**
 * Coaching 101 Digital Workbook
 * Core Values Recovery
 * Interactive workbook application with auto-save and progress tracking
 */

// ========================================
// State Management
// ========================================

const APP_STATE = {
    currentSection: 'welcome',
    currentSubsection: null,
    formData: {},
    progress: 0,
    valuesCards: [
        'Achievement', 'Adventure', 'Authenticity', 'Authority', 'Autonomy',
        'Balance', 'Beauty', 'Boldness', 'Challenge', 'Citizenship',
        'Compassion', 'Community', 'Competency', 'Connection', 'Contribution',
        'Courage', 'Creativity', 'Curiosity', 'Determination', 'Fairness',
        'Faith', 'Fame', 'Freedom', 'Friendships', 'Fun',
        'Generosity', 'Gratitude', 'Growth', 'Happiness', 'Honesty',
        'Hope', 'Humility', 'Integrity', 'Joy', 'Justice',
        'Kindness', 'Knowledge', 'Love', 'Loyalty', 'Meaningful Work',
        'Openness', 'Optimism', 'Peace', 'Perseverance', 'Pleasure',
        'Poise', 'Popularity', 'Purpose', 'Recognition', 'Religion',
        'Reputation', 'Resilience', 'Respect', 'Responsibility', 'Security',
        'Self-Care', 'Self-Respect', 'Service', 'Spirituality', 'Stability',
        'Status', 'Success', 'Trust', 'Trustworthiness', 'Wealth',
        'Wisdom'
    ]
};

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Coaching 101 Digital Workbook Initializing...');

    initializeNavigation();
    initializeValuesCards();
    initializeFormAutosave();
    loadSavedData();
    updateProgress();

    console.log('Initialization complete!');
});

// ========================================
// Navigation Functions
// ========================================

function initializeNavigation() {
    // Main navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    // Sub navigation for Day 1
    const subNavBtns = document.querySelectorAll('.sub-nav-btn');
    subNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const subsection = this.getAttribute('data-subsection');
            navigateToSubsection(subsection);
        });
    });
}

function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === sectionId) {
            btn.classList.add('active');
        }
    });

    // Update state
    APP_STATE.currentSection = sectionId;
    saveState();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If navigating to a day section, show first subsection
    if (sectionId.startsWith('day')) {
        const firstSubsection = document.querySelector(`#${sectionId} .subsection`);
        if (firstSubsection) {
            navigateToSubsection(firstSubsection.id);
        }
    }
}

function navigateToSubsection(subsectionId) {
    // Get the parent section
    const subsection = document.getElementById(subsectionId);
    if (!subsection) return;

    const parentSection = subsection.closest('.section');

    // Hide all subsections in this section
    parentSection.querySelectorAll('.subsection').forEach(sub => {
        sub.classList.remove('active');
    });

    // Show selected subsection
    subsection.classList.add('active');

    // Update sub-navigation buttons
    parentSection.querySelectorAll('.sub-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-subsection') === subsectionId) {
            btn.classList.add('active');
        }
    });

    // Update state
    APP_STATE.currentSubsection = subsectionId;
    saveState();

    // Scroll to subsection
    subsection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========================================
// Values Cards
// ========================================

function initializeValuesCards() {
    const valuesCardsContainer = document.getElementById('valuesCards');
    if (!valuesCardsContainer) return;

    // Clear container
    valuesCardsContainer.innerHTML = '';

    // Create cards
    APP_STATE.valuesCards.forEach(value => {
        const card = document.createElement('div');
        card.className = 'value-card';
        card.setAttribute('data-value', value);

        // Create image element
        const imageContainer = document.createElement('div');
        imageContainer.className = 'value-card-image';

        const img = document.createElement('img');
        // Convert value name to filename (lowercase, hyphenated)
        const filename = value.toLowerCase().replace(/\s+/g, '-');
        img.src = `images/values/${filename}.png`;
        img.alt = value;
        img.onerror = function() {
            // Fallback: hide image if not found
            this.style.display = 'none';
        };

        imageContainer.appendChild(img);
        card.appendChild(imageContainer);

        // Create text element
        const text = document.createElement('div');
        text.className = 'value-card-text';
        text.textContent = value;
        card.appendChild(text);

        card.addEventListener('click', function() {
            selectValueCard(this);
        });

        valuesCardsContainer.appendChild(card);
    });

    // Load previously selected value
    const savedValue = APP_STATE.formData['selected-value'];
    if (savedValue) {
        const savedCard = valuesCardsContainer.querySelector(`[data-value="${savedValue}"]`);
        if (savedCard) {
            selectValueCard(savedCard);
        }
    }
}

function selectValueCard(cardElement) {
    // Remove selection from all cards
    document.querySelectorAll('.value-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Select clicked card
    cardElement.classList.add('selected');

    // Get value
    const value = cardElement.getAttribute('data-value');

    // Update form
    const selectedValueInput = document.getElementById('selected-value');
    if (selectedValueInput) {
        selectedValueInput.value = value;
    }

    // Show the form
    const selectedValueForm = document.getElementById('selectedValueForm');
    if (selectedValueForm) {
        selectedValueForm.classList.remove('hidden');
    }

    // Save to state
    APP_STATE.formData['selected-value'] = value;
    saveState();
}

// ========================================
// Form Auto-save
// ========================================

function initializeFormAutosave() {
    // Get all form inputs
    const inputs = document.querySelectorAll('input[type="text"], textarea');

    inputs.forEach(input => {
        // Add auto-save on input
        input.addEventListener('input', function() {
            saveFormField(this.id, this.value);
        });

        // Also save on blur for better data integrity
        input.addEventListener('blur', function() {
            saveFormField(this.id, this.value);
        });
    });

    console.log(`Initialized auto-save for ${inputs.length} form fields`);
}

function saveFormField(fieldId, value) {
    if (!fieldId) return;

    APP_STATE.formData[fieldId] = value;
    saveState();

    // Visual feedback (optional)
    showSaveIndicator();
}

function showSaveIndicator() {
    // You can add a small "saved" indicator here if desired
    // For now, we'll keep it simple and rely on auto-save being transparent
}

// ========================================
// Data Persistence
// ========================================

function saveState() {
    try {
        localStorage.setItem('coaching101_state', JSON.stringify(APP_STATE));
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

function loadSavedData() {
    try {
        const savedState = localStorage.getItem('coaching101_state');
        if (savedState) {
            const parsed = JSON.parse(savedState);

            // Restore form data
            if (parsed.formData) {
                APP_STATE.formData = parsed.formData;

                // Populate form fields
                Object.keys(parsed.formData).forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.value = parsed.formData[fieldId];
                    }
                });
            }

            // Restore navigation state
            if (parsed.currentSection) {
                APP_STATE.currentSection = parsed.currentSection;
            }
            if (parsed.currentSubsection) {
                APP_STATE.currentSubsection = parsed.currentSubsection;
            }

            console.log('Loaded saved data successfully');
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

function saveWorkbook() {
    saveState();
    alert('✅ Your progress has been saved!\n\nYour work is automatically saved as you type, but you can use this button anytime for peace of mind.');
}

function exportWorkbook() {
    const data = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        participant: 'Coaching 101 Participant',
        formData: APP_STATE.formData
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coaching101_workbook_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('📥 Your workbook has been exported!\n\nYou can import this file later to restore your progress.');
}

function printWorkbook() {
    window.print();
}

// ========================================
// Progress Tracking
// ========================================

function updateProgress() {
    // Count total fields and filled fields
    const allFields = document.querySelectorAll('input[type="text"], textarea');
    let totalFields = 0;
    let filledFields = 0;

    allFields.forEach(field => {
        // Don't count readonly fields
        if (field.readOnly) return;

        totalFields++;
        if (field.value && field.value.trim() !== '') {
            filledFields++;
        }
    });

    // Calculate percentage
    const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }

    if (progressText) {
        progressText.textContent = `${percentage}% Complete (${filledFields} of ${totalFields} fields)`;
    }

    APP_STATE.progress = percentage;
    saveState();
}

// Update progress periodically
setInterval(updateProgress, 5000);

// ========================================
// Helper Functions
// ========================================

function clearAllData() {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
        localStorage.removeItem('coaching101_state');
        location.reload();
    }
}

function importWorkbook() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.formData) {
                    APP_STATE.formData = data.formData;
                    saveState();
                    location.reload();
                    alert('✅ Workbook imported successfully!');
                }
            } catch (error) {
                alert('❌ Error importing workbook. Please check the file format.');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// ========================================
// Keyboard Shortcuts
// ========================================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveWorkbook();
    }
});

// ========================================
// Export Global Functions for HTML onclick handlers
// ========================================

window.navigateToSection = navigateToSection;
window.navigateToSubsection = navigateToSubsection;
window.saveWorkbook = saveWorkbook;
window.exportWorkbook = exportWorkbook;
window.printWorkbook = printWorkbook;
window.clearAllData = clearAllData;
window.importWorkbook = importWorkbook;

// ========================================
// AI Scenario Generator
// ========================================

let currentScenario = null;

async function generateScenario() {
    const apiKey = document.getElementById('anthropic-api-key').value;
    const complexity = document.getElementById('scenario-complexity').value;
    const errorDiv = document.getElementById('scenario-error');
    const scenarioDiv = document.getElementById('generated-scenario');

    // Hide previous results
    errorDiv.style.display = 'none';
    scenarioDiv.style.display = 'none';

    if (!apiKey) {
        errorDiv.textContent = '⚠️ Please enter your Anthropic API key to generate scenarios.';
        errorDiv.style.display = 'block';
        return;
    }

    // Show loading
    const contentDiv = document.getElementById('scenario-content');
    contentDiv.innerHTML = '<p style="text-align: center; color: #666;">🔄 Generating scenario... this may take 10-15 seconds...</p>';
    scenarioDiv.style.display = 'block';

    try {
        const prompt = createScenarioPrompt(complexity);
        const response = await callClaudeAPI(apiKey, prompt);

        currentScenario = response;
        displayScenario(response);
    } catch (error) {
        errorDiv.textContent = `❌ Error generating scenario: ${error.message}`;
        errorDiv.style.display = 'block';
        scenarioDiv.style.display = 'none';
        console.error('Scenario generation error:', error);
    }
}

function createScenarioPrompt(complexity) {
    const complexityDescriptions = {
        moderate: 'moderate complexity with 1-2 clear complications, appropriate for practicing basic intervention skills',
        complex: 'high complexity with multiple family dynamics, ambiguous best choices, and realistic gray-area decisions',
        crisis: 'crisis-level situation with immediate safety concerns requiring urgent intervention decisions'
    };

    return `You are an expert interventionist trainer creating realistic case study scenarios for professional intervention training.

Generate a unique, realistic family intervention scenario with ${complexityDescriptions[complexity]}.

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
    {"relationship": "Mother/Father/etc", "name": "Name", "age": number, "dynamic": "brief description of their role/stance"}
  ],
  "background": "2-3 paragraph narrative describing the family situation",
  "safety_concerns": ["list", "of", "safety", "factors"],
  "family_dynamics": "description of relational patterns and capacity",
  "micro_decisions": [
    {
      "situation": "specific moment in the intervention process",
      "question": "What should you do?",
      "options": {
        "a": "option with rationale",
        "b": "option with rationale",
        "c": "option with rationale"
      },
      "teaching_point": "what this decision teaches about intervention"
    }
  ]
}

Make the scenario realistic, culturally diverse, and rich with teaching opportunities. Include authentic family dynamics, not stereotypes.`;
}

async function callClaudeAPI(apiKey, prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            messages: [{
                role: 'user',
                content: prompt
            }]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse JSON from response (handling potential markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Could not parse scenario data');
    }

    return JSON.parse(jsonMatch[0]);
}

function displayScenario(scenario) {
    const contentDiv = document.getElementById('scenario-content');
    const decisionsDiv = document.getElementById('scenario-decisions');

    // Display main scenario
    let html = `
        <h5 style="color: #1D4486;">${scenario.family_name}</h5>

        <p><strong>Pivot Person:</strong> ${scenario.pivot_person.name}, ${scenario.pivot_person.age}, ${scenario.pivot_person.substance}</p>
        <p><strong>Current Situation:</strong> ${scenario.pivot_person.situation}</p>

        <h6 style="margin-top: 15px;">Family Members:</h6>
        <ul style="margin-left: 20px;">
    `;

    scenario.family_members.forEach(member => {
        html += `<li><strong>${member.relationship}</strong> (${member.name}, ${member.age}): ${member.dynamic}</li>`;
    });

    html += `
        </ul>

        <h6 style="margin-top: 15px;">Background:</h6>
        <p>${scenario.background}</p>

        <h6 style="margin-top: 15px;">Safety Concerns:</h6>
        <ul style="margin-left: 20px;">
    `;

    scenario.safety_concerns.forEach(concern => {
        html += `<li>${concern}</li>`;
    });

    html += `
        </ul>

        <p><strong>Family Dynamics:</strong> ${scenario.family_dynamics}</p>
    `;

    contentDiv.innerHTML = html;

    // Display micro-decisions
    let decisionsHtml = '';
    scenario.micro_decisions.forEach((decision, index) => {
        decisionsHtml += `
            <div style="background-color: #f8f9fa; padding: 15px; margin-bottom: 15px; border-radius: 4px; border-left: 3px solid #D4AA4C;">
                <h6 style="color: #1D4486; margin-top: 0;">Decision Point ${index + 1}</h6>
                <p><strong>Situation:</strong> ${decision.situation}</p>
                <p><strong>${decision.question}</strong></p>
                <div style="margin-left: 15px;">
                    <p><strong>A)</strong> ${decision.options.a}</p>
                    <p><strong>B)</strong> ${decision.options.b}</p>
                    <p><strong>C)</strong> ${decision.options.c}</p>
                </div>
                <p class="small" style="margin-top: 10px; font-style: italic; color: #666;">💡 Teaching point: ${decision.teaching_point}</p>

                <div style="margin-top: 10px;">
                    <label>Group Discussion Notes:</label>
                    <textarea id="decision-${index}-notes" rows="2" placeholder="What did the group decide and why..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                </div>
            </div>
        `;
    });

    decisionsDiv.innerHTML = decisionsHtml;

    // Initialize autosave for new decision fields
    scenario.micro_decisions.forEach((_, index) => {
        const textarea = document.getElementById(`decision-${index}-notes`);
        if (textarea) {
            textarea.addEventListener('input', function() {
                saveFormField(this.id, this.value);
            });
        }
    });
}

async function generateFollowUp() {
    if (!currentScenario) return;

    const apiKey = document.getElementById('anthropic-api-key').value;
    const errorDiv = document.getElementById('scenario-error');

    if (!apiKey) {
        errorDiv.textContent = '⚠️ Please enter your Anthropic API key.';
        errorDiv.style.display = 'block';
        return;
    }

    const decisionsDiv = document.getElementById('scenario-decisions');
    decisionsDiv.innerHTML += '<p style="text-align: center; color: #666;">🔄 Generating follow-up scenario...</p>';

    try {
        const prompt = `Based on this intervention scenario:

Family: ${currentScenario.family_name}
Pivot Person: ${currentScenario.pivot_person.name}
Situation: ${currentScenario.background}

Generate a "what if" follow-up scenario that introduces a NEW complication or twist. This could be:
- Pivot Person has a change of heart (positive or negative)
- A family member reveals new information
- An unexpected crisis or opportunity emerges
- External factors change (insurance, treatment availability, etc.)

Create 2-3 new micro-decision points for how to adapt the intervention plan.

Format as JSON with this structure:
{
  "twist": "description of what changed",
  "new_situation": "updated narrative",
  "micro_decisions": [
    {
      "situation": "specific moment",
      "question": "What should you do now?",
      "options": {
        "a": "option",
        "b": "option",
        "c": "option"
      },
      "teaching_point": "lesson"
    }
  ]
}`;

        const response = await callClaudeAPI(apiKey, prompt);

        // Append follow-up to existing scenario
        let followUpHtml = `
            <div style="background-color: #fff3cd; padding: 15px; margin-top: 20px; border-radius: 4px; border: 2px solid #D4AA4C;">
                <h6 style="color: #1D4486; margin-top: 0;">🔄 FOLLOW-UP SCENARIO</h6>
                <p><strong>New Development:</strong> ${response.twist}</p>
                <p>${response.new_situation}</p>
        `;

        response.micro_decisions.forEach((decision, index) => {
            const decisionIndex = currentScenario.micro_decisions.length + index;
            followUpHtml += `
                <div style="background-color: white; padding: 15px; margin-top: 15px; border-radius: 4px; border-left: 3px solid #D4AA4C;">
                    <h6 style="color: #1D4486; margin-top: 0;">Decision Point ${decisionIndex + 1} (Follow-Up)</h6>
                    <p><strong>Situation:</strong> ${decision.situation}</p>
                    <p><strong>${decision.question}</strong></p>
                    <div style="margin-left: 15px;">
                        <p><strong>A)</strong> ${decision.options.a}</p>
                        <p><strong>B)</strong> ${decision.options.b}</p>
                        <p><strong>C)</strong> ${decision.options.c}</p>
                    </div>
                    <p class="small" style="margin-top: 10px; font-style: italic; color: #666;">💡 ${decision.teaching_point}</p>

                    <div style="margin-top: 10px;">
                        <label>Group Discussion Notes:</label>
                        <textarea id="followup-decision-${index}-notes" rows="2" placeholder="What did the group decide..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                    </div>
                </div>
            `;
        });

        followUpHtml += '</div>';

        decisionsDiv.innerHTML = decisionsDiv.innerHTML.replace(
            '<p style="text-align: center; color: #666;">🔄 Generating follow-up scenario...</p>',
            followUpHtml
        );

        // Initialize autosave for new fields
        response.micro_decisions.forEach((_, index) => {
            const textarea = document.getElementById(`followup-decision-${index}-notes`);
            if (textarea) {
                textarea.addEventListener('input', function() {
                    saveFormField(this.id, this.value);
                });
            }
        });

    } catch (error) {
        errorDiv.textContent = `❌ Error generating follow-up: ${error.message}`;
        errorDiv.style.display = 'block';
        console.error('Follow-up generation error:', error);
    }
}

window.generateScenario = generateScenario;
window.generateFollowUp = generateFollowUp;

console.log('Coaching 101 Digital Workbook - All systems ready! 🧭');
