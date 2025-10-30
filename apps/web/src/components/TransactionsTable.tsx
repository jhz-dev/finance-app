import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/domain/transaction/transaction";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import { EditTransactionDialog } from "./EditTransactionDialog";

interface TransactionsTableProps {
	transactions: Transaction[];
	budgetId: string;
}

export function TransactionsTable({
	transactions,
	budgetId,
}: TransactionsTableProps) {
	const { t } = useTranslation();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] =
		useState<Transaction | null>(null);

	const deleteTransactionMutation = useDeleteTransaction(budgetId);

	const columns: ColumnDef<Transaction>[] = useMemo(
		() => [
			{
				accessorKey: "description",
				header: t("Description"),
			},
			{
				accessorKey: "amount",
				header: () => <div className="text-right">{t("Amount")}</div>,
				cell: ({ row }) => {
					const amount = parseFloat(row.getValue("amount"));
					const formatted = new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(amount);

					return <div className="text-right font-medium">{formatted}</div>;
				},
			},
			{
				accessorKey: "type",
				header: t("Type"),
			},
			{
				accessorKey: "date",
				header: t("Date"),
				cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
			},
			{
				id: "actions",
				cell: ({ row }) => {
					const transaction = row.original;

					return (
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
											setSelectedTransaction(transaction);
											setIsEditDialogOpen(true);
										}}
									>
										{t("Edit")}
									</DropdownMenuItem>
									<AlertDialogTrigger asChild>
										<DropdownMenuItem className="text-red-500">
											{t("Delete")}
										</DropdownMenuItem>
									</AlertDialogTrigger>
								</DropdownMenuContent>
							</DropdownMenu>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
									<AlertDialogDescription>
										{t(
											"This action cannot be undone. This will permanently delete the transaction.",
										)}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
									<AlertDialogAction
										onClick={() =>
											deleteTransactionMutation.mutate(transaction.id)
										}
									>
										{t("Delete")}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					);
				},
			},
		],
		[t, deleteTransactionMutation],
	);

	const table = useReactTable({
		data: transactions,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	return (
		<div>
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
			<div className="rounded-md border border-white/20 bg-background">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="border-white/20">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="text-white">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="border-white/10"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{t("No transactions found.")}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{selectedTransaction && (
				<EditTransactionDialog
					isOpen={isEditDialogOpen}
					setIsOpen={setIsEditDialogOpen}
					transaction={selectedTransaction}
					budgetId={budgetId}
				/>
			)}
		</div>
	);
}
