function rollDice() {
    let diceNum = Math.floor(Math.random() * 6) + 1
    console.log(diceNum)
    return diceNum;
}
function greet(name) {
    console.log("Hello, " + name + "!");
}
function callMultiple(func, times) {
    for (let i = 0; i < times; i++) {
        func(); // 주어진 횟수만큼 함수 호출
    }
}

// rollDice 함수를 3번 호출하는 callMultiple 함수 실행
callMultiple(rollDice, 3);
callMultiple(greet, 10);

// === Currying 예제 (함수를 리턴하는 함수 활용) ===
function createMultiplier(factor) {
    // 내부에서 선언과 리턴을 동시에!
    return function(number) {
        return number * factor;
    };
}  // Factory Pattern 이 함수에 대해 적용되었다고 볼 수 있음
console.log(
    // currying 문법 ()() 간단한 예제
    createMultiplier(10)(20)
)

// 함수형 프로그래밍의 패턴
// 1) Input 외의 외부 상태에 의존하지 않는 로직 설계
// 2) 해당 로직을 수행하는 데 필요한 연산과정에 단계별 이름을 짓고 구획을 나눔
// 3) 각 이름에 해당하는 함수를 선언 (중첩형, 다음 단계 처리할 함수를 리턴)
// 4) Currying 방식으로 중첩 구조 설정 후 연쇄호출 "()()" 수행

let hahaha = a => console.log('hahahaha')
callMultiple(hahaha, 3)

