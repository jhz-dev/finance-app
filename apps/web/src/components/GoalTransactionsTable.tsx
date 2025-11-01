import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import type { GoalTransaction } from "@/domain/goal/goal";

interface GoalTransactionsTableProps {
  transactions: GoalTransaction[];
}

export function GoalTransactionsTable({
  transactions,
}: GoalTransactionsTableProps) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("Description")}</TableHead>
          <TableHead>{t("Amount")}</TableHead>
          <TableHead>{t("Date")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.transaction.description}</TableCell>
            <TableCell>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(transaction.amount)}
            </TableCell>
            <TableCell>
              {new Date(transaction.transaction.date).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
