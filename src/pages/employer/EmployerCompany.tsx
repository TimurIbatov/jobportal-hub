import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';

export default function EmployerCompany() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-foreground">Профиль компании</h1>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" />Информация о компании</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Название компании</Label><Input defaultValue={user?.company_name} className="rounded-xl mt-1" /></div>
          <div><Label>Контактное лицо</Label><Input defaultValue={`${user?.first_name} ${user?.last_name}`} className="rounded-xl mt-1" /></div>
          <div><Label>Email</Label><Input defaultValue={user?.email} disabled className="rounded-xl mt-1" /></div>
          <div><Label>Телефон</Label><Input defaultValue={user?.phone} className="rounded-xl mt-1" /></div>
        </CardContent>
      </Card>
    </div>
  );
}
