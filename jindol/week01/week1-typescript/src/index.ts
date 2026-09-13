// 1. 회원 정보 타입
type MemberRole = "leader" | "member";

type StudyMember = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string; // 선택 proporty
};

// 2. 회원 2명 이상 작성
const members: StudyMember[] = [
  { id: 1, name: "진서", role: "leader", githubId: "jinDol" },
  { id: 2, name: "수목", role: "member"}, 
  { id: 99, name: "상혁", role: "member"}
];

// 3. 회원 ID로 정보로 안내 문구
function getMemberNotice(id: number) {
  // 회원 ID로 검색
  const foundMember = members.find((member) => member.id === id);

  // 존재하지 않는 회원
  if (!foundMember) {
    return `ID가 ${id}인 회원을 찾을 수 없습니다.`;
  }

  // ?. 및 ?? 연산자로 안전하게

    const githubIdText = foundMember?.githubId ?? "등록되지 않음";
    const roleText = foundMember.role === "leader" ? "리더" : "멤버";

  return `[${roleText}] ${foundMember.name} 님 (GitHub: ${githubIdText})`;
}

console.log(getMemberNotice(1));  
console.log(getMemberNotice(2));  
console.log(getMemberNotice(999)); 