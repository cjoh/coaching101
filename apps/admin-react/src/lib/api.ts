import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';
import type {
  Course,
  Day,
  Session,
  SessionContent,
  CreateCourseData,
  UpdateCourseData,
  CreateDayData,
  UpdateDayData,
  CreateSessionData,
  UpdateSessionData,
} from '@/types/course';
import type { AdminUser, UpdateUserData, UserCourse, CourseAccess } from '@/types/user';
import type { Question, SubmitQuestionData, AnswerQuestionData } from '@/types/question';

const API_BASE = '/api';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  const fetchOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  const response = await fetch(url, fetchOptions);

  let responseBody: any = null;
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

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
    const message = responseBody?.message || `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, responseBody);
  }

  return responseBody as T;
}

// Auth API
export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<void> {
    return request<void>('/auth/logout', { method: 'POST' });
  },

  async getCurrentUser(): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/me');
  },

  async getModules(): Promise<any[]> {
    return request<any[]>('/modules');
  },
};

// Courses API
export const coursesApi = {
  async getAll(): Promise<Course[]> {
    return request<Course[]>('/admin/courses');
  },

  async getById(id: number): Promise<Course> {
    return request<Course>(`/admin/courses/${id}`);
  },

  async create(data: CreateCourseData): Promise<Course> {
    return request<Course>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: UpdateCourseData): Promise<Course> {
    return request<Course>(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    return request<void>(`/admin/courses/${id}`, { method: 'DELETE' });
  },

  async generateManual(id: number): Promise<Blob> {
    const response = await fetch(`${API_BASE}/admin/courses/${id}/generate-manual`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to generate manual');
    }

    return response.blob();
  },
};

// Days API
export const daysApi = {
  async getByCourseId(courseId: number): Promise<Day[]> {
    return request<Day[]>(`/admin/courses/${courseId}/days`);
  },

  async getById(id: number): Promise<Day> {
    return request<Day>(`/admin/days/${id}`);
  },

  async update(id: number, data: UpdateDayData): Promise<Day> {
    return request<Day>(`/admin/days/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Sessions API
export const sessionsApi = {
  async getByDayId(dayId: number): Promise<Session[]> {
    return request<Session[]>(`/admin/days/${dayId}/sessions`);
  },

  async getById(id: number): Promise<Session> {
    return request<Session>(`/admin/sessions/${id}`);
  },

  async create(dayId: number, data: CreateSessionData): Promise<Session> {
    return request<Session>(`/admin/days/${dayId}/sessions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: UpdateSessionData): Promise<Session> {
    return request<Session>(`/admin/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    return request<void>(`/admin/sessions/${id}`, { method: 'DELETE' });
  },

  async getContent(sessionId: number, type: 'facilitator_guide' | 'coaches_manual' | 'worksheet'): Promise<string> {
    const response = await request<{ content: string }>(`/admin/sessions/${sessionId}/content/${type}`);
    return response.content;
  },

  async updateContent(
    sessionId: number,
    type: 'facilitator_guide' | 'coaches_manual' | 'worksheet',
    content: string
  ): Promise<void> {
    return request<void>(`/admin/sessions/${sessionId}/content/${type}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },
};

// Users API
export const usersApi = {
  async getAll(): Promise<AdminUser[]> {
    return request<AdminUser[]>('/admin/users');
  },

  async update(id: number, data: UpdateUserData): Promise<AdminUser> {
    return request<AdminUser>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async resetPassword(id: number): Promise<{ tempPassword: string }> {
    return request<{ tempPassword: string }>(`/admin/users/${id}/reset-password`, {
      method: 'POST',
    });
  },

  async changeRole(id: number, role: 'admin' | 'participant'): Promise<void> {
    return request<void>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  async getCourses(id: number): Promise<UserCourse[]> {
    return request<UserCourse[]>(`/admin/users/${id}/courses`);
  },

  async updateCourses(id: number, moduleIds: string[]): Promise<void> {
    return request<void>(`/admin/users/${id}/courses`, {
      method: 'PUT',
      body: JSON.stringify({ moduleIds }),
    });
  },
};

// Questions API
export const questionsApi = {
  async getAll(): Promise<Question[]> {
    return request<Question[]>('/questions/all');
  },

  async getByModuleId(moduleId: string): Promise<Question[]> {
    return request<Question[]>(`/questions/${moduleId}`);
  },

  async submit(data: SubmitQuestionData): Promise<Question> {
    return request<Question>('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async answer(questionId: number, data: AnswerQuestionData): Promise<void> {
    return request<void>(`/questions/${questionId}/answer`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Broadcast API
export const broadcastApi = {
  async getPosition(moduleId: string): Promise<any> {
    return request(`/broadcast-position/${moduleId}`);
  },

  async updatePosition(data: {
    moduleId: string;
    day: number;
    sectionId: string;
    sectionLabel: string;
    facilitatorGuideFile?: string;
  }): Promise<void> {
    return request('/broadcast-position', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Facilitator Guide API
export const facilitatorGuideApi = {
  async get(moduleId: string, day: number, section?: string): Promise<string> {
    const params = new URLSearchParams({ day: day.toString() });
    if (section) params.append('section', section);
    return request(`/facilitator-guide/${moduleId}?${params}`);
  },
};

// Combined API object
export const api = {
  auth: authApi,
  courses: coursesApi,
  days: daysApi,
  sessions: sessionsApi,
  users: usersApi,
  questions: questionsApi,
  broadcast: broadcastApi,
  facilitatorGuide: facilitatorGuideApi,
};

export { ApiError };
export default api;
