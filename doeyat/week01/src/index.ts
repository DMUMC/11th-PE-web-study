type StudyMember = {
    name: string;
    id: number;
    role: string;
    githubId?: string;
};

const members: StudyMember[] = [
    { name: "광수", id: 1, role: 'member', githubId: "gwangsoo" },
    { name: "지수", id: 2, role: "leader" },
];


const getMember = (memberId : number) =>{
    const member = members.find((m) => m.id === memberId);
    if (!member) return `${memberId}번 회원을 찾을 수 없습니다.`

    return `${member.id}번 회원 : ${member.name} | ${member.role} | ${member.githubId ?? ""}`
}

console.log(getMember(1))
console.log(getMember(2))
console.log(getMember(999))