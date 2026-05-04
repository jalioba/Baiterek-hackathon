import { Metadata } from "next";
import ServiceCatalog from "@/components/services/ServiceCatalog";

export const metadata: Metadata = {
  title: "Каталог услуг | Байтерек",
  description: "Все меры государственной поддержки бизнеса в Казахстане",
};

export default function ServicesPage() {
  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b py-10 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#1A2332]">Каталог мер поддержки</h1>
          <p className="mt-2 text-lg text-muted-foreground">Найдите подходящую программу для вашего бизнеса среди 70+ мер</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <ServiceCatalog />
      </div>
    </div>
  );
}
