
function createBox<T>(value: T) {
  return { value };
}

const strBox = createBox("문자열");
const numBox = createBox(123);
const memberBox = createBox({ name: "광수", level: 1 });

console.log(strBox.value);
console.log(numBox.value);
console.log(memberBox.value);
