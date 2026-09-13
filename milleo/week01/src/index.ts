interface StudyMember {
    id: number;
    name: string;
    role: "leader" | "member";
    githubId?: string;
}

const members: StudyMember[] = [
    { id: 1, name: "다윗", role: "leader", githubId: "dawit" },
    { id: 2, name: "유림", role: "member" },
];

function getMemberInfo(memberId: number) {
    const member = members.find((member) => member.id === memberId);

    if (member === undefined) {
        return `${memberId}번 회원을 찾을 수 없습니다.`;
    }

    const roleName = member.role === "leader" ? "스터디 리더" : "스터디원";
    const githubId = member.githubId ?? "미등록";

    return `${member.name} / ${roleName} / GitHub: ${githubId}`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));