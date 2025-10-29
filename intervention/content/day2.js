// Day 2 Section Content
window.CONTENT = window.CONTENT || {};

window.CONTENT.day2 = `
                <h2>Day 2: Coordination</h2>
                <p class="subtitle">The Architecture of Care</p>
            </div>

            <!-- Day 2 Sub-navigation -->
            <div class="sub-nav">
                <button class="sub-nav-btn active" data-subsection="day2-session1">2.1 Check-In</button>
                <button class="sub-nav-btn" data-subsection="day2-session2">2.2 Professional Foundations</button>
                <button class="sub-nav-btn" data-subsection="day2-session3a">2.3A Continuum (1-3)</button>
                <button class="sub-nav-btn" data-subsection="day2-session3b">2.3B Continuum (4-5)</button>
                <button class="sub-nav-btn" data-subsection="day2-session3">2.3C Assessment</button>
                <button class="sub-nav-btn" data-subsection="day2-session4">2.4 Core Tools</button>
                <button class="sub-nav-btn" data-subsection="day2-session5">2.5 Case Study</button>
                <button class="sub-nav-btn" data-subsection="day2-session6">2.6 Closing</button>
                <button class="sub-nav-btn" data-subsection="day2-reflection">Reflection</button>
            </div>

            <!-- Session 1: Morning Check-In & Integration -->
            <div id="day2-session1" class="subsection active">
                <div class="content-card">
                    <h3>Session 2.1: Morning Check-In & Integration (9:00-9:30 AM)</h3>
                    <p><strong>Focus:</strong> Ground the group, integrate Day 1 learning, prepare for Day 2 depth</p>

                    <h4>Day 2 Opening: Coordination</h4>
                    <p><em>"Today we move into Coordination—the architecture of care. We'll explore practical questions: Who does what? How do we assess which intervention mode fits this family? What tools do we use?"</em></p>

                    <div class="form-group">
                        <label>One insight from Day 1 that stayed with me overnight:</label>
                        <textarea id="day2-overnight-insight" rows="3" placeholder="What's still alive for you?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>One question I'm bringing into Day 2:</label>
                        <textarea id="day2-question-bringing" rows="3" placeholder="What do you need to understand today?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>My intention for Day 2 (Coordination):</label>
                        <textarea id="day2-my-intention" rows="3" placeholder="What do you hope to gain from today?"></textarea>
                    </div>
                </div>
            </div>

            <!-- Session 2: Boundaries & Ethics Deep Dive -->
            <div id="day2-session2" class="subsection">
                <div class="content-card">
                    <h3>Session 2.2: Boundaries & Ethics Deep Dive (9:30-11:00 AM)</h3>
                    <p><strong>Focus:</strong> Professional boundaries and navigating complex ethical dilemmas</p>

                    <h4>Professional Boundaries</h4>

                    <div class="form-group">
                        <label>Boundaries I must maintain as an interventionist:</label>
                        <textarea id="boundaries-must" rows="3" placeholder="No financial interest in treatment placement, appropriate relationships, scope of practice..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Gray areas I need to discuss with mentor:</label>
                        <textarea id="boundaries-gray" rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <label>How I'll handle boundary violations if they occur:</label>
                        <textarea id="boundaries-violations" rows="3"></textarea>
                    </div>
                </div>

                <div class="info-box" style="background-color: #fff3cd; border-left: 4px solid #D4AA4C;">
                    <p><strong>⏸️ MICRO-BREAK (5 minutes - ~10:15 AM)</strong></p>
                    <p class="small">Stand, stretch, find a partner and discuss: "What's one boundary you're committed to maintaining as an interventionist?"</p>
                </div>

                <div class="content-card">
                    <h4>Complex Ethics Scenarios</h4>
                    <p class="instruction">Practice navigating gray-area dilemmas:</p>

                    <div class="form-group">
                        <label>Scenario discussed:</label>
                        <textarea id="ethics-scenario" rows="2" placeholder="Describe the ethical dilemma..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Competing values or principles:</label>
                        <textarea id="ethics-values" rows="3" placeholder="What values are in tension (e.g., autonomy vs. safety)..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>My initial response:</label>
                        <textarea id="ethics-response" rows="2" placeholder="What would I do..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Other perspectives I heard:</label>
                        <textarea id="ethics-perspectives" rows="3" placeholder="Alternative approaches discussed..."></textarea>
                    </div>

                    <h4>My Ethical Framework</h4>

                    <div class="form-group">
                        <label>Core ethical commitments as an interventionist:</label>
                        <textarea id="ethics-commitments" rows="4" placeholder="Non-negotiable principles that guide my practice..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Gray areas I'm still navigating:</label>
                        <textarea id="ethics-gray-areas" rows="3" placeholder="Questions I'm still working through..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>How I'll make ethical decisions in real time:</label>
                        <textarea id="ethics-decision-process" rows="3" placeholder="My decision-making process, who I'll consult..."></textarea>
                    </div>

                    <h4>Mode 4 Tools: Crisis Intervention</h4>
                    <p class="instruction">When immediate safety concerns require urgent action:</p>
                    <p class="small"><em>Note: Crisis intervention requires specialized training and often involves emergency services coordination.</em></p>

                    <div class="form-group">
                        <label>Emergency response protocol (when to call 911, crisis hotlines, emergency services):</label>
                        <textarea id="mode4-emergency-protocol" rows="3" placeholder="Steps to take when safety is at immediate risk..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Safety assessment checklist:</label>
                        <textarea id="mode4-safety-assessment" rows="3" placeholder="Suicidal ideation, overdose risk, violence potential, medical emergency signs..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>De-escalation techniques:</label>
                        <textarea id="mode4-deescalation" rows="3" placeholder="Staying calm, creating space, validating emotions, reducing threats..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Rapid coordination with emergency services:</label>
                        <textarea id="mode4-rapid-coordination" rows="3" placeholder="Police, hospitals, crisis teams, mobile crisis units..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>When I would activate Mode 4 (Crisis) intervention:</label>
                        <textarea id="mode4-activation" rows="2" placeholder="Scenarios that require immediate crisis response..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Session 3A: 5-Mode Continuum (Part 1) -->
            <div id="day2-session3a" class="subsection">
                <div class="content-card">
                    <h3>Session 2.3A: 5-Mode Continuum - Part 1 (11:15 AM-12:15 PM)</h3>
                    <p><strong>Focus:</strong> Modes 1-3 (Collaborative, Structured, Planned)</p>

                    <h4>The 5-Mode Intervention Continuum</h4>
                    <p class="instruction">Understanding which intervention mode fits each unique family situation:</p>

                    <div class="info-box">
                        <h5>Mode 1: Collaborative Intervention</h5>
                        <p>Pivot Person is willing and ready; family is engaged</p>
                        <p class="small"><strong>Tools you'll learn:</strong> Planning meetings, resource coordination, collaborative goal-setting, family communication agreements</p>
                        <div class="form-group">
                            <label>Key characteristics and when to use:</label>
                            <textarea id="mode1-notes" rows="3" placeholder="Notes on Mode 1..."></textarea>
                        </div>
                    </div>

                    <div class="info-box">
                        <h5>Mode 2: Structured Intervention</h5>
                        <p>Pivot Person is ambivalent; family needs guidance</p>
                        <p class="small"><strong>Tools you'll learn:</strong> Family meetings, Impact Letters, treatment options research, intervention scripts, handling resistance strategies</p>
                        <div class="form-group">
                            <label>Key characteristics and when to use:</label>
                            <textarea id="mode2-notes" rows="3" placeholder="Notes on Mode 2..."></textarea>
                        </div>
                    </div>

                    <div class="info-box">
                        <h5>Mode 3: Planned Intervention</h5>
                        <p>Pivot Person is resistant; formal gathering needed</p>
                        <p class="small"><strong>Tools you'll learn:</strong> Full intervention planning, rehearsal process, professional support coordination, treatment transition logistics</p>
                        <div class="form-group">
                            <label>Key characteristics and when to use:</label>
                            <textarea id="mode3-notes" rows="3" placeholder="Notes on Mode 3..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="info-box" style="background-color: #fff3cd; border-left: 4px solid #D4AA4C;">
                    <p><strong>⏸️ MICRO-BREAK (5 minutes - built into session)</strong></p>
                    <p class="small">Stand, stretch, pair discussion: "Which mode do you think you'll use most often and why?"</p>
                </div>
            </div>

            <div class="info-box" style="background-color: #e8f4f8; border-left: 4px solid #1d4486;">
                <p><strong>☕ BREAK (12:15-12:30 PM - 15 minutes)</strong></p>
                <p class="small">Movement, biological reset, quick networking</p>
            </div>

            <!-- Session 3B: 5-Mode Continuum (Part 2) -->
            <div id="day2-session3b" class="subsection">
                <div class="content-card">
                    <h3>Session 2.3B: 5-Mode Continuum - Part 2 (12:30-1:15 PM)</h3>
                    <p><strong>Focus:</strong> Modes 4-5 (Crisis, Individual) + Assessment Framework (45 minutes)</p>

                    <div class="info-box">
                        <h5>Mode 4: Crisis Intervention</h5>
                        <p>Immediate safety concern; urgent action required</p>
                        <p class="small"><strong>Tools you'll learn:</strong> Emergency response protocol, safety assessment checklist, de-escalation techniques, rapid coordination with emergency services</p>
                        <div class="form-group">
                            <label>Key characteristics and when to use:</label>
                            <textarea id="mode4-notes" rows="3" placeholder="Notes on Mode 4..."></textarea>
                        </div>
                    </div>

                    <div class="info-box">
                        <h5>Mode 5: Individual Intervention</h5>
                        <p>Pivot Person wants help; family not available/willing</p>
                        <p class="small"><strong>Tools you'll learn:</strong> One-on-one engagement, treatment navigation, resource connection, individual support planning, follow-up coordination</p>
                        <div class="form-group">
                            <label>Key characteristics and when to use:</label>
                            <textarea id="mode5-notes" rows="3" placeholder="Notes on Mode 5..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="content-card">
                    <h4>Assessment Framework</h4>
                    <p class="instruction">How to choose the right mode for each family:</p>

                    <div class="form-group">
                        <label>Key assessment factors (Safety, Urgency, Readiness, Relational Capacity):</label>
                        <textarea id="assessment-factors" rows="3" placeholder="How do these factors determine intervention mode?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Practice scenario - Which mode would I choose and why:</label>
                        <textarea id="continuum-practice" rows="4" placeholder="Describe family situation and your mode selection reasoning..."></textarea>
                    </div>
                </div>
            </div>

            <div class="info-box" style="background-color: #e8f4f8; border-left: 4px solid #1d4486;">
                <p><strong>🍽️ LUNCH BREAK (1:15-2:15 PM - 60 minutes)</strong></p>
                <p class="small">Time to eat, digest, decompress, and network. Biological needs matter!</p>
            </div>

            <!-- Session 3: First Call & Assessment Protocol -->
            <div id="day2-session3" class="subsection">
                <div class="content-card">
                    <h3>Session 2.3C: First Call & Assessment Protocol (2:15-3:15 PM)</h3>
                    <p><strong>Focus:</strong> Learn to distinguish inquiry calls from formal assessments, and understand the ethical imperative of charging for assessments</p>
                    <p class="instruction">This session teaches the professional boundary between "Is this a fit?" and "What does this family need?"</p>

                    <div class="info-box" style="background-color: #fff3cd; border-left: 4px solid #D4AA4C;">
                        <h4>🎯 Key Learning: The Two-Phase Contact Model</h4>
                        <p><strong>Phase 1: Initial Inquiry Call</strong> (Free, 15-30 min) → Mutual exploration: "Is intervention appropriate?"</p>
                        <p><strong>Phase 2: Formal Assessment</strong> (Paid, 60-90 min) → Professional evaluation: "What mode and approach?"</p>
                        <p class="small"><strong>Why this matters:</strong> Charging for assessment protects both you and the family from pressure to pursue intervention inappropriately.</p>
                    </div>

                    <h4>Part 1: Why Two Phases? (10 minutes)</h4>

                    <div class="form-group">
                        <label>The ethical trap many interventionists fall into:</label>
                        <p class="small">❌ Give away too much expertise for free (leading to resentment)</p>
                        <p class="small">❌ Sell intervention to everyone (because income depends on it)</p>
                        <p class="small">✅ Solution: Charge for assessment, stay objective about recommendations</p>
                        <textarea id="ethical-trap-notes" rows="2" placeholder="Why charging for assessment is ethical..."></textarea>
                    </div>

                    <div class="info-box">
                        <h5>The Core Ethical Principle</h5>
                        <p><strong>"You charge for the assessment SO THAT you don't have to sell them an intervention they don't need."</strong></p>
                        <p class="small">When your income comes from assessment (not intervention), you're free to say:</p>
                        <ul class="small">
                            <li>"You don't need intervention yet—here's what I recommend instead"</li>
                            <li>"You need family coaching, not intervention"</li>
                            <li>"This situation is beyond my scope—here's a referral"</li>
                        </ul>
                    </div>

                    <h4>Part 2: The Initial Inquiry Call (15 minutes)</h4>

                    <div class="info-box">
                        <h5>Inquiry Call Structure (15-30 minutes, FREE)</h5>
                        <p class="small"><strong>Three Questions to Answer:</strong></p>
                        <ol class="small">
                            <li><strong>Is there a legitimate problem?</strong> (substance use/behavioral issue that might warrant intervention)</li>
                            <li><strong>Is this family a fit for MY services?</strong> (do I have the skills, are there red flags)</li>
                            <li><strong>Is intervention the right approach?</strong> (or should I refer to therapy, coaching, crisis services)</li>
                        </ol>
                    </div>

                    <div class="form-group">
                        <label>📋 Inquiry Call Script Practice</label>
                        <p class="small"><strong>Opening:</strong> "Thank you for reaching out. This initial call is a free consultation to explore whether I might be able to help. We'll both have a sense of next steps by the end. Sound good?"</p>
                        <textarea id="inquiry-opening-practice" rows="2" placeholder="Practice writing your opening in your own words..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>What to listen for during inquiry call:</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" id="inquiry-who"> Who is the Pivot Person? (age, relationship, living situation)</label>
                            <label><input type="checkbox" id="inquiry-substance"> What substance(s) or behavior?</label>
                            <label><input type="checkbox" id="inquiry-duration"> How long has this been going on?</label>
                            <label><input type="checkbox" id="inquiry-consequences"> What consequences? (health, legal, relational, employment)</label>
                            <label><input type="checkbox" id="inquiry-urgency"> What's the urgency level? (crisis now or mounting concern)</label>
                            <label><input type="checkbox" id="inquiry-previous"> What have they tried before? (treatment, conversations, therapy)</label>
                            <label><input type="checkbox" id="inquiry-family"> Who's in the family system? (supporters, enablers, estranged members)</label>
                            <label><input type="checkbox" id="inquiry-safety"> Any safety concerns? (suicide, violence, children at risk)</label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>🔄 Transition to Paid Assessment</label>
                        <p class="small"><strong>Script:</strong> "Based on what you've shared, intervention might be appropriate, but I'd need to do a full assessment to understand your family's specific situation and recommend the best approach. The assessment is [duration] and the fee is $[amount]. If we determine intervention isn't right, I'll refer you to other resources. If it IS right, we'll create a plan together. Does that make sense?"</p>
                        <textarea id="assessment-transition-practice" rows="2" placeholder="How would you transition to paid assessment in your own words?"></textarea>
                    </div>

                    <h4>Part 3: The Formal Assessment (20 minutes)</h4>

                    <div class="info-box" style="background-color: #f0f9ff; border-left: 4px solid #1d4486;">
                        <h5>Why Charging for Assessment is Ethical (and Essential)</h5>
                        <ol>
                            <li><strong>OBJECTIVITY:</strong> Once paid, your income isn't dependent on them hiring you → you can recommend "Don't hire me" without financial loss</li>
                            <li><strong>PROFESSIONALISM:</strong> Assessment is skilled clinical work (family systems, stages of change, mode selection) → your expertise has value</li>
                            <li><strong>MUTUAL COMMITMENT:</strong> Payment = skin in the game → filters out shoppers, ensures serious engagement</li>
                            <li><strong>THOROUGHNESS:</strong> Paid time = adequate time (60-90 min) → not rushing to "close the sale"</li>
                        </ol>
                    </div>

                    <div class="form-group">
                        <label>My initial discomfort with charging (if any):</label>
                        <textarea id="charging-discomfort" rows="2" placeholder="What feels hard about charging? Where does that come from?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>How charging protects ME:</label>
                        <textarea id="charging-protects-me" rows="2" placeholder="How does charging for assessment prevent burnout and resentment?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>How charging protects FAMILIES:</label>
                        <textarea id="charging-protects-families" rows="2" placeholder="How does charging ensure they get objective recommendations?"></textarea>
                    </div>

                    <div class="info-box">
                        <h5>What to Gather During Formal Assessment (60-90 minutes, PAID)</h5>
                        <p class="small"><strong>Remember:</strong> You're gathering all the information needed to complete the Mode Selector Tool accurately.</p>

                        <p class="small"><strong>I. Opening & Contracting (5 min)</strong></p>
                        <p class="small">Set expectation: "My job is honest assessment, not to sell you intervention"</p>

                        <p class="small"><strong>II. Detailed Family & Substance Use History (20 min)</strong></p>
                        <ul class="small">
                            <li>Pivot Person profile (age, substance, duration, treatment history)</li>
                            <li>Consequences inventory (health, relational, legal, financial)</li>
                            <li>Previous treatment attempts and outcomes</li>
                            <li>Co-occurring mental health issues</li>
                        </ul>

                        <p class="small"><strong>III. Family System Mapping (15 min)</strong></p>
                        <ul class="small">
                            <li>Who's in the network? (concerned persons, enablers, estranged)</li>
                            <li>Relational dynamics (communication patterns, conflict, safety concerns)</li>
                            <li>Who has strongest relationship with Pivot Person?</li>
                        </ul>

                        <p class="small"><strong>IV. Readiness & Stage of Change (10 min)</strong></p>
                        <ul class="small">
                            <li>Pivot Person: Precontemplation? Contemplation? Preparation?</li>
                            <li>Family: Do they understand disease model? Are they enabling?</li>
                        </ul>

                        <p class="small"><strong>V. Safety & Urgency Evaluation (10 min)</strong></p>
                        <ul class="small">
                            <li>Score 0-10: Suicide risk, overdose risk, violence, children at risk, medical crisis, legal crisis</li>
                        </ul>

                        <p class="small"><strong>VI. Mode Selector Application (10 min)</strong></p>
                        <ul class="small">
                            <li>Calculate: Safety/Urgency score + Readiness Level + Relational Capacity score</li>
                            <li>Determine recommended intervention mode using algorithm</li>
                        </ul>

                        <p class="small"><strong>VII. Assessment Summary & Recommendation (15 min)</strong></p>
                        <ul class="small">
                            <li>Share findings transparently</li>
                            <li>Recommend Mode (or refer elsewhere) with clear rationale</li>
                            <li>Invite questions and decision</li>
                        </ul>
                    </div>

                    <div class="form-group">
                        <label>Assessment structure I'll use (adapted to my style):</label>
                        <textarea id="assessment-structure-notes" rows="3" placeholder="How will I structure my assessments? What order makes sense?"></textarea>
                    </div>

                    <div class="info-box" style="background-color: #fff3cd; border-left: 4px solid #D4AA4C;">
                        <h5>Three Possible Assessment Outcomes</h5>
                        <p><strong>Option A: Intervention IS Appropriate</strong></p>
                        <p class="small">"I believe intervention could be helpful. Based on the Mode Selector, I recommend [Mode X]. Here's what that would look like..."</p>

                        <p><strong>Option B: Intervention is NOT Appropriate Yet</strong></p>
                        <p class="small">"I don't think formal intervention is right now. Here's why: [reasons]. What would be more helpful is [family coaching, therapy, Al-Anon, etc.]"</p>

                        <p><strong>Option C: Referral to Different Provider</strong></p>
                        <p class="small">"Your situation is beyond my scope because [safety, complexity, etc.]. I'm referring you to [colleague who specializes in X]."</p>
                    </div>

                    <h4>Part 4: Practice Exercise (15 minutes)</h4>

                    <div class="info-box">
                        <h5>🎭 Role-Play: Inquiry to Assessment Transition</h5>
                        <p><strong>Scenario:</strong> Family member says: "My son is 32 and has been using heroin for about 5 years. He's been to treatment twice and left both times after a few weeks. We don't know what to do anymore. Can you help us?"</p>

                        <p class="small"><strong>Partner A (Interventionist):</strong></p>
                        <ol class="small">
                            <li>Ask 3-5 clarifying questions (urgency, readiness, relational capacity)</li>
                            <li>After 5 min, transition: "I think a formal assessment would help determine if intervention is appropriate"</li>
                            <li>Explain assessment (what it is, why it's paid, what they'll get)</li>
                            <li>Invite decision: "Does that sound like the next step?"</li>
                        </ol>

                        <p class="small"><strong>Partner B (Family Member):</strong></p>
                        <ul class="small">
                            <li>Respond authentically (scared, desperate, hopeful, uncertain)</li>
                            <li>Ask questions: "How much?" "What if you say we don't need you?" "How long?"</li>
                            <li>Decide: Will you say yes to assessment, or need time to think?</li>
                        </ul>
                    </div>

                    <div class="form-group">
                        <label>✍️ What was challenging about transitioning to paid assessment?</label>
                        <textarea id="transition-challenge" rows="2" placeholder="What felt awkward or difficult..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>What language worked well?</label>
                        <textarea id="transition-language" rows="2" placeholder="Phrases or approaches that felt authentic..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Did I feel "sales-y"? How did I navigate that?</label>
                        <textarea id="transition-salesy" rows="2" placeholder="Reflections on the sales/pressure dynamic..."></textarea>
                    </div>

                    <h4>Session Summary: Key Takeaways</h4>

                    <div class="content-card" style="background-color: #f0f9ff;">
                        <h5>Remember These Three Things:</h5>
                        <ol>
                            <li><strong>Two Different Things:</strong> Inquiry call (free) ≠ Formal assessment (paid)</li>
                            <li><strong>Charge = Objectivity:</strong> You can say "You don't need me" without financial loss</li>
                            <li><strong>Your Job:</strong> Make informed, ethical recommendations—NOT sell intervention to everyone</li>
                        </ol>
                    </div>

                    <div class="form-group">
                        <label>🎯 My commitment going forward:</label>
                        <textarea id="assessment-commitment" rows="3" placeholder="How will I implement the two-phase model in my practice?"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Questions I still have about assessment:</label>
                        <textarea id="assessment-questions" rows="2" placeholder="What do I need clarification on?"></textarea>
                    </div>
                </div>
            </div>

            <div class="info-box" style="background-color: #e8f4f8; border-left: 4px solid #1d4486;">
                <p><strong>☕ BREAK (3:15-3:30 PM - 15 minutes)</strong></p>
                <p class="small">Stretch, refresh, process what you learned about ethical assessment</p>
            </div>

            <!-- Session 4: Tools of Intervention -->
            <div id="day2-session4" class="subsection">
                <div class="content-card">
                    <h3>Session 2.4: Core Intervention Tools Deep Dive (3:30-5:00 PM)</h3>
                    <p><strong>Focus:</strong> Master 5 essential intervention tools with hands-on practice</p>
                    <p class="instruction">Today you'll practice the 5 most essential tools. Other tools will be introduced during mentorship.</p>

                    <div class="info-box">
                        <h5>Tool 1: Impact Letters (18 minutes)</h5>
                        <p class="small">Written statements from family describing impact of substance use</p>

                        <div class="form-group">
                            <label>6-Step Structure:</label>
                            <p class="small">1. Love statement | 2. Specific observations | 3. Impact on me | 4. Concern for them | 5. Hope for future | 6. Request</p>
                            <textarea id="impact-letter-structure" rows="2" placeholder="Notes on Impact Letter structure..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>✍️ PRACTICE: Write an opening line + first observation for an Impact Letter</label>
                            <p class="small">Example: "I'm writing this because I love you. Last Tuesday, I found empty bottles hidden in the garage..."</p>
                            <textarea id="impact-letter-practice" rows="3" placeholder="Your opening line and first observation..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>Pair Share Debrief: What felt natural? What was challenging?</label>
                            <textarea id="impact-letter-debrief" rows="2" placeholder="Reflections from pair discussion..."></textarea>
                        </div>
                    </div>

                    <div class="info-box">
                        <h5>Tool 2: Safety Planning (18 minutes)</h5>
                        <p class="small">Creating comprehensive safety plans for Pivot Person and family</p>

                        <div class="form-group">
                            <label>Safety Assessment Checklist:</label>
                            <p class="small">Medical risks | Suicide risk | Violence potential | Overdose risk | Withdrawal dangers</p>
                            <textarea id="safety-assessment-notes" rows="2" placeholder="Key safety factors to assess..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>✍️ PRACTICE: Create a safety plan for Martinez family case</label>
                            <p class="small">Consider: What immediate safety concerns exist? What protocols should be in place?</p>
                            <textarea id="safety-plan-practice" rows="3" placeholder="Safety plan elements for Martinez family..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>Group Debrief: What did you prioritize and why?</label>
                            <textarea id="safety-plan-debrief" rows="2" placeholder="Key priorities from group discussion..."></textarea>
                        </div>
                    </div>

                    <div class="info-box" style="background-color: #fff3cd; border-left: 4px solid #D4AA4C;">
                        <p><strong>⏸️ MICRO-BREAK (5 minutes - ~4:15 PM)</strong></p>
                        <p class="small">Stand, stretch. Share with someone nearby: "Which tool resonates most with your experience?"</p>
                    </div>

                    <div class="info-box">
                        <h5>Tool 3: Motivational Interviewing (18 minutes)</h5>
                        <p class="small">Conversation skills that increase intrinsic motivation for change</p>

                        <div class="form-group">
                            <label>OARS Framework:</label>
                            <p class="small">Open questions | Affirmations | Reflections | Summaries</p>
                            <textarea id="mi-oars-notes" rows="2" placeholder="Notes on OARS framework..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>✍️ PRACTICE: Paired MI practice (8 minutes)</label>
                            <p class="small">Partner A: Play resistant family member. Partner B: Use OARS to explore ambivalence. Switch roles.</p>
                            <textarea id="mi-practice" rows="3" placeholder="What worked? What was difficult?"></textarea>
                        </div>

                        <div class="form-group">
                            <label>Debrief: What felt challenging about MI?</label>
                            <textarea id="mi-debrief" rows="2" placeholder="Insights from MI practice..."></textarea>
                        </div>
                    </div>

                    <div class="info-box">
                        <h5>Tool 4: Family Meeting Facilitation (18 minutes)</h5>
                        <p class="small">Facilitated family conversations to address concerns and coordinate care</p>

                        <div class="form-group">
                            <label>Meeting Structure:</label>
                            <p class="small">Opening (safety, ground rules) | Managing conflict | Keeping focus | Closing with action steps</p>
                            <textarea id="family-meeting-structure" rows="2" placeholder="Notes on meeting structure..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>✍️ PRACTICE: Role-play opening a family meeting (8 minutes)</label>
                            <p class="small">Groups of 3: Facilitator, 2 family members. Practice establishing safety and ground rules.</p>
                            <textarea id="family-meeting-practice" rows="3" placeholder="How did you establish safety? What worked?"></textarea>
                        </div>

                        <div class="form-group">
                            <label>Debrief: What creates safety in family meetings?</label>
                            <textarea id="family-meeting-debrief" rows="2" placeholder="Key insights on creating safety..."></textarea>
                        </div>
                    </div>

                    <div class="info-box">
                        <h5>Tool 5: Treatment Options Research (18 minutes)</h5>
                        <p class="small">Research and present appropriate treatment levels and facilities</p>

                        <div class="form-group">
                            <label>Levels of Care:</label>
                            <p class="small">Detox | Residential | PHP (Partial Hospitalization) | IOP (Intensive Outpatient) | Outpatient | Sober Living</p>
                            <textarea id="treatment-levels-notes" rows="2" placeholder="Notes on levels of care..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>✍️ PRACTICE: Research treatment options for hypothetical client (8 minutes)</label>
                            <p class="small">Scenario: 28-year-old, opioid use disorder, willing to go to treatment, family support, insurance coverage. What would you recommend?</p>
                            <textarea id="treatment-research-practice" rows="3" placeholder="Treatment recommendations and rationale..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>Debrief: How to present options to families?</label>
                            <textarea id="treatment-presentation-debrief" rows="2" placeholder="Best practices for presenting treatment options..."></textarea>
                        </div>
                    </div>

                    <div class="content-card">
                        <h4>My Toolkit Summary</h4>
                        <p class="instruction">Reflecting on today's 5 essential tools:</p>

                        <div class="info-box">
                            <p class="small"><strong>Note:</strong> 8 additional tools are available in the Resources section. You'll practice these during the 40-week mentorship program:</p>
                            <p class="small">• Planning Meetings • Intervention Rehearsals • Aftercare Support • Core Values Recovery Model • Recovery Meetings (12-step, etc) • Accountability Monitoring (breathalyzer, drug testing) • Emergency Response • One-on-One Support</p>
                        </div>

                        <div class="form-group">
                            <label>Which tool do I feel most confident about?</label>
                            <textarea id="toolkit-confident" rows="2" placeholder="Tool that feels natural or resonates with my experience..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>Which tool do I most need to practice?</label>
                            <textarea id="toolkit-practice" rows="2" placeholder="Tool that feels challenging or I want to develop..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>How will I use these 5 tools in my first intervention?</label>
                            <textarea id="toolkit-application" rows="3" placeholder="Practical application plan..."></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Session 5: Family Case Study Setup -->
            <div id="day2-session5" class="subsection">
                <div class="content-card">
                    <h3>Session 2.5: Case Study Application (5:00-5:30 PM)</h3>
                    <p><strong>Focus:</strong> Brief case study introduction and Day 3 role assignment</p>

                    <h4>Case Study Overview</h4>
                    <p class="instruction">You'll work with this fictional family case through Day 3 role-plays:</p>

                    <div class="info-box">
                        <h5>The Martinez Family</h5>
                        <p><strong>Pivot Person:</strong> Sarah Martinez, 28, opioid use disorder</p>
                        <p><strong>Family Members:</strong> Mother (Maria), Father (Carlos), Sister (Ana), Husband (David), 2 young children</p>
                        <p><strong>Situation:</strong> Recent overdose, family in crisis, Sarah refusing treatment</p>
                        <p><strong>Intervention Mode:</strong> Structured (Sarah is ambivalent, family needs coordination)</p>
                    </div>

                    <h4>Case Study Analysis</h4>

                    <div class="form-group">
                        <label>Family system dynamics I observe:</label>
                        <textarea id="case-dynamics" rows="3" placeholder="Who plays what role in the family..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Key intervention challenges I anticipate:</label>
                        <textarea id="case-challenges" rows="3" placeholder="What might make this intervention difficult..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Questions I'd ask to understand the family better:</label>
                        <textarea id="case-questions" rows="3" placeholder="What information do I need..."></textarea>
                    </div>

                    <h4>Role Assignment (for tomorrow's simulation)</h4>

                    <div class="form-group">
                        <label>Role I'll play tomorrow:</label>
                        <input type="text" id="roleplay-role" placeholder="e.g., Interventionist, Mother, Sister...">
                    </div>

                    <div class="form-group">
                        <label>Preparation notes for my role:</label>
                        <textarea id="roleplay-prep" rows="4" placeholder="Character background, concerns, questions..."></textarea>
                    </div>

                    <h4>Pre-Work for Tomorrow</h4>

                    <div class="form-group">
                        <label>What I need to review tonight:</label>
                        <textarea id="homework-review" rows="2" placeholder="Intervention modes, language tools, family systems..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Questions I'll bring to Day 3:</label>
                        <textarea id="homework-questions" rows="2" placeholder="Clarifications or concerns..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Session 6: Day 2 Reflection & Closing -->
            <div id="day2-session6" class="subsection">
                <div class="content-card">
                    <h3>Session 2.6: Day 2 Closing (5:30-5:45 PM)</h3>
                    <p><strong>Focus:</strong> Quick reflection and homework prep for Day 3</p>

                    <h4>Today's Key Insights</h4>

                    <div class="form-group">
                        <label>Most important thing I learned about intervention modes:</label>
                        <textarea id="day2-modes-insight" rows="3" placeholder="Which mode resonated most and why..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Biggest "aha moment" about roles and boundaries:</label>
                        <textarea id="day2-boundaries-insight" rows="3" placeholder="What clarified my understanding..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Tool I'm most excited to use in intervention work:</label>
                        <textarea id="day2-tool-insight" rows="2" placeholder="Impact Letters, scripts, logistics planning..."></textarea>
                    </div>

                    <h4>Preparing for Day 3 Role-Plays</h4>

                    <div class="form-group">
                        <label>My confidence level for tomorrow (1-10) and why:</label>
                        <textarea id="day2-confidence" rows="2" placeholder="What am I confident about? What am I nervous about..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Questions I still have before tomorrow:</label>
                        <textarea id="day2-questions" rows="3" placeholder="Clarifications I need about the case study or intervention process..."></textarea>
                    </div>

                    <h4>Personal Reflection</h4>

                    <div class="form-group">
                        <label>How today challenged me:</label>
                        <textarea id="day2-challenge" rows="3" placeholder="What was difficult or uncomfortable..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>One thing I'll practice tonight:</label>
                        <textarea id="day2-practice" rows="2" placeholder="Specific skill or language I want to rehearse..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>My intention for Day 3:</label>
                        <textarea id="day2-intention" rows="2" placeholder="How I want to show up tomorrow..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Day 2 Reflection -->
            <div id="day2-reflection" class="subsection">
                <div class="content-card">
                    <h3>Day 2: Coordination - Final Reflection</h3>
                    <p class="instruction">Integrating today's learning about intervention structures and coordination</p>

                    <div class="form-group">
                        <label>The intervention mode that resonates most with me and why:</label>
                        <textarea id="day2-mode-resonance" rows="3" placeholder="Collaborative, Structured, Planned, Crisis, or Individual..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Most challenging aspect of understanding roles and boundaries:</label>
                        <textarea id="day2-challenging" rows="3" placeholder="What was difficult or confusing..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Most clarifying "aha" moment about intervention work:</label>
                        <textarea id="day2-clarifying" rows="3" placeholder="What suddenly made sense..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>One tool or skill I'm committed to practicing:</label>
                        <textarea id="day2-skill-practice" rows="3" placeholder="Impact Letters, scripts, assessment skills..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>How I'm feeling about tomorrow's role-plays:</label>
                        <textarea id="day2-tomorrow" rows="3" placeholder="Nervous? Excited? Prepared? What do I need..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>My biggest learning from Day 2:</label>
                        <textarea id="day2-biggest-learning" rows="3" placeholder="What will I carry forward from today..."></textarea>
                    </div>
                </div>
            </div>
        </section>

`;
