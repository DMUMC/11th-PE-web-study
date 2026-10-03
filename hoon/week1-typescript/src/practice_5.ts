
type MemberRole = "leader" | "member";

function getRoleMessage(role: MemberRole) {

  if (role === "leader") {
    return "스터디를 이끌어요.";
  } else if (role === "member") {
    return "스터디에 참여해요.";
  }
}

console.log(getRoleMessage("leader"));
console.log(getRoleMessage("member"));

export {};
