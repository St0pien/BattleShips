var angle = 0;
export function startAnim() {
    angle += 2;
    if(angle >= 360) {
        angle = 0;
    }
    const scan = document.querySelector('.backgroundScan');
    scan.style.transform = `rotate(${angle}deg)`;
    window.requestAnimationFrame(startAnim);
}