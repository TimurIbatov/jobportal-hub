import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CabinetSettings() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-foreground">Настройки профиля</h1>
      <Card>
        <CardHeader><CardTitle>Личные данные</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Имя</Label><Input defaultValue={user?.first_name} className="rounded-xl mt-1" /></div>
            <div><Label>Фамилия</Label><Input defaultValue={user?.last_name} className="rounded-xl mt-1" /></div>
          </div>
          <div><Label>Email</Label><Input defaultValue={user?.email} disabled className="rounded-xl mt-1" /></div>
          <div><Label>Телефон</Label><Input defaultValue={user?.phone} className="rounded-xl mt-1" /></div>
        </CardContent>
      </Card>
    </div>
  );
}
