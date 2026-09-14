interface StudyMember {
  id: number;
  name: string;
  role: "leader" | "member";
  githubId?: string;
}

const members: StudyMember[] = [
  { id: 1, name: "권희", role: "leader", githubId: "gwoni" },
  { id: 2, name: "밀레오", role: "member" },
];

function getMemberInfo(memberId: number): string {
  const member = members.find((m) => m.id === memberId);
  if (!member) return `${memberId}번 회원을 찾을 수 없습니다.`;

  const roleName = member.role === "leader" ? "스터디 리더" : "스터디원";
  return `${member.name} / ${roleName} / GitHub: ${member.githubId ?? "미등록"}`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));
