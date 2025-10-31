import { useQuery } from "@tanstack/react-query";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";
import { GoalItem } from "./GoalItem";
import { CreateGoalForm } from "./CreateGoalForm";

export const GoalList = () => {
  const { data: goals, isLoading, isError } = useQuery({
    queryKey: ["goals"],
    queryFn: goalRepository.getAll,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading goals</div>;
  }

  return (
    <div>
      <CreateGoalForm />
      {goals?.map((goal) => (
        <GoalItem key={goal.id} goal={goal} />
      ))}
    </div>
  );
};
