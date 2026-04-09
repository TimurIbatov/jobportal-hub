export type UserRole = 'job_seeker' | 'employer' | 'admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone?: string;
  company_name?: string;
  created_at: string;
}

export interface Vacancy {
  id: number;
  company_id: number;
  company_name: string;
  title: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  employment_type: string;
  experience_level: string;
  location?: string;
  industry?: string;
  skills_required: string[];
  applications_count: number;
  views_count: number;
  is_active: boolean;
  created_at: string;
  user_id: number;
}

export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected';

export interface Application {
  id: number;
  vacancy_id: number;
  vacancy_title: string;
  company_name: string;
  job_seeker_id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: ApplicationStatus;
  cover_letter?: string;
  created_at: string;
}

export interface Resume {
  id: number;
  user_id: number;
  title: string;
  file_name?: string;
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  vacancy_id?: number;
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Company {
  id: number;
  user_id: number;
  name: string;
  description: string;
  location: string;
  industry: string;
  rating: number;
  active_vacancies: number;
}
