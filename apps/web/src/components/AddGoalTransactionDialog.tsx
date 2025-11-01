import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { useQuery } from "@tanstack/react-query";

const addTransactionSchema = z.object({
  transactionId: z.string(),
  amount: z.number(),
});

interface AddGoalTransactionDialogProps {
  goalId: string;
}

export function AddGoalTransactionDialog({
  goalId,
}: AddGoalTransactionDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: budgets } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => budgetRepository.getAll(1, 100), // Assuming the user has less than 100 budgets
  });

  const form = useForm<z.infer<typeof addTransactionSchema>>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      transactionId: "",
      amount: 0,
    },
  });

  const { mutate } = useMutation({
    mutationFn: (data: z.infer<typeof addTransactionSchema>) =>
      goalRepository.addTransaction(goalId, data.transactionId, data.amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", goalId] });
      form.reset();
    },
  });

  function onSubmit(data: z.infer<typeof addTransactionSchema>) {
    mutate(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t("Add Transaction")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Add Transaction")}</DialogTitle>
          <DialogDescription>
            {t("Add a new transaction to this goal.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Transaction")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a transaction")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {budgets?.budgets.map((budget) =>
                        budget.transactions.map((transaction) => (
                          <SelectItem
                            key={transaction.id}
                            value={transaction.id}
                          >
                            {transaction.description}
                          </SelectItem>
                        )),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Amount")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{t("Add")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
