/**
 * Coaching Workbooks Front-End
 * Authenticated autosave + engagement tracking powered by the Express/SQLite backend.
 */

const MODULE_ID = window.CORE_VALUES_CONFIG?.moduleId || 'coaching101';
const SAVE_DEBOUNCE_MS = 1500;

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

let CURRENT_USER = null;
let isInitialized = false;
let saveTimeoutId = null;
let pendingSave = false;
let saveInFlight = false;
let lastSavedSnapshot = null;
let lastSavedProgress = null;

let saveStatusElement = null;
let userNameElement = null;
let logoutButtonElement = null;
let adminLinkElement = null;

let authOverlayElement = null;
let authErrorElement = null;
let authFormElement = null;
let authHeadingElement = null;
let authDescriptionElement = null;
let authSubmitButton = null;
let authModeToggle = null;
let authMode = 'login';
let authResolve = null;

const PRESENCE_DEBOUNCE_MS = 5000;
const PRESENCE_HEARTBEAT_MS = 45000;
let presenceTimeoutId = null;
let presenceInFlight = false;
let queuedPresencePayload = null;
let presenceHeartbeatId = null;

let socket = null;
let positionBannerElement = null;
let questionFormElement = null;

document.addEventListener('DOMContentLoaded', () => {
    initApp().catch(error => {
        console.error('Failed to initialize workbook:', error);
        alert('Unable to start the workbook. Please refresh or contact support.');
    });
});

async function initApp() {
    if (!window.ApiClient) {
        throw new Error('ApiClient is not loaded. Ensure apiClient.js is included before app.js.');
    }

    console.log(`Initializing module: ${MODULE_ID}`);

    createUserStatusUI();
    createAuthOverlay();

    await ensureAuthenticated();
    await loadSavedData();

    initializeNavigation();
    initializeValuesCards();
    restoreNavigationState();
    initializeFormAutosave();

    updateProgress(true, { skipSave: true });

    isInitialized = true;
    setSaveStatus('All changes saved');
    schedulePresenceUpdate({ immediate: true });
    startPresenceHeartbeat();

    await recordEngagement('module_opened', { moduleId: MODULE_ID });

    createPositionBanner();
    createQuestionForm();
    initializeSocket();
    loadCurrentPosition();

    console.log('Workbook ready for use ✅');
}

// ========================================
// Authentication UX
// ========================================

async function ensureAuthenticated() {
    try {
        const response = await ApiClient.me();
        if (response?.user) {
            setCurrentUser(response.user);
            hideAuthOverlay();
            return response.user;
        }
    } catch (error) {
        if (error.status !== 401) {
            console.error('Error checking current session:', error);
        }
    }

    return promptForAuthentication();
}

function promptForAuthentication(message) {
    showAuthOverlay(message);
    return new Promise(resolve => {
        authResolve = resolve;
    });
}

function createAuthOverlay() {
    if (authOverlayElement) return;

    authOverlayElement = document.createElement('div');
    authOverlayElement.className = 'auth-overlay hidden';
    authOverlayElement.innerHTML = `
        <div class="auth-modal">
            <h2 id="authHeading">Sign in to continue</h2>
            <p id="authDescription">Access your Core Values Recovery workbook, keep progress synced across devices, and stay connected to your cohort.</p>
            <div class="auth-tabs">
                <button type="button" class="auth-tab active" data-mode="login">Log In</button>
                <button type="button" class="auth-tab" data-mode="register">Create Account</button>
            </div>
            <div id="authError" class="auth-error hidden"></div>
            <form id="authForm" class="auth-form">
                <div class="auth-field" data-field="name">
                    <label for="authName">Full Name</label>
                    <input id="authName" name="name" type="text" autocomplete="name" placeholder="e.g., Jordan Smith">
                </div>
                <div class="auth-field" data-field="email">
                    <label for="authEmail">Email</label>
                    <input id="authEmail" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
                </div>
                <div class="auth-field" data-field="password">
                    <label for="authPassword">Password</label>
                    <input id="authPassword" name="password" type="password" autocomplete="current-password" placeholder="Enter password" required>
                </div>
                <button id="authSubmit" type="submit">Log In</button>
            </form>
            <div class="auth-footer">
                <span data-mode="login">Need an account? <button type="button" data-action="toggle">Create one</button></span>
                <span class="hidden" data-mode="register">Already have an account? <button type="button" data-action="toggle">Log in</button></span>
            </div>
        </div>
    `;

    document.body.appendChild(authOverlayElement);

    authErrorElement = authOverlayElement.querySelector('#authError');
    authFormElement = authOverlayElement.querySelector('#authForm');
    authHeadingElement = authOverlayElement.querySelector('#authHeading');
    authDescriptionElement = authOverlayElement.querySelector('#authDescription');
    authSubmitButton = authOverlayElement.querySelector('#authSubmit');
    authModeToggle = authOverlayElement.querySelectorAll('.auth-footer button[data-action="toggle"]');

    const tabButtons = authOverlayElement.querySelectorAll('.auth-tab');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => setAuthMode(button.dataset.mode));
    });

    authModeToggle.forEach(button => {
        button.addEventListener('click', () => setAuthMode(authMode === 'login' ? 'register' : 'login'));
    });

    authFormElement.addEventListener('submit', handleAuthSubmit);

    setAuthMode('login');
}

function setAuthMode(mode) {
    authMode = mode === 'register' ? 'register' : 'login';

    const isRegister = authMode === 'register';
    authOverlayElement.querySelectorAll('.auth-tab').forEach(button => {
        button.classList.toggle('active', button.dataset.mode === authMode);
    });

    const nameField = authOverlayElement.querySelector('[data-field="name"]');
    if (nameField) {
        nameField.classList.toggle('hidden', !isRegister);
        const nameInput = nameField.querySelector('input');
        if (nameInput) {
            nameInput.required = isRegister;
        }
    }

    authHeadingElement.textContent = isRegister
        ? 'Create your account'
        : 'Sign in to continue';

    authDescriptionElement.textContent = isRegister
        ? 'Join the Core Values Recovery learning portal. Your first account becomes an admin; invite teammates anytime.'
        : 'Access your Core Values Recovery workbook, keep progress synced across devices, and stay connected to your cohort.';

    authSubmitButton.textContent = isRegister ? 'Create Account' : 'Log In';
    authFormElement.reset();
    hideAuthError();

    authOverlayElement.querySelectorAll('.auth-footer span').forEach(span => {
        span.classList.toggle('hidden', span.dataset.mode !== authMode);
    });
}

async function handleAuthSubmit(event) {
    event.preventDefault();

    hideAuthError();
    authSubmitButton.disabled = true;
    authSubmitButton.textContent = authMode === 'register' ? 'Creating account…' : 'Signing in…';

    const formData = new FormData(authFormElement);
    const payload = {
        email: formData.get('email')?.trim(),
        password: formData.get('password')
    };

    if (authMode === 'register') {
        payload.name = formData.get('name')?.trim();
    }

    try {
        if (authMode === 'register') {
            await ApiClient.register(payload);
        } else {
            await ApiClient.login(payload);
        }

        const response = await ApiClient.me();
        if (response?.user) {
            setCurrentUser(response.user);
            hideAuthOverlay();
            if (typeof authResolve === 'function') {
                authResolve(response.user);
                authResolve = null;
            }
            await recordEngagement(authMode === 'register' ? 'account_created' : 'login', {
                moduleId: MODULE_ID
            });
        } else {
            throw new Error('Unable to load user profile after authentication');
        }
    } catch (error) {
        if (error.status === 401) {
            showAuthError('Invalid email or password. Please try again.');
        } else if (error.status === 409) {
            showAuthError('An account with that email already exists. Try signing in instead.');
        } else {
            console.error('Authentication error:', error);
            showAuthError(error.message || 'Something went wrong. Please try again.');
        }
    } finally {
        authSubmitButton.disabled = false;
        authSubmitButton.textContent = authMode === 'register' ? 'Create Account' : 'Log In';
    }
}

function showAuthOverlay(message) {
    if (!authOverlayElement) return;

    if (message) {
        showAuthError(message);
    } else {
        hideAuthError();
    }

    authOverlayElement.classList.remove('hidden');
    const firstInputSelector = authMode === 'register' ? '#authName' : '#authEmail';
    const firstInput = authOverlayElement.querySelector(firstInputSelector);
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 50);
    }
}

function hideAuthOverlay() {
    if (authOverlayElement) {
        authOverlayElement.classList.add('hidden');
    }
}

function showAuthError(message) {
    if (!authErrorElement) return;
    authErrorElement.textContent = message;
    authErrorElement.classList.remove('hidden');
}

function hideAuthError() {
    if (!authErrorElement) return;
    authErrorElement.textContent = '';
    authErrorElement.classList.add('hidden');
}

async function handleSessionExpired() {
    setSaveStatus('Session expired. Please sign in again.');
    await recordEngagement('session_expired', { moduleId: MODULE_ID });

    const user = await promptForAuthentication('Your session expired. Sign in again to keep your work saved.');
    setCurrentUser(user);
    scheduleSave({ immediate: true });
}

function setCurrentUser(user) {
    CURRENT_USER = user;
    if (userNameElement) {
        userNameElement.textContent = user?.name || user?.email || 'Signed in';
    }
    if (adminLinkElement) {
        if (user && user.role === 'admin') {
            adminLinkElement.classList.remove('hidden');
        } else {
            adminLinkElement.classList.add('hidden');
        }
    }
    if (logoutButtonElement) {
        logoutButtonElement.disabled = !user;
    }
    if (user && isInitialized) {
        schedulePresenceUpdate({ immediate: true });
        startPresenceHeartbeat();
    }
    if (!user) {
        stopPresenceHeartbeat();
        clearPresenceQueue();
    }
}

function createUserStatusUI() {
    const header = document.querySelector('.app-header');
    if (!header) return;

    let status = header.querySelector('.user-status');
    if (!status) {
        status = document.createElement('div');
        status.className = 'user-status';

        const saveStatus = document.createElement('span');
        saveStatus.className = 'save-status';
        saveStatus.textContent = 'Connecting…';

        const userName = document.createElement('span');
        userName.className = 'user-name';
        userName.textContent = '';

        const adminLink = document.createElement('a');
        adminLink.className = 'user-admin-link hidden';
        adminLink.href = '/admin/';
        adminLink.target = '_blank';
        adminLink.rel = 'noopener noreferrer';
        adminLink.textContent = 'Dashboard';

        const logoutButton = document.createElement('button');
        logoutButton.type = 'button';
        logoutButton.textContent = 'Log out';

        logoutButton.addEventListener('click', async () => {
            logoutButton.disabled = true;
            logoutButton.textContent = 'Logging out…';
            try {
                await ApiClient.logout();
                setCurrentUser(null);
                await recordEngagement('logout', { moduleId: MODULE_ID });
                await promptForAuthentication();
            } catch (error) {
                console.error('Error logging out:', error);
                alert('Unable to log out. Please refresh the page.');
            } finally {
                logoutButton.textContent = 'Log out';
                logoutButton.disabled = false;
            }
        });

        status.appendChild(saveStatus);
        status.appendChild(userName);
        status.appendChild(adminLink);
        status.appendChild(logoutButton);
        header.appendChild(status);

        saveStatusElement = saveStatus;
        userNameElement = userName;
        adminLinkElement = adminLink;
        logoutButtonElement = logoutButton;
    } else {
        saveStatusElement = status.querySelector('.save-status');
        userNameElement = status.querySelector('.user-name');
        adminLinkElement = status.querySelector('.user-admin-link');
        logoutButtonElement = status.querySelector('button');
    }
}

function setSaveStatus(status) {
    if (!saveStatusElement) return;
    saveStatusElement.textContent = status;
}

// ========================================
// Session Presence Tracking
// ========================================

function startPresenceHeartbeat() {
    if (!isInitialized || !CURRENT_USER) return;
    if (presenceHeartbeatId) return;
    presenceHeartbeatId = setInterval(() => {
        schedulePresenceUpdate({ immediate: true });
    }, PRESENCE_HEARTBEAT_MS);
}

function stopPresenceHeartbeat() {
    if (presenceHeartbeatId) {
        clearInterval(presenceHeartbeatId);
        presenceHeartbeatId = null;
    }
}

function clearPresenceQueue() {
    if (presenceTimeoutId) {
        clearTimeout(presenceTimeoutId);
        presenceTimeoutId = null;
    }
    queuedPresencePayload = null;
}

function schedulePresenceUpdate(options = {}) {
    if (!isInitialized || !CURRENT_USER) return;

    const payload = buildPresencePayload();
    if (!payload) return;

    queuedPresencePayload = payload;

    if (options.immediate) {
        if (presenceTimeoutId) {
            clearTimeout(presenceTimeoutId);
            presenceTimeoutId = null;
        }
        sendPresenceUpdate();
        return;
    }

    if (presenceTimeoutId) {
        clearTimeout(presenceTimeoutId);
    }

    const delay = Number.isFinite(options.delay) ? options.delay : PRESENCE_DEBOUNCE_MS;
    presenceTimeoutId = setTimeout(() => {
        presenceTimeoutId = null;
        sendPresenceUpdate();
    }, delay);
}

async function sendPresenceUpdate() {
    if (presenceInFlight || !queuedPresencePayload || !CURRENT_USER) return;

    const payload = queuedPresencePayload;
    queuedPresencePayload = null;
    presenceInFlight = true;

    try {
        await ApiClient.updatePresence(MODULE_ID, payload);
    } catch (error) {
        if (error.status === 401) {
            await handleSessionExpired();
        } else {
            console.warn('Error updating presence:', error);
            if (!queuedPresencePayload) {
                queuedPresencePayload = payload;
            }
        }
    } finally {
        presenceInFlight = false;

        if (queuedPresencePayload) {
            if (presenceTimeoutId) {
                // A timer is already scheduled.
                return;
            }
            sendPresenceUpdate();
        }
    }
}

function buildPresencePayload() {
    const sectionId = APP_STATE.currentSection || 'welcome';
    const subsectionId = APP_STATE.currentSubsection || null;

    return {
        sectionId,
        sectionLabel: getSectionLabel(sectionId),
        subsectionId,
        subsectionLabel: subsectionId ? getSubsectionLabel(subsectionId) : null,
        progress: APP_STATE.progress
    };
}

function getSectionLabel(sectionId) {
    if (!sectionId) return null;

    const navBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if (navBtn && navBtn.textContent) {
        return navBtn.textContent.trim();
    }

    const section = document.getElementById(sectionId);
    if (section) {
        const header = section.querySelector('.section-header h2') || section.querySelector('h2');
        if (header && header.textContent) {
            return header.textContent.trim();
        }
    }

    return null;
}

function getSubsectionLabel(subsectionId) {
    if (!subsectionId) return null;

    const btn = document.querySelector(`.sub-nav-btn[data-subsection="${subsectionId}"]`);
    if (btn && btn.textContent) {
        return btn.textContent.trim();
    }

    const subsection = document.getElementById(subsectionId);
    if (subsection) {
        const heading = subsection.querySelector('h3') || subsection.querySelector('h2');
        if (heading && heading.textContent) {
            return heading.textContent.trim();
        }
    }

    return null;
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        schedulePresenceUpdate({ immediate: true });
    }
});

// ========================================
// Navigation
// ========================================

function initializeNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    const subNavBtns = document.querySelectorAll('.sub-nav-btn');
    subNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const subsection = btn.getAttribute('data-subsection');
            navigateToSubsection(subsection);
        });
    });
}

function navigateToSection(sectionId, options = {}) {
    if (!sectionId) return;
    const { silent = false, skipScroll = false } = options;

    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-section') === sectionId;
        btn.classList.toggle('active', isActive);
    });

    APP_STATE.currentSection = sectionId;

    if (!skipScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (!silent && isInitialized) {
        scheduleSave();
        schedulePresenceUpdate({ immediate: true });
        recordEngagement('navigate_section', { moduleId: MODULE_ID, sectionId }).catch(() => {});
    }

    if (sectionId.startsWith('day')) {
        const firstSubsection = document.querySelector(`#${sectionId} .subsection`);
        if (firstSubsection) {
            navigateToSubsection(firstSubsection.id, { silent: true, skipScroll: true });
        }
    }
}

function navigateToSubsection(subsectionId, options = {}) {
    if (!subsectionId) return;
    const { silent = false, skipScroll = false } = options;

    const subsection = document.getElementById(subsectionId);
    if (!subsection) return;

    const parentSection = subsection.closest('.section');
    if (!parentSection) return;

    parentSection.querySelectorAll('.subsection').forEach(el => {
        el.classList.remove('active');
    });

    subsection.classList.add('active');

    parentSection.querySelectorAll('.sub-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-subsection') === subsectionId);
    });

    APP_STATE.currentSubsection = subsectionId;

    if (!skipScroll) {
        subsection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (!silent && isInitialized) {
        scheduleSave();
        schedulePresenceUpdate({ immediate: true });
        recordEngagement('navigate_subsection', { moduleId: MODULE_ID, subsectionId }).catch(() => {});
    }
}

function restoreNavigationState() {
    if (APP_STATE.currentSection) {
        navigateToSection(APP_STATE.currentSection, { silent: true, skipScroll: true });
    } else {
        navigateToSection('welcome', { silent: true, skipScroll: true });
    }

    if (APP_STATE.currentSubsection) {
        navigateToSubsection(APP_STATE.currentSubsection, { silent: true, skipScroll: true });
    }
}

// ========================================
// Values Cards
// ========================================

function initializeValuesCards() {
    const valuesCardsContainer = document.getElementById('valuesCards');
    if (!valuesCardsContainer) return;

    valuesCardsContainer.innerHTML = '';

    APP_STATE.valuesCards.forEach(value => {
        const card = document.createElement('div');
        card.className = 'value-card';
        card.setAttribute('data-value', value);

        const imageContainer = document.createElement('div');
        imageContainer.className = 'value-card-image';

        const img = document.createElement('img');
        const filename = value.toLowerCase().replace(/\s+/g, '-');
        img.src = `images/values/${filename}.png`;
        img.alt = value;
        img.onerror = function() {
            this.style.display = 'none';
        };

        imageContainer.appendChild(img);
        card.appendChild(imageContainer);

        const text = document.createElement('div');
        text.className = 'value-card-text';
        text.textContent = value;
        card.appendChild(text);

        card.addEventListener('click', () => selectValueCard(card));

        valuesCardsContainer.appendChild(card);
    });

    const savedValue = APP_STATE.formData['selected-value'];
    if (savedValue) {
        const savedCard = valuesCardsContainer.querySelector(`[data-value="${savedValue}"]`);
        if (savedCard) {
            selectValueCard(savedCard, { silent: true });
        }
    }
}

function selectValueCard(cardElement, options = {}) {
    if (!cardElement) return;
    const { silent = false } = options;

    document.querySelectorAll('.value-card').forEach(card => {
        card.classList.remove('selected');
    });

    cardElement.classList.add('selected');

    const value = cardElement.getAttribute('data-value');
    const selectedValueInput = document.getElementById('selected-value');
    if (selectedValueInput) {
        selectedValueInput.value = value;
    }

    const selectedValueForm = document.getElementById('selectedValueForm');
    if (selectedValueForm) {
        selectedValueForm.classList.remove('hidden');
    }

    APP_STATE.formData['selected-value'] = value;

    if (!silent && isInitialized) {
        scheduleSave();
        schedulePresenceUpdate({ immediate: true });
        recordEngagement('select_value_card', { moduleId: MODULE_ID, value }).catch(() => {});
    }
}

// ========================================
// Form Autosave
// ========================================

function initializeFormAutosave() {
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            saveFormField(input.id, input.value);
            updateProgress();
        });

        input.addEventListener('blur', () => {
            saveFormField(input.id, input.value);
            updateProgress();
        });
    });

    console.log(`Autosave ready on ${inputs.length} fields`);
}

function saveFormField(fieldId, value) {
    if (!fieldId) return;
    APP_STATE.formData[fieldId] = value;
    scheduleSave();
}

// ========================================
// Persistence + Engagement
// ========================================

function getPersistedState() {
    return {
        currentSection: APP_STATE.currentSection,
        currentSubsection: APP_STATE.currentSubsection,
        formData: { ...APP_STATE.formData }
    };
}

function scheduleSave(options = {}) {
    if (!isInitialized) return;

    pendingSave = true;

    if (options.immediate) {
        commitSave();
        return;
    }

    if (saveTimeoutId) {
        clearTimeout(saveTimeoutId);
    }

    saveTimeoutId = setTimeout(() => {
        commitSave();
    }, SAVE_DEBOUNCE_MS);
}

async function commitSave() {
    if (!pendingSave || saveInFlight) return;
    if (!CURRENT_USER) return;

    if (saveTimeoutId) {
        clearTimeout(saveTimeoutId);
        saveTimeoutId = null;
    }

    const statePayload = getPersistedState();
    const snapshot = JSON.stringify(statePayload);
    const progress = APP_STATE.progress;

    if (snapshot === lastSavedSnapshot && progress === lastSavedProgress) {
        pendingSave = false;
        setSaveStatus('All changes saved');
        return;
    }

    saveInFlight = true;
    pendingSave = false;
    setSaveStatus('Saving…');

    try {
        await ApiClient.saveProgress(MODULE_ID, {
            state: statePayload,
            progress
        });
        lastSavedSnapshot = snapshot;
        lastSavedProgress = progress;
        setSaveStatus('Saved just now');
    } catch (error) {
        pendingSave = true;
        if (error.status === 401) {
            await handleSessionExpired();
        } else {
            console.error('Error saving progress:', error);
            setSaveStatus('Save failed — retrying…');
            setTimeout(() => scheduleSave({ immediate: true }), 3000);
        }
    } finally {
        saveInFlight = false;
    }
}

async function loadSavedData() {
    try {
        const response = await ApiClient.fetchProgress(MODULE_ID);
        if (!response || !response.state) {
            setProgressUI(0);
            return;
        }

        const { state, progress } = response;
        if (state.formData) {
            APP_STATE.formData = { ...state.formData };
            Object.keys(APP_STATE.formData).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = APP_STATE.formData[fieldId];
                }
            });
        }

        APP_STATE.currentSection = state.currentSection || APP_STATE.currentSection;
        APP_STATE.currentSubsection = state.currentSubsection || APP_STATE.currentSubsection;
        APP_STATE.progress = typeof progress === 'number' ? progress : APP_STATE.progress;

        setProgressUI(APP_STATE.progress);

        lastSavedSnapshot = JSON.stringify(getPersistedState());
        lastSavedProgress = APP_STATE.progress;

        console.log('Progress restored from server');
    } catch (error) {
        if (error.status === 401) {
            await handleSessionExpired();
            return loadSavedData();
        }
        console.error('Error loading saved progress:', error);
        setProgressUI(0);
    }
}

async function recordEngagement(eventType, metadata = {}) {
    if (!CURRENT_USER) return;
    try {
        await ApiClient.logEngagement(MODULE_ID, { eventType, metadata });
    } catch (error) {
        if (error.status === 401) {
            await handleSessionExpired();
        } else {
            console.warn('Unable to log engagement event:', error);
        }
    }
}

// ========================================
// Progress Tracking
// ========================================

function setProgressUI(percentage, filled = null, total = null) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    if (progressText) {
        if (filled !== null && total !== null) {
            progressText.textContent = `${percentage}% Complete (${filled} of ${total} fields)`;
        } else {
            progressText.textContent = `${percentage}% Complete`;
        }
    }
}

function updateProgress(force = false, options = {}) {
    const { skipSave = false } = options;
    const allFields = document.querySelectorAll('input[type="text"], textarea');
    let totalFields = 0;
    let filledFields = 0;

    allFields.forEach(field => {
        if (field.readOnly) return;
        totalFields++;
        if (field.value && field.value.trim() !== '') {
            filledFields++;
        }
    });

    const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    const hasChanged = percentage !== APP_STATE.progress;

    if (force || hasChanged) {
        APP_STATE.progress = percentage;
        setProgressUI(percentage, filledFields, totalFields);
        if (!skipSave) {
            scheduleSave();
        }
        schedulePresenceUpdate();
    }
}

setInterval(() => updateProgress(false), 5000);

// ========================================
// Workbook Utilities
// ========================================

function saveWorkbook() {
    scheduleSave({ immediate: true });
    schedulePresenceUpdate({ immediate: true });
    alert('✅ Progress saved to the cloud.');
    recordEngagement('manual_save', { moduleId: MODULE_ID }).catch(() => {});
}

function exportWorkbook() {
    scheduleSave({ immediate: true });

    const data = {
        exportDate: new Date().toISOString(),
        moduleId: MODULE_ID,
        user: CURRENT_USER ? { id: CURRENT_USER.id, email: CURRENT_USER.email } : null,
        formData: APP_STATE.formData
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${MODULE_ID}_workbook_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('📥 Workbook exported. Keep this file safe for your records.');
    recordEngagement('export_workbook', { moduleId: MODULE_ID }).catch(() => {});
}

function printWorkbook() {
    window.print();
    recordEngagement('print_workbook', { moduleId: MODULE_ID }).catch(() => {});
}

function clearAllData() {
    if (!confirm('Clear all workbook data for this module? This cannot be undone.')) {
        return;
    }

    Object.keys(APP_STATE.formData).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = '';
        }
    });

    APP_STATE.formData = {};
    APP_STATE.progress = 0;
    setProgressUI(0, 0, 0);

    scheduleSave({ immediate: true });
    schedulePresenceUpdate({ immediate: true });
    recordEngagement('clear_data', { moduleId: MODULE_ID }).catch(() => {});
}

function importWorkbook() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = event => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.formData || typeof data.formData !== 'object') {
                    throw new Error('Invalid workbook format');
                }

                APP_STATE.formData = { ...data.formData };

                Object.keys(APP_STATE.formData).forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.value = APP_STATE.formData[fieldId];
                    }
                });

                updateProgress(true);
                scheduleSave({ immediate: true });

                alert('✅ Workbook imported. Your progress is synced.');
                recordEngagement('import_workbook', { moduleId: MODULE_ID }).catch(() => {});
            } catch (error) {
                console.error('Import error:', error);
                alert('❌ Unable to import this workbook file.');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// ========================================
// Keyboard Shortcuts & Global bindings
// ========================================

document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        saveWorkbook();
    }
});

window.navigateToSection = navigateToSection;
window.navigateToSubsection = navigateToSubsection;
window.saveWorkbook = saveWorkbook;
window.exportWorkbook = exportWorkbook;
window.printWorkbook = printWorkbook;
window.clearAllData = clearAllData;
window.importWorkbook = importWorkbook;

// ========================================
// Position Banner & Questions
// ========================================

function createPositionBanner() {
    if (positionBannerElement) return;

    positionBannerElement = document.createElement('div');
    positionBannerElement.id = 'positionBanner';
    positionBannerElement.className = 'position-banner hidden';
    positionBannerElement.innerHTML = `
        <div class="banner-content">
            <span class="banner-icon">📍</span>
            <div class="banner-text">
                <strong>Class is currently on:</strong>
                <span id="bannerPositionText">—</span>
            </div>
            <button type="button" id="bannerGoButton" class="banner-go-button">Go There</button>
            <button type="button" id="bannerCloseButton" class="banner-close-button" title="Dismiss">&times;</button>
        </div>
    `;

    document.body.appendChild(positionBannerElement);

    const goButton = document.getElementById('bannerGoButton');
    const closeButton = document.getElementById('bannerCloseButton');

    if (goButton) {
        goButton.addEventListener('click', () => {
            const position = positionBannerElement.dataset.position;
            if (position) {
                try {
                    const pos = JSON.parse(position);
                    if (pos.section_id) {
                        navigateToSection(`day${pos.day}`);
                    }
                } catch (error) {
                    console.error('Error parsing position:', error);
                }
            }
            positionBannerElement.classList.add('hidden');
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            positionBannerElement.classList.add('hidden');
        });
    }
}

function createQuestionForm() {
    if (questionFormElement) return;

    questionFormElement = document.createElement('div');
    questionFormElement.id = 'questionForm';
    questionFormElement.className = 'question-form-container';
    questionFormElement.innerHTML = `
        <button type="button" id="questionToggleButton" class="question-toggle-button" title="Ask a question">?</button>
        <div id="questionFormPanel" class="question-form-panel hidden">
            <div class="question-form-header">
                <h4>Ask a Question</h4>
                <button type="button" id="questionFormCloseButton" class="question-form-close">&times;</button>
            </div>
            <div class="question-form-body">
                <textarea id="questionTextarea" placeholder="Type your question here..." rows="3"></textarea>
                <button type="button" id="questionSubmitButton" class="question-submit-button">Submit Question</button>
                <p id="questionFormStatus" class="question-form-status hidden"></p>
            </div>
        </div>
    `;

    document.body.appendChild(questionFormElement);

    const toggleButton = document.getElementById('questionToggleButton');
    const formPanel = document.getElementById('questionFormPanel');
    const closeButton = document.getElementById('questionFormCloseButton');
    const submitButton = document.getElementById('questionSubmitButton');
    const textarea = document.getElementById('questionTextarea');
    const status = document.getElementById('questionFormStatus');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            formPanel.classList.toggle('hidden');
            if (!formPanel.classList.contains('hidden')) {
                textarea.focus();
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            formPanel.classList.add('hidden');
        });
    }

    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            const questionText = textarea.value.trim();
            if (!questionText) {
                showQuestionStatus('Please enter a question', 'error');
                return;
            }

            submitButton.disabled = true;
            showQuestionStatus('Submitting...', 'info');

            try {
                await ApiClient.submitQuestion({
                    moduleId: MODULE_ID,
                    questionText
                });

                showQuestionStatus('Question submitted!', 'success');
                textarea.value = '';
                setTimeout(() => {
                    formPanel.classList.add('hidden');
                    status.classList.add('hidden');
                }, 2000);
            } catch (error) {
                console.error('Error submitting question:', error);
                showQuestionStatus(error.message || 'Failed to submit question', 'error');
            } finally {
                submitButton.disabled = false;
            }
        });
    }
}

function showQuestionStatus(message, type) {
    const status = document.getElementById('questionFormStatus');
    if (!status) return;

    status.textContent = message;
    status.className = `question-form-status ${type}`;
    status.classList.remove('hidden');
}

function initializeSocket() {
    if (!window.io || socket) return;

    socket = io();

    socket.on('connect', () => {
        console.log('WebSocket connected');
    });

    socket.on('position-update', (data) => {
        console.log('Position update received:', data);
        if (data.moduleId === MODULE_ID && data.position) {
            displayPositionBanner(data.position);
        }
    });

    socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
    });
}

async function loadCurrentPosition() {
    try {
        const response = await ApiClient.getBroadcastPosition(MODULE_ID);
        if (response?.position) {
            displayPositionBanner(response.position);
        }
    } catch (error) {
        console.warn('Error loading current position:', error);
    }
}

function displayPositionBanner(position) {
    if (!positionBannerElement || !position) return;

    const text = `Day ${position.day}${position.section_label ? ` - ${position.section_label}` : ''}`;
    const textElement = document.getElementById('bannerPositionText');
    if (textElement) {
        textElement.textContent = text;
    }

    positionBannerElement.dataset.position = JSON.stringify(position);
    positionBannerElement.classList.remove('hidden');
}

console.log('Client scripts loaded for module:', MODULE_ID);
