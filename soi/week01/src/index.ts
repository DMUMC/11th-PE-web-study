type MemberRole = "leader" | "member";

type StudyMember = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

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

function memberInfo(id: number) {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return id + "번 회원을 찾을 수 없습니다.";
  }

  if (!member.githubId) {
    return member.name + " 님은 GitHub 아이디가 없습니다.";
  }

  return member.name + " 님의 GitHub 아이디는 " + member.githubId + "입니다.";
}

console.log(memberInfo(1));
console.log(memberInfo(2));
console.log(memberInfo(999));
/*
interface StudyMember {
  id: number;
  name: string;
  role: string;
  githubId?: string;
}

type StudyMemberType = {
  id: number;
  name: string;
  role: string;
  githubId?: string;
};

선택 미션1
type과 interface는 모두 객체의 형태와 각 속성의 타입을 정의할 수 있다는 공통점이 있습니다.
type은 유니언 타입 등 다양한 타입을 표현할 수 있고 interface는 주로 객체의 형태를 정의할 때 사용합니다.
type은 같은 이름으로 다시 선언할 수 없지만 interface는 같은 이름으로 선언하면 내용이 합쳐집니다.

const studyHour: number | undefined = 0;
console.log(studyHour || 1); // 1
console.log(studyHour ?? 1); // 0

선택 미션2
||는 0을 false 값으로 판단하기 때문에 결과가 1입니다.
??는 null 또는 undefined일 때만 오른쪽 값을 사용합니다.
0은 null이나 undefined가 아니므로 결과가 0입니다.


function formatMemberId(input: unknown) {
  if (typeof input === "number") {
    return "MEMBER-" + input;
  }

  if (typeof input === "string") {
    return input.toUpperCase();
  }

  return "잘못된 값입니다.";
}

console.log(formatMemberId(1));
console.log(formatMemberId("member-01"));
console.log(formatMemberId(true));
*/