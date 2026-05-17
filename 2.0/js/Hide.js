//玩偶隐藏下的彩蛋
function callback1() {
    alert('还是被你发现了！？');
}
function callback2() {
    document.write('<a href= "interface 1.html">人机测试</a >')
}

function multipleClick(element, callback1, callback2) {
    const btn = document.querySelector(element);
    let num = 0;
    let lastTime = 0;
    let isShow = false;
    btn.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastTime < 500) {
            num++;
        } else {
            num = 1;
        }
        lastTime = now;
        if (num === 5) {
            num = 0;
            lastTime = 0;
            isShow = !isShow;
            isShow ? callback1() : callback2();
        }
    });
}

multipleClick('#btn', callback1, callback2);