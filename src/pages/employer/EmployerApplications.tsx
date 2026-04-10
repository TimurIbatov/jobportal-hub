import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getApplications, updateApplicationStatus } from '@/lib/api';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from '@/lib/constants';
import { Application, ApplicationStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function EmployerApplications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const load = async () => { if (user) setApplications(await getApplications({ employer_user_id: user.id })); };
  useEffect(() => { load(); }, [user]);

  const changeStatus = async (id: string, status: ApplicationStatus, app: Application) => {
    await updateApplicationStatus(id, status);
    await load();
    toast({ title: `Статус изменён на: ${APPLICATION_STATUS_LABELS[status]}` });
    // Navigate to chat with this applicant
    navigate('/employer/messages', { state: { contactUserId: app.user_id, vacancyId: app.vacancy_id } });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-foreground">Отклики кандидатов</h1>
      {applications.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground">Откликов пока нет</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <Card key={app.id} className="border-none shadow-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-foreground">{app.first_name} {app.last_name}</h3>
                    <p className="text-sm text-muted-foreground">Вакансия: {app.vacancy_title}</p>
                    {app.cover_letter && <p className="text-sm text-muted-foreground mt-2 italic">«{app.cover_letter}»</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${APPLICATION_STATUS_COLORS[app.status]}`}>{APPLICATION_STATUS_LABELS[app.status]}</span>
                    <div className="flex gap-1 flex-wrap">
                      {app.status !== 'reviewing' && <Button size="sm" variant="outline" className="rounded-lg text-xs" onClick={() => changeStatus(app.id, 'reviewing', app)}>Просмотрен</Button>}
                      {app.status !== 'accepted' && <Button size="sm" className="rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => changeStatus(app.id, 'accepted', app)}>Принять</Button>}
                      {app.status !== 'rejected' && <Button size="sm" variant="destructive" className="rounded-lg text-xs" onClick={() => changeStatus(app.id, 'rejected', app)}>Отклонить</Button>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
