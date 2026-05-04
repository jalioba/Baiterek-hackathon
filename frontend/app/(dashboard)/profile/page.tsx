"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/i18n";
import { ArrowLeft, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, profile, logout } = useAuth();
  const { t } = useLang();

  const displayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ''}`.trim()
    : user?.email?.split('@')[0] || 'Пользователь';

  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: user?.email || "",
      phone: profile?.phone || "",
      iin: profile?.iin || "",
      companyName: profile?.businessType || "",
    },
  });

  return (
    <div className="space-y-6">
      {/* Back to Home */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#003F87] hover:underline">
        <ArrowLeft size={16} /> {t.profile.backHome}
      </Link>

      <h1 className="text-2xl font-bold text-[#1A2332]">{t.profile.title}</h1>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#003F87] to-[#0056B8] text-2xl font-bold text-white">
            {initials || <User size={28} />}
          </div>
          <div>
            <div className="font-bold text-lg text-[#1A2332]">{displayName}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
            {profile?.role && (
              <span className="mt-1 inline-block px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-md">
                {profile.role}
              </span>
            )}
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">{t.profile.firstName}</label>
              <input {...register("firstName")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#003F87] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">{t.profile.lastName}</label>
              <input {...register("lastName")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#003F87] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">{t.profile.email}</label>
            <input {...register("email")} type="email" readOnly className="w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">{t.profile.phone}</label>
            <input {...register("phone")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#003F87] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">{t.profile.iin}</label>
            <input {...register("iin")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#003F87] focus:outline-none font-mono" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">{t.profile.company}</label>
            <input {...register("companyName")} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#003F87] focus:outline-none" />
          </div>
          
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="rounded-xl bg-[#003F87] px-6 py-2.5 font-medium text-white hover:bg-[#0056B8] transition-colors">
              {t.profile.save}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} /> {t.profile.logout}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
