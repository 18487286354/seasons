// runtime.js
(function() {
    // 确保 DOM 加载完成后获取 span 元素
    function initRuntime() {
        var span = document.getElementById('span');
        if (!span) return;

        // 初始时间：月/日/年 时:分:秒
        var startDate = new Date("07/02/2024 9:30:00");

        function updateRuntime() {
            var now = new Date();
            var diff = now.getTime() - startDate.getTime();
            var dayMilli = 24 * 60 * 60 * 1000;
            var days = Math.floor(diff / dayMilli);
            var hours = Math.floor((diff % dayMilli) / (60 * 60 * 1000));
            var minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
            var seconds = Math.floor((diff % (60 * 1000)) / 1000);

            var currentYear = now.getFullYear();
            span.innerHTML = "© " + currentYear + " 阿葉步未的个人网页 | Designed by WangYun 已运行: " + days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
        }

        updateRuntime();
        setInterval(updateRuntime, 1000);
    }

    // 如果 DOM 已加载完成则直接执行，否则等待
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRuntime);
    } else {
        initRuntime();
    }
})();