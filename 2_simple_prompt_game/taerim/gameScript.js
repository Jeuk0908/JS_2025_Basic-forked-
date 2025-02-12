// ###### 숫자 맞추기 게임
// 1) 유저로부터 임의의 최초 입력을 숫자로 입력받기
// 2) 0에서 해당 넘버 사이의 랜덤 숫자를  프로그램이 지정
// 3) 반복적으로 유저 입력을 받으며 프로그램이 지정한 정답 숫자를 맞출 경우 게임 종료
// 3-1) 시도횟수를 화면에 표시
// 4) 현재까지의 최고 기록도 화면에 표시

document.addEventListener("DOMContentLoaded", function () {
    const gameStartBtn = document.getElementById("gameStartBtn");
    const gameStartBtn2 = document.getElementById("gameStartBtn2");

    if (gameStartBtn) {
        gameStartBtn.onclick = function () {
            gameStartBtn.style.display = "none";
            gamestart();
        };
    }

    if (gameStartBtn2) {
        gameStartBtn2.onclick = function () {
            gameStartBtn2.style.display = "none";
            gamestart2();
        };
    }

    let bestScore = localStorage.getItem("bestScore") ? Number(localStorage.getItem("bestScore")) : 9999;
    const bestScoreElement = document.getElementById("printBestScore");

    if (bestScore !== 9999 && bestScoreElement) {
        bestScoreElement.innerText = `최고 기록: ${bestScore}회`;
    }
});

function gamestart() {
    let randNum = Math.floor(Math.random() * 100);
    let cntNum = 0;
    let bestScore = localStorage.getItem("bestScore") ? Number(localStorage.getItem("bestScore")) : 9999;

    while (true) {
        let userInput = Number(prompt(`값 입력(도전 횟수: ${cntNum})`));
        console.log(`입력한 값은 ${userInput} 입니다.`);

        if (userInput >= 0 && userInput <= 100) {
            cntNum++;

            if (userInput === randNum) {
                alert(`${userInput} 정답입니다! 시도 횟수: ${cntNum}번`);
                console.log(`${userInput} 정답입니다! 시도 횟수: ${cntNum}번`);

                if (cntNum < bestScore) {
                    localStorage.setItem("bestScore", cntNum);
                    const bestScoreElement = document.getElementById("printBestScore");
                    if (bestScoreElement) {
                        bestScoreElement.innerText = `최고 기록: ${cntNum}회`;
                    }
                }
                break;
            } else if (userInput < randNum) {
                alert("더 큰 숫자를 입력하세요!");
            } else {
                alert("더 작은 숫자를 입력하세요!");
            }
        } else {
            alert("0~100 사이의 숫자만 입력하세요.");
        }
    }
}

// ###### 스무고개 게임 ######## (배열)
// 1) 단어들을 20여개 올려주고 힌트 (약 10개) 세트를 단어별로 넣어주기
// 2) 시작할 때 랜덤한 단어 선택되게 해주기
// 3) '초기 힌트를 화면에 표시하고 유저가 오답을 제시하면 힌트 하나씩 추가 공개'
// 4) 맞추면 기록을 표시하고 종료, 힌트 소진까지 다 틀리면 게임오버로 종료

// 숫자 맞추기 & 스무고개 게임


const words = [
    { word: "사과", hints: ["과일", "빨간색", "달콤함", "건강", "비타민", "나무", "씨앗", "초록색도 있음", "깎아 먹음", "주스로 마심"] },
    { word: "코끼리", hints: ["동물", "크다", "회색", "코가 길다", "아프리카", "코로 물을 뿌림", "귀가 크다", "초식동물", "엄청 무겁다", "기억력이 좋다"] },
    { word: "컴퓨터", hints: ["전자기기", "키보드", "마우스", "모니터", "코딩", "인터넷", "게임", "작업", "프로그래밍", "소프트웨어"] },
    { word: "바다", hints: ["물", "넓다", "파도", "푸른색", "수영", "모래", "섬", "고기", "배", "소금"] },
    { word: "비행기", hints: ["탈것", "하늘", "날다", "빠르다", "공항", "파일럿", "승무원", "여행", "구름", "티켓"] }
];

function gamestart2() {
    const selected = words[Math.floor(Math.random() * words.length)];
    const answer = selected.word;
    const hints = selected.hints;
    let attempts = 0;
    let revealedHints = 1;

    console.log("🎮 스무고개 게임을 시작합니다!");
    console.log(`첫 번째 힌트: ${hints[0]}`);

    while (attempts < 10) {
        let userInput = prompt(`힌트: ${hints.slice(0, revealedHints).join(", ")}\n단어를 입력하세요:`);

        if (userInput === answer) {
            alert(`정답입니다! '${answer}'를 맞추셨습니다! (시도 횟수: ${attempts + 1}회)`);
            return;
        }

        attempts++;
        if (revealedHints < hints.length) {
            revealedHints++;
            console.log(`오답! 추가 힌트: ${hints[revealedHints - 1]}`);
        } else {
            alert(`게임 오버! 정답은 '${answer}'였습니다.`);
            return;
        }
    }
}
