import { supabase } from '@/integrations/supabase/client';
import type { Profile, Vacancy, Application, Resume, Message, Company, Service, UserService, ApplicationStatus } from './types';

// ===== PROFILES =====
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  return data as Profile | null;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').update(updates).eq('user_id', userId).select().single();
  if (error) throw new Error(error.message);
  return data as Profile;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return (data || []) as Profile[];
}

// ===== COMPANIES =====
export async function getCompanies(): Promise<Company[]> {
  const { data: companies } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
  if (!companies) return [];
  // Get active vacancy counts
  const { data: vacancies } = await supabase.from('vacancies').select('company_id').eq('is_active', true);
  return (companies as Company[]).map(c => ({
    ...c,
    active_vacancies: (vacancies || []).filter(v => v.company_id === c.id).length,
  }));
}

export async function getCompany(id: string): Promise<Company | null> {
  const { data } = await supabase.from('companies').select('*').eq('id', id).single();
  return data as Company | null;
}

export async function getCompanyByUserId(userId: string): Promise<Company | null> {
  const { data } = await supabase.from('companies').select('*').eq('user_id', userId).single();
  return data as Company | null;
}

export async function upsertCompany(company: Partial<Company> & { user_id: string; name: string }): Promise<Company> {
  const existing = await getCompanyByUserId(company.user_id);
  if (existing) {
    const { data, error } = await supabase.from('companies').update(company).eq('id', existing.id).select().single();
    if (error) throw new Error(error.message);
    return data as Company;
  }
  const { data, error } = await supabase.from('companies').insert(company).select().single();
  if (error) throw new Error(error.message);
  return data as Company;
}

// ===== VACANCIES =====
export async function getVacancies(filters?: {
  search?: string;
  employmentType?: string;
  experienceLevel?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
}): Promise<Vacancy[]> {
  let query = supabase.from('vacancies').select(`
    *,
    profiles!vacancies_user_id_fkey(first_name, last_name, company_name),
    companies(name),
    applications(id)
  `).eq('is_active', true).order('created_at', { ascending: false });

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  if (filters?.employmentType) {
    const types = filters.employmentType.split(',');
    query = query.in('employment_type', types);
  }
  if (filters?.experienceLevel) {
    const levels = filters.experienceLevel.split(',');
    query = query.in('experience_level', levels);
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  if (filters?.salaryMin) {
    query = query.gte('salary_max', filters.salaryMin);
  }
  if (filters?.salaryMax) {
    query = query.lte('salary_min', filters.salaryMax);
  }

  const { data } = await query;
  return (data || []).map((v: any) => ({
    ...v,
    company_name: v.companies?.name || v.profiles?.company_name || v.profiles?.first_name || '',
    employer_first_name: v.profiles?.first_name,
    employer_last_name: v.profiles?.last_name,
    applications_count: v.applications?.length || 0,
    profiles: undefined,
    companies: undefined,
    applications: undefined,
  })) as Vacancy[];
}

export async function getVacancy(id: string): Promise<Vacancy | null> {
  const { data } = await supabase.from('vacancies').select(`
    *,
    profiles!vacancies_user_id_fkey(first_name, last_name, company_name),
    companies(name),
    applications(id)
  `).eq('id', id).single();
  if (!data) return null;
  const v = data as any;
  return {
    ...v,
    company_name: v.companies?.name || v.profiles?.company_name || v.profiles?.first_name || '',
    employer_first_name: v.profiles?.first_name,
    employer_last_name: v.profiles?.last_name,
    applications_count: v.applications?.length || 0,
    profiles: undefined,
    companies: undefined,
    applications: undefined,
  } as Vacancy;
}

export async function getEmployerVacancies(userId: string): Promise<Vacancy[]> {
  const { data } = await supabase.from('vacancies').select(`
    *,
    profiles!vacancies_user_id_fkey(first_name, last_name, company_name),
    companies(name),
    applications(id)
  `).eq('user_id', userId).order('created_at', { ascending: false });
  return (data || []).map((v: any) => ({
    ...v,
    company_name: v.companies?.name || v.profiles?.company_name || v.profiles?.first_name || '',
    applications_count: v.applications?.length || 0,
    profiles: undefined,
    companies: undefined,
    applications: undefined,
  })) as Vacancy[];
}

export async function getAllVacancies(): Promise<Vacancy[]> {
  const { data } = await supabase.from('vacancies').select(`
    *,
    profiles!vacancies_user_id_fkey(first_name, last_name, company_name),
    companies(name),
    applications(id)
  `).order('created_at', { ascending: false });
  return (data || []).map((v: any) => ({
    ...v,
    company_name: v.companies?.name || v.profiles?.company_name || v.profiles?.first_name || '',
    applications_count: v.applications?.length || 0,
    profiles: undefined,
    companies: undefined,
    applications: undefined,
  })) as Vacancy[];
}

export async function createVacancy(vacancy: {
  user_id: string;
  company_id?: string;
  title: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  employment_type: string;
  experience_level: string;
  location?: string;
  industry?: string;
  skills_required?: string[];
}): Promise<Vacancy> {
  const { data, error } = await supabase.from('vacancies').insert(vacancy).select().single();
  if (error) throw new Error(error.message);
  return data as Vacancy;
}

export async function updateVacancy(id: string, updates: Partial<Vacancy>): Promise<Vacancy> {
  const { data, error } = await supabase.from('vacancies').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data as Vacancy;
}

export async function toggleVacancyActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from('vacancies').update({ is_active: isActive }).eq('id', id);
  if (error) throw new Error(error.message);
}

// ===== APPLICATIONS =====
export async function getApplications(filters?: {
  vacancy_id?: string;
  user_id?: string;
  employer_user_id?: string;
}): Promise<Application[]> {
  if (filters?.employer_user_id) {
    // Get employer's vacancy IDs first
    const { data: vacancies } = await supabase.from('vacancies').select('id').eq('user_id', filters.employer_user_id);
    const vacIds = (vacancies || []).map(v => v.id);
    if (vacIds.length === 0) return [];
    const { data } = await supabase.from('applications').select(`
      *,
      vacancies(title, user_id),
      profiles!applications_user_id_fkey(first_name, last_name, company_name)
    `).in('vacancy_id', vacIds).order('created_at', { ascending: false });
    return (data || []).map((a: any) => ({
      ...a,
      vacancy_title: a.vacancies?.title || '',
      first_name: a.profiles?.first_name || '',
      last_name: a.profiles?.last_name || '',
      vacancies: undefined,
      profiles: undefined,
    })) as Application[];
  }

  let query = supabase.from('applications').select(`
    *,
    vacancies(title, user_id),
    profiles!applications_user_id_fkey(first_name, last_name, company_name)
  `).order('created_at', { ascending: false });

  if (filters?.vacancy_id) query = query.eq('vacancy_id', filters.vacancy_id);
  if (filters?.user_id) query = query.eq('user_id', filters.user_id);

  const { data } = await query;
  return (data || []).map((a: any) => ({
    ...a,
    vacancy_title: a.vacancies?.title || '',
    first_name: a.profiles?.first_name || '',
    last_name: a.profiles?.last_name || '',
    vacancies: undefined,
    profiles: undefined,
  })) as Application[];
}

export async function getApplicationForVacancy(vacancyId: string, userId: string): Promise<Application | null> {
  const { data } = await supabase.from('applications').select('*').eq('vacancy_id', vacancyId).eq('user_id', userId).single();
  return data as Application | null;
}

export async function createApplication(vacancyId: string, userId: string, coverLetter?: string): Promise<Application> {
  const { data, error } = await supabase.from('applications').insert({
    vacancy_id: vacancyId,
    user_id: userId,
    cover_letter: coverLetter || null,
  }).select().single();
  if (error) {
    if (error.code === '23505') throw new Error('Вы уже откликнулись на эту вакансию');
    throw new Error(error.message);
  }
  return data as Application;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application> {
  const { data, error } = await supabase.from('applications').update({ status }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data as Application;
}

// ===== RESUMES =====
export async function getResumes(userId: string): Promise<Resume[]> {
  const { data } = await supabase.from('resumes').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return (data || []) as Resume[];
}

export async function createResume(userId: string, title: string, fileName?: string, fileUrl?: string): Promise<Resume> {
  const { data, error } = await supabase.from('resumes').insert({
    user_id: userId,
    title,
    file_name: fileName || null,
    file_url: fileUrl || null,
  }).select().single();
  if (error) throw new Error(error.message);
  return data as Resume;
}

export async function deleteResume(id: string): Promise<void> {
  const { error } = await supabase.from('resumes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function uploadResumeFile(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('resumes').upload(path, file);
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('resumes').getPublicUrl(path);
  return data.publicUrl;
}

export async function getResumesByApplicant(applicantUserId: string): Promise<Resume[]> {
  const { data } = await supabase.from('resumes').select('*').eq('user_id', applicantUserId).order('created_at', { ascending: false });
  return (data || []) as Resume[];
}

// ===== MESSAGES =====
export async function getMessages(userId: string): Promise<Message[]> {
  const { data } = await supabase.from('messages').select(`
    *,
    sender:profiles!messages_sender_id_fkey(first_name, last_name)
  `).or(`sender_id.eq.${userId},recipient_id.eq.${userId}`).order('created_at', { ascending: true });
  return (data || []).map((m: any) => ({
    ...m,
    sender_name: m.sender ? `${m.sender.first_name} ${m.sender.last_name}` : '',
    sender: undefined,
  })) as Message[];
}

export async function getConversation(userId: string, otherUserId: string, vacancyId?: string): Promise<Message[]> {
  let query = supabase.from('messages').select(`
    *,
    sender:profiles!messages_sender_id_fkey(first_name, last_name)
  `).or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`);
  
  if (vacancyId) query = query.eq('vacancy_id', vacancyId);
  query = query.order('created_at', { ascending: true });

  const { data } = await query;
  return (data || []).map((m: any) => ({
    ...m,
    sender_name: m.sender ? `${m.sender.first_name} ${m.sender.last_name}` : '',
    sender: undefined,
  })) as Message[];
}

export async function sendMessage(senderId: string, recipientId: string, content: string, vacancyId?: string): Promise<Message> {
  const { data, error } = await supabase.from('messages').insert({
    sender_id: senderId,
    recipient_id: recipientId,
    content,
    vacancy_id: vacancyId || null,
  }).select().single();
  if (error) throw new Error(error.message);
  return data as Message;
}

export async function getContacts(userId: string): Promise<{ userId: string; name: string; lastMessage: string; vacancyId?: string }[]> {
  const msgs = await getMessages(userId);
  const profileIds = new Set<string>();
  msgs.forEach(m => {
    profileIds.add(m.sender_id === userId ? m.recipient_id : m.sender_id);
  });
  
  const { data: profiles } = await supabase.from('profiles').select('user_id, first_name, last_name').in('user_id', Array.from(profileIds));
  const profileMap = new Map((profiles || []).map(p => [p.user_id, `${p.first_name} ${p.last_name}`]));
  
  const contactMap = new Map<string, { userId: string; name: string; lastMessage: string; vacancyId?: string }>();
  msgs.forEach(m => {
    const otherId = m.sender_id === userId ? m.recipient_id : m.sender_id;
    const key = `${otherId}-${m.vacancy_id || '0'}`;
    contactMap.set(key, {
      userId: otherId,
      name: profileMap.get(otherId) || 'Неизвестный',
      lastMessage: m.content,
      vacancyId: m.vacancy_id || undefined,
    });
  });
  return Array.from(contactMap.values());
}

// ===== SAVED VACANCIES =====
export async function getSavedVacancies(userId: string): Promise<Vacancy[]> {
  const { data } = await supabase.from('saved_vacancies').select(`
    vacancy_id,
    vacancies(
      *,
      profiles!vacancies_user_id_fkey(first_name, last_name, company_name),
      companies(name),
      applications(id)
    )
  `).eq('user_id', userId);
  return (data || []).map((sv: any) => {
    const v = sv.vacancies;
    if (!v) return null;
    return {
      ...v,
      company_name: v.companies?.name || v.profiles?.company_name || v.profiles?.first_name || '',
      applications_count: v.applications?.length || 0,
      profiles: undefined,
      companies: undefined,
      applications: undefined,
    };
  }).filter(Boolean) as Vacancy[];
}

export async function saveVacancy(userId: string, vacancyId: string): Promise<void> {
  const { error } = await supabase.from('saved_vacancies').insert({ user_id: userId, vacancy_id: vacancyId });
  if (error && error.code !== '23505') throw new Error(error.message);
}

export async function unsaveVacancy(userId: string, vacancyId: string): Promise<void> {
  const { error } = await supabase.from('saved_vacancies').delete().eq('user_id', userId).eq('vacancy_id', vacancyId);
  if (error) throw new Error(error.message);
}

export async function isVacancySaved(userId: string, vacancyId: string): Promise<boolean> {
  const { data } = await supabase.from('saved_vacancies').select('id').eq('user_id', userId).eq('vacancy_id', vacancyId).single();
  return !!data;
}

// ===== SERVICES =====
export async function getServices(): Promise<Service[]> {
  const { data } = await supabase.from('services').select('*').eq('is_active', true).order('price', { ascending: true });
  return (data || []) as Service[];
}

export async function purchaseService(userId: string, serviceId: string, durationDays: number): Promise<UserService> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);
  const { data, error } = await supabase.from('user_services').insert({
    user_id: userId,
    service_id: serviceId,
    expires_at: expiresAt.toISOString(),
  }).select().single();
  if (error) throw new Error(error.message);
  return data as UserService;
}

export async function getUserServices(userId: string): Promise<UserService[]> {
  const { data } = await supabase.from('user_services').select(`*, services(*)`).eq('user_id', userId).order('created_at', { ascending: false });
  return (data || []).map((us: any) => ({
    ...us,
    service: us.services,
    services: undefined,
  })) as UserService[];
}

// ===== ADMIN =====
export async function getAdminStats() {
  const [profiles, vacancies, applications] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('vacancies').select('id, is_active', { count: 'exact', head: false }),
    supabase.from('applications').select('id', { count: 'exact', head: true }),
  ]);
  const { data: allVacancies } = await supabase.from('vacancies').select('is_active');
  return {
    users: profiles.count || 0,
    vacancies: vacancies.count || 0,
    applications: applications.count || 0,
    activeVacancies: (allVacancies || []).filter(v => v.is_active).length,
  };
}

export async function adminDeleteUser(userId: string): Promise<void> {
  // Delete profile (cascade will handle auth.users through trigger)
  const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
}
