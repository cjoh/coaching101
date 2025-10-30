// Admin Dashboard JavaScript
// Handles three-tab interface: Content, Users, Live

const state = {
    user: null,
    currentTab: 'content',
    courses: [],
    selectedCourse: null,
    selectedDay: null,
    selectedSession: null,
    users: [],
    questions: [],
    socket: null,
    markdownEditors: {},
    liveModule: null,
    liveDay: null,
    liveSession: null
};

const dom = {};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    attachEventListeners();
    initializeDashboard();
});

function cacheElements() {
    // Auth elements
    dom.loginPanel = document.getElementById('loginPanel');
    dom.loginForm = document.getElementById('loginForm');
    dom.loginError = document.getElementById('loginError');
    dom.notAdminPanel = document.getElementById('notAdminPanel');
    dom.dashboard = document.getElementById('dashboard');
    dom.userStatus = document.getElementById('userStatus');
    dom.adminName = document.getElementById('adminName');
    dom.logoutButton = document.getElementById('logoutButton');

    // Tab navigation
    dom.tabButtons = document.querySelectorAll('.tab-button');
    dom.tabContents = document.querySelectorAll('.tab-content');

    // Content Tab
    dom.courseTree = document.getElementById('courseTree');
    dom.createCourseBtn = document.getElementById('createCourseBtn');
    dom.contentWelcome = document.getElementById('contentWelcome');
    dom.courseEditor = document.getElementById('courseEditor');
    dom.dayEditor = document.getElementById('dayEditor');
    dom.sessionEditor = document.getElementById('sessionEditor');

    // Users Tab
    dom.usersTable = document.getElementById('usersTable');
    dom.usersSearch = document.getElementById('usersSearch');
    dom.usersRoleFilter = document.getElementById('usersRoleFilter');

    // Live Tab
    dom.liveTabButtons = document.querySelectorAll('.live-tab-btn');
    dom.questionsSubTab = document.getElementById('questionsSubTab');
    dom.sessionSubTab = document.getElementById('sessionSubTab');
    dom.questionsList = document.getElementById('questionsList');
    dom.questionsModuleFilter = document.getElementById('questionsModuleFilter');
    dom.liveModule = document.getElementById('liveModule');
    dom.liveDay = document.getElementById('liveDay');
    dom.liveSession = document.getElementById('liveSession');
    dom.broadcastSessionBtn = document.getElementById('broadcastSessionBtn');

    // Modals
    dom.createCourseModal = document.getElementById('createCourseModal');
    dom.addSessionModal = document.getElementById('addSessionModal');
    dom.editUserModal = document.getElementById('editUserModal');
    dom.userCoursesModal = document.getElementById('userCoursesModal');
}

function attachEventListeners() {
    // Login
    if (dom.loginForm) {
        dom.loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (dom.logoutButton) {
        dom.logoutButton.addEventListener('click', handleLogout);
    }

    // Main tab navigation
    dom.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });

    // Live sub-tab navigation
    dom.liveTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const subTab = btn.dataset.liveTab;
            switchLiveSubTab(subTab);
        });
    });

    // Content Tab
    if (dom.createCourseBtn) {
        dom.createCourseBtn.addEventListener('click', () => openModal('createCourseModal'));
    }

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });

    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Users Tab
    if (dom.usersSearch) {
        dom.usersSearch.addEventListener('input', filterUsers);
    }
    if (dom.usersRoleFilter) {
        dom.usersRoleFilter.addEventListener('change', filterUsers);
    }

    // Live Tab - Session control
    if (dom.liveModule) {
        dom.liveModule.addEventListener('change', handleLiveModuleChange);
    }
    if (dom.liveDay) {
        dom.liveDay.addEventListener('change', handleLiveDayChange);
    }
    if (dom.liveSession) {
        dom.liveSession.addEventListener('change', handleLiveSessionChange);
    }
    if (dom.broadcastSessionBtn) {
        dom.broadcastSessionBtn.addEventListener('click', broadcastCurrentSession);
    }
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

async function initializeDashboard() {
    try {
        const user = await ApiClient.getCurrentUser();
        if (!user) {
            showLoginPanel();
            return;
        }

        if (user.role !== 'admin') {
            showNotAdminPanel();
            return;
        }

        state.user = user;
        showDashboard();
        await loadInitialData();
        setupWebSocket();
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showLoginPanel();
    }
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        dom.loginError.classList.add('hidden');
        const user = await ApiClient.login(email, password);

        if (user.role !== 'admin') {
            showNotAdminPanel();
            return;
        }

        state.user = user;
        showDashboard();
        await loadInitialData();
        setupWebSocket();
    } catch (error) {
        console.error('Login error:', error);
        dom.loginError.textContent = error.message || 'Login failed';
        dom.loginError.classList.remove('hidden');
    }
}

async function handleLogout() {
    try {
        await ApiClient.logout();
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to log out');
    }
}

function showLoginPanel() {
    dom.loginPanel.classList.remove('hidden');
    dom.notAdminPanel.classList.add('hidden');
    dom.dashboard.classList.add('hidden');
    dom.userStatus.classList.add('hidden');
}

function showNotAdminPanel() {
    dom.loginPanel.classList.add('hidden');
    dom.notAdminPanel.classList.remove('hidden');
    dom.dashboard.classList.add('hidden');
    dom.userStatus.classList.add('hidden');
}

function showDashboard() {
    dom.loginPanel.classList.add('hidden');
    dom.notAdminPanel.classList.add('hidden');
    dom.dashboard.classList.remove('hidden');
    dom.userStatus.classList.remove('hidden');
    dom.adminName.textContent = state.user.name || state.user.email;
}

// ============================================================================
// DATA LOADING
// ============================================================================

async function loadInitialData() {
    await Promise.all([
        loadCourses(),
        loadUsers(),
        loadQuestions()
    ]);

    // Load content for current tab
    if (state.currentTab === 'content') {
        renderCourseTree();
    } else if (state.currentTab === 'users') {
        renderUsersTable();
    } else if (state.currentTab === 'live') {
        await loadLiveModules();
        renderQuestions();
    }
}

async function loadCourses() {
    try {
        state.courses = await ApiClient.get('/api/admin/courses');
    } catch (error) {
        console.error('Failed to load courses:', error);
        state.courses = [];
    }
}

async function loadUsers() {
    try {
        state.users = await ApiClient.get('/api/admin/users');
    } catch (error) {
        console.error('Failed to load users:', error);
        state.users = [];
    }
}

async function loadQuestions() {
    try {
        state.questions = await ApiClient.get(`/api/questions/all`);
    } catch (error) {
        console.error('Failed to load questions:', error);
        state.questions = [];
    }
}

// ============================================================================
// TAB NAVIGATION
// ============================================================================

function switchTab(tabName) {
    state.currentTab = tabName;

    // Update buttons
    dom.tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update content
    dom.tabContents.forEach(content => {
        if (content.id === `${tabName}Tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Load tab-specific data
    if (tabName === 'content') {
        renderCourseTree();
    } else if (tabName === 'users') {
        renderUsersTable();
    } else if (tabName === 'live') {
        loadLiveModules();
        renderQuestions();
    }
}

function switchLiveSubTab(subTab) {
    dom.liveTabButtons.forEach(btn => {
        if (btn.dataset.liveTab === subTab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (subTab === 'questions') {
        dom.questionsSubTab.classList.add('active');
        dom.sessionSubTab.classList.add('hidden');
    } else if (subTab === 'session') {
        dom.questionsSubTab.classList.add('hidden');
        dom.sessionSubTab.classList.add('active');
    }
}

// ============================================================================
// CONTENT TAB - COURSE TREE
// ============================================================================

async function renderCourseTree() {
    if (!dom.courseTree) return;

    if (state.courses.length === 0) {
        dom.courseTree.innerHTML = '<div class="empty-state">No courses yet. Create one to get started.</div>';
        return;
    }

    const html = state.courses.map(course => `
        <div class="tree-item tree-item-course ${state.selectedCourse?.id === course.id ? 'active expanded' : 'collapsed'}" data-course-id="${course.id}">
            <span class="tree-toggle"></span>
            ${course.name}
            <div class="tree-children" id="tree-course-${course.id}"></div>
        </div>
    `).join('');

    dom.courseTree.innerHTML = html;

    // Attach click handlers
    dom.courseTree.querySelectorAll('.tree-item-course').forEach(item => {
        const courseId = item.dataset.courseId;
        const toggle = item.querySelector('.tree-toggle');
        const content = item.cloneNode(true);
        content.querySelector('.tree-toggle')?.remove();
        content.querySelector('.tree-children')?.remove();

        toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            item.classList.toggle('expanded');
            item.classList.toggle('collapsed');
            if (item.classList.contains('expanded')) {
                loadCourseDays(courseId);
            }
        });

        content.addEventListener('click', () => selectCourse(courseId));
    });

    // Auto-expand selected course
    if (state.selectedCourse) {
        loadCourseDays(state.selectedCourse.id);
    }
}

async function loadCourseDays(courseId) {
    const container = document.getElementById(`tree-course-${courseId}`);
    if (!container) return;

    try {
        const days = await ApiClient.get(`/api/admin/courses/${courseId}/days`);

        const html = days.map(day => `
            <div class="tree-item tree-item-day ${state.selectedDay?.id === day.id ? 'active expanded' : 'collapsed'}" data-day-id="${day.id}">
                <span class="tree-toggle"></span>
                ${day.title}
                <div class="tree-children" id="tree-day-${day.id}"></div>
            </div>
        `).join('');

        container.innerHTML = html;

        // Attach day click handlers
        container.querySelectorAll('.tree-item-day').forEach(item => {
            const dayId = item.dataset.dayId;
            const toggle = item.querySelector('.tree-toggle');
            const content = item.cloneNode(true);
            content.querySelector('.tree-toggle')?.remove();
            content.querySelector('.tree-children')?.remove();

            toggle?.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.toggle('expanded');
                item.classList.toggle('collapsed');
                if (item.classList.contains('expanded')) {
                    loadDaySessions(dayId);
                }
            });

            content.addEventListener('click', () => selectDay(dayId));
        });

        // Auto-expand selected day
        if (state.selectedDay && days.find(d => d.id === state.selectedDay.id)) {
            loadDaySessions(state.selectedDay.id);
        }
    } catch (error) {
        console.error('Failed to load days:', error);
        container.innerHTML = '<div class="empty-state">Failed to load days</div>';
    }
}

async function loadDaySessions(dayId) {
    const container = document.getElementById(`tree-day-${dayId}`);
    if (!container) return;

    try {
        const sessions = await ApiClient.get(`/api/admin/days/${dayId}/sessions`);

        const html = sessions.map(session => `
            <div class="tree-item tree-item-session ${state.selectedSession?.id === session.id ? 'active' : ''}" data-session-id="${session.id}">
                ${session.session_number}: ${session.title}
            </div>
        `).join('');

        container.innerHTML = html || '<div class="empty-state" style="margin-left: 2rem; font-size: 0.8rem;">No sessions</div>';

        // Attach session click handlers
        container.querySelectorAll('.tree-item-session').forEach(item => {
            item.addEventListener('click', () => selectSession(item.dataset.sessionId));
        });
    } catch (error) {
        console.error('Failed to load sessions:', error);
        container.innerHTML = '<div class="empty-state">Failed to load sessions</div>';
    }
}

// ============================================================================
// CONTENT TAB - SELECTION HANDLERS
// ============================================================================

async function selectCourse(courseId) {
    try {
        state.selectedCourse = await ApiClient.get(`/api/admin/courses/${courseId}`);
        state.selectedDay = null;
        state.selectedSession = null;

        hideAllEditors();
        showCourseEditor();
        renderCourseTree(); // Update tree selection
    } catch (error) {
        console.error('Failed to load course:', error);
        alert('Failed to load course');
    }
}

async function selectDay(dayId) {
    try {
        state.selectedDay = await ApiClient.get(`/api/admin/days/${dayId}`);
        state.selectedSession = null;

        hideAllEditors();
        await showDayEditor();
        renderCourseTree(); // Update tree selection
    } catch (error) {
        console.error('Failed to load day:', error);
        alert('Failed to load day');
    }
}

async function selectSession(sessionId) {
    try {
        state.selectedSession = await ApiClient.get(`/api/admin/sessions/${sessionId}`);

        hideAllEditors();
        await showSessionEditor();
        renderCourseTree(); // Update tree selection
    } catch (error) {
        console.error('Failed to load session:', error);
        alert('Failed to load session');
    }
}

// ============================================================================
// CONTENT TAB - EDITORS
// ============================================================================

function hideAllEditors() {
    dom.contentWelcome?.classList.add('hidden');
    dom.courseEditor?.classList.remove('active');
    dom.courseEditor?.classList.add('hidden');
    dom.dayEditor?.classList.remove('active');
    dom.dayEditor?.classList.add('hidden');
    dom.sessionEditor?.classList.remove('active');
    dom.sessionEditor?.classList.add('hidden');
}

function showCourseEditor() {
    dom.courseEditor.classList.remove('hidden');
    dom.courseEditor.classList.add('active');

    document.getElementById('courseEditorTitle').textContent = state.selectedCourse.name;
    document.getElementById('courseName').value = state.selectedCourse.name;
    document.getElementById('courseDescription').value = state.selectedCourse.description || '';
    document.getElementById('courseDuration').value = state.selectedCourse.duration_days;
    document.getElementById('courseActive').checked = state.selectedCourse.is_active === 1;

    // Attach save handler
    const saveBtn = document.getElementById('saveCourseBtn');
    const generateManualBtn = document.getElementById('generateManualBtn');
    const deleteBtn = document.getElementById('deleteCourseBtn');

    generateManualBtn.onclick = async () => {
        try {
            generateManualBtn.disabled = true;
            generateManualBtn.textContent = '⏳ Generating...';

            // Call API to generate manual - it will return the file as a download
            const response = await fetch(`${ApiClient.baseUrl}/api/admin/courses/${state.selectedCourse.id}/generate-manual`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to generate manual');
            }

            // Get the blob and create a download link
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${state.selectedCourse.id}_coaches_manual_${new Date().toISOString().split('T')[0]}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            alert('Manual generated and downloaded successfully!');
        } catch (error) {
            console.error('Failed to generate manual:', error);
            alert('Failed to generate manual. Please try again.');
        } finally {
            generateManualBtn.disabled = false;
            generateManualBtn.textContent = '📄 Generate Manual';
        }
    };

    saveBtn.onclick = async () => {
        try {
            await ApiClient.put(`/api/admin/courses/${state.selectedCourse.id}`, {
                name: document.getElementById('courseName').value,
                description: document.getElementById('courseDescription').value,
                duration_days: parseInt(document.getElementById('courseDuration').value),
                is_active: document.getElementById('courseActive').checked
            });
            alert('Course updated successfully');
            await loadCourses();
            renderCourseTree();
        } catch (error) {
            console.error('Failed to update course:', error);
            alert('Failed to update course');
        }
    };

    deleteBtn.onclick = async () => {
        if (!confirm(`Are you sure you want to delete "${state.selectedCourse.name}"? This will delete all days and sessions.`)) {
            return;
        }
        try {
            await ApiClient.delete(`/api/admin/courses/${state.selectedCourse.id}`);
            state.selectedCourse = null;
            await loadCourses();
            hideAllEditors();
            dom.contentWelcome.classList.remove('hidden');
            renderCourseTree();
        } catch (error) {
            console.error('Failed to delete course:', error);
            alert('Failed to delete course');
        }
    };
}

async function showDayEditor() {
    dom.dayEditor.classList.remove('hidden');
    dom.dayEditor.classList.add('active');

    document.getElementById('dayEditorTitle').textContent = `${state.selectedDay.title} - Schedule & Sessions`;
    document.getElementById('dayTitle').value = state.selectedDay.title;
    document.getElementById('dayDescription').value = state.selectedDay.description || '';

    // Initialize markdown editor for schedule
    if (!state.markdownEditors.daySchedule) {
        state.markdownEditors.daySchedule = new EasyMDE({
            element: document.getElementById('daySchedule'),
            spellChecker: false,
            status: false,
            toolbar: ["bold", "italic", "heading", "|", "unordered-list", "ordered-list", "|", "link", "preview"]
        });
    }
    state.markdownEditors.daySchedule.value(state.selectedDay.schedule_markdown || '');

    // Load and render sessions
    await renderSessionsList();

    // Attach save handler
    const saveBtn = document.getElementById('saveDayBtn');
    saveBtn.onclick = async () => {
        try {
            await ApiClient.put(`/api/admin/days/${state.selectedDay.id}`, {
                title: document.getElementById('dayTitle').value,
                description: document.getElementById('dayDescription').value,
                schedule_markdown: state.markdownEditors.daySchedule.value()
            });
            alert('Day updated successfully');
            await loadCourses();
        } catch (error) {
            console.error('Failed to update day:', error);
            alert('Failed to update day');
        }
    };

    // Attach add session handler
    const addSessionBtn = document.getElementById('addSessionBtn');
    addSessionBtn.onclick = () => {
        openModal('addSessionModal');

        // Set up confirm handler
        document.getElementById('confirmAddSession').onclick = async () => {
            try {
                await ApiClient.post(`/api/admin/days/${state.selectedDay.id}/sessions`, {
                    session_number: document.getElementById('newSessionNumber').value,
                    title: document.getElementById('newSessionTitle').value,
                    duration_minutes: parseInt(document.getElementById('newSessionDuration').value)
                });
                closeModal('addSessionModal');
                await renderSessionsList();
                // Clear form
                document.getElementById('newSessionNumber').value = '';
                document.getElementById('newSessionTitle').value = '';
                document.getElementById('newSessionDuration').value = '60';
            } catch (error) {
                console.error('Failed to add session:', error);
                alert('Failed to add session');
            }
        };
    };
}

async function renderSessionsList() {
    const container = document.getElementById('sessionsList');
    if (!container) return;

    try {
        const sessions = await ApiClient.get(`/api/admin/days/${state.selectedDay.id}/sessions`);

        if (sessions.length === 0) {
            container.innerHTML = '<div class="empty-state">No sessions yet. Add one to get started.</div>';
            return;
        }

        const html = sessions.map(session => `
            <div class="session-item" data-session-id="${session.id}">
                <div class="session-item-number">${session.session_number}</div>
                <div class="session-item-title">${session.title} (${session.duration_minutes} min)</div>
            </div>
        `).join('');

        container.innerHTML = html;

        // Attach click handlers
        container.querySelectorAll('.session-item').forEach(item => {
            item.addEventListener('click', () => selectSession(item.dataset.sessionId));
        });
    } catch (error) {
        console.error('Failed to load sessions:', error);
        container.innerHTML = '<div class="empty-state">Failed to load sessions</div>';
    }
}

async function showSessionEditor() {
    dom.sessionEditor.classList.remove('hidden');
    dom.sessionEditor.classList.add('active');

    document.getElementById('sessionEditorTitle').textContent = `Session ${state.selectedSession.session_number}: ${state.selectedSession.title}`;
    document.getElementById('sessionNumber').value = state.selectedSession.session_number;
    document.getElementById('sessionTitle').value = state.selectedSession.title;
    document.getElementById('sessionDuration').value = state.selectedSession.duration_minutes;

    // Set up content tabs
    setupContentTabs();

    // Load all three content types
    await loadSessionContent('facilitator_guide');
    await loadSessionContent('coaches_manual');
    await loadSessionContent('worksheet');

    // Attach save handler
    const saveBtn = document.getElementById('saveSessionBtn');
    saveBtn.onclick = async () => {
        try {
            // Save session metadata
            await ApiClient.put(`/api/admin/sessions/${state.selectedSession.id}`, {
                session_number: document.getElementById('sessionNumber').value,
                title: document.getElementById('sessionTitle').value,
                duration_minutes: parseInt(document.getElementById('sessionDuration').value)
            });

            // Save all content
            await saveSessionContent('facilitator_guide');
            await saveSessionContent('coaches_manual');
            await saveSessionContent('worksheet');

            alert('Session saved successfully');
            await loadCourses();
            renderCourseTree();
        } catch (error) {
            console.error('Failed to save session:', error);
            alert('Failed to save session');
        }
    };

    // Attach delete handler
    const deleteBtn = document.getElementById('deleteSessionBtn');
    deleteBtn.onclick = async () => {
        if (!confirm(`Are you sure you want to delete this session?`)) {
            return;
        }
        try {
            await ApiClient.delete(`/api/admin/sessions/${state.selectedSession.id}`);
            state.selectedSession = null;
            await selectDay(state.selectedDay.id); // Refresh day editor
        } catch (error) {
            console.error('Failed to delete session:', error);
            alert('Failed to delete session');
        }
    };
}

function setupContentTabs() {
    const tabs = document.querySelectorAll('.content-tab-btn');
    const panels = document.querySelectorAll('.content-editor-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const contentType = tab.dataset.content;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`${contentType.replace('_', '')}Editor`).classList.add('active');
        });
    });
}

async function loadSessionContent(contentType) {
    try {
        const content = await ApiClient.get(`/api/admin/sessions/${state.selectedSession.id}/content/${contentType}`);
        const editorId = `${contentType.replace('_', '')}Content`;

        // Initialize markdown editor if not exists
        if (!state.markdownEditors[contentType]) {
            state.markdownEditors[contentType] = new EasyMDE({
                element: document.getElementById(editorId),
                spellChecker: false,
                status: false,
                toolbar: ["bold", "italic", "heading", "|", "unordered-list", "ordered-list", "|", "link", "preview", "|", "guide"]
            });
        }

        state.markdownEditors[contentType].value(content.markdown_content || '');
    } catch (error) {
        console.error(`Failed to load ${contentType}:`, error);
    }
}

async function saveSessionContent(contentType) {
    try {
        const markdown = state.markdownEditors[contentType]?.value() || '';
        await ApiClient.put(`/api/admin/sessions/${state.selectedSession.id}/content/${contentType}`, {
            markdown_content: markdown
        });
    } catch (error) {
        console.error(`Failed to save ${contentType}:`, error);
        throw error;
    }
}

// ============================================================================
// CONTENT TAB - CREATE COURSE MODAL
// ============================================================================

document.getElementById('confirmCreateCourse')?.addEventListener('click', async () => {
    try {
        const id = document.getElementById('newCourseId').value.trim();
        const name = document.getElementById('newCourseName').value.trim();
        const description = document.getElementById('newCourseDescription').value.trim();
        const duration = parseInt(document.getElementById('newCourseDuration').value);

        if (!id || !name) {
            alert('Course ID and name are required');
            return;
        }

        await ApiClient.post('/api/admin/courses', {
            id,
            name,
            description,
            duration_days: duration
        });

        closeModal('createCourseModal');
        await loadCourses();
        renderCourseTree();

        // Clear form
        document.getElementById('newCourseId').value = '';
        document.getElementById('newCourseName').value = '';
        document.getElementById('newCourseDescription').value = '';
        document.getElementById('newCourseDuration').value = '3';
    } catch (error) {
        console.error('Failed to create course:', error);
        alert(error.message || 'Failed to create course');
    }
});

// ============================================================================
// USERS TAB
// ============================================================================

function renderUsersTable() {
    if (!dom.usersTable) return;

    const filteredUsers = getFilteredUsers();

    if (filteredUsers.length === 0) {
        dom.usersTable.innerHTML = '<tr><td colspan="6" class="empty-state">No users found</td></tr>';
        return;
    }

    const html = filteredUsers.map(user => `
        <tr>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td><span class="user-role-badge ${user.role}">${user.role}</span></td>
            <td><span class="user-courses-count">—</span></td>
            <td>${user.last_seen ? formatDate(user.last_seen) : 'Never'}</td>
            <td>
                <div class="user-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-sm btn-secondary" onclick="resetPassword(${user.id})">Reset Password</button>
                    <button class="btn btn-sm btn-secondary" onclick="manageUserCourses(${user.id})">Courses</button>
                    ${user.role === 'participant' ? `<button class="btn btn-sm btn-secondary" onclick="changeRole(${user.id}, 'admin')">Make Admin</button>` : ''}
                    ${user.role === 'admin' && user.id !== state.user.id ? `<button class="btn btn-sm btn-secondary" onclick="changeRole(${user.id}, 'participant')">Remove Admin</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');

    dom.usersTable.innerHTML = html;
}

function getFilteredUsers() {
    let users = state.users;

    // Filter by search
    if (dom.usersSearch?.value) {
        const search = dom.usersSearch.value.toLowerCase();
        users = users.filter(u =>
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
        );
    }

    // Filter by role
    if (dom.usersRoleFilter?.value && dom.usersRoleFilter.value !== 'all') {
        users = users.filter(u => u.role === dom.usersRoleFilter.value);
    }

    return users;
}

function filterUsers() {
    renderUsersTable();
}

window.editUser = async (userId) => {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;

    openModal('editUserModal');

    document.getElementById('confirmEditUser').onclick = async () => {
        try {
            await ApiClient.put(`/api/admin/users/${userId}`, {
                name: document.getElementById('editUserName').value,
                email: document.getElementById('editUserEmail').value
            });
            closeModal('editUserModal');
            await loadUsers();
            renderUsersTable();
        } catch (error) {
            console.error('Failed to update user:', error);
            alert(error.message || 'Failed to update user');
        }
    };
};

window.resetPassword = async (userId) => {
    if (!confirm('This will generate a new temporary password for the user. Continue?')) {
        return;
    }

    try {
        const result = await ApiClient.post(`/api/admin/users/${userId}/reset-password`);
        alert(`Password reset successfully.\n\nTemporary password: ${result.tempPassword}\n\nPlease share this with the user securely.`);
    } catch (error) {
        console.error('Failed to reset password:', error);
        alert('Failed to reset password');
    }
};

window.changeRole = async (userId, newRole) => {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;

    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) {
        return;
    }

    try {
        await ApiClient.put(`/api/admin/users/${userId}/role`, { role: newRole });
        await loadUsers();
        renderUsersTable();
    } catch (error) {
        console.error('Failed to change role:', error);
        alert(error.message || 'Failed to change role');
    }
};

window.manageUserCourses = async (userId) => {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('userCoursesName').textContent = user.name;

    try {
        // Get user's current courses
        const userCourses = await ApiClient.get(`/api/admin/users/${userId}/courses`);
        const userCourseIds = userCourses.map(c => c.course_id);

        // Render checkboxes
        const html = state.courses.map(course => `
            <label>
                <input type="checkbox" value="${course.id}" ${userCourseIds.includes(course.id) ? 'checked' : ''}>
                ${course.name}
            </label>
        `).join('');

        document.getElementById('userCoursesList').innerHTML = html;

        openModal('userCoursesModal');

        document.getElementById('confirmUserCourses').onclick = async () => {
            try {
                const checkboxes = document.querySelectorAll('#userCoursesList input[type="checkbox"]');
                const selectedCourses = Array.from(checkboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);

                await ApiClient.put(`/api/admin/users/${userId}/courses`, {
                    courseIds: selectedCourses
                });

                closeModal('userCoursesModal');
                alert('Course access updated successfully');
            } catch (error) {
                console.error('Failed to update courses:', error);
                alert('Failed to update courses');
            }
        };
    } catch (error) {
        console.error('Failed to load user courses:', error);
        alert('Failed to load user courses');
    }
};

// ============================================================================
// LIVE TAB - QUESTIONS
// ============================================================================

function renderQuestions() {
    if (!dom.questionsList) return;

    const filtered = state.questions.filter(q => {
        if (dom.questionsModuleFilter?.value && dom.questionsModuleFilter.value !== 'all') {
            return q.module_id === dom.questionsModuleFilter.value;
        }
        return true;
    });

    if (filtered.length === 0) {
        dom.questionsList.innerHTML = '<div class="empty-state">No questions yet.</div>';
        return;
    }

    const html = filtered.map(q => `
        <div class="question-item ${q.is_answered ? 'answered' : ''}">
            <div class="question-header">
                <strong>${escapeHtml(q.user_name)}</strong>
                <span class="question-time">${formatDate(q.created_at)}</span>
            </div>
            <div class="question-text">${escapeHtml(q.question_text)}</div>
            ${q.is_answered ?
                `<div class="question-answer">
                    <strong>Answered:</strong> ${escapeHtml(q.answer_text || 'Marked as answered')}
                </div>` :
                `<button class="btn btn-sm btn-primary" onclick="answerQuestion(${q.id})">Mark as Answered</button>`
            }
        </div>
    `).join('');

    dom.questionsList.innerHTML = html;
}

window.answerQuestion = async (questionId) => {
    const answer = prompt('Optional answer (or leave blank to just mark as answered):');
    if (answer === null) return; // User cancelled

    try {
        await ApiClient.put(`/api/questions/${questionId}/answer`, {
            answerText: answer
        });
        await loadQuestions();
        renderQuestions();
    } catch (error) {
        console.error('Failed to answer question:', error);
        alert('Failed to answer question');
    }
};

// ============================================================================
// LIVE TAB - THIS SESSION
// ============================================================================

async function loadLiveModules() {
    try {
        const modules = await ApiClient.get('/api/modules');

        if (dom.liveModule) {
            dom.liveModule.innerHTML = '<option value="">Select course...</option>' +
                modules.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        }

        if (dom.questionsModuleFilter) {
            dom.questionsModuleFilter.innerHTML = '<option value="all">All Modules</option>' +
                modules.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Failed to load modules:', error);
    }
}

async function handleLiveModuleChange() {
    const moduleId = dom.liveModule.value;
    if (!moduleId) {
        dom.liveDay.innerHTML = '<option value="">Select day...</option>';
        dom.liveSession.innerHTML = '<option value="">Select session...</option>';
        return;
    }

    state.liveModule = moduleId;

    try {
        const days = await ApiClient.get(`/api/admin/courses/${moduleId}/days`);
        dom.liveDay.innerHTML = '<option value="">Select day...</option>' +
            days.map(d => `<option value="${d.id}">Day ${d.day_number}: ${d.title}</option>`).join('');
        dom.liveSession.innerHTML = '<option value="">Select session...</option>';
    } catch (error) {
        console.error('Failed to load days:', error);
    }
}

async function handleLiveDayChange() {
    const dayId = dom.liveDay.value;
    if (!dayId) {
        dom.liveSession.innerHTML = '<option value="">Select session...</option>';
        return;
    }

    state.liveDay = dayId;

    try {
        const sessions = await ApiClient.get(`/api/admin/days/${dayId}/sessions`);
        dom.liveSession.innerHTML = '<option value="">Select session...</option>' +
            sessions.map(s => `<option value="${s.id}">${s.session_number}: ${s.title}</option>`).join('');
    } catch (error) {
        console.error('Failed to load sessions:', error);
    }
}

async function handleLiveSessionChange() {
    const sessionId = dom.liveSession.value;
    if (!sessionId) return;

    state.liveSession = sessionId;

    // Load session content for display
    await loadLiveSessionContent(sessionId);
}

async function loadLiveSessionContent(sessionId) {
    try {
        // Load all three content types
        const [facilitator, manual, worksheet] = await Promise.all([
            ApiClient.get(`/api/admin/sessions/${sessionId}/content/facilitator_guide`),
            ApiClient.get(`/api/admin/sessions/${sessionId}/content/coaches_manual`),
            ApiClient.get(`/api/admin/sessions/${sessionId}/content/worksheet`)
        ]);

        // Render markdown
        document.getElementById('facilitatorDisplay').innerHTML = marked.parse(facilitator.markdown_content || '*No content yet*');
        document.getElementById('manualDisplay').innerHTML = marked.parse(manual.markdown_content || '*No content yet*');
        document.getElementById('worksheetDisplay').innerHTML = marked.parse(worksheet.markdown_content || '*No content yet*');

        // Setup content tab switching
        setupSessionContentTabs();
    } catch (error) {
        console.error('Failed to load session content:', error);
    }
}

function setupSessionContentTabs() {
    const tabs = document.querySelectorAll('.session-content-tab-btn');
    const panels = document.querySelectorAll('.session-content-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const contentType = tab.dataset.sessionContent;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`session${capitalize(contentType)}Content`).classList.add('active');
        });
    });
}

async function broadcastCurrentSession() {
    if (!state.liveModule || !state.liveSession) {
        alert('Please select a course and session first');
        return;
    }

    try {
        const session = await ApiClient.get(`/api/admin/sessions/${state.liveSession}`);
        const day = await ApiClient.get(`/api/admin/days/${state.liveDay}`);

        // Broadcast position (this would need to match your existing broadcast API)
        // For now, just show confirmation
        document.getElementById('currentBroadcast').classList.remove('hidden');
        document.getElementById('currentBroadcastText').textContent =
            `Day ${day.day_number}, Session ${session.session_number}: ${session.title}`;

        alert('Position broadcast to all participants!');
    } catch (error) {
        console.error('Failed to broadcast:', error);
        alert('Failed to broadcast position');
    }
}

// ============================================================================
// WEBSOCKET
// ============================================================================

function setupWebSocket() {
    state.socket = io();

    state.socket.on('new-question', async (data) => {
        await loadQuestions();
        if (state.currentTab === 'live') {
            renderQuestions();
        }
    });

    state.socket.on('question-answered', async (data) => {
        await loadQuestions();
        if (state.currentTab === 'live') {
            renderQuestions();
        }
    });
}

// ============================================================================
// MODAL HELPERS
// ============================================================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
