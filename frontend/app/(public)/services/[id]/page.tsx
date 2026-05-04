import { SERVICES } from "@/lib/mock-data";
import ServiceDetails from "@/components/services/ServiceDetails";
import { Metadata } from "next";

export async function generateStaticParams() {
  return SERVICES.map((s) => ({
    id: s.id,
  }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const service = SERVICES.find((s) => s.id === params.id) || SERVICES[0];
  return {
    title: `${service.title} | Байтерек`,
    description: service.description,
  };
}

export default function ServicePage({ params }: { params: { id: string } }) {
  return <ServiceDetails id={params.id} />;
}
