const scores = [70, 60, 50, 40, 30, 20, 19, 18]  // 점수 배열이 그때그때 달라질 수 있음!
const [goldMedal, silverMedal, bronzeMedal, ...basicPrize] = scores
console.log("금메달 :" + goldMedal)
console.log("은메달 :" + silverMedal)

const user = {
    username: 'kai',
    email: 'abc@tt.cc',
    device: 'Mobile',
    authorized: true,
    isAdmin: false
}

// 객체에서 개별 속성들을 변수로 꺼낼 수 있음 (객체 내 속성 값은 유지)
const { username, device, isAdmin } = user;
console.log(username)
console.log(isAdmin)

// 속성에 새로운 이름을 지정할 수 있음
const { email: mailAddr, device: machine, isAdmin: adminAuth } = user;
console.log(mailAddr)
console.log(machine)

// ...restArgs 구문으로 남은 속성만 객체로 묶을 수 있음 (관심 없는 것을 제외하는 유용한 구문!)
const { isAdmin: isAdmin2, ...restArgs } = user;
console.log(restArgs);
// { username: 'kai',
//   email: 'abc@tt.cc',
//   device: 'Mobile',
//   authorized: true }