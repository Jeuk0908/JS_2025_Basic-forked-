// ############ 스무고개 게임 ##############
// 1) 단어들을 20여개 올려주고 힌트 세트를 단어별로 넣어주기
// 2) 시작 시 랜덤 단어 선택되게 해주기
// 3) 초기 힌트를 화면에 표시하고 유저가 오답을 제시하면 힌트 하나씩 추가
// 4) 맞추면 기록 표시하고 종료, 힌트 소진까지 다 틀리면 게임오버로 종료

const startButton = document.getElementById("startButton");
const paragraph = document.querySelector("p");

const fetchHints = async () => {
    try {
        const response = await fetch("./hint.json");
        console.log(response.status);
        if (!response.ok) {
            console.log(response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(response.status + error);
    }
};

const startGame = async () => {
    const hints = await fetchHints();
    if (!hints) {
        alert("에러가 발생하였습니다!");
        return;
    }

    const randomIndex = Math.floor(Math.random() * hints.words.length);
    const selectedWord = hints.words[randomIndex];
    const hintsArray = selectedWord.hints;
    let hintIndex = 0;
    let i = 1;
    let bestAttempt = 21;

    while (hintIndex < hintsArray.length) {
        const userInput = prompt(
            `${i}번째시도. 정답을 입력하세요.\n힌트: ${hintsArray[hintIndex]}\nq 입력 시 종료됩니다.`
        );

        if (userInput === "q") {
            alert("게임이 종료됩니다.");
            return; // 함수 종료
        }

        if (userInput === selectedWord.word) {
            alert(
                `정답입니다! "${selectedWord.word}"를 맞췄습니다.\n시도 횟수: ${i}`
            );
            if (i < bestAttempt) {
                bestAttempt = i;
            }
            paragraph.textContent = `${bestAttempt}번째가 최고 기록입니다.`;
            return; // 함수 종료
        } else {
            i++;
            hintIndex++;
            if (hintIndex < hintsArray.length) {
            } else {
                alert("모든 힌트를 사용했습니다. 게임 오버!");
            }
        }
    }
};

startButton.addEventListener("click", startGame);
