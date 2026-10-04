type MemberRole = "leader" | "member";

type StudyMember = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const members: StudyMember[] = [
  { id: 1, name: "코그모", role: "leader", githubId: "kogmaw" },
  { id: 2, name: "야스오", role: "member" },
  { id: 3, name: "아리", role: "member", githubId: "ahri" },
  { id: 4, name: "티모", role: "member", githubId: "teemo" },
];

function findInformation(id: number): string {
  const member = members.find((member) => member.id === id);
//members.find(...)  members배열에서 조건에 맞는 첫 번째 요소를 찾는다.
//members의 각 요소를 하나씩 member(member가 아니라 abc이렇게 써도됨)에 넣어본다. 요소의 id가 매개변수 id값과 같으면
// member 변수에 넣는다.

  if (!member) {
    return `ID ${id}에 해당하는 회원이 없습니다.`;
  }

  const roleText = member.role === "leader" ? "리더" : "멤버";
  const githubText = member.githubId
    ? `(GitHub ID: ${member.githubId})`
    : "(GitHub 미등록)";

  return `${member.name}님은 ${roleText}입니다. ${githubText}`;
}

console.log(findInformation(1));
// 코그모님은 리더입니다. (GitHub ID: kogmaw)

console.log(findInformation(2));
// 야스오님은 멤버입니다. (GitHub 미등록)

console.log(findInformation(999));
// ID 999에 해당하는 회원이 없습니다.

