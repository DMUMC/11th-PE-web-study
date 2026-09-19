//Mission

// type Member = {
//     Id: number,
//     role: string,
//     gitHubId?: string,
// }

// const member = [
//     {
//         id: 1,
//         role: "member",
//         gitHubId: "zzongzzong"
//     },
//     {
//         id: 2,
//         role: "member",
//     }
// ]

// const findMember = member.find((member) => member.id === 1);
// if (findMember) {
//     console.log("안녕하세요 " + findMember.gitHubId + "님");
// } else {
//     console.log("존재하지 않는 회원입니다.");
// }

// const findMember2 = member.find((member) => member.id === 2);
// if (findMember2) {
//     console.log("안녕하세요 " + findMember2.gitHubId + "님");
// } else {
//     console.log("존재하지 않는 회원입니다.");
// }

// const findMember3 = member.find((member) => member.id === 999);
// if (findMember3) {
//     console.log("안녕하세요 " + findMember3.gitHubId + "님");
// } else {
//     console.log("존재하지 않는 회원입니다.");
// }

//selecMission
type StudyMember = {
    member: string,
    level: number,
}
interface Study {
    member: string,
}
interface Study {
    level: number
}

const plus: Study = {
    member: "zzongzzong",
    level: 3
}


//test1
// const courseName = "TypeScript";
// console.log("이번 주 학습 주제: " + courseName);

//test2
// const currentLevel: number = 1;
// console.log("현재 레벨: " + currentLevel);

//test3
// function introduceStudent(studentName: string, currentLevel: number) {
//     return studentName + " 님은 현재 " + currentLevel + "레벨이에요.";
// }

// introduceStudent("광수", 1);

//test4
// let studentName = "광수";
// let currentLevel = 1;
// let isCompleted = false;

// console.log(studentName, currentLevel, isCompleted);

//test5
// const firstMember = { name: "광수" };
// const secondMember = { name: "광수" };
// const sameMember = firstMember;

// //내용은 같지만 객체가 다르므로 false
// console.log(firstMember === secondMember);
// //같은 객체를 가리키므로 true
// console.log(firstMember === sameMember);

//test6
// const studyMember = { name: "광수" };
// studyMember.name = "지수";
// console.log(studyMember.name);

//다른 객체를 다시 넣을 수 없음
// studyMember = { name: "현우" };

//miniTest
// const member = "zzongzzong";
// const week = "fist";
// const completed = "current";

//test7
// type MemberProfile = {
//     name: string;
// };
// type GithubProfile = {
//     githubId: string;
// }
// type MemberWithGithub = MemberProfile & GithubProfile;

// const gwangsooProfile: MemberWithGithub = {
//     name: "광수",
//     githubId: "gwangsoo",
// }

// console.log(gwangsooProfile.name, gwangsooProfile.githubId);

//test8
// type StudentName = string;
// interface StudyMember {
//     name: StudentName;
// }
// interface StudyMember {
//     level: number;
// }
// const member: StudyMember = {
//     name: "광수",
//     level: 1,
// }

//minitest2
// type StudyMember = {
//     name: string;
//     level: number;
//     isLeader: boolean;
// };

// const member: StudyMember = {
//     name: "광수",
//     level: 1,
//     isLeader: true,
// };

// function createMemberCard(studyMember: StudyMember) {
//     return studyMember.name + " 님, " + studyMember.level
// }

// console.log(createMemberCard(member));

//test9
// function printMemberId(memberId: string | number) {
//     console.log(memberId);
// }

// printMemberId("member-01");
// printMemberId(1);

// function formatMemberId(memberId: string | number) {
//     if (typeof memberId === "string") {
//         return memberId.toUpperCase();
//     }
//     return "MEMBER-" + memberId;
// }

// const answer = formatMemberId("zzongzzong");
// console.log(answer);

//test10
// type StudyMember = {
//     name: string;
//     githubId?: string;
// }

// const members: StudyMember[] = [
//     { name: "쫑쫑", githubId: "zzongzzong" },
//     { name: "지수" },
// ]

// let selectedMember: StudyMember | null = null;
// const foundMember = members.find((member) => member.name === "쫑쫑");
// console.log(selectedMember);
// console.log(foundMember);

// selectedMember = { name: "쫑쫑", githubId: "zzongzzong" };

// if (foundMember) {
//     console.log(foundMember.name);
// } else {
//     console.log("회원을 찾지 못했어요.");
// }

//test11
// type StudyResult = | { status: "success"; completedCount: number } | { status: "error"; message: string };
// function printStudyResult(result: StudyResult) {
//     if (result.status === "success") {
//         console.log("완료한 과제: " + result.completedCount)
//         return;
//     }

//     console.log("오류: " + result.message);
// }

//miniTest
// type MemberRole = "leader" | "member";

// function Role(role: MemberRole) {
//     if (role === "leader") {
//         console.log("스터디를 이끌어요");
//     } else if (role === "member") {
//         console.log("스터디에 참여해요.");
//     } else {
//         console.log("정하지 않은 역할입니다.");
//     }
// }

// Role("leader");
// Role("member");


//pratice
// type Member = {
//     name: string,
//     age: number
// }

// const member =
//     [
//         { name: "쫑쫑", age: 23 },
//     ]

// const find = member.find((member) => (member.name === "씨앗"));

// if (find) {
//     console.log(find);
// }