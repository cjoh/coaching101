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
        'Authenticity', 'Compassion', 'Connection', 'Courage', 'Creativity',
        'Curiosity', 'Faith', 'Freedom', 'Generosity', 'Gratitude',
        'Growth', 'Honesty', 'Hope', 'Humility', 'Integrity',
        'Joy', 'Justice', 'Kindness', 'Love', 'Peace',
        'Perseverance', 'Purpose', 'Resilience', 'Respect', 'Responsibility',
        'Self-Care', 'Service', 'Spirituality', 'Trust', 'Wisdom'
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
        card.textContent = value;
        card.setAttribute('data-value', value);

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

console.log('Coaching 101 Digital Workbook - All systems ready! 🧭');
