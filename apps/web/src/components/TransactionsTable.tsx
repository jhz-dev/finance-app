import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Transaction } from "@/domain/transaction/transaction";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import { TransactionItem } from "./TransactionItem";

interface TransactionsTableProps {
	transactions: Transaction[];
	budgetId: string;
}

export function TransactionsTable({
	transactions,
	budgetId,
}: TransactionsTableProps) {
	const { t } = useTranslation();

	const deleteTransactionMutation = useDeleteTransaction(budgetId);

	return (
		<div className="space-y-4">
			{deleteTransactionMutation.isError && (
				<Alert variant="destructive">
					<AlertTitle>{t("Error")}</AlertTitle>
					<AlertDescription>
						{t("Failed to delete transaction.")}
					</AlertDescription>
				</Alert>
			)}
			{deleteTransactionMutation.isSuccess && (
				<Alert>
					<AlertTitle>{t("Success!")}</AlertTitle>
					<AlertDescription>
						{t("Transaction deleted successfully!")}
					</AlertDescription>
				</Alert>
			)}
			<h2 className="text-2xl font-bold text-slate-900 mb-4">{t("Transactions")}</h2>
			<div className="bg-white rounded-3xl shadow-2xl p-6">
				{transactions.length > 0 ? (
					<div className="divide-y divide-slate-100">
						{transactions.map((transaction) => (
							<TransactionItem key={transaction.id} transaction={transaction} budgetId={budgetId} />
						))}
					</div>
				) : (
					<p className="text-slate-500 text-center py-4">{t("No transactions found.")}</p>
				)}
			</div>
		</div>
	);
}
