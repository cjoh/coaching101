/**
 * Content Loader
 * Dynamically loads section content from separate JS files
 * to reduce initial page load size and improve maintainability
 */

(function() {
    'use strict';

    // Track which sections have been loaded
    const loadedSections = new Set();

    /**
     * Load content into a section
     * @param {string} sectionId - The ID of the section to load
     */
    function loadSectionContent(sectionId) {
        // Check if already loaded
        if (loadedSections.has(sectionId)) {
            return;
        }

        // Get the section element
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) {
            console.warn(`Section ${sectionId} not found`);
            return;
        }

        // Check if content is available
        if (!window.CONTENT || !window.CONTENT[sectionId]) {
            console.warn(`Content for ${sectionId} not loaded yet`);
            return;
        }

        // Inject the content
        sectionElement.innerHTML = window.CONTENT[sectionId];

        // Mark as loaded
        loadedSections.add(sectionId);

        // Reinitialize any event listeners for the newly loaded content
        reinitializeEventListeners(sectionElement);

        console.log(`✓ Loaded content for section: ${sectionId}`);
    }

    /**
     * Reinitialize event listeners for dynamically loaded content
     * @param {HTMLElement} container - The container with new content
     */
    function reinitializeEventListeners(container) {
        // Reinitialize sub-navigation if present
        const subNavButtons = container.querySelectorAll('.sub-nav-btn');
        subNavButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const subsectionId = this.getAttribute('data-subsection');
                if (subsectionId) {
                    navigateToSubsection(subsectionId);
                }
            });
        });

        // Reinitialize any form autosave listeners
        const formInputs = container.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (typeof saveFormData === 'function') {
                    saveFormData();
                }
            });
        });
    }

    /**
     * Navigate to a subsection within a section
     * @param {string} subsectionId - The ID of the subsection
     */
    function navigateToSubsection(subsectionId) {
        const section = document.querySelector(`#${subsectionId}`).closest('.section');
        const subsections = section.querySelectorAll('.subsection');
        const subNavButtons = section.querySelectorAll('.sub-nav-btn');

        // Hide all subsections
        subsections.forEach(sub => sub.classList.remove('active'));

        // Deactivate all sub-nav buttons
        subNavButtons.forEach(btn => btn.classList.remove('active'));

        // Show selected subsection
        const targetSubsection = document.getElementById(subsectionId);
        if (targetSubsection) {
            targetSubsection.classList.add('active');
        }

        // Activate corresponding button
        const targetButton = section.querySelector(`[data-subsection="${subsectionId}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Initialize content loader on page load
     */
    function init() {
        // Load initial visible section (welcome)
        loadSectionContent('welcome');

        // Listen for section navigation events
        const originalNavigateToSection = window.navigateToSection;
        window.navigateToSection = function(sectionId) {
            // Load content before navigation if not already loaded
            loadSectionContent(sectionId);

            // Call original navigation function if it exists
            if (originalNavigateToSection) {
                originalNavigateToSection(sectionId);
            }
        };

        // Also intercept navigation button clicks
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                if (sectionId) {
                    loadSectionContent(sectionId);
                }
            });
        });

        console.log('✓ Content Loader initialized');
    }

    // Make navigateToSubsection globally available
    window.navigateToSubsection = navigateToSubsection;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
