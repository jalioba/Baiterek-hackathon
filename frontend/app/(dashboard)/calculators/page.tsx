"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calculator, GripVertical, Plus, Trash2, Download, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

// --- DND SORTABLE ITEM COMPONENT ---
function SortableItem({ id, item, updateItem, removeItem }: { id: string, item: any, updateItem: (id: string, field: string, value: any) => void, removeItem: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("grid grid-cols-12 gap-3 p-3 items-center bg-white border border-gray-100 rounded-xl mb-2", isDragging && "shadow-lg border-blue-200")}>
      <div className="col-span-1 flex justify-center cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#003F87]" {...attributes} {...listeners}>
        <GripVertical size={20} />
      </div>
      <div className="col-span-4">
        <input type="text" value={item.name} onChange={(e) => updateItem(id, "name", e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#003F87]" placeholder="Название расхода" />
      </div>
      <div className="col-span-2">
        <input type="text" value={item.unit} onChange={(e) => updateItem(id, "unit", e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#003F87]" placeholder="Ед. изм." />
      </div>
      <div className="col-span-2">
        <input type="number" value={item.quantity} onChange={(e) => updateItem(id, "quantity", Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#003F87]" />
      </div>
      <div className="col-span-2">
        <input type="number" value={item.price} onChange={(e) => updateItem(id, "price", Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#003F87]" />
      </div>
      <div className="col-span-1 flex justify-center">
        <button onClick={() => removeItem(id)} className="text-gray-400 hover:text-red-500 p-1">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState("credit");

  // --- CREDIT CALCULATOR STATE ---
  const [amount, setAmount] = useState(10000000);
  const [rate, setRate] = useState(8);
  const [months, setMonths] = useState(60);
  const [chartData, setChartData] = useState<any[]>([]);

  const monthlyRate = rate / 100 / 12;
  const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = monthlyPayment * months;
  const overpayment = totalPayment - amount;

  useEffect(() => {
    const data = [];
    let remainingAmount = amount;
    for (let i = 1; i <= months; i++) {
      if (i % Math.max(1, Math.floor(months / 12)) === 0 || i === months) {
        const interestPayment = remainingAmount * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingAmount -= principalPayment;
        data.push({
          month: i,
          payment: Math.round(monthlyPayment),
          balance: Math.max(0, Math.round(remainingAmount)),
        });
      }
    }
    setChartData(data);
  }, [amount, rate, months, monthlyPayment, monthlyRate]);

  // --- EXPENSE ESTIMATE STATE (DND) ---
  const [items, setItems] = useState([
    { id: "1", name: "Закупка оборудования", unit: "шт", quantity: 5, price: 1200000 },
    { id: "2", name: "Аренда помещения", unit: "кв.м", quantity: 150, price: 15000 },
    { id: "3", name: "Маркетинговые услуги", unit: "мес", quantity: 3, price: 500000 },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: "", unit: "", quantity: 1, price: 0 }]);
  };

  const totalEstimate = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#1A2332]">Калькуляторы</h1>
        <p className="text-muted-foreground mt-1">Инструменты для финансового планирования</p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("credit")}
          className={cn("px-6 py-3 font-semibold transition-colors", activeTab === "credit" ? "text-[#003F87] border-b-2 border-[#003F87]" : "text-gray-500 hover:text-[#1A2332]")}
        >
          <span className="flex items-center gap-2"><Calculator size={18} /> Кредитный калькулятор</span>
        </button>
        <button
          onClick={() => setActiveTab("estimate")}
          className={cn("px-6 py-3 font-semibold transition-colors", activeTab === "estimate" ? "text-[#003F87] border-b-2 border-[#003F87]" : "text-gray-500 hover:text-[#1A2332]")}
        >
          <span className="flex items-center gap-2"><PieChart size={18} /> Смета расходов</span>
        </button>
      </div>

      {activeTab === "credit" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-[#1A2332]">Сумма кредита (₸)</label>
                <span className="text-sm font-bold text-[#003F87]">{amount.toLocaleString("ru-RU")} ₸</span>
              </div>
              <input type="range" min="1000000" max="1000000000" step="1000000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-[#003F87]" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 млн</span><span>1 млрд</span></div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-[#1A2332]">Процентная ставка (%)</label>
                <span className="text-sm font-bold text-[#003F87]">{rate}%</span>
              </div>
              <input type="range" min="1" max="20" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-[#003F87]" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1%</span><span>20%</span></div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-[#1A2332]">Срок (мес)</label>
                <span className="text-sm font-bold text-[#003F87]">{months} мес.</span>
              </div>
              <input type="range" min="1" max="120" step="1" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-[#003F87]" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 мес</span><span>120 мес</span></div>
            </div>

            <div className="p-4 bg-[#F5F7FA] rounded-xl space-y-3 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ежемесячный платеж:</span>
                <span className="font-bold text-[#1A2332]">{Math.round(monthlyPayment).toLocaleString("ru-RU")} ₸</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Переплата:</span>
                <span className="font-bold text-red-600">{Math.round(overpayment).toLocaleString("ru-RU")} ₸</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#1A2332]">Итого к возврату:</span>
                <span className="font-bold text-[#003F87] text-lg">{Math.round(totalPayment).toLocaleString("ru-RU")} ₸</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="font-bold text-[#1A2332] mb-6">График погашения (остаток долга)</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" tickFormatter={(v) => `${v} мес`} stroke="#a0aec0" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}М`} stroke="#a0aec0" fontSize={12} tickLine={false} axisLine={false} width={50} />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString("ru-RU")} ₸`, "Остаток"]}
                    labelFormatter={(label) => `Месяц ${label}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="balance" stroke="#003F87" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#003F87", stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "estimate" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#1A2332]">Статьи расходов проекта</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-[#003F87] border border-gray-200 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
              <Download size={16} /> Скачать смету
            </button>
          </div>

          <div className="grid grid-cols-12 gap-3 px-3 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-4">
            <div className="col-span-1 text-center">№</div>
            <div className="col-span-4">Наименование</div>
            <div className="col-span-2">Ед. изм.</div>
            <div className="col-span-2">Кол-во</div>
            <div className="col-span-2">Цена (₸)</div>
            <div className="col-span-1 text-center">Удал.</div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id} item={item} updateItem={updateItem} removeItem={removeItem} />
              ))}
            </SortableContext>
          </DndContext>

          <button onClick={addItem} className="flex items-center gap-2 mt-4 text-[#003F87] font-medium text-sm hover:underline">
            <Plus size={16} /> Добавить строку
          </button>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <div className="bg-[#F5F7FA] px-8 py-4 rounded-xl flex items-center gap-6">
              <span className="font-semibold text-gray-600 uppercase tracking-wider text-sm">Итого по смете:</span>
              <span className="font-bold text-2xl text-[#003F87]">{totalEstimate.toLocaleString("ru-RU")} ₸</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
