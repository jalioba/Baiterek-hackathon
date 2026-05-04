"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Building2, ChevronRight, ChevronLeft, Check, Loader2, Camera, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Validations
const step1Schema = z.object({
  accountType: z.enum(["ip", "juridical"], { required_error: "Выберите тип субъекта" }),
});

const step2Schema = z.object({
  firstName: z.string().min(2, "Минимум 2 символа"),
  lastName: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Неверный email"),
  phone: z.string().min(10, "Введите номер"),
  iin: z.string().length(12, "ИИН должен состоять из 12 цифр"),
  bin: z.string().optional(),
  companyName: z.string().optional(),
}).superRefine((data, ctx) => {
  // If we had access to step1 data here we'd enforce BIN for juridical, but we'll do it manually on submit
});

const step3Schema = z.object({
  password: z.string().min(8, "Пароль слишком короткий"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [biometricState, setBiometricState] = useState<"idle" | "right" | "left" | "success">("idle");

  // Forms
  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  const onStep1Submit = (data: Step1Data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStep2Submit = (data: Step2Data) => {
    if (formData.accountType === "juridical" && (!data.bin || data.bin.length !== 12)) {
      form2.setError("bin", { message: "БИН должен состоять из 12 цифр" });
      return;
    }
    if (formData.accountType === "juridical" && !data.companyName) {
      form2.setError("companyName", { message: "Введите название компании" });
      return;
    }
    setFormData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const onStep3Submit = (data: Step3Data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(4);
  };

  const finalSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const { registerUser } = await import("@/lib/firebase/auth");
      await registerUser(formData);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Ошибка сервера");
      setIsSubmitting(false);
    }
  };

  // Password strength
  const watchPassword = form3.watch("password", "");
  const hasLength = watchPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(watchPassword);
  const hasNumber = /[0-9]/.test(watchPassword);
  const strength = (hasLength ? 33 : 0) + (hasUpper ? 33 : 0) + (hasNumber ? 34 : 0);

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
          <span>Шаг {step} из 5</span>
          <span>
            {step === 1 && "Тип аккаунта"}
            {step === 2 && "Личные данные"}
            {step === 3 && "Безопасность"}
            {step === 4 && "Биометрия"}
            {step === 5 && "Подтверждение"}
          </span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", step >= i ? "bg-[#003F87]" : "bg-gray-200")} />
          ))}
        </div>
      </div>

      {error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">{error}</div>}

      {/* Step 1: Type */}
      {step === 1 && (
        <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={cn(
              "relative cursor-pointer rounded-2xl border-2 p-6 text-center transition-all hover:border-[#003F87] hover:bg-blue-50",
              form1.watch("accountType") === "ip" ? "border-[#003F87] bg-blue-50 ring-1 ring-[#003F87]" : "border-gray-200 bg-white"
            )}>
              <input type="radio" value="ip" {...form1.register("accountType")} className="sr-only" />
              <div className={cn("mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-colors", form1.watch("accountType") === "ip" ? "bg-[#003F87] text-white" : "bg-[#F5F7FA] text-muted-foreground")}>
                <User size={28} />
              </div>
              <h3 className="font-semibold text-[#1A2332]">Индивидуальный предприниматель</h3>
              <p className="mt-2 text-xs text-muted-foreground">Для ИП, КФХ, лиц частной практики</p>
            </label>

            <label className={cn(
              "relative cursor-pointer rounded-2xl border-2 p-6 text-center transition-all hover:border-[#003F87] hover:bg-blue-50",
              form1.watch("accountType") === "juridical" ? "border-[#003F87] bg-blue-50 ring-1 ring-[#003F87]" : "border-gray-200 bg-white"
            )}>
              <input type="radio" value="juridical" {...form1.register("accountType")} className="sr-only" />
              <div className={cn("mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-colors", form1.watch("accountType") === "juridical" ? "bg-[#003F87] text-white" : "bg-[#F5F7FA] text-muted-foreground")}>
                <Building2 size={28} />
              </div>
              <h3 className="font-semibold text-[#1A2332]">Юридическое лицо</h3>
              <p className="mt-2 text-xs text-muted-foreground">Для ТОО, АО и других юр. лиц</p>
            </label>
          </div>
          {form1.formState.errors.accountType && <p className="text-sm text-red-500 text-center">{form1.formState.errors.accountType.message}</p>}
          
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003F87] py-3.5 font-semibold text-white transition-all hover:bg-[#0056B8]">
            Продолжить <ChevronRight size={18} />
          </button>
        </form>
      )}

      {/* Step 2: Info */}
      {step === 2 && (
        <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1A2332]">Имя</label>
              <input {...form2.register("firstName")} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87]" />
              {form2.formState.errors.firstName && <p className="mt-1 text-xs text-red-500">{form2.formState.errors.firstName.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1A2332]">Фамилия</label>
              <input {...form2.register("lastName")} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87]" />
              {form2.formState.errors.lastName && <p className="mt-1 text-xs text-red-500">{form2.formState.errors.lastName.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1A2332]">Email</label>
              <input {...form2.register("email")} type="email" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87]" />
              {form2.formState.errors.email && <p className="mt-1 text-xs text-red-500">{form2.formState.errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1A2332]">Телефон</label>
              <input {...form2.register("phone")} type="tel" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87]" />
              {form2.formState.errors.phone && <p className="mt-1 text-xs text-red-500">{form2.formState.errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A2332]">ИИН (12 цифр)</label>
            <input {...form2.register("iin")} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87]" />
            {form2.formState.errors.iin && <p className="mt-1 text-xs text-red-500">{form2.formState.errors.iin.message}</p>}
          </div>

          {formData.accountType === "juridical" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1A2332]">БИН (12 цифр)</label>
                <input {...form2.register("bin")} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87]" />
                {form2.formState.errors.bin && <p className="mt-1 text-xs text-red-500">{form2.formState.errors.bin.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1A2332]">Название компании</label>
                <input {...form2.register("companyName")} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87]" />
                {form2.formState.errors.companyName && <p className="mt-1 text-xs text-red-500">{form2.formState.errors.companyName.message}</p>}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setStep(1)} className="flex items-center justify-center gap-2 rounded-xl bg-[#F5F7FA] px-6 py-3.5 font-semibold text-[#1A2332] transition hover:bg-gray-200">
              <ChevronLeft size={18} />
            </button>
            <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003F87] py-3.5 font-semibold text-white transition hover:bg-[#0056B8]">
              Далее <ChevronRight size={18} />
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Password */}
      {step === 3 && (
        <form onSubmit={form3.handleSubmit(onStep3Submit)} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A2332]">Придумайте пароль</label>
            <input {...form3.register("password")} type="password" placeholder="••••••••" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87]" />
            
            {/* Strength Indicator */}
            <div className="mt-3">
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex gap-1">
                <div className={cn("h-full transition-all duration-300", strength > 0 ? strength > 35 ? strength > 70 ? "bg-green-500 w-1/3" : "bg-yellow-400 w-1/3" : "bg-red-400 w-1/3" : "w-0")} />
                <div className={cn("h-full transition-all duration-300", strength > 35 ? strength > 70 ? "bg-green-500 w-1/3" : "bg-yellow-400 w-1/3" : "w-0")} />
                <div className={cn("h-full transition-all duration-300", strength > 70 ? "bg-green-500 w-1/3" : "w-0")} />
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <Check size={14} className={hasLength ? "text-green-500" : "text-gray-300"} />
                  <span className={hasLength ? "text-[#1A2332]" : "text-gray-500"}>Минимум 8 символов</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check size={14} className={hasUpper ? "text-green-500" : "text-gray-300"} />
                  <span className={hasUpper ? "text-[#1A2332]" : "text-gray-500"}>Заглавная буква</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check size={14} className={hasNumber ? "text-green-500" : "text-gray-300"} />
                  <span className={hasNumber ? "text-[#1A2332]" : "text-gray-500"}>Цифра</span>
                </div>
              </div>
            </div>
            {form3.formState.errors.password && <p className="mt-1 text-xs text-red-500">{form3.formState.errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A2332]">Повторите пароль</label>
            <input {...form3.register("confirmPassword")} type="password" placeholder="••••••••" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003F87]" />
            {form3.formState.errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{form3.formState.errors.confirmPassword.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setStep(2)} className="flex items-center justify-center gap-2 rounded-xl bg-[#F5F7FA] px-6 py-3.5 font-semibold text-[#1A2332] transition hover:bg-gray-200">
              <ChevronLeft size={18} />
            </button>
            <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003F87] py-3.5 font-semibold text-white transition hover:bg-[#0056B8]">
              Далее <ChevronRight size={18} />
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Biometrics */}
      {step === 4 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <div className="relative mb-6 flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-4 border-[#003F87] bg-white shadow-inner">
              {biometricState === "idle" && <User size={80} className="text-gray-300" />}
              {biometricState === "right" && (
                <div className="flex flex-col items-center text-[#003F87] animate-pulse">
                  <User size={60} className="mb-2" />
                  <span className="text-sm font-bold">➡️ Вправо</span>
                </div>
              )}
              {biometricState === "left" && (
                <div className="flex flex-col items-center text-[#003F87] animate-pulse">
                  <User size={60} className="mb-2" />
                  <span className="text-sm font-bold">⬅️ Влево</span>
                </div>
              )}
              {biometricState === "success" && (
                <div className="flex flex-col items-center text-green-500">
                  <CheckCircle2 size={80} />
                </div>
              )}
              {biometricState !== "idle" && biometricState !== "success" && (
                <div className="absolute inset-0 bg-[#003F87]/10 flex flex-col justify-between">
                  <div className="h-full w-full bg-gradient-to-b from-transparent via-[#003F87]/40 to-transparent animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="text-center h-20">
              <h3 className="mb-2 text-lg font-bold text-[#1A2332]">
                {biometricState === "idle" && "Биометрическая проверка"}
                {biometricState === "right" && "Поверните голову вправо..."}
                {biometricState === "left" && "Поверните голову влево..."}
                {biometricState === "success" && "Проверка успешно пройдена!"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {biometricState === "idle" && "Для продолжения необходимо подтвердить личность."}
                {biometricState === "success" && "Личность подтверждена. Вы можете продолжить."}
                {(biometricState === "right" || biometricState === "left") && "Смотрите в камеру и следуйте инструкциям."}
              </p>
            </div>

            {biometricState === "idle" && (
              <button 
                type="button"
                onClick={() => {
                  setBiometricState("right");
                  setTimeout(() => {
                    setBiometricState("left");
                    setTimeout(() => {
                      setBiometricState("success");
                    }, 2500);
                  }, 2500);
                }}
                className="mt-2 flex items-center gap-2 rounded-xl bg-[#003F87] px-6 py-3 font-semibold text-white transition hover:bg-[#0056B8]"
              >
                <Camera size={20} /> Начать проверку
              </button>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setStep(3)} className="flex items-center justify-center gap-2 rounded-xl bg-[#F5F7FA] px-6 py-3.5 font-semibold text-[#1A2332] transition hover:bg-gray-200">
              <ChevronLeft size={18} />
            </button>
            <button 
              type="button" 
              onClick={() => setStep(5)} 
              disabled={biometricState !== "success"}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003F87] py-3.5 font-semibold text-white transition hover:bg-[#0056B8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Далее <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Summary */}
      {step === 5 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 space-y-3">
            <h3 className="font-bold text-[#1A2332] mb-4">Проверьте данные</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-muted-foreground">Тип:</div>
              <div className="font-medium text-[#1A2332]">{formData.accountType === "ip" ? "Индивидуальный предприниматель" : "Юридическое лицо"}</div>
              
              <div className="text-muted-foreground">ФИО:</div>
              <div className="font-medium text-[#1A2332]">{formData.lastName} {formData.firstName}</div>
              
              <div className="text-muted-foreground">Email:</div>
              <div className="font-medium text-[#1A2332]">{formData.email}</div>
              
              <div className="text-muted-foreground">ИИН:</div>
              <div className="font-medium text-[#1A2332]">{formData.iin}</div>

              {formData.accountType === "juridical" && (
                <>
                  <div className="text-muted-foreground">БИН:</div>
                  <div className="font-medium text-[#1A2332]">{formData.bin}</div>
                  <div className="text-muted-foreground">Компания:</div>
                  <div className="font-medium text-[#1A2332]">{formData.companyName}</div>
                </>
              )}
            </div>
          </div>

          <label className="flex items-start gap-3 p-2 cursor-pointer group">
            <div className="flex h-5 items-center">
              <input id="terms" type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-[#003F87] focus:ring-[#003F87]" />
            </div>
            <div className="text-sm text-muted-foreground">
              Я соглашаюсь с <a href="#" className="text-[#003F87] hover:underline">Пользовательским соглашением</a> и обработкой персональных данных
            </div>
          </label>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setStep(4)} className="flex items-center justify-center gap-2 rounded-xl bg-[#F5F7FA] px-6 py-3.5 font-semibold text-[#1A2332] transition hover:bg-gray-200 disabled:opacity-50" disabled={isSubmitting}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={finalSubmit} disabled={isSubmitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-70">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Создать аккаунт"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
