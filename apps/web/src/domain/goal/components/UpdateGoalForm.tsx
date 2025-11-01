import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";
import { FinancialGoal } from "../goal";

export const UpdateGoalForm = ({ goal, onDone }: { goal: FinancialGoal, onDone: () => void }) => {
  const queryClient = useQueryClient();

  const { mutate: updateGoal } = useMutation({
    mutationFn: (values: { name: string; targetAmount: number, currentAmount: number }) =>
      goalRepository.update(goal.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      onDone();
    },
  });

  const form = useForm({
    defaultValues: {
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
    },
    onSubmit: async ({ value }) => {
      updateGoal(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        children={(field) => (
          <input
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            aria-label="Name"
          />
        )}
      />
      <form.Field
        name="targetAmount"
        children={(field) => (
          <input
            name={field.name}
            type="number"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
            aria-label="Target Amount"
          />
        )}
      />
       <form.Field
        name="currentAmount"
        children={(field) => (
          <input
            name={field.name}
            type="number"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
            aria-label="Current Amount"
          />
        )}
      />
      <button type="submit">Update Goal</button>
      <button type="button" onClick={onDone}>Cancel</button>
    </form>
  );
};
