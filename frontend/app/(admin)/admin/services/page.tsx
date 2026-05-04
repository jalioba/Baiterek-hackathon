"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical, Edit2, Trash2, Shield, EyeOff, LayoutTemplate } from "lucide-react";
import { SERVICES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AdminServicesPage() {
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filtered = SERVICES.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2332]">Управление услугами</h1>
          <p className="text-muted-foreground mt-1 text-sm">Всего {SERVICES.length} программ поддержки</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-[#003F87] text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-[#0056B8] transition-colors"
        >
          <Plus size={18} /> Добавить услугу
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Поиск по названию..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 outline-none focus:border-[#003F87] text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none text-sm font-medium">
              <option>Все категории</option>
              <option>Кредитование</option>
              <option>Гранты</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Название услуги</th>
                <th className="px-6 py-4">Категория</th>
                <th className="px-6 py-4">Организация</th>
                <th className="px-6 py-4 text-center">Форма</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map(service => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1A2332] max-w-xs truncate">{service.title}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs">{service.category}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{service.subsidiary?.shortName}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#003F87] bg-blue-50 px-2 py-1 rounded">
                      <LayoutTemplate size={14} /> Привязана
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded-md w-max">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Активна
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-[#003F87] hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg text-[#1A2332]">Добавить услугу</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Название услуги</label>
                <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#003F87]" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Организация (ДО)</label>
                <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#003F87]">
                  <option>ФРП (Даму)</option>
                  <option>БРК</option>
                  <option>Qazaqstan Investment Corporation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Срок обработки (дней)</label>
                <input type="number" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#003F87]" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Конструктор формы</label>
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LayoutTemplate className="text-[#003F87]" size={20} />
                    <span className="text-sm font-medium text-[#003F87]">Схема заявки не выбрана</span>
                  </div>
                  <button className="text-xs font-bold text-[#003F87] hover:underline">Выбрать</button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">Статус активности</div>
                  <div className="text-xs text-gray-500">Показывать в каталоге</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button onClick={() => setIsDrawerOpen(false)} className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50">Отмена</button>
              <button className="flex-1 py-2.5 bg-[#003F87] text-white font-medium rounded-xl hover:bg-[#0056B8]">Сохранить</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
