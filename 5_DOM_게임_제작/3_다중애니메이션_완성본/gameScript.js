'use strict'

// 1. 캐릭터 이미지 사전로드
const imgDir = '../img/zelda-link/';
const postureTypes = ['back', 'front', 'left', 'right']
const images = Array.from({length:40},
    (_, idx) => `${imgDir}${postureTypes[Math.floor(idx/10)]}_walk${idx%10}.png`
)
images.forEach(image => {
    // 이미지 객체에 대한 브라우저 메모리를 할당
    const img = new Image();
    img.src = image;
});

// 2. 캐릭터 요소 선택
// const $characterContainer = document.getElementsByClassName('character-container')[0];
const $userCharacter = document.getElementById('zelda-link');
document.addEventListener('DOMContentLoaded', function (){
        $userCharacter.setAttribute('style', `background: url('${imgDir}front_stand.png') no-repeat center/cover;`)
    }
)

// 3. 캐릭터 이동 관련 변수 및 메서드 선언
const characterLocation = {
    x: 0, y: 0
}
const step = 20;
const animationPostfix = {
    // 키보드 버튼과 프로그램 제어에 사용되는 동작 매핑 : keyMap!
    ArrowDown: 'forward',
    ArrowUp: 'backward',
    ArrowLeft: 'left',
    ArrowRight: 'right'
}
const characterMove = function() {
    $userCharacter.setAttribute('style', `transform: translate(${characterLocation.x}px, ${characterLocation.y}px)`)
}
const moveTo = {
    ArrowDown: (function forward() { return function () { characterLocation.y += step; characterMove(); } })(),
    ArrowUp: (function backward() { return function(){ if (characterLocation.y !== 0) { characterLocation.y -= step; characterMove(); } } })(),
    ArrowLeft: (function left() { return function(){ if (characterLocation.x !== 0) { characterLocation.x -= step; characterMove(); } } })(),
    ArrowRight: (function right() { return function(){ characterLocation.x += step; characterMove(); } })(),
}
const runningActions = Object.values(animationPostfix).map(direction => `running-${direction}`);
const pausedActions = Object.values(animationPostfix).map(direction => `pause-${direction}`);
function playAnimation(key) {
    $userCharacter.classList.remove(...pausedActions);
    $userCharacter.classList.add(`running-${animationPostfix[key]}`);
}
function pauseAnimation(key) {
    $userCharacter.classList.remove(...runningActions);
    $userCharacter.classList.add(`pause-${animationPostfix[key]}`);
}

// 4. 캐릭터 이동 제어를 위한 방향키 이벤트 리스너 부착
document.addEventListener('keydown', (event) => {
    console.log(event.code, event.key);

    // 4-1. 이벤트 키 검사
    if (!Object.keys(animationPostfix).includes(event.key)){
        return;
    }

    // 4-2. 키 입력에 따른 캐릭터 좌표 수정
    // switch (key) {
    //     case 'ArrowUp':
    //         if (characterLocation.y !== 0) {
    //             characterLocation.y -= step;
    //         }
    //         break;
    //     case 'ArrowDown':
    //         characterLocation.y += step;
    //         break;
    //     case 'ArrowLeft':
    //         if (characterLocation.x !== 0) {
    //             characterLocation.x -= step;
    //         }
    //         break;
    //     case 'ArrowRight':
    //         characterLocation.x += step;
    //         break;
    //     default:
    //         break;
    // }

    // 4-3. 함수형 프로그래밍 : 함수객체 적용 버전으로 개선
    moveTo[event.key]();

    // 4-4. 키 입력에 따른 캐릭터 애니메이션 재생시작
    setTimeout(() => {playAnimation(event.key)}, 100);
});

// 5. 방향키 입력 종료 감지 리스너 부착
document.addEventListener('keyup', (event) => {
    // 5-1. 이벤트 키 검사
    if (!Object.keys(animationPostfix).includes(event.key)){
        return;
    }
    // 5-2. CSS 애니메이션 일시정지
    setTimeout(() => {pauseAnimation(event.key)}, 200);
});
