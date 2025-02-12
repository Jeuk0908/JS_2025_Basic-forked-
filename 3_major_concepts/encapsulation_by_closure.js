function createCounter(init_count)
{
    let count = init_count; // count 변수를 함수 내부에 은닉

    // 은닉한 count 변수에 접근하는 클로저 함수 선언
    function increment() {
        console.log('현재 count 값:', ++count);
    }
    function decrement() {
        console.log('현재 count 값:', --count);
    }

    // 은닉된 스코프에 접근하는 클로저 함수를 포함한 counter 객체 반환
    return {
        // count: count,
        increment: increment,
        decrement: decrement
    };
}

const myCounter = createCounter(10);
myCounter.increment()
myCounter.decrement()
console.log(myCounter.count)