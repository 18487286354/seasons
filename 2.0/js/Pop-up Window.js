// notice.js
(function () {
    var div = document.createElement('div');
    div.textContent = '为了你的浏览体验，推荐使用PC平台打开该网页';
    div.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.75);
    color: #fff;
    padding: 8px 20px;
    border-radius: 40px;
    font-size: 14px;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    z-index: 10000;
    backdrop-filter: blur(8px);
    white-space: nowrap;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    transition: opacity 0.3s ease;
    opacity: 1;
    pointer-events: none;`
    ;
    document.body.appendChild(div);
    setTimeout(function () {
        div.style.opacity = '0';
        setTimeout(function () {
            if (div.parentNode) div.parentNode.removeChild(div);
        }, 400);
    }, 3000);
})();