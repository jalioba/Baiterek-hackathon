"use client";

import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
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
            Единое окно для развития вашего бизнеса
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8">
            Получите доступ к государственным программам финансирования, субсидирования и экспертизы в одном месте.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#003F87] bg-blue-100"></div>
              <div className="w-10 h-10 rounded-full border-2 border-[#003F87] bg-green-100"></div>
              <div className="w-10 h-10 rounded-full border-2 border-[#003F87] bg-purple-100"></div>
            </div>
            <p className="text-sm font-medium text-white/90">
              Уже более 14,000 предпринимателей с нами
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-[#F5F7FA] lg:bg-white relative">
        <Link href="/" className="lg:hidden absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#1A2332]">
          <ArrowLeft size={16} /> На главную
        </Link>
        
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1A2332] mb-2">С возвращением</h2>
            <p className="text-muted-foreground">Войдите в систему для доступа к услугам</p>
          </div>
          
          <LoginForm />
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link href="/register" className="font-semibold text-[#003F87] hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
