import { getTranslations, setRequestLocale } from "next-intl/server";
import { TASKS_CONFIG } from "@/components/dashboard/entity-configs";
import { EntityManager } from "@/components/dashboard/entity-manager";
import { TaskBoard } from "@/components/dashboard/task-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fa = locale === "fa";
  const t = await getTranslations("dash");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {t("tasks")}
      </h1>
      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">{fa ? "برد" : "Board"}</TabsTrigger>
          <TabsTrigger value="table">{fa ? "جدول" : "Table"}</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="mt-4">
          <TaskBoard />
        </TabsContent>
        <TabsContent value="table" className="mt-4">
          <EntityManager {...TASKS_CONFIG} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
