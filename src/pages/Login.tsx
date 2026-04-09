import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Loader2, Briefcase } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { email: 'seeker@example.com', password: 'password123', label: 'Соискатель' },
  { email: 'employer@example.com', password: 'password123', label: 'Работодатель' },
  { email: 'admin@example.com', password: 'password123', label: 'Админ' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      navigate(user.role === 'employer' ? '/employer' : user.role === 'admin' ? '/admin' : '/cabinet');
    } catch {}
  };

  const quickLogin = async (account: typeof DEMO_ACCOUNTS[0]) => {
    try {
      const user = await login(account.email, account.password);
      navigate(user.role === 'employer' ? '/employer' : user.role === 'admin' ? '/admin' : '/cabinet');
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center bg-card pt-10 pb-4">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Briefcase className="w-9 h-9" />
                </div>
              </div>
              <CardTitle className="text-3xl font-black text-foreground tracking-tight">Вход в JobPortal</CardTitle>
              <CardDescription className="text-muted-foreground mt-3 font-medium px-6">Роль определяется автоматически по вашему аккаунту</CardDescription>
            </CardHeader>
            <CardContent className="bg-card px-8 pb-10 pt-6">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex gap-3 border border-destructive/20 items-center">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" /><span className="font-semibold">{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-foreground ml-1">Электронная почта</Label>
                  <Input id="email" type="email" placeholder="example@mail.uz" className="h-14 rounded-xl px-5 text-lg" value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-bold text-foreground ml-1">Пароль</Label>
                  <Input id="password" type="password" placeholder="••••••••" className="h-14 rounded-xl px-5 text-lg" value={password} onChange={e => setPassword(e.target.value)} required disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full h-14 text-xl font-black bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'ВОЙТИ'}
                </Button>
              </form>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-center text-muted-foreground font-medium mb-4">Нет аккаунта? <Link to="/register" className="text-primary font-black hover:underline">Зарегистрироваться</Link></p>
                <p className="text-xs text-center text-muted-foreground mb-3 font-bold uppercase tracking-widest">Демо-входы</p>
                <div className="grid grid-cols-3 gap-2">
                  {DEMO_ACCOUNTS.map(a => (
                    <button key={a.email} type="button" onClick={() => quickLogin(a)} disabled={isLoading} className="px-3 py-2.5 text-xs font-bold rounded-lg border border-border bg-secondary hover:bg-card hover:border-primary transition-all text-muted-foreground hover:text-primary">{a.label}</button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
