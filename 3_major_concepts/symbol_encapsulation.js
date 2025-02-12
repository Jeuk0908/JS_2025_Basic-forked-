// Symbol을 생성해 객체 키 지정
const myObj = {
    [Symbol("key")]: "value"
};

// Symbol 키에 접근
// 접근 시도 1) "key" 라는 용도에 대한 string 값을 알때, 해당 값으로 Symbol 재생성
//            => 실패
console.log(myObj[Symbol("key")]); // undefined

// 접근 시도 2) 필드 선언에 사용된 정확한 객체를 참조해 온 뒤, 객체 키로 필드 접근
//            => 성공
const keySymbol = Object.getOwnPropertySymbols(myObj)[0]
console.log(myObj[keySymbol]); // "value"

// ========= 일반 객체로는 은닉효과를 가져올 수 없음 =========
// 키 객체를 생성
const keyObject = { name: "key" };
// 객체 내에서 키로 사용
const myObj2 = {
    [keyObject]: "value"
};

// 아무 Object 나 키로 사용해도 값에 접근 가능 ㅠㅠ
console.log(myObj2[new Object()]); // "value"
