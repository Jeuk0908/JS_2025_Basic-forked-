let maxNum = prompt('여기에 추측 게임 최대값 숫자를 입력하세요! (종료:"q")')
console.log(`입력한 값은 ${maxNum} 입니다!`)
while (!parseInt(maxNum)) {
    if (maxNum === 'q') {
        alert('게임 실행을 취소합니다!')
        break;
    }
    maxNum = prompt('추측 게임 최대값을 유효한 숫자로 입력하세요! (종료:"q")')
}

let correctNum = Math.floor(Math.random() * maxNum) + 1;
console.log(correctNum)
let userGuess = undefined;
let minAttemptCnt = Infinity;
let userAttemptCnt = 0;
let gameContinue = true;  // (반복) 제어용 flag 변수
while (maxNum!=='q' && gameContinue) {
    // 유저 추측 숫자 받기
    userGuess = prompt('숫자 추측값을 입력해 보세요 (종료 "q"):');
    // 2) 입력값이 숫자가 아니면 가이드
    if (!parseInt(userGuess)) {
        // 1) gameContinue 검사
        if (userGuess === 'q') {
            gameContinue = false;
            alert('게임을 종료합니다!')
            break;
        } else {
            alert('추측값은 숫자로 입력해야 합니다!')
            userGuess = undefined;
            continue;
        }
    }

    // 정답 검사
    if (parseInt(userGuess) !== correctNum) {
        alert('땡!')
        userAttemptCnt++
    } else {
        // 3) 입력값 범위 검사 (너무 크거나 작은 숫자 입력시 가이드)
        alert('정답!')
        userAttemptCnt++
        break;
    }
    userGuess = undefined;
}

// 최소 도전 횟수
minAttemptCnt = Math.min(minAttemptCnt, userAttemptCnt)

// 화면상에 기록 출력
let screenParagraph = document.querySelector('p')
screenParagraph.textContent = `현재기록: ${userAttemptCnt} / 최고기록: ${minAttemptCnt}`

// ######## 숫자 맞추기 게임 ########
// 1) 유저로부터 임의의 최초 입력을 숫자로 입력받음
// 2) 0에서 해당 넘버 사이의 랜덤 숫자를 프로그램이 지정
// 3) 반복적으로 유저 입력을 받으며 프로그램이 지정한 정답 숫자를 맞출 경우 게임 종료
// 4) 시도횟수를 화면에 표시
// 5) 현재까지의 최고 기록도 화면에 표시
