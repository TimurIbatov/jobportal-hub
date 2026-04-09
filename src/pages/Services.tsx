import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Shield, Rocket, Target, Award } from 'lucide-react';

export default function ServicesPage() {
  const seekerServices = [
    { title: 'Премиум резюме', description: 'Выделите резюме в поиске и получайте больше приглашений.', price: '50 000 UZS', icon: <Sparkles className="w-8 h-8 text-yellow-500" /> },
    { title: 'Автоподнятие', description: 'Резюме автоматически поднимается в начало списка каждый день.', price: '30 000 UZS', icon: <Zap className="w-8 h-8 text-primary" /> },
    { title: 'Проверка компании', description: 'Детальный отчёт о благонадёжности работодателя.', price: '100 000 UZS', icon: <Shield className="w-8 h-8 text-success" /> },
  ];
  const employerServices = [
    { title: 'Быстрый старт', description: 'Рассылка вакансии по базе подходящих кандидатов за 24 часа.', price: '150 000 UZS', icon: <Rocket className="w-8 h-8 text-purple-500" /> },
    { title: 'Таргет-подбор', description: 'Персональный менеджер подберёт кандидатов под ваши требования.', price: '500 000 UZS', icon: <Target className="w-8 h-8 text-orange-500" /> },
    { title: 'Бренд работодателя', description: 'Продвижение бренда компании на платформе JobPortal.', price: '300 000 UZS', icon: <Award className="w-8 h-8 text-primary" /> },
  ];

  const renderCard = (service: typeof seekerServices[0], i: number) => (
    <Card key={i} className="border-none shadow-sm hover:shadow-2xl transition-all rounded-3xl overflow-hidden bg-card group">
      <CardContent className="p-6 md:p-10">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center border border-border group-hover:scale-110 transition-transform">{service.icon}</div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-foreground mb-2">{service.title}</h2>
            <p className="text-muted-foreground font-medium mb-4">{service.description}</p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-2xl font-black text-primary">{service.price}</span>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 rounded-xl h-12">Подключить</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-foreground mb-4 tracking-tighter">Услуги JobPortal</h1>
        <p className="text-xl text-muted-foreground font-medium mb-12">Инструменты для успешного поиска работы и подбора персонала.</p>
        <h2 className="text-2xl font-black text-foreground mb-6">Для соискателей</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">{seekerServices.map(renderCard)}</div>
        <h2 className="text-2xl font-black text-foreground mb-6">Для работодателей</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{employerServices.map(renderCard)}</div>
      </main>
      <Footer />
    </div>
  );
}
