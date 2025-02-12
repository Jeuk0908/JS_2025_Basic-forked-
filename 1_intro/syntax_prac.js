console.log(my_var1);
// 변수 호이스팅!
// => JS 에서는 변수, 함수, 클래스 등등에 대해서
//    선언부 위에서도 해당 이름을 감지할 수 있음 (끌올)
//    Java 에서 미리 클래스 선언을 전부 감지하는 것과 같음

// console.log(my_let1);
// console.log(my_const1);

// 부작용 : 전역변수임
var my_var1 = 1;
var my_var2 = 2;

// 개선 : 지역변수
let my_let1 = 1;
let my_let2 = 2;
// 코드 블록 밖에서 영향을 미치지 않고 변수 라이프사이클 종료
// => 사용하기에 안전함

const my_const1 = 1;
const my_const2 = 2;

console.log("modulo 연산! 100 % 4 = " + 100 % 4)
console.log("modulo 연산! 100 % 3 = " + 100 % 3)

console.log("지수 연산! 2 ** 10 = " + 2**10)

console.log("0으로 나누면 어떻게 될까? 10/0 = " + 10/0)
console.log("Infinity 를 연산에 포함시키기 10/Infinity = " + 10/Infinity)
console.log("Infinity 를 연산에 포함시키기 10/(10/0) = " + 10/(10/0))
console.log("NaN 은 Not a Number (Infinity/Infinity = " + Infinity/Infinity + ")")
console.log("NaN 과의 연산은 NaN : " + (NaN + Infinity))

