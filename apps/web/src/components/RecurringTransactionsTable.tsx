import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import type { RecurringTransaction } from "@/domain/transaction/recurring-transaction";

interface RecurringTransactionsTableProps {
  transactions: RecurringTransaction[];
}

export function RecurringTransactionsTable({
  transactions,
}: RecurringTransactionsTableProps) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("Description")}</TableHead>
          <TableHead>{t("Amount")}</TableHead>
          <TableHead>{t("Frequency")}</TableHead>
          <TableHead>{t("Start Date")}</TableHead>
          <TableHead>{t("End Date")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(transaction.amount)}
            </TableCell>
            <TableCell>{transaction.frequency}</TableCell>
            <TableCell>
              {new Date(transaction.startDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {transaction.endDate
                ? new Date(transaction.endDate).toLocaleDateString()
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
