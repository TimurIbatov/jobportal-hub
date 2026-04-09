import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createVacancy } from '@/lib/mock-api';
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

export default function EmployerNewVacancy() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: '', description: '', salary_min: '', salary_max: '',
    employment_type: 'full_time', experience_level: 'mid', location: '', skills: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    createVacancy({
      title: form.title, description: form.description,
      salary_min: form.salary_min ? Number(form.salary_min) : undefined,
      salary_max: form.salary_max ? Number(form.salary_max) : undefined,
      employment_type: form.employment_type, experience_level: form.experience_level,
      location: form.location, skills_required: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      user_id: user.id, company_name: user.company_name || user.first_name,
    });
    toast({ title: 'Вакансия создана!' });
    navigate('/employer/vacancies');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-foreground">Новая вакансия</h1>
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><Label>Название</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="rounded-xl mt-1" required /></div>
            <div><Label>Описание</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="rounded-xl mt-1" rows={5} required /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Зарплата от (UZS)</Label><Input type="number" value={form.salary_min} onChange={e => setForm(p => ({ ...p, salary_min: e.target.value }))} className="rounded-xl mt-1" /></div>
              <div><Label>Зарплата до (UZS)</Label><Input type="number" value={form.salary_max} onChange={e => setForm(p => ({ ...p, salary_max: e.target.value }))} className="rounded-xl mt-1" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Тип занятости</Label>
                <select value={form.employment_type} onChange={e => setForm(p => ({ ...p, employment_type: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground mt-1">
                  {Object.entries(EMPLOYMENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select></div>
              <div><Label>Уровень опыта</Label>
                <select value={form.experience_level} onChange={e => setForm(p => ({ ...p, experience_level: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground mt-1">
                  {Object.entries(EXPERIENCE_LEVELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select></div>
            </div>
            <div><Label>Город</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="rounded-xl mt-1" /></div>
            <div><Label>Навыки (через запятую)</Label><Input value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} placeholder="React, TypeScript, Node.js" className="rounded-xl mt-1" /></div>
            <Button type="submit" className="h-12 px-8 rounded-xl font-black text-lg">Опубликовать</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
