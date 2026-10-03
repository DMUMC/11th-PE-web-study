type StudyMemberOpt = {
  name: string;
  githubId?: string;
};

const membersList: StudyMemberOpt[] = [
  { name: "광수", githubId: "gwangsoo" },
  { name: "지수" },
];

const missingMember = membersList.find(m => m.name === "현우");
console.log(missingMember);

let selectedMember: StudyMemberOpt | null = null;
console.log(selectedMember);

if (membersList[0]) {
  console.log(membersList[0].name);
}

const studyHour: number | undefined = 0;
console.log(studyHour || 1);
console.log(studyHour ?? 1);

const displayGithubId = membersList[1]?.githubId ?? "등록되지 않음";
console.log(displayGithubId);
