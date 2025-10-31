export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'participant';
  created_at: string;
  last_login: string | null;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface UserCourse {
  user_id: number;
  module_id: string;
  enrolled_at: string;
}

export interface CourseAccess {
  moduleId: string;
  moduleName: string;
  enrolled: boolean;
}
