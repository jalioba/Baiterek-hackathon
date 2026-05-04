"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, ShieldCheck, Smartphone, HardDrive, Cloud, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // Modal state
  const [showEgovModal, setShowEgovModal] = useState(false);
  const [egovStep, setEgovStep] = useState<"choice" | "loading" | "success">("choice");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const { loginUser } = await import("@/lib/firebase/auth");
      await loginUser(data.email, data.password);
      // Let the useAuth hook handle redirection or just push directly
      router.push("/dashboard"); // We'll push to dashboard for now
    } catch (err: any) {
      setError(err.message || "Ошибка входа. Проверьте почту и пароль.");
    }
  };

  const startEgovAuth = () => {
    setEgovStep("loading");
    setProgress(0);
    setLogs(["[SYSTEM] Подключение к eGov IDP..."]);
    
    // Simulate connection
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setEgovStep("success");
        setLogs(prev => [...prev, "[OK] Сертификат проверен", "[OK] ИИН верифицирован", "[SYS] Загрузка профиля..."]);
        
        setTimeout(() => {
          localStorage.setItem("baiterek_user", JSON.stringify({ name: "eGov User", role: "USER", iin: "880101400111" }));
          router.push("/dashboard");
        }, 1500);
      }
      setProgress(currentProgress);
      
      if (currentProgress > 30 && currentProgress < 40) {
        setLogs(prev => [...prev, "[WAIT] Ожидание ответа от шлюза..."]);
      }
      if (currentProgress > 70 && currentProgress < 80) {
        setLogs(prev => [...prev, "[SECURE] Установка зашифрованного канала..."]);
      }
    }, 300);
  };

  return (
    <>
      {error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A2332]">Email</label>
          <input 
            {...register("email")} 
            type="email" 
            placeholder="name@company.kz"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87]" 
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-[#1A2332]">Пароль</label>
            <a href="#" className="text-xs font-medium text-[#003F87] hover:underline">Забыли пароль?</a>
          </div>
          <div className="relative">
            <input 
              {...register("password")} 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87]" 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center">
          <input 
            {...register("remember")} 
            id="remember" 
            type="checkbox" 
            className="h-4 w-4 rounded border-gray-300 text-[#003F87] focus:ring-[#003F87]"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">
            Запомнить меня
          </label>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003F87] py-3.5 font-semibold text-white shadow-sm transition-all hover:bg-[#0056B8] hover:shadow-md disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Войти"}
        </button>
      </form>

      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">или</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <button 
        onClick={() => setShowEgovModal(true)}
        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-blue-50 border border-blue-100 py-3.5 font-semibold text-[#003F87] transition-all hover:bg-blue-100"
      >
        <ShieldCheck size={20} className="text-[#003F87]" />
        Войти через eGov ID
      </button>

      {/* eGov Modal */}
      {showEgovModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Left side: Content */}
            <div className="p-8 flex-1">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={24} className="text-[#003F87]" />
                  <h3 className="text-xl font-bold text-[#1A2332]">eGov ID</h3>
                </div>
                {egovStep === "choice" && (
                  <button onClick={() => setShowEgovModal(false)} className="text-gray-400 hover:text-gray-600 text-sm font-medium">Закрыть</button>
                )}
              </div>

              {egovStep === "choice" ? (
                <>
                  <p className="text-sm text-muted-foreground mb-6">Выберите способ авторизации:</p>
                  <div className="space-y-3">
                    <button onClick={startEgovAuth} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#003F87] hover:bg-blue-50 transition-all text-left group">
                      <div className="bg-[#F5F7FA] p-2 rounded-lg group-hover:bg-white"><Smartphone size={20} className="text-[#003F87]" /></div>
                      <div>
                        <div className="font-semibold text-[#1A2332]">Мобильный eGov</div>
                        <div className="text-xs text-muted-foreground">QR-код или пуш-уведомление</div>
                      </div>
                    </button>
                    <button onClick={startEgovAuth} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#003F87] hover:bg-blue-50 transition-all text-left group">
                      <div className="bg-[#F5F7FA] p-2 rounded-lg group-hover:bg-white"><HardDrive size={20} className="text-[#003F87]" /></div>
                      <div>
                        <div className="font-semibold text-[#1A2332]">ЭЦП (NCALayer)</div>
                        <div className="text-xs text-muted-foreground">Ключ на компьютере или флешке</div>
                      </div>
                    </button>
                    <button onClick={startEgovAuth} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#003F87] hover:bg-blue-50 transition-all text-left group">
                      <div className="bg-[#F5F7FA] p-2 rounded-lg group-hover:bg-white"><Cloud size={20} className="text-[#003F87]" /></div>
                      <div>
                        <div className="font-semibold text-[#1A2332]">Облачная ЭЦП</div>
                        <div className="text-xs text-muted-foreground">Вход по биометрии</div>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  {egovStep === "loading" ? (
                    <div className="relative w-20 h-20 mb-6">
                      <svg className="w-full h-full text-gray-200" viewBox="0 0 100 100">
                        <circle className="stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                      </svg>
                      <svg className="absolute top-0 left-0 w-full h-full text-[#003F87] transition-all duration-300" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                        <circle className="stroke-current" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray={`${progress * 2.51} 251.2`}></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-[#003F87]">{Math.round(progress)}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 mb-6 rounded-full bg-green-100 flex items-center justify-center">
                      <ShieldCheck size={40} className="text-green-600" />
                    </div>
                  )}
                  
                  <h4 className="text-lg font-bold text-[#1A2332] mb-2">
                    {egovStep === "loading" ? "Выполняется вход..." : "Вход выполнен!"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {egovStep === "loading" ? "Пожалуйста, не закрывайте окно" : "Перенаправление в личный кабинет..."}
                  </p>
                </div>
              )}
            </div>

            {/* Right side: Terminal/Logs */}
            <div className="bg-[#0D1117] w-full md:w-64 p-6 flex flex-col font-mono text-[10px] md:text-xs">
              <div className="flex items-center gap-2 mb-4 text-gray-500 border-b border-gray-800 pb-2">
                <Terminal size={14} /> <span>console_out.log</span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto">
                {logs.length === 0 ? (
                  <span className="text-gray-600">Ожидание действий пользователя...</span>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className={cn(
                      "break-words",
                      log.includes("[OK]") ? "text-green-400" : log.includes("[WAIT]") ? "text-yellow-400" : "text-gray-300"
                    )}>
                      {log}
                    </div>
                  ))
                )}
                {egovStep === "loading" && (
                  <div className="text-gray-500 animate-pulse">_</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
