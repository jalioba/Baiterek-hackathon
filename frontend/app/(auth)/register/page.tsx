import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import RegisterWizard from "@/components/auth/RegisterWizard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрация | Байтерек",
  description: "Создание аккаунта на портале Байтерек",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#003F87] overflow-hidden flex-col justify-between p-12 text-white baiterek-gradient">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-white p-2 rounded-lg">
              <Building2 size={24} className="text-[#003F87]" />
            </div>
            <span className="text-xl font-bold tracking-tight">БАЙТЕРЕК</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Начните путь к успеху с нами
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8">
            Зарегистрируйтесь, чтобы получить доступ к грантам, субсидиям, кредитованию и бесплатным бизнес-курсам от государства.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-white/90">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm font-bold">1</div>
              <span>Заполните профиль компании</span>
            </li>
            <li className="flex items-center gap-3 text-white/90">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm font-bold">2</div>
              <span>Найдите подходящие программы</span>
            </li>
            <li className="flex items-center gap-3 text-white/90">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm font-bold">3</div>
              <span>Подавайте заявки в один клик</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-[#F5F7FA] lg:bg-white relative min-h-screen overflow-y-auto">
        <Link href="/" className="lg:hidden absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#1A2332]">
          <ArrowLeft size={16} /> На главную
        </Link>
        
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="mb-8 mt-12 lg:mt-0">
            <h2 className="text-3xl font-bold text-[#1A2332] mb-2">Создание аккаунта</h2>
            <p className="text-muted-foreground">Для доступа к государственным мерам поддержки</p>
          </div>
          
          <RegisterWizard />
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-semibold text-[#003F87] hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
