export {};

type StudyMember = {
  name: string;
  level: number;
  isLeader: boolean;
};

const member: StudyMember = {
  name: "광수",
  level: 1,
  isLeader: false,
};

function createMemberCard(studyMember: StudyMember) {
  return studyMember.name + " 님, " + studyMember.level + "레벨";
}

console.log(createMemberCard(member));
