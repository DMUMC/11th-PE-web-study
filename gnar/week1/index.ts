//스터디 회원 관리 프로그램 완성하기
//회원의 ID, 이름, 역할과 선택 값인 GitHub 아이디를 타입으로 표현하고,
// // 서로 다른 정보를 가진 회원 두 명 이상을 작성해요.
type Member = {
  id : number;
  name : string;
  role : string;
  githubId? : string;
};

const members: Member[] = [
  {
    id: 1,
    name : "영중",
    role : "Web Developer",
    githubId : "Youngjoong",
  },
  {
    id: 2,
    name : "나르",
    role : "League_Of_Legend Developer",
    githubId : "Yanasna"
  },
];
//회원 ID로 정보를 찾아 안내 문구를 만들고, GitHub 아이디가 없는 회원과
//  존재하지 않는 회원도 오류 없이 처리해요.
function findMember(id: number): string {
  const member = members.find((member) => member.id === id); 

  if (!member) {
    return `ID ${id}에 해당하는 회원을 찾을 수 없습니다.`;
  }

  if (member.githubId) {
    return `${member.name}님은 ${member.role} 역할이며 GitHub 아이디는 ${member.githubId}입니다.`;
  }

  return `${member.name}님은 ${member.role} 역할이며 GitHub 아이디가 없습니다.`;
}
//회원 ID 1, 2, 999를 전달한 결과를 확인하고
//  pnpm exec tsc --noEmit, 컴파일과 실행을 모두 완료해요.
console.log(findMember(1));
console.log(findMember(2));
console.log(findMember(999));