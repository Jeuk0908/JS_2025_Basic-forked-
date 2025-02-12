function sayName() {
    console.log("My name is " + this.name);
}

const person1 = {
    name: "Alice",
    speak: sayName
};

const person2 = {
    name: "Bob",
    speak: sayName
};

person1.speak(); // My name is Alice
person2.speak(); // My name is Bobs
sayName();

const person3 = {
    name: "Alice",
    greet: function() {
        // setTimeout() 함수 내부에서 화살표 함수를 호출하므로
        // 화살표 함수의 실행 스코프는 setTimeout 함수 스코프임
        setTimeout(() =>
        {
            // 화살표 함수의 스코프 -> 부모 스코프를 그대로 쓴다
            console.log("Hello, " + this.name);
        }, 1000);
    }
};

const person4 = {
    name: "Bob",
    greet: function() {
        // setTimeout() 함수 내부에서 일반 함수를 호출하므로
        // 일반 함수의 실행 스코프는 setTimeout 함수 스코프임
        setTimeout(function()
        {
            // 일반 함수의 스코프 -> 자체 스코프
            console.log("Hello, " + this.name);
        }, 1000);
    }
};

person3.greet()
person4.greet()