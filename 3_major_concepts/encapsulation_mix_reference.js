const person = {
    // 아래 객체 필드들은 은닉 안됨
    name: "Tom",
    email: "hey@tom.hi",
    birthYear: 2000,
    idNum() {
        // 아래 필드들은 은닉됨
        // 난수 발생 로직 -> 특정 개인정보를 토대로 역추적이 가능하게 만드는 경우
        codeBase1 = (this.name+this.email).length;
        codeBase2 = this.birthYear / (this.name+this.email).length;
        codeString = String(codeBase1**codeBase2)
        const numGenerator = function(){
            return `${codeString.slice(0, 6)}-${codeString.slice(-7, -1)}`;
        };
        codeString = (codeString.includes('e')) ? codeString.replace(/[.\-+e]/g,'') : codeString;
        // codeString = (codeString.includes('-')) ? codeString.replace(/[\-]/g,'') : codeString;
        return numGenerator();
    }
}
console.log(person.idNum());