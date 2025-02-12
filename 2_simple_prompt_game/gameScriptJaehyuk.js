let questions = [
    {
        answer: "사과",
        hints: [
            "과일입니다.", "빨간색이 많아요.", "한 입 베어 문 로고가 유명해요.",
            "영어로 Apple입니다.", "단맛과 신맛이 있습니다.", "나무에서 자랍니다.",
            "가을에 수확합니다.", "건강에 좋습니다.", "파이나 주스로도 먹을 수 있습니다.",
            "백설공주 이야기와 관련이 있습니다."
        ]
    },
    {
        answer: "코끼리",
        hints: [
            "아주 큽니다.", "회색 피부를 가졌습니다.", "긴 코가 있습니다.",
            "엄청난 기억력을 가졌습니다.", "뿌우! 소리를 냅니다.", "코로 물을 뿌립니다.",
            "초식동물입니다.", "아시아와 아프리카에 삽니다.", "귀가 매우 큽니다.",
            "코로 물건을 집을 수 있습니다."
        ]
    },
    {
        answer: "축구",
        hints: [
            "공을 사용합니다.", "세계적으로 인기 많은 스포츠입니다.", "손을 사용하면 안 됩니다.",
            "11명이 한 팀입니다.", "골을 넣어야 이깁니다.", "경기장은 매우 큽니다.",
            "월드컵이 열립니다.", "유명한 선수로는 메시, 호날두가 있습니다.", "주로 잔디에서 합니다.",
            "90분 동안 진행됩니다."
        ]
    },
    {
        answer: "기차",
        hints: [
            "궤도를 따라 움직입니다.", "많은 사람들이 탑승할 수 있습니다.", "길고 빠릅니다.",
            "철도 위를 달립니다.", "전기로도 움직입니다.", "옛날에는 증기로 움직였습니다.",
            "객차가 여러 개 있습니다.", "역에서 승객을 태웁니다.", "소리가 크고 길게 납니다.",
            "지하철과 비슷하지만 다릅니다."
        ]
    },
    {
        answer: "컴퓨터",
        hints: [
            "전자기기입니다.", "인터넷을 사용할 수 있습니다.", "마우스와 키보드를 사용합니다.",
            "윈도우, 맥OS, 리눅스가 있습니다.", "게임을 할 수 있습니다.", "문서를 작성할 수 있습니다.",
            "프로그래밍을 할 수 있습니다.", "영화를 볼 수 있습니다.", "CPU, RAM, HDD가 있습니다.",
            "전기를 사용해야 작동합니다."
        ]
    }
];

// 랜덤한 문제 선택
let randomIndex = Math.floor(Math.random() * questions.length);
let question = questions[randomIndex];

let attempts = 0;
let hintsShown = [question.hints[0]];   // 초기 힌트 1개만 표시

alert("스무고개 게임을 시작합니다! \n정답을 맞혀보세요.");

while (attempts < question.hints.length) {
    let userAnswer = prompt(`힌트: ${hintsShown.join("\n")}\n정답은?`);

    if (userAnswer === null) {
        alert("게임을 종료합니다.");
        break;
    }

    if (userAnswer.trim() === question.answer) {
        alert(`정답입니다! (${attempts + 1}번 만에 맞췄어요!)`);
        break;
    } else {
        attempts++;
        if (attempts < question.hints.length) {
            hintsShown.push(question.hints[attempts]); // 새로운 힌트 추가
            alert("틀렸습니다! 다음 힌트를 공개합니다.");
        } else {
            alert(`모든 힌트를 공개했습니다. 정답은 '${question.answer}'였습니다.`);
        }
    }
}
