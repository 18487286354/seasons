const video = document.getElementById('myVideo');
const tip = document.querySelector('.tip');
const replayBtn = document.getElementById('replayBtn');

// 辅助函数：弹出一段文字并自动消失
function showFloatingMessage(msg, duration = 2000) {
    // 移除已有的toast（避免堆积）
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = msg;
    document.body.appendChild(toast);

    // duration 后自动移除
    setTimeout(() => {
        if (toast && toast.remove) toast.remove();
    }, duration);
}

// 视频播放结束后的逻辑（原样保留）
video.addEventListener('ended', () => {
    video.style.display = 'none';

    // 文字淡入放大
    tip.classList.add('show');

    // 3秒后文字淡出消失
    setTimeout(() => {
        tip.classList.remove('show');

        // 淡出动画结束后显示按钮
        setTimeout(() => {
            replayBtn.style.display = 'block';
        }, 800);
    }, 3000);
});

// 退出按钮：重置视频 + 弹出指定文字"哟，还是个m"
replayBtn.addEventListener('click', () => {
    // 弹出文字（自动消失）
    showFloatingMessage('哟，还是个m', 2000);

    // 原有功能：重置视频并播放
    replayBtn.style.display = 'none';
    video.style.display = 'block';
    video.currentTime = 0;
    video.play();

    // 额外保证如果视频结束时的tip残留样式被清理干净
    tip.classList.remove('show');
});
//禁用F12
document.onkeydown = function (e) {
    if (e.keyCode == 123) { // F12的键码是123
        e.preventDefault(); // 阻止默认行为
        return false; // 阻止事件进一步传播
    }
};

//禁用鼠标右键的检查
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });
});