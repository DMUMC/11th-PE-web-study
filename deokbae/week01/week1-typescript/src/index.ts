type MemberRole = "leader" | "member";

type StudyMember = {
    id : number;
    name: string;
    role : MemberRole;
  githubId?: string;
};

const members: StudyMember[] = [
  { id : 1, name: "재석", role : "leader", githubId: "bestMC" },
  { id : 2, name: "광수", role : "member" },
  { id : 3, name: "석진", role : "member", githubId: "raceStrater" },
];

function findInfo(id:number) : string {
  const checkMember = members.find((member)=>member.id === id);

  // ID에 없는 회원 처리
  if(!checkMember){
    return `ID ${id}에 해당하는 회원은 존재하지 않습니다`
  }

  // GitHub ID 없는 회원 처리
   const githubText = checkMember.githubId ? `(GitHub ID: ${checkMember.githubId})` : "(GitHub 미등록)";

   return `${checkMember.name}님은 ${checkMember.role === "leader" ? "리더" : "멤버"}예요. ${githubText}`;

}