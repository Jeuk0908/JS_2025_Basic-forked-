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
    // 시각적 요소를 제어하기 위해서는 실행 환경을 고려해서 테스트를 환경별, 상황별 여러차례 수행하면서 검증하는 작업 필요
    // 미리 모든 시각요소가 고려된 후 작업한다? X
    // 주요 시각요소가 충족된 후에, 테스트한다. O
    img.src = image;
});

// 2. 캐릭터 요소 선택
// const $characterContainer = document.getElementsByClassName('character-container')[0];
const $userCharacter = document.getElementById('zelda-link');
document.addEventListener('DOMContentLoaded', function (){
        // 동작별 디폴트 이미지를 다르게 하기 위해 CSS 에서 정적인 이미지 지정을 아예 제거하고 아래와 같이 동적 처리!
        // $userCharacter.setAttribute('style',`background: url('${imgDir}front_stand.png') no-repeat center/cover;`)
        $userCharacter.classList.add('zelda-link-init')
    }
)

// 3. 캐릭터 이동 관련 변수 및 메서드 선언
// const characterLocation = {
//     x: 0, y: 0
// }
// 3-1. 백그라운드 이동으로 로직 변경
const $townMap = document.querySelector('.town-map');
const backgroundLocation = {
    x: 0, y: 0
    // TODO : 백그라운드의 기본위치 및 특별한 위치를 Map 좌표테이터로 관리
    //        특정 위치에 따라서 백그라운드 이미지를 변경 및 해당 이미지의 좌표계로 초기화
}
const step = 20;
const animationPostfix = {
    // 키보드 버튼과 프로그램 제어에 사용되는 동작 매핑 : keyMap!
    ArrowDown: 'forward',
    ArrowUp: 'backward',
    ArrowLeft: 'left',
    ArrowRight: 'right'
}
// const characterMove = function() {
//     $userCharacter.setAttribute('style', `transform: translate(${backgroundLocation.x}px, ${backgroundLocation.y}px)`)
// }
const bgMove = function() {
    $townMap.setAttribute('style', `background-position: ${backgroundLocation.x}px ${backgroundLocation.y}px`)
}

// 키보드 이벤트 처리할 때, 함수 맵을 사용하는 경우가 많음
// 키 입력과 동시에 연산 및 프로그램 제어가 필요한 경우
const moveTo = {
    ArrowDown: (
        function forward() {
            // 객체를 리턴하는 함수 -> 팩토리 패턴 ==(함수형 프로그래밍에 응용)==> 함수를 리턴하는 함수 -> currying 적용에 포함
            return function () {
                backgroundLocation.y -= step; bgMove();
            }
        }
    )(),  // 선언과 동시에 실행하는 인라인 함수 정의 : (함수정의)(호출)
    ArrowUp: (function backward() { return function(){
        // if (backgroundLocation.y !== 0)
        // {
            backgroundLocation.y += step; bgMove();
        // }
    } })(),
    ArrowLeft: (function left() { return function(){ if (backgroundLocation.x !== 0) { backgroundLocation.x += step; bgMove(); } } })(),
    ArrowRight: (function right() { return function(){ backgroundLocation.x -= step; bgMove(); } })(),
}

// 키맵을 사용해서 사용자의 동작을 해석 (키맵을 데이터로만 사용)
const runningActions = Object.values(animationPostfix).map(direction => `running-${direction}`);
const pausedActions = Object.values(animationPostfix).map(direction => `pause-${direction}`);

// 동작 여러 개가 동시에 적용되는 로직을 구현하기 위해서
// 멀티 토글링 (상충되는 요소 일괄 Off 후, 특정 필요 요소만 적용하기!)
function playAnimation(key) {
    if ($userCharacter.classList.contains('zelda-link-init')) {
        $userCharacter.classList.remove('zelda-link-init')
    }
    // 위치이동을 동작 적용과 같은 곳에서 호출해도 무방함
    // (제어 및 코드 관리에 용이한 방식으로 수행)
    // moveTo[key]();
    // 애니메이션 적용
    $userCharacter.classList.remove(...pausedActions);  // 기존 정지모션 모두 삭제
    $userCharacter.classList.add(`running-${animationPostfix[key]}`);  // 특정 움직임 적용
}
function pauseAnimation(key) {
    $userCharacter.classList.remove(...runningActions);  // 기존 움직임 모두 삭제
    $userCharacter.classList.add(`pause-${animationPostfix[key]}`);  // 특정 정지모션 적용 적용
}

function isKeyValid(keyInput) {
    return Object.keys(animationPostfix).includes(keyInput);
}

// 4. 캐릭터 이동 제어를 위한 방향키 이벤트 리스너 부착
document.addEventListener('keydown', (event) => {
    // console.log(event.code, event.key);
    // 4-1. 이벤트 키 검사 (Validator -> 함수로 분리 가능)
    if (!isKeyValid(event.key)){
        return;
    }

    // 4-2. 키 입력에 따른 캐릭터 좌표 수정
    // switch (event.key) {
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
    // switch-case 문을 함수형 키맵으로 바꿈!

    // 4-3. 함수형 프로그래밍 : 함수객체 적용 버전으로 개선
    moveTo[event.key]();  // 프로그램의 모듈화 -> 유지보수성 향상
    // 처음부터 이렇게 설계해야 하는가? -> 코드가 길어지기 시작하면 적용!

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
