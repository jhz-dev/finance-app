import { useState } from "react";
import type { FinancialGoal } from "../goal";
import { UpdateGoalForm } from "./UpdateGoalForm";
import { useDeleteGoal } from "@/hooks/useDeleteGoal";

export const GoalItem = ({ goal }: { goal: FinancialGoal }) => {
	const [isEditing, setIsEditing] = useState(false);

	const { mutate: deleteGoal } = useDeleteGoal();

  return (
    <div>
      {isEditing ? (
        <UpdateGoalForm goal={goal} onDone={() => setIsEditing(false)} />
      ) : (
        <div>
          <h2>{goal.name}</h2>
          <p>
            {goal.currentAmount} / {goal.targetAmount}
          </p>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button type="button" onClick={() => deleteGoal(goal.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
