import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { AddGoalTransactionDialog } from "@/components/AddGoalTransactionDialog";
import { GoalTransactionsTable } from "@/components/GoalTransactionsTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/goals/detail")({
  component: GoalDetailPage,
});

function GoalDetailPage() {
  const { goalId } = useParams({ from: "/goals/$goalId" });
  const { t } = useTranslation();

  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ["goals", goalId],
    queryFn: () => goalRepository.getById(goalId),
    enabled: !!goalId,
  });

  return (
    <div>
      {isPending && (
        <h1 className="text-3xl font-bold text-slate-900">{t("Loading...")}</h1>
      )}
      {isError && (
        <h1 className="text-3xl font-bold text-red-500">
          {t("Error: {{message}}", { message: error.message })}
        </h1>
      )}
      {isSuccess && data && (
        <div>
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/goals">{t("Goals")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900">{data.name}</h1>
            <AddGoalTransactionDialog goalId={goalId} />
          </div>
          <GoalTransactionsTable transactions={data.goalTransactions} />
        </div>
      )}
    </div>
  );
}
