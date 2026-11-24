export {};

type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember[] = [
  { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "member" },
];

function printMemberInfo(targetId: number) {
  const member = members.find((m) => m.id === targetId);

  if (member) {
    const githubId = member.githubId ?? "등록되지 않음";
    const roleMsg = member.role === "leader" ? "리더" : "멤버";
    console.log(`[${member.id}] ${member.name} 님은 스터디 ${roleMsg}입니다. (GitHub: ${githubId})`);
  } else {
    console.log(`ID가 ${targetId}인 회원을 찾을 수 없습니다.`);
  }
}

console.log("=== 필수 미션 결과 ===");
printMemberInfo(1);
printMemberInfo(2);
printMemberInfo(999);

type StudyMemberType = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const studyHour: number | undefined = 0;
console.log("\n=== 선택 미션: || 와 ?? 의 차이 ===");
console.log("|| 사용:", studyHour || 1);
console.log("?? 사용:", studyHour ?? 1);

function formatMemberId(input: unknown): string {
  if (typeof input === "string") {
    return `MEMBER-${input.toUpperCase()}`;
  }
  if (typeof input === "number") {
    return `MEMBER-${input}`;
  }
  return "유효하지 않은 회원 ID입니다.";
}

console.log("\n=== 선택 미션: unknown 타입 좁히기 ===");
console.log(formatMemberId("abc"));
console.log(formatMemberId(123));
console.log(formatMemberId(true));
