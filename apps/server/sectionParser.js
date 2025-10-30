const fs = require('fs').promises;
const path = require('path');

/**
 * Section Parser - Dynamically extracts section metadata from facilitator guide markdown files
 * Single source of truth: the markdown guides themselves
 */

// Cache parsed sections in memory
const sectionCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Parse sections from a markdown file
 * Looks for headings like: # SESSION 1.1: WELCOME & ORIENTATION
 * Also matches: ## SESSION 2.1: MORNING CHECK-IN (with ## heading)
 */
function parseSectionsFromMarkdown(content) {
    const sections = [];
    const lines = content.split('\n');

    // Regex to match: # SESSION X.Y: TITLE or ## SESSION X.Y: TITLE
    const sessionRegex = /^#{1,2}\s+SESSION\s+(\d+\.\d+):\s+(.+)$/i;

    for (const line of lines) {
        const match = line.match(sessionRegex);
        if (match) {
            const [, sectionId, title] = match;
            sections.push({
                id: sectionId,
                label: title.trim()
                    // Convert "WELCOME & ORIENTATION" to "Welcome & Orientation"
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')
            });
        }
    }

    return sections;
}

/**
 * Get guide file path for a given module and day
 */
function getGuidePath(moduleId, day) {
    const contentRoot = path.join(__dirname, '../../content');

    // Map module IDs to their content directories
    const moduleMap = {
        intervention: 'intervention',
        coaching101: 'coaching101',
        families: 'families'
    };

    const modulePath = moduleMap[moduleId];
    if (!modulePath) {
        return null;
    }

    // Try different possible file naming patterns
    const possiblePaths = [
        // intervention: content/intervention/manuals/guides/Interventionist_Day1_Guide.md
        path.join(contentRoot, modulePath, 'manuals', 'guides', `Interventionist_Day${day}_Guide.md`),
        // coaching101: content/coaching101/manuals/Coaching101_Day1_Guide.md (if exists)
        path.join(contentRoot, modulePath, 'manuals', `Coaching101_Day${day}_Guide.md`),
        // families: content/families/manuals/Families_Day1_Guide.md (if exists)
        path.join(contentRoot, modulePath, 'manuals', `Families_Day${day}_Guide.md`),
        // Generic pattern: content/{module}/manuals/guides/Day{N}_Guide.md
        path.join(contentRoot, modulePath, 'manuals', 'guides', `Day${day}_Guide.md`)
    ];

    return possiblePaths;
}

/**
 * Get sections for a specific module and day
 * @param {string} moduleId - Module identifier (coaching101, intervention, families)
 * @param {number} day - Day number (1, 2, or 3)
 * @returns {Promise<Array>} Array of section objects with id and label
 */
async function getSections(moduleId, day) {
    const cacheKey = `${moduleId}-day${day}`;

    // Check cache first
    const cached = sectionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.sections;
    }

    const possiblePaths = getGuidePath(moduleId, day);
    if (!possiblePaths) {
        throw new Error(`Unknown module: ${moduleId}`);
    }

    // Try each possible path until we find one that exists
    let content = null;
    let foundPath = null;

    for (const filePath of possiblePaths) {
        try {
            content = await fs.readFile(filePath, 'utf-8');
            foundPath = filePath;
            break;
        } catch (error) {
            // File doesn't exist, try next path
            continue;
        }
    }

    if (!content) {
        // No guide found for this module/day combination
        // This is okay - some modules might not have session-level guides yet
        console.warn(`No facilitator guide found for ${moduleId} Day ${day}`);

        // Cache empty result so we don't keep trying
        sectionCache.set(cacheKey, {
            sections: [],
            timestamp: Date.now()
        });

        return [];
    }

    // Parse sections from markdown
    const sections = parseSectionsFromMarkdown(content);

    // Cache the result
    sectionCache.set(cacheKey, {
        sections,
        timestamp: Date.now(),
        sourcePath: foundPath
    });

    return sections;
}

/**
 * Get all sections for all days of a module
 * @param {string} moduleId - Module identifier
 * @returns {Promise<Object>} Object with days as keys, sections arrays as values
 */
async function getAllSections(moduleId) {
    const allSections = {};

    // Assume 3 days for all modules (can make this configurable if needed)
    for (let day = 1; day <= 3; day++) {
        try {
            const sections = await getSections(moduleId, day);
            if (sections.length > 0) {
                allSections[day] = sections;
            }
        } catch (error) {
            console.warn(`Error loading sections for ${moduleId} Day ${day}:`, error.message);
        }
    }

    return allSections;
}

/**
 * Clear the section cache (useful for development or when guides are updated)
 */
function clearCache() {
    sectionCache.clear();
}

module.exports = {
    getSections,
    getAllSections,
    clearCache
};
