import { Metadata } from "next";
import NewsCatalog from "@/components/news/NewsCatalog";

export const metadata: Metadata = {
  title: "Пресс-центр | Байтерек",
  description: "Главные новости холдинга Байтерек и дочерних организаций",
};

export default function NewsPage() {
  return <NewsCatalog />;
}
