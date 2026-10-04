

function formatStudyWeek(week: unknown) {

  if (typeof week === "number") {
    return `현재 ${week}주차예요.`;
  }

  if (typeof week === "string") {
    return `입력한 주차: ${week}`;
  }

  return "주차를 확인할 수 없어요.";
}

console.log(formatStudyWeek(1));
console.log(formatStudyWeek("1주"));
console.log(formatStudyWeek(true));
