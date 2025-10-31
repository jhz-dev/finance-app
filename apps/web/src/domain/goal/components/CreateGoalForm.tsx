import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";

export const CreateGoalForm = () => {
  const queryClient = useQueryClient();

  const { mutate: createGoal } = useMutation({
    mutationFn: (goal) => goalRepository.create(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      targetAmount: 0,
    },
    onSubmit: async ({ value }) => {
      createGoal(value);
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
      <button type="submit">Create Goal</button>
    </form>
  );
};
