type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember[] = [
  {
    id: 1,
    name: "광수",
    role: "leader",
    githubId: "gwangsoo",
  },
  {
    id: 2,
    name: "지수",
    role: "member",
  },
];

function createMemberMessage(memberId: number): string {
  const foundMember = members.find((member) => member.id === memberId);

  if (!foundMember) {
    return "해당 회원을 찾을 수 없어요.";
  }

  const roleMessage =
    foundMember.role === "leader"
      ? "스터디를 이끌어요."
      : "스터디에 참여해요.";
  const githubId = foundMember.githubId ?? "등록되지 않음";

  return (
    foundMember.name +
    " 님은 " +
    roleMessage +
    " GitHub: " +
    githubId
  );
}

console.log(createMemberMessage(1));
console.log(createMemberMessage(2));
console.log(createMemberMessage(999));
