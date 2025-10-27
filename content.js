/**
 * Content data for Coaching 101 Digital Workbook
 * This file contains all the structured content for the 3-day training
 */

const WORKBOOK_CONTENT = {
    day1: {
        title: "Day 1: Foundations & Identity",
        subtitle: "Who am I as a coach?",
        sessions: {
            session3: {
                title: "Session 3: The GROW Model (90 minutes)",
                content: [
                    {
                        type: "text",
                        heading: "Understanding GROW",
                        paragraphs: ["The GROW model is a simple yet powerful framework for structuring coaching conversations."]
                    },
                    {
                        type: "form-group",
                        label: "G - Goal: What does the person want?",
                        inputs: [
                            { id: "grow-g-desc", type: "textarea", rows: 2, placeholder: "What would success look like?" },
                            { id: "grow-g-question", type: "text", label: "Key question I'll ask:", placeholder: "e.g., What do you want to achieve?" }
                        ]
                    },
                    {
                        type: "form-group",
                        label: "R - Reality: What's happening now?",
                        inputs: [
                            { id: "grow-r-desc", type: "textarea", rows: 2, placeholder: "What's the current situation?" },
                            { id: "grow-r-question", type: "text", label: "Key question I'll ask:", placeholder: "e.g., What's happening right now?" }
                        ]
                    },
                    {
                        type: "form-group",
                        label: "O - Options: What possibilities exist?",
                        inputs: [
                            { id: "grow-o-desc", type: "textarea", rows: 2, placeholder: "What could they try?" },
                            { id: "grow-o-question", type: "text", label: "Key question I'll ask:", placeholder: "e.g., What options do you see?" }
                        ]
                    },
                    {
                        type: "form-group",
                        label: "W - Will: What will they actually do?",
                        inputs: [
                            { id: "grow-w-desc", type: "textarea", rows: 2, placeholder: "What's the commitment?" },
                            { id: "grow-w-question", type: "text", label: "Key question I'll ask:", placeholder: "e.g., What will you do next?" }
                        ]
                    },
                    {
                        type: "heading",
                        text: "GROW Practice Worksheet"
                    },
                    {
                        type: "form",
                        fields: [
                            { id: "grow-practice-partner", type: "text", label: "Partner's Name:" },
                            { id: "grow-practice-topic", type: "textarea", rows: 2, label: "Topic they chose:" },
                            { id: "grow-practice-goal", type: "textarea", rows: 3, label: "Goal (what they want):" },
                            { id: "grow-practice-reality", type: "textarea", rows: 3, label: "Reality (current situation):" },
                            { id: "grow-practice-options", type: "textarea", rows: 3, label: "Options (possibilities they identified):" },
                            { id: "grow-practice-will", type: "textarea", rows: 3, label: "Will (their commitment):" },
                            { id: "grow-practice-noticed", type: "textarea", rows: 3, label: "What I noticed:" },
                            { id: "grow-practice-challenging", type: "textarea", rows: 3, label: "What was challenging:" },
                            { id: "grow-practice-learned", type: "textarea", rows: 3, label: "What I learned:" }
                        ]
                    }
                ]
            },
            session4: {
                title: "Session 4: Mirror vs. Mentor (90 minutes)",
                content: [
                    {
                        type: "text",
                        heading: "The Mirror Tool",
                        paragraphs: [
                            "What a mirror does:",
                            "• Reflects without distortion",
                            "• Shows what's there, not what should be there",
                            "• Allows the person to see themselves clearly"
                        ]
                    },
                    {
                        type: "form-group",
                        label: "Mirror phrases I can use:",
                        inputs: [
                            { id: "mirror-phrase-1", type: "text", placeholder: "I'm hearing that..." },
                            { id: "mirror-phrase-2", type: "text", placeholder: "It sounds like..." },
                            { id: "mirror-phrase-3", type: "text", placeholder: "What I'm noticing is..." },
                            { id: "mirror-phrase-4", type: "text", placeholder: "Tell me more about..." }
                        ]
                    },
                    {
                        type: "heading",
                        text: "Mentor Warning Signs"
                    },
                    {
                        type: "form",
                        fields: [
                            { id: "mentor-times-1", type: "text", label: "Times I might slip into mentoring (1):" },
                            { id: "mentor-times-2", type: "text", label: "Times I might slip into mentoring (2):" },
                            { id: "mentor-times-3", type: "text", label: "Times I might slip into mentoring (3):" },
                            { id: "mentor-advice", type: "textarea", rows: 3, label: "My 'favorite advice' I need to watch out for:" },
                            { id: "mentor-catch", type: "textarea", rows: 3, label: "How I'll catch myself:" }
                        ]
                    },
                    {
                        type: "heading",
                        text: "Mirror Practice Notes"
                    },
                    {
                        type: "form",
                        fields: [
                            { id: "mirror-partner", type: "text", label: "Partner's Name:" },
                            { id: "mirror-reflected", type: "textarea", rows: 3, label: "What I reflected back:" },
                            { id: "mirror-response", type: "textarea", rows: 3, label: "Their response:" },
                            { id: "mirror-learned", type: "textarea", rows: 3, label: "What I learned about mirroring:" }
                        ]
                    }
                ]
            },
            session5: {
                title: "Session 5: Active Listening Deep Dive (90 minutes)",
                content: [
                    {
                        type: "text",
                        heading: "Levels of Listening",
                        paragraphs: []
                    },
                    {
                        type: "form-group",
                        label: "Level 1 - Internal Listening",
                        help: "Focused on my own thoughts and responses",
                        inputs: [
                            { id: "listening-level1-example", type: "textarea", rows: 2, label: "Example:" }
                        ]
                    },
                    {
                        type: "form-group",
                        label: "Level 2 - Focused Listening",
                        help: "Fully present to the other person",
                        inputs: [
                            { id: "listening-level2-example", type: "textarea", rows: 2, label: "Example:" }
                        ]
                    },
                    {
                        type: "form-group",
                        label: "Level 3 - Global Listening",
                        help: "Aware of emotions, energy, what's not being said",
                        inputs: [
                            { id: "listening-level3-example", type: "textarea", rows: 2, label: "Example:" }
                        ]
                    },
                    {
                        type: "heading",
                        text: "My Listening Challenges"
                    },
                    {
                        type: "form",
                        fields: [
                            { id: "listening-distracts", type: "textarea", rows: 3, label: "What distracts me when listening:" },
                            { id: "listening-notice", type: "textarea", rows: 3, label: "How I'll notice when I've stopped listening:" },
                            { id: "listening-commitment", type: "textarea", rows: 3, label: "My commitment to presence:" }
                        ]
                    },
                    {
                        type: "heading",
                        text: "Listening Practice Reflection"
                    },
                    {
                        type: "form",
                        fields: [
                            { id: "listening-partner1-name", type: "text", label: "Partner 1 Name:" },
                            { id: "listening-partner1-topic", type: "text", label: "Topic:" },
                            { id: "listening-partner1-noticed", type: "textarea", rows: 3, label: "What I noticed:" },
                            { id: "listening-partner2-name", type: "text", label: "Partner 2 Name:" },
                            { id: "listening-partner2-topic", type: "text", label: "Topic:" },
                            { id: "listening-partner2-noticed", type: "textarea", rows: 3, label: "What I noticed:" },
                            { id: "listening-insight", type: "textarea", rows: 3, label: "My biggest insight about listening:" }
                        ]
                    }
                ]
            },
            session6: {
                title: "Session 6: Powerful Questions (60 minutes)",
                content: [
                    {
                        type: "text",
                        heading: "Open vs. Closed Questions",
                        paragraphs: []
                    },
                    {
                        type: "form-group",
                        label: "Closed questions (yes/no, limited answer)",
                        inputs: [
                            { id: "questions-closed-example", type: "text", value: "Did you go to a meeting?", label: "Example:" },
                            { id: "questions-closed-useful", type: "textarea", rows: 2, label: "When useful:" }
                        ]
                    },
                    {
                        type: "form-group",
                        label: "Open questions (invite exploration)",
                        inputs: [
                            { id: "questions-open-example", type: "text", value: "What was meaningful about that meeting?", label: "Example:" },
                            { id: "questions-open-useful", type: "textarea", rows: 2, label: "When useful:" }
                        ]
                    },
                    {
                        type: "text",
                        heading: "Question Starters That Open Conversations",
                        paragraphs: [
                            "• What... 'What matters most to you about this?'",
                            "• How... 'How does that align with your values?'",
                            "• When... 'When have you handled something like this before?'",
                            "• Who... 'Who could support you in this?'",
                            "• Where... 'Where do you feel this in your body?'"
                        ]
                    },
                    {
                        type: "heading",
                        text: "My Powerful Questions Practice"
                    },
                    {
                        type: "form",
                        fields: [
                            { id: "questions-q1", type: "text", label: "Question 1:" },
                            { id: "questions-q2", type: "text", label: "Question 2:" },
                            { id: "questions-q3", type: "text", label: "Question 3:" },
                            { id: "questions-q4", type: "text", label: "Question 4:" },
                            { id: "questions-q5", type: "text", label: "Question 5:" },
                            { id: "questions-deepest", type: "textarea", rows: 2, label: "Which one opened the deepest conversation:" },
                            { id: "questions-why-worked", type: "textarea", rows: 3, label: "Why it worked:" }
                        ]
                    }
                ]
            }
        }
    }
};
