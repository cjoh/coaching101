// Day 3 Section Content
window.CONTENT = window.CONTENT || {};

window.CONTENT.day3 = `
                <h2>Day 3: Care</h2>
                <p class="subtitle">Practice, Integration, and Reflection</p>
            </div>

            <!-- Day 3 Sub-navigation -->
            <div class="sub-nav">
                <button class="sub-nav-btn active" data-subsection="day3-session1">3.1 Check-In</button>
                <button class="sub-nav-btn" data-subsection="day3-session2">3.2 Trauma & Prep</button>
                <button class="sub-nav-btn" data-subsection="day3-session3a">3.3A Role-Plays 1</button>
                <button class="sub-nav-btn" data-subsection="day3-session3b">3.3B Role-Plays 2</button>
                <button class="sub-nav-btn" data-subsection="day3-session4">3.4 Debrief</button>
                <button class="sub-nav-btn" data-subsection="day3-session5">3.5 Mentorship</button>
                <button class="sub-nav-btn" data-subsection="day3-session6">3.6 Closing</button>
                <button class="sub-nav-btn" data-subsection="day3-reflection">Reflection</button>
            </div>

            <!-- Session 1: Morning Check-In -->
            <div id="day3-session1" class="subsection active">
                <div class="content-card">
                    <h3>Session 3.1: Morning Check-In & Intention-Setting (9:00-9:30 AM)</h3>
                    <p><strong>Focus:</strong> Grounding, presence, and readiness for today's practice</p>

                    <div class="form-group">
                        <label>How I'm feeling this morning (body, mind, heart):</label>
                        <textarea id="day3-morning-feeling" rows="3" placeholder="Physical energy, mental clarity, emotional state..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>My intention for today's role-plays:</label>
                        <textarea id="day3-intention" rows="2" placeholder="What I want to practice or learn..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>One thing I'm nervous about:</label>
                        <textarea id="day3-nervous" rows="2" placeholder="What feels challenging..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>One strength I bring to today:</label>
                        <textarea id="day3-strength" rows="2" placeholder="Skills, experience, or qualities I'm confident in..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Support I need from the group today:</label>
                        <textarea id="day3-support-needed" rows="2" placeholder="What would help me learn and practice..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Session 2: Trauma-Informed Practice & Case Prep -->
            <div id="day3-session2" class="subsection">
                <div class="content-card">
                    <h3>Session 3.2: Trauma-Informed Practice & Case Prep (9:30-10:15 AM)</h3>
                    <p><strong>Focus:</strong> Trauma framework BEFORE roleplays + scenario preparation</p>

                    <h4>Trauma-Informed Framework</h4>
                    <p class="instruction">Understanding trauma before we practice intervention work:</p>

                    <div class="form-group">
                        <label>5 Principles of Trauma-Informed Care:</label>
                        <p class="small">Safety | Trustworthiness | Choice | Collaboration | Empowerment</p>
                        <textarea id="trauma-principles" rows="2" placeholder="How these principles apply to intervention work..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Signs of trauma I might see during interventions:</label>
                        <textarea id="trauma-signs-prep" rows="3" placeholder="Behavioral cues, emotional reactions, resistance patterns..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>How I'll create safety in today's roleplays:</label>
                        <textarea id="trauma-safety-prep" rows="3" placeholder="Language, pacing, choice, control, checking in..."></textarea>
                    </div>

                    <h4>Case Study Preparation</h4>
                    <p class="instruction">Final preparation before role-play simulations:</p>

                    <div class="form-group">
                        <label>Confirmed intervention mode for our case:</label>
                        <input type="text" id="prep-mode" placeholder="e.g., Structured, Collaborative...">
                    </div>

                    <div class="form-group">
                        <label>Order of speakers and key points:</label>
                        <textarea id="prep-speakers" rows="3" placeholder="Who speaks when and what they'll say..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Facilitator's opening script (practice notes):</label>
                        <textarea id="prep-opening" rows="3" placeholder="How you'll start the intervention..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>My role in the simulation:</label>
                        <input type="text" id="prep-my-role" placeholder="e.g., Interventionist, Mother, Pivot Person...">
                    </div>

                    <div class="form-group">
                        <label>My readiness check (1-10 and what I need):</label>
                        <textarea id="prep-readiness" rows="2" placeholder="How ready do I feel? What support do I need..."></textarea>
                    </div>
                </div>
            </div>

<!-- Session 3A: Role-Play Round 1 -->
            <div id="day3-session3a" class="subsection">
                <div class="content-card">
                    <h3>Session 3.3A: Role-Play Round 1 (10:15-11:30 AM)</h3>
                    <p><strong>Focus:</strong> First two intervention scenarios with immediate feedback</p>
                    <p class="instruction">Two groups present their intervention simulations (30 minutes each + 15-minute debrief)</p>

                    <h4>Observation Notes - Scenario 1</h4>
                    <p class="small">Take notes while observing the first simulation:</p>

                    <div class="form-group">
                        <label>What the interventionist did well:</label>
                        <textarea id="roleplay1-strengths" rows="3" placeholder="Opening, pacing, managing process, handling resistance..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Effective moments (what worked):</label>
                        <textarea id="roleplay1-effective" rows="2" placeholder="Specific interventions that landed well..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Growth opportunities (constructive feedback):</label>
                        <textarea id="roleplay1-growth" rows="2" placeholder="What could be improved or tried differently..."></textarea>
                    </div>

                    <h4>Observation Notes - Scenario 2</h4>

                    <div class="form-group">
                        <label>What the interventionist did well:</label>
                        <textarea id="roleplay2-strengths" rows="3" placeholder="Opening, pacing, managing process, handling resistance..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Effective moments (what worked):</label>
                        <textarea id="roleplay2-effective" rows="2" placeholder="Specific interventions that landed well..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Growth opportunities (constructive feedback):</label>
                        <textarea id="roleplay2-growth" rows="2" placeholder="What could be improved or tried differently..."></textarea>
                    </div>
                </div>
            </div>

            <div class="info-box" style="background-color: #e8f4f8; border-left: 4px solid #1d4486;">
                <p><strong>☕ BREAK (11:30-11:45 AM - 15 minutes)</strong></p>
                <p class="small">Biological reset, emotional processing, networking. Roleplay work is intense!</p>
            </div>

            <!-- Session 3B: Role-Play Round 2 -->
            <div id="day3-session3b" class="subsection">
                <div class="content-card">
                    <h3>Session 3.3B: Role-Play Round 2 (11:45 AM-12:45 PM)</h3>
                    <p><strong>Focus:</strong> Additional scenarios and integration</p>
                    <p class="instruction">Final scenarios (25 minutes each + 10-minute integration)</p>

                    <h4>Observation Notes - Additional Scenarios</h4>

                    <div class="form-group">
                        <label>Patterns I'm noticing across all scenarios:</label>
                        <textarea id="roleplay-patterns" rows="3" placeholder="Common challenges, effective strategies, recurring themes..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Most powerful intervention moment I witnessed:</label>
                        <textarea id="roleplay-powerful" rows="2" placeholder="What moment really landed and why..."></textarea>
                    </div>

                    <h4>My Personal Role-Play Experience</h4>

                    <div class="form-group">
                        <label>My role in the simulation:</label>
                        <input type="text" id="roleplay-my-role" placeholder="e.g., Interventionist, family member...">
                    </div>

                    <div class="form-group">
                        <label>What felt most challenging:</label>
                        <textarea id="roleplay-challenge" rows="3" placeholder="Difficult moments, uncertainties..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>What surprised me (insights or breakthroughs):</label>
                        <textarea id="roleplay-surprise" rows="3" placeholder="Unexpected realizations or learnings..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Feedback I received from observers:</label>
                        <textarea id="roleplay-feedback-received" rows="3" placeholder="Constructive feedback from the group..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Key takeaway from all simulations:</label>
                        <textarea id="roleplay-takeaway" rows="3" placeholder="What I'm taking forward from this practice..."></textarea>
                    </div>
                </div>
            </div>

            <div class="info-box" style="background-color: #e8f4f8; border-left: 4px solid #1d4486;">
                <p><strong>🍽️ LUNCH BREAK (12:45-1:45 PM - 60 minutes)</strong></p>
                <p class="small">Time to eat, digest, decompress after intense roleplay work</p>
            </div>

            <!-- Session 4: Trauma-Informed Debrief -->
            <div id="day3-session4" class="subsection">
                <div class="content-card">
                    <h3>Session 3.4: Trauma-Informed Debrief (1:45-2:45 PM)</h3>
                    <p><strong>Focus:</strong> Processing the simulations with trauma-informed care lens</p>

                    <h4>TiPS Framework (Trauma-informed Practice Strategies)</h4>
                    <p class="instruction">Processing what came up during role-plays:</p>

                    <div class="form-group">
                        <label>What feelings or reactions came up for me:</label>
                        <textarea id="debrief-feelings" rows="3" placeholder="Emotional responses, triggers, body sensations..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Connections to my own story (if any):</label>
                        <textarea id="debrief-personal" rows="3" placeholder="Personal experiences that resonated..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>How I'll care for myself after intense practice:</label>
                        <textarea id="debrief-selfcare" rows="3" placeholder="Self-care strategies, boundaries, support..."></textarea>
                    </div>

                    <h4>Trauma-Informed Interventionist Practice</h4>

                    <div class="form-group">
                        <label>Signs of trauma I might see in intervention work:</label>
                        <textarea id="trauma-signs" rows="3" placeholder="Behavioral cues, emotional reactions..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>How I'll create safety in intervention settings:</label>
                        <textarea id="trauma-safety" rows="3" placeholder="Language, pacing, choice, control..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>When I'll seek consultation or supervision:</label>
                        <textarea id="trauma-consultation" rows="3" placeholder="Red flags, complex cases, personal triggers..."></textarea>
                    </div>
                </div>
            </div>

            <div class="info-box" style="background-color: #e8f4f8; border-left: 4px solid #1d4486;">
                <p><strong>☕ BREAK (2:45-3:05 PM - 20 minutes)</strong></p>
                <p class="small">Extended break after emotionally heavy content. Participants need reset time.</p>
            </div>

            <!-- Session 5: Mentorship Program Overview -->
            <div id="day3-session5" class="subsection">
                <div class="content-card">
                    <h3>Session 3.5: Mentorship Program Overview (3:05-3:35 PM)</h3>
                    <p><strong>Focus:</strong> Understanding the 40-week mentorship structure and next steps</p>

                    <h4>40-Week Mentorship Structure</h4>

                    <div class="info-box">
                        <p><strong>Phase 1 (Weeks 1-12):</strong> Foundation Building</p>
                        <p class="small">Weekly supervision calls, case observation, skill development</p>
                    </div>

                    <div class="info-box">
                        <p><strong>Phase 2 (Weeks 13-28):</strong> Guided Practice</p>
                        <p class="small">Co-facilitated interventions, case consultation, peer learning</p>
                    </div>

                    <div class="info-box">
                        <p><strong>Phase 3 (Weeks 29-40):</strong> Independent Practice</p>
                        <p class="small">Lead interventions with supervision, final case review, certification</p>
                    </div>

                    <h4>Mentorship Commitment</h4>

                    <div class="form-group">
                        <label>My availability for mentorship (weekly commitment):</label>
                        <textarea id="mentorship-availability" rows="2" placeholder="Days/times I can commit to calls and practice..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Learning goals for mentorship:</label>
                        <textarea id="mentorship-goals" rows="3" placeholder="What I want to develop during the 40 weeks..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Questions about mentorship program:</label>
                        <textarea id="mentorship-questions" rows="2" placeholder="Clarifications I need..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Support I'll need to complete mentorship:</label>
                        <textarea id="mentorship-support" rows="2" placeholder="Resources, accountability, barriers to address..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Session 6: Integration & Closing Ceremony -->
            <div id="day3-session6" class="subsection">
                <div class="content-card">
                    <h3>Session 3.6: Integration & Closing Ceremony (3:35-4:45 PM)</h3>
                    <p><strong>Focus:</strong> Learning synthesis, commitments, and celebration (70 minutes)</p>

                    <h4>Letter to My Future Self</h4>
                    <p class="instruction">Write to yourself 6 months from now, at the midpoint of mentorship:</p>

                    <div class="form-group">
                        <label>Dear Future Me,</label>
                        <textarea id="future-letter" rows="6" placeholder="What do you want to remember from these 3 days? What commitments are you making? What hopes do you have for your development as an interventionist?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Signed,</label>
                        <input type="text" id="future-signature" placeholder="Your name">
                    </div>

                    <div class="form-group">
                        <label>Today's date:</label>
                        <input type="date" id="future-date">
                    </div>

                    <h4>Circle Closing Reflections</h4>

                    <div class="form-group">
                        <label>What I'm taking with me from this training:</label>
                        <textarea id="closing-taking" rows="3" placeholder="Skills, insights, connections..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>My commitment to the families I'll serve:</label>
                        <textarea id="closing-commitment" rows="3" placeholder="How I'll show up as an interventionist..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>How I'll honor this calling:</label>
                        <textarea id="closing-honor" rows="3" placeholder="Daily practices, ongoing learning, self-care..."></textarea>
                    </div>

                    <div class="info-box" style="background-color: #fff3cd; border-left: 4px solid #D4AA4C;">
                        <p><strong>⏸️ MICRO-BREAK (5 minutes - ~4:15 PM)</strong></p>
                        <p class="small">Stand, stretch. Transition from reflection to celebration.</p>
                    </div>

                    <div class="form-group">
                        <label>Gratitude:</label>
                        <textarea id="closing-gratitude" rows="3" placeholder="Appreciation for the group, facilitators, this experience..."></textarea>
                    </div>
                </div>

                <div class="content-card" style="text-align: center; background: linear-gradient(135deg, #1D4486 0%, #2a5ba8 100%); color: white;">
                    <h3 style="color: white;">🎓 Congratulations!</h3>
                    <p style="font-size: 1.2rem;">You've completed the Core Values Interventionist Training</p>
                    <p style="color: #D4AA4C; font-weight: 700; font-size: 1.3rem; margin-top: 2rem;">Thank you for your commitment to serving families in crisis.</p>
                    <p style="font-size: 1.1rem; margin-top: 1.5rem;">May you intervene with compassion, guide with humility, and trust the process of connection.</p>
                    <div style="margin-top: 2rem; font-size: 2rem;">
                        🪞 🧭 🗼 🌳
                    </div>
                    <p style="margin-top: 2rem; font-weight: 700; letter-spacing: 1px;">CORE VALUES RECOVERY</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem;">Begin your 40-week mentorship journey</p>
                </div>

                <div class="content-card">
                    <h4>Final Goodbyes & Logistics (4:45-5:00 PM)</h4>
                    <p class="instruction">Wrapping up the 3-day training with practical next steps:</p>

                    <div class="info-box">
                        <p><strong>✓ Certificates</strong> - Completion certificates distributed</p>
                        <p><strong>✓ Contact Exchange</strong> - Connect with cohort members</p>
                        <p><strong>✓ Next Steps</strong> - Mentorship program begins, first call scheduling</p>
                        <p><strong>✓ Resources</strong> - Access to digital workbook, tools reference, community</p>
                    </div>

                    <div class="form-group">
                        <label>Action items before first mentorship call:</label>
                        <textarea id="closing-action-items" rows="3" placeholder="Schedule first call, review tools, prepare first case..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Day 3 Reflection -->
            <div id="day3-reflection" class="subsection">
                <div class="content-card">
                    <h3>Day 3: Care - Final Reflection</h3>
                    <p class="instruction">Integrating the full 3-day training experience</p>

                    <div class="form-group">
                        <label>Most powerful moment from Day 3:</label>
                        <textarea id="day3-powerful-moment" rows="3" placeholder="What moved me or shifted my understanding..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>What the role-plays taught me about myself:</label>
                        <textarea id="day3-self-learning" rows="3" placeholder="Strengths, growing edges, patterns..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>One skill I'm confident in:</label>
                        <textarea id="day3-confidence" rows="2" placeholder="What I know I can do well..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>One skill I'll prioritize developing:</label>
                        <textarea id="day3-develop" rows="2" placeholder="What I most need to practice..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>How I'll integrate trauma-informed care:</label>
                        <textarea id="day3-trauma-care" rows="3" placeholder="Practices I'll bring to intervention work..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>My ethical "north star" as an interventionist:</label>
                        <textarea id="day3-ethics" rows="3" placeholder="Core principles that will guide me..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>What I'm looking forward to in mentorship:</label>
                        <textarea id="day3-mentorship-forward" rows="3" placeholder="Opportunities, challenges, growth..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>My biggest learning from the full 3-day training:</label>
                        <textarea id="day3-biggest-learning" rows="4" placeholder="What will stay with me from this experience..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>One word that captures my journey:</label>
                        <input type="text" id="day3-one-word" placeholder="Your word...">
                    </div>
                </div>
            </div>
        </section>

`;
