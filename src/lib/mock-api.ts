import { User, Vacancy, Application, Resume, Message, Company, UserRole, ApplicationStatus } from './types';

const USERS_KEY = 'jp_users';
const VACANCIES_KEY = 'jp_vacancies';
const APPLICATIONS_KEY = 'jp_applications';
const RESUMES_KEY = 'jp_resumes';
const MESSAGES_KEY = 'jp_messages';
const AUTH_KEY = 'jp_auth';

function get<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function set<T>(key: string, data: T[]) { localStorage.setItem(key, JSON.stringify(data)); }
function nextId(items: { id: number }[]): number { return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1; }

// ===== SEED DATA =====
export function seedIfEmpty() {
  if (get<User>(USERS_KEY).length > 0) return;

  const users: User[] = [
    { id: 1, email: 'seeker@example.com', role: 'job_seeker', first_name: 'Алексей', last_name: 'Иванов', phone: '+998901234567', created_at: new Date().toISOString() },
    { id: 2, email: 'employer@example.com', role: 'employer', first_name: 'Дильшод', last_name: 'Каримов', company_name: 'TechUz', phone: '+998901234568', created_at: new Date().toISOString() },
    { id: 3, email: 'admin@example.com', role: 'admin', first_name: 'Админ', last_name: 'Системы', created_at: new Date().toISOString() },
    { id: 4, email: 'hr@globalsoft.uz', role: 'employer', first_name: 'Нодира', last_name: 'Рахимова', company_name: 'GlobalSoft', created_at: new Date().toISOString() },
    { id: 5, email: 'hr@smartdev.uz', role: 'employer', first_name: 'Бахтиёр', last_name: 'Усманов', company_name: 'SmartDev', created_at: new Date().toISOString() },
  ];

  const vacancies: Vacancy[] = [
    { id: 1, company_id: 2, company_name: 'TechUz', title: 'Frontend-разработчик (React)', description: 'Разработка и поддержка веб-приложений на React/TypeScript. Опыт от 2 лет. Удалённая работа.', salary_min: 8000000, salary_max: 15000000, currency: 'UZS', employment_type: 'full_time', experience_level: 'mid', location: 'Ташкент', industry: 'IT', skills_required: ['React', 'TypeScript', 'CSS'], applications_count: 12, views_count: 245, is_active: true, created_at: '2025-01-15', user_id: 2 },
    { id: 2, company_id: 2, company_name: 'TechUz', title: 'Backend-разработчик (Node.js)', description: 'Проектирование и разработка REST API, микросервисов. PostgreSQL, Redis.', salary_min: 10000000, salary_max: 20000000, currency: 'UZS', employment_type: 'full_time', experience_level: 'senior', location: 'Ташкент', industry: 'IT', skills_required: ['Node.js', 'PostgreSQL', 'Docker'], applications_count: 8, views_count: 189, is_active: true, created_at: '2025-01-20', user_id: 2 },
    { id: 3, company_id: 4, company_name: 'GlobalSoft', title: 'UI/UX Дизайнер', description: 'Создание пользовательских интерфейсов для мобильных и веб-приложений. Figma, Adobe XD.', salary_min: 6000000, salary_max: 12000000, currency: 'UZS', employment_type: 'full_time', experience_level: 'mid', location: 'Ташкент', industry: 'IT', skills_required: ['Figma', 'UI/UX', 'Prototyping'], applications_count: 15, views_count: 320, is_active: true, created_at: '2025-02-01', user_id: 4 },
    { id: 4, company_id: 5, company_name: 'SmartDev', title: 'Менеджер по продажам', description: 'Активные продажи IT-решений. Работа с корпоративными клиентами. Бонусы за результат.', salary_min: 5000000, salary_max: 10000000, currency: 'UZS', employment_type: 'full_time', experience_level: 'entry', location: 'Самарканд', industry: 'Продажи', skills_required: ['CRM', 'B2B', 'Переговоры'], applications_count: 22, views_count: 412, is_active: true, created_at: '2025-02-10', user_id: 5 },
    { id: 5, company_id: 4, company_name: 'GlobalSoft', title: 'DevOps инженер', description: 'Автоматизация CI/CD, управление облачной инфраструктурой (AWS/GCP). Kubernetes, Terraform.', salary_min: 12000000, salary_max: 25000000, currency: 'UZS', employment_type: 'full_time', experience_level: 'senior', location: 'Удалённо', industry: 'IT', skills_required: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'], applications_count: 6, views_count: 156, is_active: true, created_at: '2025-02-15', user_id: 4 },
    { id: 6, company_id: 5, company_name: 'SmartDev', title: 'Стажёр-разработчик', description: 'Обучение и работа в команде разработки. Наставничество от опытных специалистов.', salary_min: 2000000, salary_max: 4000000, currency: 'UZS', employment_type: 'internship', experience_level: 'entry', location: 'Ташкент', industry: 'IT', skills_required: ['JavaScript', 'HTML', 'CSS'], applications_count: 35, views_count: 520, is_active: true, created_at: '2025-03-01', user_id: 5 },
  ];

  const applications: Application[] = [
    { id: 1, vacancy_id: 1, vacancy_title: 'Frontend-разработчик (React)', company_name: 'TechUz', job_seeker_id: 1, first_name: 'Алексей', last_name: 'Иванов', email: 'seeker@example.com', status: 'reviewing', cover_letter: 'Имею 3 года опыта работы с React.', created_at: '2025-02-01' },
    { id: 2, vacancy_id: 3, vacancy_title: 'UI/UX Дизайнер', company_name: 'GlobalSoft', job_seeker_id: 1, first_name: 'Алексей', last_name: 'Иванов', email: 'seeker@example.com', status: 'pending', cover_letter: 'Увлекаюсь дизайном.', created_at: '2025-02-05' },
  ];

  const resumes: Resume[] = [
    { id: 1, user_id: 1, title: 'Frontend Developer — Алексей Иванов', file_name: 'resume_alexey.pdf', created_at: '2025-01-10' },
  ];

  set(USERS_KEY, users);
  set(VACANCIES_KEY, vacancies);
  set(APPLICATIONS_KEY, applications);
  set(RESUMES_KEY, resumes);
  set(MESSAGES_KEY, []);
}

// ===== AUTH =====
export function getAuthUser(): { user: User; token: string } | null {
  try { const d = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); return d; } catch { return null; }
}

export function register(email: string, password: string, first_name: string, last_name: string, role: UserRole, phone?: string, company_name?: string): { user: User; token: string } {
  const users = get<User>(USERS_KEY);
  if (users.find(u => u.email === email)) throw new Error('Пользователь с таким email уже существует');
  const user: User = { id: nextId(users), email, role, first_name, last_name, phone, company_name, created_at: new Date().toISOString() };
  users.push(user);
  set(USERS_KEY, users);
  // Store password separately
  const passwords = JSON.parse(localStorage.getItem('jp_passwords') || '{}');
  passwords[email] = password;
  localStorage.setItem('jp_passwords', JSON.stringify(passwords));
  const auth = { user, token: 'tok_' + user.id };
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  return auth;
}

export function login(email: string, password: string): { user: User; token: string } {
  const users = get<User>(USERS_KEY);
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('Неверный email или пароль');
  // Demo accounts have password 'password123'
  const passwords = JSON.parse(localStorage.getItem('jp_passwords') || '{}');
  const storedPw = passwords[email];
  if (storedPw && storedPw !== password) throw new Error('Неверный email или пароль');
  // If no stored password (seed accounts), accept 'password123'
  if (!storedPw && password !== 'password123') throw new Error('Неверный email или пароль');
  const auth = { user, token: 'tok_' + user.id };
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  return auth;
}

export function logout() { localStorage.removeItem(AUTH_KEY); }

// ===== VACANCIES =====
export function getVacancies(filters?: { search?: string; employmentType?: string; experienceLevel?: string }): Vacancy[] {
  let v = get<Vacancy>(VACANCIES_KEY).filter(x => x.is_active);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    v = v.filter(x => x.title.toLowerCase().includes(q) || x.company_name.toLowerCase().includes(q) || x.description.toLowerCase().includes(q));
  }
  if (filters?.employmentType) v = v.filter(x => filters.employmentType!.split(',').includes(x.employment_type));
  if (filters?.experienceLevel) v = v.filter(x => filters.experienceLevel!.split(',').includes(x.experience_level));
  // Update applications_count
  const apps = get<Application>(APPLICATIONS_KEY);
  return v.map(vac => ({ ...vac, applications_count: apps.filter(a => a.vacancy_id === vac.id).length }));
}

export function getVacancy(id: number): Vacancy | undefined {
  const apps = get<Application>(APPLICATIONS_KEY);
  const v = get<Vacancy>(VACANCIES_KEY).find(x => x.id === id);
  if (v) v.applications_count = apps.filter(a => a.vacancy_id === v.id).length;
  return v;
}

export function getEmployerVacancies(userId: number): Vacancy[] {
  const apps = get<Application>(APPLICATIONS_KEY);
  return get<Vacancy>(VACANCIES_KEY).filter(v => v.user_id === userId).map(v => ({
    ...v, applications_count: apps.filter(a => a.vacancy_id === v.id).length
  }));
}

export function createVacancy(data: Partial<Vacancy> & { user_id: number; company_name: string }): Vacancy {
  const vacancies = get<Vacancy>(VACANCIES_KEY);
  const v: Vacancy = {
    id: nextId(vacancies), company_id: data.user_id, company_name: data.company_name,
    title: data.title || '', description: data.description || '',
    salary_min: data.salary_min, salary_max: data.salary_max, currency: 'UZS',
    employment_type: data.employment_type || 'full_time', experience_level: data.experience_level || 'entry',
    location: data.location, industry: data.industry, skills_required: data.skills_required || [],
    applications_count: 0, views_count: 0, is_active: true, created_at: new Date().toISOString(), user_id: data.user_id,
  };
  vacancies.push(v);
  set(VACANCIES_KEY, vacancies);
  return v;
}

export function updateVacancy(id: number, data: Partial<Vacancy>): Vacancy {
  const vacancies = get<Vacancy>(VACANCIES_KEY);
  const idx = vacancies.findIndex(v => v.id === id);
  if (idx === -1) throw new Error('Вакансия не найдена');
  vacancies[idx] = { ...vacancies[idx], ...data };
  set(VACANCIES_KEY, vacancies);
  return vacancies[idx];
}

// ===== APPLICATIONS =====
export function getApplications(filters?: { vacancy_id?: number; job_seeker_id?: number; employer_user_id?: number }): Application[] {
  let apps = get<Application>(APPLICATIONS_KEY);
  if (filters?.vacancy_id) apps = apps.filter(a => a.vacancy_id === filters.vacancy_id);
  if (filters?.job_seeker_id) apps = apps.filter(a => a.job_seeker_id === filters.job_seeker_id);
  if (filters?.employer_user_id) {
    const vacIds = get<Vacancy>(VACANCIES_KEY).filter(v => v.user_id === filters.employer_user_id).map(v => v.id);
    apps = apps.filter(a => vacIds.includes(a.vacancy_id));
  }
  return apps;
}

export function createApplication(vacancy_id: number, job_seeker_id: number, cover_letter?: string): Application {
  const apps = get<Application>(APPLICATIONS_KEY);
  if (apps.find(a => a.vacancy_id === vacancy_id && a.job_seeker_id === job_seeker_id)) throw new Error('Вы уже откликнулись на эту вакансию');
  const vacancy = getVacancy(vacancy_id);
  const users = get<User>(USERS_KEY);
  const user = users.find(u => u.id === job_seeker_id);
  const app: Application = {
    id: nextId(apps), vacancy_id, vacancy_title: vacancy?.title || '',
    company_name: vacancy?.company_name || '', job_seeker_id,
    first_name: user?.first_name || '', last_name: user?.last_name || '', email: user?.email || '',
    status: 'pending', cover_letter, created_at: new Date().toISOString(),
  };
  apps.push(app);
  set(APPLICATIONS_KEY, apps);
  return app;
}

export function updateApplicationStatus(id: number, status: ApplicationStatus) {
  const apps = get<Application>(APPLICATIONS_KEY);
  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) throw new Error('Отклик не найден');
  apps[idx].status = status;
  set(APPLICATIONS_KEY, apps);
  return apps[idx];
}

// ===== RESUMES =====
export function getResumes(userId: number): Resume[] { return get<Resume>(RESUMES_KEY).filter(r => r.user_id === userId); }
export function createResume(userId: number, title: string, fileName?: string): Resume {
  const resumes = get<Resume>(RESUMES_KEY);
  const r: Resume = { id: nextId(resumes), user_id: userId, title, file_name: fileName, created_at: new Date().toISOString() };
  resumes.push(r);
  set(RESUMES_KEY, resumes);
  return r;
}
export function deleteResume(id: number) { set(RESUMES_KEY, get<Resume>(RESUMES_KEY).filter(r => r.id !== id)); }

// ===== MESSAGES =====
export function getMessages(userId: number): Message[] {
  return get<Message>(MESSAGES_KEY).filter(m => m.sender_id === userId || m.recipient_id === userId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function getConversation(userId: number, otherUserId: number, vacancyId?: number): Message[] {
  return get<Message>(MESSAGES_KEY).filter(m =>
    ((m.sender_id === userId && m.recipient_id === otherUserId) || (m.sender_id === otherUserId && m.recipient_id === userId))
    && (!vacancyId || m.vacancy_id === vacancyId)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function sendMessage(senderId: number, senderName: string, recipientId: number, content: string, vacancyId?: number): Message {
  const msgs = get<Message>(MESSAGES_KEY);
  const m: Message = { id: nextId(msgs), sender_id: senderId, recipient_id: recipientId, vacancy_id: vacancyId, sender_name: senderName, content, is_read: false, created_at: new Date().toISOString() };
  msgs.push(m);
  set(MESSAGES_KEY, msgs);
  return m;
}

export function getContacts(userId: number): { userId: number; name: string; lastMessage: string; vacancyId?: number }[] {
  const msgs = getMessages(userId);
  const users = get<User>(USERS_KEY);
  const contactMap = new Map<string, { userId: number; name: string; lastMessage: string; vacancyId?: number }>();
  msgs.forEach(m => {
    const otherId = m.sender_id === userId ? m.recipient_id : m.sender_id;
    const key = `${otherId}-${m.vacancy_id || 0}`;
    const other = users.find(u => u.id === otherId);
    contactMap.set(key, { userId: otherId, name: other ? `${other.first_name} ${other.last_name}` : m.sender_name, lastMessage: m.content, vacancyId: m.vacancy_id });
  });
  return Array.from(contactMap.values());
}

// ===== COMPANIES =====
export function getCompanies(): Company[] {
  const users = get<User>(USERS_KEY).filter(u => u.role === 'employer');
  const vacancies = get<Vacancy>(VACANCIES_KEY);
  return users.map(u => ({
    id: u.id, user_id: u.id, name: u.company_name || u.first_name,
    description: `Компания ${u.company_name || u.first_name} — надёжный работодатель в Узбекистане.`,
    location: 'Ташкент', industry: 'IT & Технологии', rating: 4.5 + Math.random() * 0.5,
    active_vacancies: vacancies.filter(v => v.user_id === u.id && v.is_active).length,
  }));
}

// ===== ADMIN =====
export function getAllUsers(): User[] { return get<User>(USERS_KEY); }
export function deleteUser(id: number) { set(USERS_KEY, get<User>(USERS_KEY).filter(u => u.id !== id)); }
export function getAllVacancies(): Vacancy[] {
  const apps = get<Application>(APPLICATIONS_KEY);
  return get<Vacancy>(VACANCIES_KEY).map(v => ({ ...v, applications_count: apps.filter(a => a.vacancy_id === v.id).length }));
}
export function toggleVacancyActive(id: number) {
  const vs = get<Vacancy>(VACANCIES_KEY);
  const idx = vs.findIndex(v => v.id === id);
  if (idx !== -1) { vs[idx].is_active = !vs[idx].is_active; set(VACANCIES_KEY, vs); }
}
export function getAdminStats() {
  return {
    users: get<User>(USERS_KEY).length,
    vacancies: get<Vacancy>(VACANCIES_KEY).length,
    applications: get<Application>(APPLICATIONS_KEY).length,
    activeVacancies: get<Vacancy>(VACANCIES_KEY).filter(v => v.is_active).length,
  };
}
