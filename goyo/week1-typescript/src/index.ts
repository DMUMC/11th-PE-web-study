type StudyMember = {
  id: number;
  name: string;
  role: string;
  githubId?: string;
};

const members: StudyMember[] = [
  { id: 1, name: "광수",role:"leader", githubId: "gwangsoo" },
  { id:2,name: "지수", role:"member" },
];

function printMemberInfo(id: number){
    for (const member of members ){
        if(member.id===id){
            console.log(`name : ${member.name}`);
            console.log(`role : ${member.role}`);
            console.log(`githubId : ${member.githubId ?? "no github"}`);
        }
    }
}

printMemberInfo(1);
printMemberInfo(2);
printMemberInfo(999);