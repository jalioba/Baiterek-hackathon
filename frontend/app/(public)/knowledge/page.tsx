import { Metadata } from "next";
import KnowledgeBase from "@/components/knowledge/KnowledgeBase";

export const metadata: Metadata = {
  title: "База знаний | Байтерек",
  description: "Полезные материалы, ответы на частые вопросы и шаблоны документов для бизнеса",
};

export default function KnowledgePage() {
  return <KnowledgeBase />;
}
