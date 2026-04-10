import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAdminStats, getAllProfiles, getAllVacancies, toggleVacancyActive } from '@/lib/api';
import { formatSalary } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Briefcase, Trash2, ToggleLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { profile, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({ users: 0, vacancies: 0, applications: 0, activeVacancies: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);

  useEffect(() => {
    if (isInitialized && (!isAuthenticated || profile?.role !== 'admin')) navigate('/login');
  }, [isInitialized, isAuthenticated, profile]);

  const load = async () => {
    setStats(await getAdminStats());
    setUsers(await getAllProfiles());
    setVacancies(await getAllVacancies());
  };
  useEffect(() => { if (profile?.role === 'admin') load(); }, [profile]);

  if (!profile || profile.role !== 'admin') return null;

  const roleLabels: Record<string, string> = { job_seeker: 'Соискатель', employer: 'Работодатель', admin: 'Админ' };

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
          <TabsList className="mb-6"><TabsTrigger value="users">Пользователи</TabsTrigger><TabsTrigger value="vacancies">Вакансии</TabsTrigger></TabsList>
          <TabsContent value="users">
            <div className="space-y-2">{users.map(u => (
              <Card key={u.id} className="border-none shadow-sm"><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div><p className="font-bold text-foreground">{u.first_name} {u.last_name}</p><p className="text-sm text-muted-foreground">{roleLabels[u.role] || u.role}</p></div>
              </CardContent></Card>
            ))}</div>
          </TabsContent>
          <TabsContent value="vacancies">
            <div className="space-y-2">{vacancies.map(v => (
              <Card key={v.id} className="border-none shadow-sm"><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div><p className="font-bold text-foreground">{v.title}</p><p className="text-sm text-muted-foreground">{v.company_name} • {v.applications_count || 0} откликов</p></div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${v.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{v.is_active ? 'Активна' : 'Закрыта'}</span>
                  <Button variant="outline" size="sm" onClick={async () => { await toggleVacancyActive(v.id, !v.is_active); await load(); }}><ToggleLeft className="w-4 h-4" /></Button>
                </div>
              </CardContent></Card>
            ))}</div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
