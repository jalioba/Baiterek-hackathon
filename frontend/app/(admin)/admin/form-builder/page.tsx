"use client";

import { useState } from "react";
import { 
  Type, AlignLeft, Hash, Calendar, ChevronDown, CheckSquare, 
  CircleDot, Upload, DollarSign, MapPin, Building2, Minus, 
  Heading1, Settings, Eye, Save, Link2, GripVertical, Edit2, Trash2, LayoutTemplate
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, 
  useSensor, useSensors, DragEndEvent 
} from "@dnd-kit/core";
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, 
  verticalListSortingStrategy, useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SERVICES } from "@/lib/mock-data";

const FIELD_TYPES = [
  { id: "text", icon: Type, label: "Текстовое поле" },
  { id: "textarea", icon: AlignLeft, label: "Текстовая область" },
  { id: "number", icon: Hash, label: "Числовое поле" },
  { id: "date", icon: Calendar, label: "Дата" },
  { id: "select", icon: ChevronDown, label: "Выпадающий список" },
  { id: "checkbox", icon: CheckSquare, label: "Чекбокс" },
  { id: "radio", icon: CircleDot, label: "Радио-кнопки" },
  { id: "file", icon: Upload, label: "Загрузка файла" },
  { id: "money", icon: DollarSign, label: "Сумма" },
  { id: "address", icon: MapPin, label: "Адрес" },
  { id: "company", icon: Building2, label: "Из справочника" },
  { id: "divider", icon: Minus, label: "Разделитель" },
  { id: "heading", icon: Heading1, label: "Заголовок секции" },
];

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

function SortableField({ field, onSelect, onRemove, isSelected }: { field: FormField, onSelect: () => void, onRemove: () => void, isSelected: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const Icon = FIELD_TYPES.find(t => t.id === field.type)?.icon || Type;

  return (
    <div 
      ref={setNodeRef} style={style}
      className={cn(
        "bg-white rounded-xl border p-4 flex items-start gap-4 group transition-colors cursor-default",
        isSelected ? "border-[#003F87] ring-1 ring-[#003F87] shadow-sm" : "border-gray-200 hover:border-blue-300"
      )}
      onClick={onSelect}
    >
      <div 
        {...attributes} {...listeners} 
        className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
      >
        <GripVertical size={16} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Icon size={16} className="text-[#003F87]" />
          <span className="font-semibold text-sm text-[#1A2332]">{field.label}</span>
          {field.required && <span className="text-red-500 text-xs">*</span>}
        </div>
        
        {field.type !== 'divider' && field.type !== 'heading' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 w-full">
            {field.placeholder || "Ввод текста..."}
          </div>
        )}
        {field.type === 'heading' && <div className="text-lg font-bold text-gray-800 border-b pb-2">Текст заголовка</div>}
        {field.type === 'divider' && <div className="h-px bg-gray-300 w-full my-2"></div>}
      </div>

      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-gray-400 hover:text-[#003F87] p-1"><Edit2 size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

export default function FormBuilderPage() {
  const [fields, setFields] = useState<FormField[]>([
    { id: "1", type: "heading", label: "Общая информация" },
    { id: "2", type: "text", label: "Название проекта", required: true, placeholder: "Например: Модернизация цеха" },
    { id: "3", type: "money", label: "Сумма финансирования", required: true, placeholder: "0.00 ₸" },
  ]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [formName, setFormName] = useState("Анкета на финансирование");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: FIELD_TYPES.find(t => t.id === type)?.label || "Новое поле",
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-[#F5F7FA] -m-4 md:-m-8">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-lg text-[#003F87]"><LayoutTemplate size={20} /></div>
          <input 
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="text-xl font-bold text-[#1A2332] outline-none border-b border-transparent hover:border-gray-300 focus:border-[#003F87] bg-transparent transition-colors px-1 py-0.5"
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none w-48 truncate">
            <option value="">Не привязана к услуге</option>
            {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border", isPreview ? "bg-gray-100 border-gray-200 text-gray-700" : "bg-white border-gray-200 text-[#003F87] hover:bg-blue-50")}
          >
            <Eye size={16} /> {isPreview ? "Редактор" : "Превью"}
          </button>
          <button className="flex items-center gap-2 bg-[#003F87] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0056B8] transition-colors shadow-sm">
            <Save size={16} /> Сохранить
          </button>
        </div>
      </div>

      {isPreview ? (
        // Preview Mode
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-[#1A2332] mb-6 pb-4 border-b">{formName}</h2>
            <div className="space-y-6">
              {fields.map(field => (
                <div key={field.id}>
                  {field.type === 'heading' && <h3 className="text-lg font-bold text-[#1A2332] mb-2">{field.label}</h3>}
                  {field.type === 'divider' && <div className="h-px bg-gray-200 w-full my-4"></div>}
                  {field.type !== 'heading' && field.type !== 'divider' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input 
                        type={field.type === 'number' || field.type === 'money' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                        placeholder={field.placeholder}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87]"
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 mt-8 border-t border-gray-100 flex justify-end">
                <button className="bg-[#003F87] text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:bg-[#0056B8]">
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Builder Mode
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel */}
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Компоненты</h3>
            </div>
            <div className="p-4 space-y-2">
              {FIELD_TYPES.map(type => (
                <button 
                  key={type.id}
                  onClick={() => addField(type.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 text-left transition-colors group text-sm text-gray-600 hover:text-[#003F87]"
                >
                  <type.icon size={18} className="text-gray-400 group-hover:text-[#003F87]" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center Canvas */}
          <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#F5F7FA]">
            <div className="w-full max-w-2xl min-h-[500px]">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-full p-6">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4 min-h-[400px] border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50">
                      {fields.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                          Перетащите компоненты сюда
                        </div>
                      ) : (
                        fields.map((field) => (
                          <SortableField 
                            key={field.id} 
                            field={field} 
                            isSelected={selectedFieldId === field.id}
                            onSelect={() => setSelectedFieldId(field.id)}
                            onRemove={() => removeField(field.id)}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Свойства поля</h3>
            </div>
            <div className="p-6">
              {selectedField ? (
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-mono font-medium mb-2">
                    ID: {selectedField.id}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1A2332] mb-1.5">Метка поля (Label)</label>
                    <input 
                      type="text" 
                      value={selectedField.label}
                      onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#003F87]"
                    />
                  </div>

                  {selectedField.type !== 'divider' && selectedField.type !== 'heading' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-[#1A2332] mb-1.5">Подсказка (Placeholder)</label>
                        <input 
                          type="text" 
                          value={selectedField.placeholder || ""}
                          onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#003F87]"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-sm font-medium text-[#1A2332]">Обязательное поле</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={!!selectedField.required} 
                            onChange={(e) => updateField(selectedField.id, { required: e.target.checked })} 
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#003F87]"></div>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-gray-400 py-12">
                  <Settings size={48} className="mb-4 opacity-20" />
                  <p className="text-sm">Выберите поле на холсте<br/>для редактирования настроек</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
