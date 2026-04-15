import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAdminStats, getAllProfiles, getAllVacancies, getAllApplications, toggleVacancyActive, deleteVacancy, deleteApplication, updateApplicationStatus, updateProfile } from '@/lib/api';
import { formatSalary } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleLeft, Trash2, Pencil, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Profile, Vacancy, Application, ApplicationStatus } from '@/lib/types';

export default function AdminPage() {
  const { profile, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({ users: 0, vacancies: 0, applications: 0, activeVacancies: 0 });
  const [users, setUsers] = useState<Profile[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', role: '' as string });

  useEffect(() => {
    if (isInitialized && (!isAuthenticated || profile?.role !== 'admin')) navigate('/login');
  }, [isInitialized, isAuthenticated, profile]);

  const load = async () => {
    const [s, u, v, a] = await Promise.all([getAdminStats(), getAllProfiles(), getAllVacancies(), getAllApplications()]);
    setStats(s); setUsers(u); setVacancies(v); setApplications(a);
  };
  useEffect(() => { if (profile?.role === 'admin') load(); }, [profile]);

  if (!profile || profile.role !== 'admin') return null;

  const roleLabels: Record<string, string> = { job_seeker: 'Соискатель', employer: 'Работодатель', admin: 'Админ' };
  const statusLabels: Record<string, string> = { pending: 'Ожидает', reviewing: 'На рассмотрении', accepted: 'Принят', rejected: 'Отклонён' };
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const handleToggleVacancy = async (id: string, isActive: boolean) => {
    try {
      await toggleVacancyActive(id, !isActive);
      toast({ title: isActive ? 'Вакансия скрыта' : 'Вакансия активирована' });
      await load();
    } catch (e: any) { toast({ title: 'Ошибка', description: e.message, variant: 'destructive' }); }
  };

  const handleDeleteVacancy = async (id: string) => {
    if (!confirm('Удалить вакансию?')) return;
    try {
      await deleteVacancy(id);
      toast({ title: 'Вакансия удалена' });
      await load();
    } catch (e: any) { toast({ title: 'Ошибка', description: e.message, variant: 'destructive' }); }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Удалить отклик?')) return;
    try {
      await deleteApplication(id);
      toast({ title: 'Отклик удалён' });
      await load();
    } catch (e: any) { toast({ title: 'Ошибка', description: e.message, variant: 'destructive' }); }
  };

  const handleChangeStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, status);
      toast({ title: 'Статус обновлён' });
      await load();
    } catch (e: any) { toast({ title: 'Ошибка', description: e.message, variant: 'destructive' }); }
  };

  const openEditUser = (u: Profile) => {
    setEditUser(u);
    setEditForm({ first_name: u.first_name, last_name: u.last_name, role: u.role });
  };

  const handleSaveUser = async () => {
    if (!editUser) return;
    try {
      await updateProfile(editUser.user_id, { first_name: editForm.first_name, last_name: editForm.last_name });
      toast({ title: 'Профиль обновлён' });
      setEditUser(null);
      await load();
    } catch (e: any) { toast({ title: 'Ошибка', description: e.message, variant: 'destructive' }); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-foreground mb-8">Админ-панель JobPortal</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Пользователей</p><p className="text-3xl font-bold text-foreground">{stats.users}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Вакансий</p><p className="text-3xl font-bold text-foreground">{stats.vacancies}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Активных</p><p className="text-3xl font-bold text-foreground">{stats.activeVacancies}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Откликов</p><p className="text-3xl font-bold text-foreground">{stats.applications}</p></CardContent></Card>
        </div>
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Пользователи ({users.length})</TabsTrigger>
            <TabsTrigger value="vacancies">Вакансии ({vacancies.length})</TabsTrigger>
            <TabsTrigger value="applications">Отклики ({applications.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <div className="space-y-2">{users.map(u => (
              <Card key={u.id} className="border-none shadow-sm"><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground">{u.first_name} {u.last_name}</p>
                  <p className="text-sm text-muted-foreground">{roleLabels[u.role] || u.role}{u.company_name ? ` • ${u.company_name}` : ''}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => openEditUser(u)}><Pencil className="w-4 h-4 mr-1" />Редактировать</Button>
              </CardContent></Card>
            ))}</div>
          </TabsContent>
          <TabsContent value="vacancies">
            <div className="space-y-2">{vacancies.map(v => (
              <Card key={v.id} className="border-none shadow-sm"><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground">{v.title}</p>
                  <p className="text-sm text-muted-foreground">{v.company_name} • {v.applications_count || 0} откликов • {formatSalary(v.salary_min, v.salary_max)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${v.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{v.is_active ? 'Активна' : 'Скрыта'}</span>
                  <Button variant="outline" size="sm" onClick={() => handleToggleVacancy(v.id, v.is_active)} title={v.is_active ? 'Скрыть' : 'Активировать'}>
                    {v.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteVacancy(v.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent></Card>
            ))}</div>
          </TabsContent>
          <TabsContent value="applications">
            <div className="space-y-2">{applications.map(a => (
              <Card key={a.id} className="border-none shadow-sm"><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground">{a.first_name} {a.last_name}</p>
                  <p className="text-sm text-muted-foreground">Вакансия: {a.vacancy_title}</p>
                  {a.cover_letter && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{a.cover_letter}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Select value={a.status} onValueChange={(val) => handleChangeStatus(a.id, val as ApplicationStatus)}>
                    <SelectTrigger className="w-[160px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Ожидает</SelectItem>
                      <SelectItem value="reviewing">На рассмотрении</SelectItem>
                      <SelectItem value="accepted">Принят</SelectItem>
                      <SelectItem value="rejected">Отклонён</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteApplication(a.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent></Card>
            ))}</div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Редактировать пользователя</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Имя</Label><Input value={editForm.first_name} onChange={e => setEditForm(p => ({ ...p, first_name: e.target.value }))} className="mt-1" /></div>
            <div><Label>Фамилия</Label><Input value={editForm.last_name} onChange={e => setEditForm(p => ({ ...p, last_name: e.target.value }))} className="mt-1" /></div>
            <div><Label>Роль</Label><p className="text-sm text-muted-foreground mt-1">{roleLabels[editForm.role] || editForm.role}</p></div>
            <Button onClick={handleSaveUser} className="w-full">Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
