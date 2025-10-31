import { useTranslation } from "react-i18next";
import { ArrowDownCircle, ArrowUpCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { Transaction } from "@/domain/transaction/transaction";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { EditTransactionDialog } from "./EditTransactionDialog";

interface TransactionItemProps {
  transaction: Transaction;
  budgetId: string;
}

export function TransactionItem({ transaction, budgetId }: TransactionItemProps) {
  const { t } = useTranslation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const deleteTransactionMutation = useDeleteTransaction(budgetId);

  const isIncome = transaction.type === "INCOME";
  const amountColorClass = isIncome ? "text-emerald-600" : "text-rose-500";
  const icon = isIncome ? (
    <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
  ) : (
    <ArrowDownCircle className="h-5 w-5 text-rose-500" />
  );

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(transaction.amount);

  const formattedDate = new Date(transaction.date).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <>
      <div className="flex justify-between items-center py-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <p className="text-slate-900 font-medium">{transaction.description}</p>
            {transaction.category && (
              <p className="text-slate-500 text-sm">{transaction.category}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <p className={`font-semibold ${amountColorClass}`}>
              {formattedAmount}
            </p>
            <p className="text-slate-400 text-sm">{formattedDate}</p>
          </div>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t("Open menu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setIsEditDialogOpen(true);
                  }
                  }>
                  {t("Edit")}
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-500">
                    {t("Delete")}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent className="bg-white rounded-3xl shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    "This action cannot be undone. This will permanently delete the transaction.",
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-200 text-slate-700 rounded-full py-3 px-6 font-semibold hover:bg-slate-300 transition-all">{t("Cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    deleteTransactionMutation.mutate(transaction.id)
                  }
                  className="bg-emerald-500 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  {t("Delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {isEditDialogOpen && (
        <EditTransactionDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          transaction={transaction}
          budgetId={budgetId}
        />
      )}
    </>
  );
}
