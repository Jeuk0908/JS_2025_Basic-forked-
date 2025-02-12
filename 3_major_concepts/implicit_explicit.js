// 묵시적 타입변환
// 1. String
const extVar = true
const myStringTemplate = `여기에 작성되면 묵식적 String 변환됨! : ${extVar}`
console.log(myStringTemplate)
console.log(typeof (1123123123123 + ''))

// 2. number (double 타입)
// 2-1. valueOf 를 통한 묵시적 변환
const obj1 = {
    valueOf() {
        return 123
    }
}
console.log(typeof obj1)
console.log(typeof +obj1)
console.log("obj1 * 2 =" + (obj1 * 2))
// 2-2. toString 을 통한 묵시적 변환
const obj2 = {
    toString() {
        return "123"  // parseInt() 가능한 문자열
    }
}
console.log(typeof obj2)
console.log(typeof +obj2)
console.log("obj2 + 10 =" + (+obj2 + 10))

// 3. boolean 타입
// 3-1. 연산자 결합에 따라서 boolean 에서 다른 타입으로
console.log(+true)
console.log(-true)
console.log(typeof (true + ''))
// 3-2. 구체적인 truthy, falsy 값이 날아가고 boolean 으로 변환되는 맥락
console.log(!0)
console.log(!1)

const numFromBool = Number(false)
console.log(numFromBool)

// 단위를 얼마만큼 받아주는지 확인!
const numFromStr = parseFloat('0.123456789022345678903234567890423456789042345678906234567890')
console.log(numFromStr)
