const state = {
    user: null,
    modules: [],
    rows: [],
    activeSessions: [],
    filter: 'all',
    search: '',
    questions: [],
    questionsFilter: 'all',
    socket: null,
    currentPosition: null
};

const dom = {};
const POLL_INTERVAL_MS = 15000;
let pollingTimerId = null;
let dashboardInFlight = false;

document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    attachEventListeners();
    initializeDashboard();
});

function cacheElements() {
    dom.loginPanel = document.getElementById('loginPanel');
    dom.loginForm = document.getElementById('loginForm');
    dom.loginError = document.getElementById('loginError');

    dom.notAdminPanel = document.getElementById('notAdminPanel');
    dom.dashboard = document.getElementById('dashboard');
    dom.dashboardMessage = document.getElementById('dashboardMessage');

    dom.moduleFilter = document.getElementById('moduleFilter');
    dom.searchInput = document.getElementById('searchInput');
    dom.refreshButton = document.getElementById('refreshButton');

    dom.summaryParticipants = document.getElementById('summaryParticipants');
    dom.summaryLive = document.getElementById('summaryLive');
    dom.summaryLiveDetail = document.getElementById('summaryLiveDetail');
    dom.summaryAverage = document.getElementById('summaryAverage');
    dom.summaryAverageDetail = document.getElementById('summaryAverageDetail');
    dom.summaryLastUpdated = document.getElementById('summaryLastUpdated');

    dom.activeSessionsTable = document.getElementById('activeSessionsTable');
    dom.progressTable = document.getElementById('progressTable');

    dom.userStatus = document.getElementById('userStatus');
    dom.adminName = document.getElementById('adminName');
    dom.logoutButton = document.getElementById('logoutButton');

    dom.broadcastModule = document.getElementById('broadcastModule');
    dom.broadcastDay = document.getElementById('broadcastDay');
    dom.broadcastSection = document.getElementById('broadcastSection');
    dom.broadcastButton = document.getElementById('broadcastButton');
    dom.currentPosition = document.getElementById('currentPosition');
    dom.currentPositionText = document.getElementById('currentPositionText');
    dom.facilitatorGuide = document.getElementById('facilitatorGuide');
    dom.guideContent = document.getElementById('guideContent');
    dom.closeGuide = document.getElementById('closeGuide');
    dom.questionsModuleFilter = document.getElementById('questionsModuleFilter');
    dom.questionsList = document.getElementById('questionsList');
}

function attachEventListeners() {
    if (dom.loginForm) {
        dom.loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (dom.logoutButton) {
        dom.logoutButton.addEventListener('click', async () => {
            dom.logoutButton.disabled = true;
            stopPolling();
            try {
                await ApiClient.logout();
                window.location.reload();
            } catch (error) {
                showBanner('Unable to log out. Please refresh.', 'error');
            } finally {
                dom.logoutButton.disabled = false;
            }
        });
    }

    if (dom.moduleFilter) {
        dom.moduleFilter.addEventListener('change', event => {
            state.filter = event.target.value;
            renderTable();
            renderSummary();
            renderActiveSessions();
        });
    }

    if (dom.searchInput) {
        dom.searchInput.addEventListener('input', event => {
            state.search = event.target.value.trim().toLowerCase();
            renderTable();
            renderSummary();
            renderActiveSessions();
        });
    }

    if (dom.refreshButton) {
        dom.refreshButton.addEventListener('click', () => {
            loadDashboardData({ showSuccess: true });
        });
    }

    if (dom.broadcastButton) {
        dom.broadcastButton.addEventListener('click', handleBroadcast);
    }

    if (dom.broadcastModule) {
        dom.broadcastModule.addEventListener('change', () => {
            loadCurrentPosition();
        });
    }

    if (dom.closeGuide) {
        dom.closeGuide.addEventListener('click', () => {
            dom.facilitatorGuide?.classList.add('hidden');
        });
    }

    if (dom.questionsModuleFilter) {
        dom.questionsModuleFilter.addEventListener('change', (event) => {
            state.questionsFilter = event.target.value;
            renderQuestions();
        });
    }
}

async function initializeDashboard() {
    showBanner('Checking session…', 'info');
    try {
        const response = await ApiClient.me();
        if (!response?.user) {
            throw Object.assign(new Error('Not authenticated'), { status: 401 });
        }

        if (response.user.role !== 'admin') {
            revealNotAdmin(response.user);
            return;
        }

        setCurrentUser(response.user);
        await loadModuleList();
        await loadDashboardData();
    } catch (error) {
        if (error.status === 401) {
            revealLogin();
            showBanner('', null);
        } else if (error.status === 403) {
            revealNotAdmin();
        } else {
            console.error('Failed to initialize admin dashboard:', error);
            showBanner('Unable to load dashboard. Please try again.', 'error');
        }
    }
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    if (!dom.loginForm) return;

    const formData = new FormData(dom.loginForm);
    const email = formData.get('email')?.trim();
    const password = formData.get('password');

    if (!email || !password) {
        displayLoginError('Email and password are required.');
        return;
    }

    dom.loginForm.querySelector('button[type="submit"]').disabled = true;
    displayLoginError('');

    try {
        await ApiClient.login({ email, password });
        showBanner('Login successful. Loading dashboard…', 'success');
        await initializeDashboard();
    } catch (error) {
        if (error.status === 401) {
            displayLoginError('Invalid credentials. Please try again.');
        } else {
            console.error('Login error:', error);
            displayLoginError(error.message || 'Unable to log in right now.');
        }
    } finally {
        dom.loginForm.querySelector('button[type="submit"]').disabled = false;
    }
}

function displayLoginError(message) {
    if (!dom.loginError) return;
    if (!message) {
        dom.loginError.classList.add('hidden');
        dom.loginError.textContent = '';
    } else {
        dom.loginError.textContent = message;
        dom.loginError.classList.remove('hidden');
    }
}

function revealLogin() {
    hideAllPanels();
    dom.loginPanel?.classList.remove('hidden');
    stopPolling();
}

function revealNotAdmin(user) {
    hideAllPanels();
    dom.notAdminPanel?.classList.remove('hidden');
    showBanner('', null);
    stopPolling();

    if (user) {
        setCurrentUser(user);
    }
}

function revealDashboard() {
    hideAllPanels();
    dom.dashboard?.classList.remove('hidden');
}

function hideAllPanels() {
    dom.loginPanel?.classList.add('hidden');
    dom.notAdminPanel?.classList.add('hidden');
    dom.dashboard?.classList.add('hidden');
}

async function loadModuleList() {
    try {
        const response = await ApiClient.listModules();
        state.modules = response?.modules || [];
        populateModuleFilter();
    } catch (error) {
        console.warn('Unable to load module list:', error);
    }
}

async function loadDashboardData(options = {}) {
    const { showSuccess = false, silent = false, skipIfBusy = false } = options;

    if (dashboardInFlight) {
        if (skipIfBusy) {
            return;
        }
        if (!silent) {
            showBanner('Refresh already in progress…', 'info');
        }
        return;
    }

    dashboardInFlight = true;

    if (!silent) {
        showBanner('Loading participant data…', 'info');
    }

    try {
        const [progressResponse, sessionsResponse] = await Promise.all([
            ApiClient.adminProgress(),
            ApiClient.adminActiveSessions()
        ]);

        state.rows = progressResponse?.progress || [];
        state.activeSessions = sessionsResponse?.sessions || [];

        mergeModulesFromData();
        populateModuleFilter();
        populateBroadcastModules();
        revealDashboard();
        renderSummary();
        renderTable();
        renderActiveSessions();
        initializeSocket();
        loadQuestions();
        startPolling();

        if (showSuccess && !silent) {
            showBanner('Dashboard refreshed.', 'success', 1800);
        } else if (!silent) {
            showBanner('', null);
        }
    } catch (error) {
        if (error.status === 401) {
            dashboardInFlight = false;
            await initializeDashboard();
            return;
        }

        if (error.status === 403) {
            dashboardInFlight = false;
            revealNotAdmin();
            return;
        }

        console.error('Failed to load dashboard data:', error);
        if (!silent) {
            showBanner('Unable to fetch dashboard data. Try again shortly.', 'error');
        }
    } finally {
        dashboardInFlight = false;
    }
}

function mergeModulesFromData() {
    const moduleById = new Map(state.modules.map(module => [module.id, { ...module }]));

    [...state.rows, ...state.activeSessions].forEach(entry => {
        if (!entry || !entry.module_id) return;
        if (!moduleById.has(entry.module_id)) {
            moduleById.set(entry.module_id, {
                id: entry.module_id,
                name: entry.module_name || entry.module_id
            });
        } else {
            const existing = moduleById.get(entry.module_id);
            if (!existing.name && (entry.module_name || entry.module_id)) {
                existing.name = entry.module_name || entry.module_id;
            }
        }
    });

    state.modules = Array.from(moduleById.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function populateModuleFilter() {
    if (!dom.moduleFilter) return;

    const currentSelection = state.filter;
    dom.moduleFilter.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Modules';
    dom.moduleFilter.appendChild(allOption);

    state.modules.forEach(module => {
        const option = document.createElement('option');
        option.value = module.id;
        option.textContent = module.name;
        dom.moduleFilter.appendChild(option);
    });

    if (currentSelection && (currentSelection === 'all' || state.modules.some(m => m.id === currentSelection))) {
        dom.moduleFilter.value = currentSelection;
    } else {
        dom.moduleFilter.value = 'all';
        state.filter = 'all';
    }
}

function renderSummary() {
    if (!dom.summaryParticipants) return;

    const filteredRows = getFilteredRows();
    const filteredSessions = getFilteredSessions();

    const participantIds = new Set();
    let progressSum = 0;
    let lastUpdated = null;

    filteredRows.forEach(row => {
        participantIds.add(row.user_id);
        progressSum += Number(row.progress || 0);

        if (row.updated_at) {
            const updatedDate = new Date(row.updated_at);
            if (!Number.isNaN(updatedDate.getTime())) {
                if (!lastUpdated || updatedDate > lastUpdated) {
                    lastUpdated = updatedDate;
                }
            }
        }
    });

    filteredSessions.forEach(session => {
        participantIds.add(session.user_id);
    });

    const participantCount = participantIds.size;
    const averageProgress = filteredRows.length > 0 ? Math.round(progressSum / filteredRows.length) : 0;

    const liveParticipants = new Set(filteredSessions.map(session => session.user_id));
    const liveSessionCount = filteredSessions.length;

    dom.summaryParticipants.textContent = participantCount.toString();

    if (dom.summaryLive) {
        dom.summaryLive.textContent = liveParticipants.size.toString();
    }

    if (dom.summaryLiveDetail) {
        if (liveSessionCount > 0) {
            const sessionsLabel = `${liveSessionCount} session${liveSessionCount === 1 ? '' : 's'}`;
            const participantsLabel = `${liveParticipants.size} participant${liveParticipants.size === 1 ? '' : 's'}`;
            const percentText = participantCount > 0
                ? ` • ${Math.round((liveParticipants.size / participantCount) * 100)}% of participants active`
                : '';
            dom.summaryLiveDetail.textContent = `${sessionsLabel} across ${participantsLabel}${percentText}`;
        } else {
            dom.summaryLiveDetail.textContent = 'No active sessions';
        }
    }

    dom.summaryAverage.textContent = `${averageProgress}%`;
    dom.summaryAverageDetail.textContent = filteredRows.length
        ? `Across ${filteredRows.length} module enrollments`
        : 'No module progress yet';
    dom.summaryLastUpdated.textContent = lastUpdated
        ? lastUpdated.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        })
        : '—';
}

function renderTable() {
    if (!dom.progressTable) return;

    dom.progressTable.innerHTML = '';
    const rows = getFilteredRows().sort((a, b) => {
        const nameCompare = (a.name || a.email || '').localeCompare(b.name || b.email || '', undefined, {
            sensitivity: 'base'
        });
        if (nameCompare !== 0) return nameCompare;
        const moduleCompare = (a.module_name || a.module_id || '').localeCompare(
            b.module_name || b.module_id || '',
            undefined,
            { sensitivity: 'base' }
        );
        if (moduleCompare !== 0) return moduleCompare;
        return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
    });

    if (!rows.length) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 4;
        emptyCell.className = 'empty-state';
        emptyCell.textContent = 'No participant progress matches your filters yet.';
        emptyRow.appendChild(emptyCell);
        dom.progressTable.appendChild(emptyRow);
        return;
    }

    rows.forEach(row => {
        const tr = document.createElement('tr');

        const participantCell = document.createElement('td');
        participantCell.dataset.label = 'Participant';
        participantCell.appendChild(buildParticipantCell(row));

        const moduleCell = document.createElement('td');
        moduleCell.dataset.label = 'Module';
        moduleCell.textContent = row.module_name || row.module_id || 'Unknown module';

        const progressCell = document.createElement('td');
        progressCell.dataset.label = 'Progress';
        progressCell.appendChild(buildProgressMeter(row.progress));

        const updatedCell = document.createElement('td');
        updatedCell.dataset.label = 'Updated';
        updatedCell.textContent = formatUpdatedDate(row.updated_at);

        tr.appendChild(participantCell);
        tr.appendChild(moduleCell);
        tr.appendChild(progressCell);
        tr.appendChild(updatedCell);

        dom.progressTable.appendChild(tr);
    });
}

function renderActiveSessions() {
    if (!dom.activeSessionsTable) return;

    dom.activeSessionsTable.innerHTML = '';
    const sessions = getFilteredSessions().sort((a, b) => {
        const updatedA = new Date(a.updated_at || 0).getTime();
        const updatedB = new Date(b.updated_at || 0).getTime();
        return updatedB - updatedA;
    });

    if (!sessions.length) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 5;
        emptyCell.className = 'empty-state';
        emptyCell.textContent = state.filter !== 'all' || state.search
            ? 'No active sessions match your filters.'
            : 'No one is active right now.';
        emptyRow.appendChild(emptyCell);
        dom.activeSessionsTable.appendChild(emptyRow);
        return;
    }

    sessions.forEach(session => {
        const tr = document.createElement('tr');

        const participantCell = document.createElement('td');
        participantCell.dataset.label = 'Participant';
        participantCell.appendChild(buildParticipantCell(session));

        const moduleCell = document.createElement('td');
        moduleCell.dataset.label = 'Module';
        moduleCell.textContent = session.module_name || session.module_id || 'Unknown module';

        const viewingCell = document.createElement('td');
        viewingCell.dataset.label = 'Viewing';
        viewingCell.appendChild(buildViewingCell(session));

        const progressCell = document.createElement('td');
        progressCell.dataset.label = 'Progress';
        progressCell.appendChild(buildProgressMeter(session.progress));

        const updatedCell = document.createElement('td');
        updatedCell.dataset.label = 'Last Seen';
        updatedCell.textContent = formatUpdatedDate(session.updated_at);

        tr.appendChild(participantCell);
        tr.appendChild(moduleCell);
        tr.appendChild(viewingCell);
        tr.appendChild(progressCell);
        tr.appendChild(updatedCell);

        dom.activeSessionsTable.appendChild(tr);
    });
}

function buildParticipantCell(row) {
    const wrapper = document.createElement('div');
    wrapper.className = 'participant-cell';

    const name = document.createElement('div');
    name.className = 'participant-name';
    name.textContent = row.name || '—';

    const email = document.createElement('div');
    email.className = 'participant-email';
    email.textContent = row.email || 'No email';

    wrapper.appendChild(name);
    wrapper.appendChild(email);
    return wrapper;
}

function startPolling() {
    if (pollingTimerId) return;
    pollingTimerId = setInterval(() => {
        if (document.hidden || dom.dashboard?.classList.contains('hidden')) return;
        loadDashboardData({ silent: true, skipIfBusy: true });
    }, POLL_INTERVAL_MS);
}

function stopPolling() {
    if (pollingTimerId) {
        clearInterval(pollingTimerId);
        pollingTimerId = null;
    }
}

function buildViewingCell(row) {
    const wrapper = document.createElement('div');
    wrapper.className = 'viewing-path';

    const sectionName = row.section_label || row.section_id;
    const subsectionName = row.subsection_label || row.subsection_id;

    const sectionEl = document.createElement('div');
    sectionEl.className = 'viewing-section';
    sectionEl.textContent = sectionName || '—';
    wrapper.appendChild(sectionEl);

    if (subsectionName) {
        const subsectionEl = document.createElement('div');
        subsectionEl.className = 'viewing-subsection';
        subsectionEl.textContent = subsectionName;
        wrapper.appendChild(subsectionEl);
    }

    return wrapper;
}

function buildProgressMeter(progressValue) {
    const value = Number.isFinite(progressValue) ? Math.max(0, Math.min(100, Math.round(progressValue))) : 0;

    const wrapper = document.createElement('div');
    wrapper.className = 'progress-meter';

    const barOuter = document.createElement('div');
    barOuter.className = 'progress-bar-outer';

    const barInner = document.createElement('div');
    barInner.className = 'progress-bar-inner';
    barInner.style.width = `${value}%`;
    barOuter.appendChild(barInner);

    const label = document.createElement('span');
    label.className = 'progress-value';
    label.textContent = `${value}%`;

    wrapper.appendChild(barOuter);
    wrapper.appendChild(label);
    return wrapper;
}

function formatUpdatedDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function getFilteredRows() {
    let filtered = Array.from(state.rows);

    if (state.filter !== 'all') {
        filtered = filtered.filter(row => row.module_id === state.filter);
    }

    if (state.search) {
        filtered = filtered.filter(row => {
            const haystack = `${row.name || ''} ${row.email || ''}`.toLowerCase();
            return haystack.includes(state.search);
        });
    }

    return filtered;
}

function getFilteredSessions() {
    let sessions = Array.from(state.activeSessions || []);

    if (state.filter !== 'all') {
        sessions = sessions.filter(session => session.module_id === state.filter);
    }

    if (state.search) {
        sessions = sessions.filter(session => {
            const haystack = `${session.name || ''} ${session.email || ''}`.toLowerCase();
            return haystack.includes(state.search);
        });
    }

    return sessions;
}

function setCurrentUser(user) {
    state.user = user;
    if (dom.adminName) {
        dom.adminName.textContent = `${user.name || user.email} · ${user.role}`;
    }

    if (dom.userStatus) {
        dom.userStatus.classList.remove('hidden');
    }
}

function showBanner(message, type = 'info', timeout) {
    if (!dom.dashboardMessage) return;

    dom.dashboardMessage.classList.add('hidden');
    dom.dashboardMessage.classList.remove('info', 'error', 'success');

    if (!message) return;

    dom.dashboardMessage.textContent = message;
    if (type) {
        dom.dashboardMessage.classList.add(type);
    }
    dom.dashboardMessage.classList.remove('hidden');

    if (timeout) {
        window.setTimeout(() => {
            dom.dashboardMessage?.classList.add('hidden');
        }, timeout);
    }
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !dom.dashboard?.classList.contains('hidden')) {
        loadDashboardData({ silent: true, skipIfBusy: true });
    }
});

window.addEventListener('beforeunload', () => {
    stopPolling();
    if (state.socket) {
        state.socket.disconnect();
    }
});

function initializeSocket() {
    if (state.socket) return;

    state.socket = io();

    state.socket.on('connect', () => {
        console.log('WebSocket connected');
    });

    state.socket.on('position-update', (data) => {
        console.log('Position update received:', data);
        if (data.moduleId && data.position) {
            if (dom.broadcastModule.value === data.moduleId) {
                state.currentPosition = data.position;
                displayCurrentPosition(data.position);
            }
        }
    });

    state.socket.on('new-question', (data) => {
        console.log('New question received:', data);
        if (data.question) {
            state.questions.unshift(data.question);
            renderQuestions();
        }
    });

    state.socket.on('question-answered', (data) => {
        console.log('Question answered:', data);
        if (data.question) {
            const index = state.questions.findIndex(q => q.id === data.question.id);
            if (index !== -1) {
                state.questions[index] = data.question;
                renderQuestions();
            }
        }
    });
}

async function loadCurrentPosition() {
    const moduleId = dom.broadcastModule.value;
    if (!moduleId) return;

    try {
        const response = await ApiClient.getBroadcastPosition(moduleId);
        state.currentPosition = response?.position || null;

        if (state.currentPosition) {
            displayCurrentPosition(state.currentPosition);
        } else {
            dom.currentPosition?.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error loading current position:', error);
    }
}

function displayCurrentPosition(position) {
    if (!position || !dom.currentPositionText) return;

    const text = `Day ${position.day}${position.section_label ? ` - ${position.section_label}` : ''}`;
    dom.currentPositionText.textContent = text;
    dom.currentPosition?.classList.remove('hidden');
}

async function handleBroadcast() {
    const moduleId = dom.broadcastModule.value;
    const day = dom.broadcastDay.value;
    const sectionLabel = dom.broadcastSection.value.trim();

    if (!moduleId) {
        showBanner('Please select a module', 'error', 3000);
        return;
    }

    if (!day) {
        showBanner('Please select a day', 'error', 3000);
        return;
    }

    dom.broadcastButton.disabled = true;
    showBanner('Broadcasting position...', 'info');

    try {
        await ApiClient.broadcastPosition({
            moduleId,
            day: parseInt(day, 10),
            sectionId: sectionLabel ? `day${day}-${sectionLabel.toLowerCase().replace(/\s+/g, '-')}` : null,
            sectionLabel: sectionLabel || null,
            facilitatorGuideFile: null // No longer needed
        });

        showBanner('Position broadcast to all students!', 'success', 3000);

        await loadCurrentPosition();

        // Load the session-specific guide
        await loadFacilitatorGuide(moduleId, day, sectionLabel);
    } catch (error) {
        console.error('Error broadcasting position:', error);
        showBanner(error.message || 'Failed to broadcast position', 'error', 5000);
    } finally {
        dom.broadcastButton.disabled = false;
    }
}

async function loadFacilitatorGuide(moduleId, day, section) {
    if (!day) return;

    try {
        const response = await ApiClient.getFacilitatorGuide(moduleId, day, section);

        if (response && response.html) {
            // Add filename as header if available
            let content = '';
            if (response.fileName) {
                content = `<div class="guide-file-name"><strong>Guide:</strong> ${response.fileName}</div>`;
            }
            content += response.html;

            dom.guideContent.innerHTML = content;
            dom.facilitatorGuide?.classList.remove('hidden');
        }
    } catch (error) {
        console.warn('Error loading facilitator guide:', error);
        const errorMsg = error.data?.searched
            ? `<p class="error-text">Facilitator guide not found for Day ${day}${section ? ' - ' + section : ''}</p><details><summary>Searched locations</summary><ul>${error.data.searched.map(p => `<li>${p}</li>`).join('')}</ul></details>`
            : '<p class="error-text">Facilitator guide not available for this section.</p>';
        dom.guideContent.innerHTML = errorMsg;
        dom.facilitatorGuide?.classList.remove('hidden');
    }
}

async function loadQuestions() {
    const moduleId = state.questionsFilter === 'all' ? null : state.questionsFilter;

    try {
        const allQuestions = [];

        if (moduleId) {
            const response = await ApiClient.getQuestions(moduleId);
            allQuestions.push(...(response?.questions || []));
        } else {
            for (const module of state.modules) {
                const response = await ApiClient.getQuestions(module.id);
                allQuestions.push(...(response?.questions || []));
            }
        }

        state.questions = allQuestions.sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );

        renderQuestions();
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function renderQuestions() {
    if (!dom.questionsList) return;

    dom.questionsList.innerHTML = '';

    let questions = state.questions;

    if (state.questionsFilter !== 'all') {
        questions = questions.filter(q => q.module_id === state.questionsFilter);
    }

    if (!questions.length) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.textContent = 'No questions yet.';
        dom.questionsList.appendChild(emptyDiv);
        return;
    }

    questions.forEach(question => {
        const card = document.createElement('div');
        card.className = `question-card ${question.is_answered ? 'answered' : ''}`;

        const header = document.createElement('div');
        header.className = 'question-header';

        const userInfo = document.createElement('div');
        userInfo.className = 'question-user';
        userInfo.innerHTML = `<strong>${escapeHtml(question.user_name)}</strong> <span class="question-module">${getModuleName(question.module_id)}</span>`;

        const time = document.createElement('div');
        time.className = 'question-time';
        time.textContent = formatUpdatedDate(question.created_at);

        header.appendChild(userInfo);
        header.appendChild(time);

        const text = document.createElement('div');
        text.className = 'question-text';
        text.textContent = question.question_text;

        card.appendChild(header);
        card.appendChild(text);

        if (question.is_answered && question.answer_text) {
            const answer = document.createElement('div');
            answer.className = 'question-answer';
            answer.innerHTML = `<strong>Answer:</strong> ${escapeHtml(question.answer_text)}`;
            card.appendChild(answer);
        }

        dom.questionsList.appendChild(card);
    });
}

function getModuleName(moduleId) {
    const module = state.modules.find(m => m.id === moduleId);
    return module ? module.name : moduleId;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function populateBroadcastModules() {
    if (!dom.broadcastModule || !dom.questionsModuleFilter) return;

    dom.broadcastModule.innerHTML = '<option value="">Select module...</option>';
    dom.questionsModuleFilter.innerHTML = '<option value="all">All Modules</option>';

    state.modules.forEach(module => {
        const option1 = document.createElement('option');
        option1.value = module.id;
        option1.textContent = module.name;
        dom.broadcastModule.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = module.id;
        option2.textContent = module.name;
        dom.questionsModuleFilter.appendChild(option2);
    });
}
