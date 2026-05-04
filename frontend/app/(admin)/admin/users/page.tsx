"use client";

import { useState } from "react";
import { Search, UserCog, User, ShieldAlert, Lock, Unlock, Mail, Phone, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_USERS = [
  { id: "1", name: "Азамат Кенжебеков", email: "azamat@example.kz", iin: "890512301245", role: "ADMIN", registered: "2026-01-15" },
  { id: "2", name: "ТОО 'Baiterek Tech'", email: "info@baiterek.tech", iin: "123456789012", role: "USER", registered: "2026-03-22" },
  { id: "3", name: "Нурлан Болатов", email: "n.bolatov@mail.kz", iin: "900101300456", role: "AUTHOR", registered: "2026-02-10" },
  { id: "4", name: "ИП 'Qazaq Trade'", email: "qazaqtrade@gmail.com", iin: "880815402361", role: "USER", registered: "2026-05-01" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filtered = MOCK_USERS.filter(u =>
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter === "ALL" || u.role === roleFilter)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A2332]">Пользователи системы</h1>
        <p className="text-muted-foreground mt-1 text-sm">Управление аккаунтами и ролями доступа</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 outline-none focus:border-[#003F87] text-sm"
            />
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            {["ALL", "USER", "AUTHOR", "ADMIN"].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={cn(
                  "flex-1 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                  roleFilter === role ? "bg-white text-[#1A2332] shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {role === "ALL" ? "Все" : role}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Пользователь</th>
                <th className="px-6 py-4">ИИН / БИН</th>
                <th className="px-6 py-4">Роль</th>
                <th className="px-6 py-4">Регистрация</th>
                <th className="px-6 py-4 text-right">Детали</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#003F87]/10 flex items-center justify-center text-[#003F87] font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#1A2332]">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">{user.iin}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold",
                      user.role === 'ADMIN' ? "bg-purple-100 text-purple-700" :
                        user.role === 'AUTHOR' ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-600"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.registered}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#003F87] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Профиль <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Drawer Overlay */}
      {selectedUser && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedUser(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">

            <div className="p-6 bg-gradient-to-br from-[#003F87] to-[#1A2332] text-white">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-2xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <button onClick={() => setSelectedUser(null)} className="text-white/60 hover:text-white"><Search className="rotate-45" /></button>
              </div>
              <h2 className="font-bold text-xl">{selectedUser.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-blue-200 text-sm">
                <span className="flex items-center gap-1"><Mail size={14} /> {selectedUser.email}</span>
                <span className="flex items-center gap-1 font-mono"><User size={14} /> {selectedUser.iin}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Статистика</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
                    <div className="text-2xl font-bold text-[#1A2332]">12</div>
                    <div className="text-xs text-gray-500 font-medium">Всего заявок</div>
                  </div>
                  <div className="bg-green-50 border border-green-100 p-3 rounded-xl">
                    <div className="text-2xl font-bold text-green-700">8</div>
                    <div className="text-xs text-green-600 font-medium">Одобрено</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Управление доступом</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-sm text-[#1A2332]">Роль пользователя</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Определяет права в системе</div>
                    </div>
                    <select
                      defaultValue={selectedUser.role}
                      className="bg-gray-50 border border-gray-200 text-sm font-bold rounded-lg px-3 py-1.5 outline-none"
                    >
                      <option value="USER">USER</option>
                      <option value="AUTHOR">AUTHOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>

                  <button className="w-full flex items-center justify-between p-4 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors rounded-xl text-red-700 group">
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-red-500" />
                      <div className="text-left">
                        <div className="font-semibold text-sm">Заблокировать аккаунт</div>
                        <div className="text-xs opacity-70">Запретить вход в систему</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
