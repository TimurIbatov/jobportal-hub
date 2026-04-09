import { Card, CardContent } from '@/components/ui/card';

export default function CabinetSaved() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-foreground">Сохранённые вакансии</h1>
      <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground">Сохранённых вакансий пока нет. Нажмите ★ на вакансии, чтобы сохранить.</p></CardContent></Card>
    </div>
  );
}
