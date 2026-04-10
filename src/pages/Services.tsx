import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getServices, purchaseService } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Service } from '@/lib/types';
import { formatSalary } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Zap, Shield, Rocket, Target, Award } from 'lucide-react';

const icons = [Sparkles, Zap, Shield, Rocket, Target, Award];
const colors = ['text-yellow-500', 'text-primary', 'text-green-600', 'text-purple-500', 'text-orange-500', 'text-primary'];

export default function ServicesPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => { getServices().then(setServices); }, []);

  const handlePurchase = async (service: Service) => {
    if (!user) return;
    try {
      await purchaseService(user.id, service.id, service.duration_days);
      toast({ title: 'Услуга активирована!', description: `${service.name} на ${service.duration_days} дней` });
    } catch (e: any) {
      toast({ title: 'Ошибка', description: e.message, variant: 'destructive' });
    }
  };

  const seekerServices = services.filter(s => s.target_role === 'job_seeker');
  const employerServices = services.filter(s => s.target_role === 'employer');

  const renderCard = (service: Service, i: number) => {
    const Icon = icons[i % icons.length];
    const color = colors[i % colors.length];
    return (
      <Card key={service.id} className="border-none shadow-sm hover:shadow-2xl transition-all rounded-3xl overflow-hidden bg-card group">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center border border-border group-hover:scale-110 transition-transform">
              <Icon className={`w-8 h-8 ${color}`} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-foreground mb-2">{service.name}</h2>
              <p className="text-muted-foreground font-medium mb-3">{service.description}</p>
              {service.features.length > 0 && (
                <ul className="text-sm text-muted-foreground mb-4 space-y-1">
                  {service.features.map((f, j) => <li key={j}>✓ {f}</li>)}
                </ul>
              )}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="text-2xl font-black text-primary">{service.price.toLocaleString('ru-RU')} {service.currency}</span>
                <Button onClick={() => handlePurchase(service)} disabled={!isAuthenticated} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 rounded-xl h-12">
                  {isAuthenticated ? 'Подключить' : 'Войдите'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Срок действия: {service.duration_days} дней</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-foreground mb-4 tracking-tighter">Услуги JobPortal</h1>
        <p className="text-xl text-muted-foreground font-medium mb-12">Инструменты для успешного поиска работы и подбора персонала.</p>
        {employerServices.length > 0 && <>
          <h2 className="text-2xl font-black text-foreground mb-6">Для работодателей</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">{employerServices.map(renderCard)}</div>
        </>}
        {seekerServices.length > 0 && <>
          <h2 className="text-2xl font-black text-foreground mb-6">Для соискателей</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{seekerServices.map(renderCard)}</div>
        </>}
      </main>
      <Footer />
    </div>
  );
}
