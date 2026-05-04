import ApplicationWizard from "@/components/features/applications/ApplicationWizard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SERVICES } from "@/lib/mock-data";

export default function NewApplicationPage({ params }: { params: { serviceId: string } }) {
  const service = SERVICES.find(s => s.id === params.serviceId) || SERVICES[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/services" 
          className="p-2 hover:bg-white rounded-xl transition-colors text-muted-foreground hover:text-[#1A2332]"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1A2332]">Оформление заявки</h1>
          <p className="text-sm text-muted-foreground mt-1">Услуга: {service?.title}</p>
        </div>
      </div>

      <ApplicationWizard serviceId={params.serviceId} />
    </div>
  );
}
