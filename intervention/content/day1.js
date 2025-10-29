// Day 1 Section Content
window.CONTENT = window.CONTENT || {};

window.CONTENT.day1 = `
                <h2>Day 1: Awareness</h2>
                <p class="subtitle">The Foundation of Connection</p>
            </div>

            <!-- Day 1 Sub-navigation -->
            <div class="sub-nav">
                <button class="sub-nav-btn active" data-subsection="day1-session1">Session 1</button>
                <button class="sub-nav-btn" data-subsection="day1-session2">Session 2</button>
                <button class="sub-nav-btn" data-subsection="day1-session3">Session 3</button>
                <button class="sub-nav-btn" data-subsection="day1-session4">Session 4</button>
                <button class="sub-nav-btn" data-subsection="day1-session5">Session 5</button>
                <button class="sub-nav-btn" data-subsection="day1-session6">Session 6</button>
                <button class="sub-nav-btn" data-subsection="day1-reflection">Reflection</button>
            </div>

            <!-- Session 1: Welcome & Orientation -->
            <div id="day1-session1" class="subsection active">
                <div class="content-card">
                    <h3>Session 1.1: Welcome & Orientation (9:00-9:30 AM)</h3>
                    <p><strong>Focus:</strong> Connection, safety, and shared agreements</p>

                    <h4>My "Why" for Becoming an Interventionist</h4>
                    <p class="instruction">Reflect on your calling to this work. Use this space to clarify your purpose:</p>

                    <div class="form-group">
                        <label>My connection to intervention work (personal or professional):</label>
                        <textarea id="recovery-story-brought" rows="4" placeholder="What experiences led you here..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>What I hope to bring to families in crisis:</label>
                        <textarea id="recovery-story-given" rows="4" placeholder="Skills, presence, compassion..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Why intervention feels like a calling to me:</label>
                        <textarea id="recovery-story-calling" rows="4" placeholder="What draws you to guide families from crisis to connection..."></textarea>
                    </div>
                </div>

                <div class="content-card">
                    <h4>🪞 Values Cards Activity</h4>
                    <p class="instruction">Select the value that resonates most with you today:</p>

                    <div class="values-cards" id="valuesCards">
                        <!-- Values cards will be dynamically generated -->
                    </div>

                    <div id="selectedValueForm" class="hidden">
                        <div class="form-group">
                            <label>My Selected Value:</label>
                            <input type="text" id="selected-value" readonly>
                        </div>

                        <div class="form-group">
                            <label>Why this value matters to me today:</label>
                            <textarea id="value-matters" rows="3"></textarea>
                        </div>

                        <div class="form-group">
                            <label>How this value shows up in my recovery:</label>
                            <textarea id="value-in-recovery" rows="3"></textarea>
                        </div>

                        <div class="form-group">
                            <label>How this value might inform my work as an interventionist:</label>
                            <textarea id="value-in-coaching" rows="3"></textarea>
                        </div>
                    </div>
                </div>

                <div class="content-card">
                    <h4>Cohort Connections</h4>
                    <p class="instruction">Build relationships with your training cohort. Note fellow interventionists-in-training:</p>

                    <div class="connections-table">
                        <div class="table-row table-header">
                            <div class="table-cell">Name</div>
                            <div class="table-cell">Something Memorable</div>
                        </div>
                        <div class="table-row" data-row="1">
                            <div class="table-cell"><input type="text" id="connection-name-1" placeholder="Name"></div>
                            <div class="table-cell"><input type="text" id="connection-memo-1" placeholder="What you learned..."></div>
                        </div>
                        <div class="table-row" data-row="2">
                            <div class="table-cell"><input type="text" id="connection-name-2" placeholder="Name"></div>
                            <div class="table-cell"><input type="text" id="connection-memo-2" placeholder="What you learned..."></div>
                        </div>
                        <div class="table-row" data-row="3">
                            <div class="table-cell"><input type="text" id="connection-name-3" placeholder="Name"></div>
                            <div class="table-cell"><input type="text" id="connection-memo-3" placeholder="What you learned..."></div>
                        </div>
                        <div class="table-row" data-row="4">
                            <div class="table-cell"><input type="text" id="connection-name-4" placeholder="Name"></div>
                            <div class="table-cell"><input type="text" id="connection-memo-4" placeholder="What you learned..."></div>
                        </div>
                        <div class="table-row" data-row="5">
                            <div class="table-cell"><input type="text" id="connection-name-5" placeholder="Name"></div>
                            <div class="table-cell"><input type="text" id="connection-memo-5" placeholder="What you learned..."></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Session 2: What Is an Intervention & The Interventionist Role -->
            <div id="day1-session2" class="subsection">
                <div class="content-card">
                    <h3>Session 1.2: Intervention & The Interventionist Role (9:30-11:00 AM)</h3>
                    <p><strong>Focus:</strong> Defining intervention and the professional role of the interventionist</p>

                    <h4>Core Definition: What Is Intervention?</h4>
                    <blockquote>
                        "Intervention is a guided process of connection—bringing together the people, information, resources, and actions needed to help someone move from crisis to recovery. The outcome of intervention is connection, honesty, and hope."
                    </blockquote>

                    <div class="form-group">
                        <label>In my own words, intervention is:</label>
                        <textarea id="intervention-definition" rows="3" placeholder="Define intervention in your own words..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>The difference between treatment and intervention:</label>
                        <textarea id="treatment-vs-intervention" rows="3" placeholder="How are they different?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Why "connection" is central to intervention:</label>
                        <textarea id="connection-central" rows="3" placeholder="Reflect on the role of connection..."></textarea>
                    </div>
                </div>

                <div class="content-card">
                    <h4>Interventionist vs. Other Roles</h4>
                    <p class="instruction">Understand how interventionists differ from and collaborate with other helpers:</p>

                    <div class="roles-table">
                        <div class="role-row highlighted">
                            <div class="role-header">
                                <h5>🧭 Interventionist</h5>
                            </div>
                            <div class="role-content">
                                <div class="form-group">
                                    <label>Primary Focus:</label>
                                    <input type="text" id="role-coach-focus" value="Crisis to connection, family systems" readonly>
                                </div>
                                <div class="form-group">
                                    <label>Key Role:</label>
                                    <input type="text" id="role-coach-question" value="Guide families through intervention process" readonly>
                                </div>
                                <div class="form-group">
                                    <label>My notes:</label>
                                    <textarea id="role-coach-example" rows="2"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="role-row">
                            <div class="role-header">
                                <h5>Coach</h5>
                            </div>
                            <div class="role-content">
                                <div class="form-group">
                                    <label>Primary Focus:</label>
                                    <input type="text" id="role-sponsor-focus" placeholder="Ongoing support, accountability">
                                </div>
                                <div class="form-group">
                                    <label>Distinction from Interventionist:</label>
                                    <input type="text" id="role-sponsor-question" placeholder="How does coaching differ?">
                                </div>
                                <div class="form-group">
                                    <label>Notes:</label>
                                    <textarea id="role-sponsor-example" rows="2"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="role-row">
                            <div class="role-header">
                                <h5>Therapist</h5>
                            </div>
                            <div class="role-content">
                                <div class="form-group">
                                    <label>Primary Focus:</label>
                                    <input type="text" id="role-therapist-focus" placeholder="Clinical treatment, diagnosis">
                                </div>
                                <div class="form-group">
                                    <label>Distinction from Interventionist:</label>
                                    <input type="text" id="role-therapist-question" placeholder="How does therapy differ?">
                                </div>
                                <div class="form-group">
                                    <label>Notes:</label>
                                    <textarea id="role-therapist-example" rows="2"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="role-row">
                            <div class="role-header">
                                <h5>Sponsor / Peer Professional</h5>
                            </div>
                            <div class="role-content">
                                <div class="form-group">
                                    <label>Primary Focus:</label>
                                    <input type="text" id="role-casemanager-focus" placeholder="12-step guidance, peer support">
                                </div>
                                <div class="form-group">
                                    <label>Distinction from Interventionist:</label>
                                    <input type="text" id="role-casemanager-question" placeholder="How does sponsorship differ?">
                                </div>
                                <div class="form-group">
                                    <label>Notes:</label>
                                    <textarea id="role-casemanager-example" rows="2"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-box" style="background-color: #fff3cd; border-left: 4px solid #D4AA4C;">
                    <p><strong>⏸️ MICRO-BREAK (5 minutes - ~10:15 AM)</strong></p>
                    <p class="small">Stand, stretch, pair discussion: "Which role distinction surprised you most?"</p>
                </div>

                <div class="content-card">
                    <h4>When to Refer (Not Intervene Yourself)</h4>
                    <p class="instruction">Interventionists must know when to step back and refer to other professionals:</p>

                    <div class="form-group">
                        <label>Situations requiring immediate referral:</label>
                        <textarea id="when-refer-immediate" rows="3" placeholder="Medical crisis, active psychosis, imminent danger, violence..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Signs the situation is outside my scope:</label>
                        <textarea id="when-refer-scope" rows="3" placeholder="What indicates this needs a different professional?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>No financial interest principle - Why it matters:</label>
                        <textarea id="financial-interest" rows="2" placeholder="Why interventionists shouldn't benefit financially from treatment placement..."></textarea>
                    </div>
                </div>

                <div class="content-card">
                    <h4>My Interventionist Identity Reflection</h4>

                    <div class="form-group">
                        <label>What excites me about intervention work:</label>
                        <textarea id="identity-excites" rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <label>What concerns or scares me about intervention work:</label>
                        <textarea id="identity-concerns" rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <label>My biggest question about being an interventionist:</label>
                        <textarea id="identity-question" rows="3"></textarea>
                    </div>
                </div>
            </div>

            <div class="info-box" style="background-color: #e8f4f8; border-left: 4px solid #1d4486;">
                <p><strong>☕ BREAK (11:00-11:15 AM - 15 minutes)</strong></p>
                <p class="small">Biological reset, networking</p>
            </div>

            <!-- Session 3: The Nature of Recovery -->
            <div id="day1-session3" class="subsection">
                <div class="content-card">
                    <h3>Session 1.3: The Nature of Recovery (11:15 AM-12:30 PM)</h3>
                    <p><strong>Focus:</strong> Recovery as lifelong process, values reclamation</p>

                    <h4>Recovery Is Not a One-Time Event</h4>
                    <p class="instruction">Reflect on recovery as an ongoing, lifelong process:</p>

                    <div class="form-group">
                        <label>How I understand "recovery is lifelong":</label>
                        <textarea id="recovery-lifelong" rows="3" placeholder="What does this mean to you?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>The difference between sobriety and recovery:</label>
                        <textarea id="sobriety-vs-recovery" rows="3" placeholder="How are they different?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>What recovery reclaims (beyond sobriety):</label>
                        <textarea id="recovery-reclaims" rows="3" placeholder="Values, purpose, relationships, meaning..."></textarea>
                    </div>
                </div>

                <div class="content-card">
                    <h4>Systemic Recovery</h4>
                    <p><strong>Key Insight:</strong> "Recovery belongs to the whole system, not just the Pivot Person."</p>

                    <div class="form-group">
                        <label>Who else in the family system needs recovery support:</label>
                        <textarea id="system-recovery" rows="3" placeholder="Parents, siblings, partners, children..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>How family members are affected by addiction:</label>
                        <textarea id="family-affected" rows="3" placeholder="Trauma, enabling, codependency, loss..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Why the interventionist serves the whole family, not just the Pivot Person:</label>
                        <textarea id="whole-family-why" rows="3" placeholder="Reflect on systemic intervention..."></textarea>
                    </div>
                </div>
            </div>

            <div class="info-box" style="background-color: #e8f4f8; border-left: 4px solid #1d4486;">
                <p><strong>🍽️ LUNCH BREAK (12:30-1:30 PM - 60 minutes)</strong></p>
                <p class="small">Time to eat, digest, decompress, and network</p>
            </div>

            <!-- Session 4: Systems Thinking in Recovery -->
            <div id="day1-session4" class="subsection">
                <div class="content-card">
                    <h3>Session 1.4: Systems Thinking in Recovery (1:30-2:45 PM)</h3>
                    <p><strong>Focus:</strong> Family systems mapping and understanding addiction as a family disease</p>

                    <h4>Family Systems Mapping Exercise</h4>
                    <p class="instruction">Practice mapping a family system affected by addiction:</p>

                    <div class="form-group">
                        <label>Pivot Person (at center of intervention):</label>
                        <input type="text" id="systems-pivot" placeholder="Name, age, relationship to substance">
                    </div>

                    <div class="form-group">
                        <label>Family members directly affected:</label>
                        <textarea id="systems-family" rows="3" placeholder="List family members and their relationships..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Support network members (friends, employers, community):</label>
                        <textarea id="systems-network" rows="3" placeholder="Who else is in the system?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Professional helpers currently involved:</label>
                        <textarea id="systems-professionals" rows="3" placeholder="Therapists, sponsors, coaches, doctors..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>System dynamics I observe:</label>
                        <textarea id="systems-dynamics" rows="4" placeholder="Enabling? Codependency? Enmeshment? Boundaries? Communication patterns?"></textarea>
                    </div>
                </div>

                <div class="info-box" style="background-color: #fff3cd; border-left: 4px solid #D4AA4C;">
                    <p><strong>⏸️ MICRO-BREAK (5 minutes)</strong></p>
                    <p class="small">Stand up, stretch, turn to someone nearby and share: "What's one system dynamic you're noticing in the mapping exercise?"</p>
                </div>

                <div class="content-card">
                    <h4>The Pivot Person Concept</h4>
                    <p><strong>Core Values Language:</strong> We use "Pivot Person" instead of "addict" or "identified patient"</p>

                    <div class="form-group">
                        <label>Why "Pivot Person" matters:</label>
                        <textarea id="pivot-person-why" rows="3" placeholder="What does this language communicate about dignity and agency?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>How the family system pivots around this person:</label>
                        <textarea id="pivot-dynamics" rows="3" placeholder="Describe system patterns..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>How intervention helps the system rebalance:</label>
                        <textarea id="pivot-rebalance" rows="3" placeholder="What shifts when intervention succeeds?"></textarea>
                    </div>
                </div>
            </div>

            <!-- Session 5: Language Workshop -->
            <div id="day1-session5" class="subsection">
                <div class="content-card">
                    <h3>Session 1.5: Language Workshop (3:00-4:15 PM)</h3>
                    <p><strong>Focus:</strong> Core Values language - "Healthy Choices," "Pivot Person," reframing blame</p>

                    <h4>Language Reframing Exercise</h4>
                    <p class="instruction">Practice reframing common judgmental phrases into Core Values language:</p>

                    <div class="form-group">
                        <label>"Boundaries" → "Healthy Choices"</label>
                        <p class="small">Example: "I'm making a healthy choice to not give you money" instead of "I'm setting a boundary"</p>
                        <textarea id="language-boundaries" rows="2" placeholder="Write your own reframe..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>"Addict" / "Alcoholic" → "Pivot Person" / "Person with substance use disorder"</label>
                        <p class="small">Why this matters: Reduces stigma, honors dignity, person-first language</p>
                        <textarea id="language-pivot" rows="2" placeholder="Reflect on this language shift..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>"Enabling" → "Supporting in a way that may not help"</label>
                        <textarea id="language-enabling" rows="2" placeholder="Write your own reframe..."></textarea>
                    </div>
                </div>

                <div class="content-card">
                    <h4>Active Practice (Stand & Practice)</h4>
                    <p class="instruction">Find a partner. Stand and practice these language shifts out loud:</p>

                    <div class="form-group">
                        <label>Partner A: Say a stigmatizing phrase</label>
                        <p class="small">Example: "My brother is an addict who needs to hit bottom."</p>
                    </div>

                    <div class="form-group">
                        <label>Partner B: Reframe using Core Values language</label>
                        <p class="small">Example: "Your brother is a Pivot Person experiencing substance use disorder. A crisis point might create an opportunity for intervention."</p>
                    </div>

                    <div class="form-group">
                        <label>Switch roles and practice 3-4 more scenarios</label>
                        <textarea id="language-practice-notes" rows="3" placeholder="What felt natural? What was challenging?"></textarea>
                    </div>
                </div>

                <div class="info-box" style="background-color: #fff3cd; border-left: 4px solid #D4AA4C;">
                    <p><strong>⏸️ MICRO-BREAK (5 minutes)</strong></p>
                    <p class="small">Remain standing. Stretch. Share with your partner: "Which language shift feels most important for you to practice?"</p>
                </div>

                <div class="content-card">
                    <h4>Additional Language Reframes</h4>

                    <div class="form-group">
                        <label>"Hitting bottom" → "Crisis point" / "Moment of clarity"</label>
                        <textarea id="language-bottom" rows="2" placeholder="Write your own reframe..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>"Codependent" → "Deeply affected by the system"</label>
                        <textarea id="language-codependent" rows="2" placeholder="Write your own reframe..."></textarea>
                    </div>
                </div>

                <div class="content-card">
                    <h4>"Recovery is a Team Sport"</h4>
                    <p><strong>Core Values Metaphor:</strong> This language emphasizes collaboration over individual heroism</p>

                    <div class="form-group">
                        <label>What "team sport" communicates about recovery:</label>
                        <textarea id="team-sport-meaning" rows="3" placeholder="How does this metaphor shift perspective?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Who are the "team members" in intervention:</label>
                        <textarea id="team-members" rows="3" placeholder="Family, interventionist, therapist, sponsor, peer support..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>How I'll use this language with families:</label>
                        <textarea id="team-sport-use" rows="3" placeholder="Practical application..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Session 6: Integration & Community Building -->
            <div id="day1-session6" class="subsection">
                <div class="content-card">
                    <h3>Session 1.6: Integration & Community Building (4:30-5:30 PM)</h3>
                    <p><strong>Focus:</strong> Personal reflection (30m) + Community connection (30m)</p>

                    <h4>Day 1 Integration: Awareness</h4>
                    <p class="instruction">Reflect on what you've learned about awareness as the foundation of intervention work:</p>

                    <div class="form-group">
                        <label>The most important insight from today:</label>
                        <textarea id="day1-insight" rows="3" placeholder="What shifted for you?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>How I now understand "intervention" differently:</label>
                        <textarea id="intervention-understanding" rows="3" placeholder="What changed in your thinking?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>The language shift that resonates most with me:</label>
                        <textarea id="language-resonates" rows="3" placeholder="Pivot Person? Healthy Choices? Team Sport?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Questions I'm bringing into Day 2:</label>
                        <textarea id="questions-day2" rows="3" placeholder="What do you still need to understand?"></textarea>
                    </div>
                </div>

                <div class="content-card">
                    <h4>Personal Commitment</h4>

                    <div class="form-group">
                        <label>One practice I'll commit to tonight / tomorrow morning:</label>
                        <textarea id="tonight-practice" rows="2" placeholder="Journaling? Meditation? Reading?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Who I want to talk to about what I'm learning:</label>
                        <textarea id="talk-to" rows="2" placeholder="Mentor? Sponsor? Family member?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>My intention for Day 2 (Coordination):</label>
                        <textarea id="day2-intention" rows="3" placeholder="What do you hope to gain tomorrow?"></textarea>
                    </div>
                </div>

                <div class="content-card">
                    <h4>Community Q&A & Connection (30 minutes)</h4>
                    <p class="instruction">Now we move from individual reflection to community connection.</p>

                    <div class="form-group">
                        <label>Questions I want to ask the group or trainer:</label>
                        <textarea id="community-questions" rows="3" placeholder="What are you curious about?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Someone I'd like to connect with before tomorrow:</label>
                        <input type="text" id="connect-with" placeholder="Name and why you want to connect...">
                    </div>

                    <div class="info-box">
                        <p><strong>Parking Lot</strong></p>
                        <p class="small">Questions we didn't get to today will be addressed tomorrow morning or during breaks.</p>
                    </div>
                </div>
            </div>

            <div id="day1-reflection" class="subsection">
                <div class="content-card">
                    <h3>Day 1: Awareness - Final Reflection</h3>
                    <p class="instruction">Take time to integrate your learning from Day 1:</p>

                    <div class="form-group">
                        <label>Most important thing I learned about intervention today:</label>
                        <textarea id="day1-important" rows="3" placeholder="What will stay with you?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Biggest surprise or shift in thinking:</label>
                        <textarea id="day1-surprise" rows="3" placeholder="What challenged your assumptions?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>What I'm still processing or confused about:</label>
                        <textarea id="day1-confused" rows="3" placeholder="What needs more clarity?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>One practice I'll commit to before Day 2:</label>
                        <textarea id="day1-practice" rows="3" placeholder="How will you integrate this learning?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>My biggest question for Day 2 (Coordination):</label>
                        <textarea id="day1-question" rows="3" placeholder="What do you need to understand next?"></textarea>
                    </div>
                </div>
            </div>
`;
