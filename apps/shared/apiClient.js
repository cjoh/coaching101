(function () {
    const API_BASE = '/api';

    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    function buildUrl(path) {
        if (path.startsWith('http')) {
            return path;
        }
        return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
    }

    async function request(path, options = {}) {
        const fetchOptions = {
            method: 'GET',
            credentials: 'include',
            headers: { ...defaultHeaders },
            ...options
        };

        if (options.headers) {
            fetchOptions.headers = {
                ...defaultHeaders,
                ...options.headers
            };
        }

        if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
            fetchOptions.body = JSON.stringify(fetchOptions.body);
        }

        const response = await fetch(buildUrl(path), fetchOptions);

        let responseBody = null;
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');

        if (isJson) {
            try {
                responseBody = await response.json();
            } catch (error) {
                console.warn('Failed to parse JSON response:', error);
            }
        } else if (response.status !== 204) {
            responseBody = await response.text();
        }

        if (!response.ok) {
            const error = new Error(
                responseBody && responseBody.message
                    ? responseBody.message
                    : `Request failed with status ${response.status}`
            );
            error.status = response.status;
            error.data = responseBody;
            throw error;
        }

        return responseBody;
    }

    const api = {
        async register({ name, email, password }) {
            return request('/auth/register', {
                method: 'POST',
                body: { name, email, password }
            });
        },
        async login({ email, password }) {
            return request('/auth/login', {
                method: 'POST',
                body: { email, password }
            });
        },
        async logout() {
            return request('/auth/logout', {
                method: 'POST'
            });
        },
        async me() {
            return request('/auth/me');
        },
        async listModules() {
            return request('/modules');
        },
        async getSections(moduleId, day) {
            const params = day ? `?day=${day}` : '';
            return request(`/modules/${moduleId}/sections${params}`);
        },
        async fetchProgress(moduleId) {
            return request(`/progress/${moduleId}`);
        },
        async saveProgress(moduleId, { state, progress }) {
            return request(`/progress/${moduleId}`, {
                method: 'PUT',
                body: { state, progress }
            });
        },
        async logEngagement(moduleId, { eventType, metadata }) {
            return request(`/engagement/${moduleId}`, {
                method: 'POST',
                body: { eventType, metadata }
            });
        },
        async updatePresence(moduleId, payload) {
            return request('/session/presence', {
                method: 'POST',
                body: { moduleId, ...payload }
            });
        },
        async adminActiveSessions() {
            return request('/admin/active-sessions');
        },
        async adminProgress() {
            return request('/admin/progress');
        },
        async adminEngagement() {
            return request('/admin/engagement');
        },
        async getBroadcastPosition(moduleId) {
            return request(`/broadcast-position/${moduleId}`);
        },
        async broadcastPosition({ moduleId, day, sectionId, sectionLabel, facilitatorGuideFile }) {
            return request('/broadcast-position', {
                method: 'POST',
                body: { moduleId, day, sectionId, sectionLabel, facilitatorGuideFile }
            });
        },
        async getFacilitatorGuide(moduleId, day, section) {
            const params = new URLSearchParams({ day });
            if (section) params.append('section', section);
            return request(`/facilitator-guide/${moduleId}?${params}`);
        },
        async submitQuestion({ moduleId, questionText }) {
            return request('/questions', {
                method: 'POST',
                body: { moduleId, questionText }
            });
        },
        async getQuestions(moduleId) {
            return request(`/questions/${moduleId}`);
        },
        async answerQuestion(questionId, answerText) {
            return request(`/questions/${questionId}/answer`, {
                method: 'PUT',
                body: { answerText }
            });
        }
    };

    window.ApiClient = api;
})();
