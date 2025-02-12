function greet(name) {
    console.log("Hello, " + name + "!");
}
greet("John");

const greetFuncObj = function(name) {
    // 함수는 일급 객체이므로 변수에 할당 가능!
    console.log("Hello, " + name + "!");
};

console.log(greetFuncObj)
console.log(typeof greetFuncObj)
console.log(typeof [1,2,3]);
// currying -> ()()()()()()()()() 문법이 있음
// 세미콜론 자동완성이 연속된 괄호 사이를 감지하지 않음

(function(name) {
    console.log("Hello, " + name + "!");
})("Everyone!");

function rollDice(dicePlanes = 6) {
    return Math.floor(Math.random() * dicePlanes) + 1;
}

console.log(rollDice(100));