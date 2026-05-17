// social-manager.js
// 社交数据统一管理模块（外链版）
(function () {
    // ---------- 社交数据配置（集中维护）----------
    const SOCIAL_DATA = [
        { name: "微信", icon: "fab fa-weixin", url: "weixin://", title: "请添加 13013350560", extraClass: "wechat-copy" },
        { name: "QQ", icon: "fab fa-qq", url: "https://qm.qq.com/q/eURGGQZONy", title: "QQ:3560563914" },
        { name: "电话", icon: "fab fa-viber", url: "tel:18487286354", title: "有事请拨打" },
        { name: "邮箱", icon: "far fa-envelope", url: "mailto:3560563914@qq.com", title: "3560563914@qq.com" },
        { name: "B站", icon: "fab fa-blogger-b", url: "https://b23.tv/1D0upJK", title: "uid:382027074" },
        { name: "网易云", icon: "fab fa-itunes-note", url: "https://y.music.163.com/m/user?id=1439832878", title: "阿葉步未", extraClass: "patch1" },
        { name: "抖音", icon: "fab fa-tiktok", url: "https://v.douyin.com/ihfjKhs8/", title: "小羊睡不着的时候会数人类嘛", extraClass: "patch1" }
    ];

    // 生成单个按钮的 HTML
    function generateButtonHTML(item) {
        const extraClass = item.extraClass ? ` ${item.extraClass}` : '';
        return `
            <div class="button" alt="${escapeHtml(item.name)}" title="${escapeHtml(item.title)}">
                <div class="icon"><i class="${escapeHtml(item.icon)}"></i></div>
                <a href="${escapeHtml(item.url)}"${extraClass ? ` class="${extraClass}"` : ''} rel="noopener noreferrer">${escapeHtml(item.name)}</a>
            </div>
        `;
    }

    // 简单的防 XSS 辅助函数
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function (m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // 渲染所有社交容器
    function renderAllSocials() {
        const containers = document.querySelectorAll('.social-container');
        if (!containers.length) return;

        // 一次性生成所有按钮 HTML（避免重复循环）
        const allButtonsHtml = SOCIAL_DATA.map(item => generateButtonHTML(item)).join('');
        const wrapperHtml = `<div class="wrapper">${allButtonsHtml}</div>`;

        containers.forEach(container => {
            container.innerHTML = wrapperHtml;
        });
    }

    // 监听 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderAllSocials);
    } else {
        renderAllSocials();
    }
})();