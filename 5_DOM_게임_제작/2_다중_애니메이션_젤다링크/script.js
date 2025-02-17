'use strict'  // 코드가 복잡해지고 구조가 여러가지 중첩될 때, 실수 방지

const $zeldalink = document.querySelector('#zelda-link')
const imgPrefix = ['front','back','left','right']
const imgDir = 'img/zelda-link/'

document.addEventListener('DOMContentLoaded', () => {
    // 캐릭터 이미지 사전 로드하기 : 10개 이미지 * 4 방향
    // JS 에서 파일 로드하기
    // for (let direction of imgPrefix) {
    //     for (let idx of Array.from({length: 10}, (_, i) => i)) {
    //         let imgFilename = `${imgDir}${direction}_walk${idx}.png`
    //         // console.log(imgFilename)
    //         $zeldalink.setAttribute('style', `url("${imgFilename}") no-repeat center/cover;`)
    //     }
    // }
    // 최초에 심리스하게 로드하는 방법을 사용
    $zeldalink.classList.add('load-all')
    $zeldalink.classList.remove('load-all')
    // setTimeout(()=> $zeldalink.classList.remove('load-all'), 200)
    // setTimeout(()=> $zeldalink.classList.add('walking-forward'), 1000)
})

const characterLocation = { x:0, y:0 }
const stepSize = 20;
const mapSize = { width:960, height:900 }
const allowedKeys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight']
const keyMap = {
    'ArrowUp': 'backward',
    'ArrowDown': 'forward',
    'ArrowLeft': 'left',
    'ArrowRight':'right'
}
const walkingClasses = ["walking-forward","walking-backward","walking-left","walking-right"]
const pauseClasses = ["pause-forward","pause-backward","pause-left","pause-right"]

document.addEventListener('keydown', (evt)=>{
    if (!allowedKeys.includes(evt.key)) {
        return;
    }
    console.log(`pause-${keyMap[evt.key]}`, `walking-${keyMap[evt.key]}`)
    for (let direction of Object.values(keyMap)) {
        $zeldalink.classList.remove(`pause-${direction}`)
    }
    $zeldalink.classList.add(`walking-${keyMap[evt.key]}`)
})
document.addEventListener('keyup', (evt)=>{
    if (!allowedKeys.includes(evt.key)) {
        return;
    }
    $zeldalink.classList.remove(`walking-${keyMap[evt.key]}`)
    $zeldalink.classList.add(`pause-${keyMap[evt.key]}`)
})