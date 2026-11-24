type WeeklyGoal = {
  title: string;
  targetCount: number;
};

const weeklyGoal: WeeklyGoal = {
  title: "TypeScript 예제 연습",
  targetCount: 3,
};

function printGoal(goal: WeeklyGoal): string {
  console.log(goal.title);
  return goal.title;
}

printGoal(weeklyGoal);

