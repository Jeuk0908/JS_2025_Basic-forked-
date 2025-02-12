// 안전한 객체참조를 위한 코드 테크닉 1
const nullObj = null;
const undefinedObj = undefined;

const referAttr1 = nullObj && nullObj.attr;
console.log(referAttr1)
const referAttr2 = undefinedObj && undefinedObj.attr;
console.log(referAttr2)

const existingObj = {attr : 10}
const referAttr3 = existingObj && existingObj.attr;
console.log(referAttr3)

// 안전한 객체참조를 위한 코드 테크닉 2
const referAttr4 = nullObj?.attr;
const referAttr5 = undefinedObj?.attr;
const referAttr6 = existingObj?.attr;
console.log(referAttr4, referAttr5, referAttr6)