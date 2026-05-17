const dom = document.documentElement
const link = document.querySelector('#link')
const music = document.querySelector('audio')
const darkMode = document.querySelector('#darkMode')
let mode = JSON.parse(localStorage.getItem('darkMode')) || false

// 判断是否为深色模式
if (mode) {
  darkMode.src = 'assets/images/svg/moon.svg'
  dom.setAttribute('theme', 'dark')
}
// 切换深色模式
darkMode.addEventListener('click', () => {
  if (mode) {
    darkMode.src = 'assets/images/svg/sun.svg'
    dom.removeAttribute('theme')
  } else {
    darkMode.src = 'assets/images/svg/moon.svg'
    dom.setAttribute('theme', 'dark')
  }
  mode = !mode
  localStorage.setItem('darkMode', mode)
})
// 点击页面切换
document.querySelector('nav').addEventListener('click', e => {
  // 事件委托,判断点击的元素是否为A标签
  if (e.target.tagName === 'A') {
    // 阻止默认事件
    e.preventDefault()
    // 先移除active类名,再给当前点击的元素添加active类名
    document.querySelector('.active').classList.remove('active')
    e.target.classList.add('active')
    // 获取name为当前点击元素id值的元素的offsetLeft值
    const num = document.querySelector(`[title='${e.target.id}']`).offsetLeft
    document.querySelector('main').scrollTo({ left: num, behavior: 'smooth' })
  }
})

// 滑动页面切换Tab
let timer = null
// 监听滚动事件，并设置防抖
document.querySelector('main').addEventListener('scroll', e => {
  // 先清除定时器
  if (timer) clearTimeout(timer)
  // 设置定时器
  timer = setTimeout(() => {
    // 获取所有的section元素并遍历
    document.querySelectorAll('section').forEach(item => {
      // 判断当前元素的offsetLeft值与滚动条的scrollLeft值的差的绝对值是否小于误差阈值
      if (Math.abs(e.target.scrollLeft - item.offsetLeft) < 50) {
        // 先移除active类名，再给当前元素对应的A标签添加active类名
        document.querySelector('.active').classList.remove('active')
        document.querySelector(`#${item.title}`).classList.add('active')
        return
      }
    })
  }, 200) // 延迟200毫秒执行
})

// 音乐功能
let isPlay = false
// 监听音乐按钮点击事件
document.querySelector('#music').addEventListener('click', function () {
  // 判断音乐是否在播放
  if (isPlay) {
    // 播放音乐
    music.pause()
    this.src = 'assets/images/svg/play.svg'
  } else {
    // 暂停音乐
    music.play()
    this.src = 'assets/images/svg/pause.svg'
  }
  isPlay = !isPlay
})



//生成随机色的通用函数（所有div共用）
function getRandomColor() {
  const r = Math.floor(Math.random() * 250); // 红（0-255）
  const g = Math.floor(Math.random() * 250); // 绿（0-255）
  const b = Math.floor(Math.random() * 250); // 蓝（0-255）
  return `rgb(${r}, ${g}, ${b})`; // 返回随机RGB颜色
}
/* 社交按钮悬停随机变色效果 */
(function() {  
    function bindHoverEffect(button) {
        // 避免重复绑定
        if (button._hoverColorBound) return;
        
        const icon = button.querySelector('.icon');
        if (!icon) return;

        let originalBg = '';

        button.addEventListener('mouseenter', () => {
            originalBg = icon.style.backgroundColor || '';
            icon.style.backgroundColor = getRandomColor();
            icon.style.transition = 'background-color 0.25s ease';
        });

        button.addEventListener('mouseleave', () => {
            icon.style.backgroundColor = originalBg;
            // 清理过渡属性（可选）
            setTimeout(() => {
                if (!icon.style.backgroundColor) {
                    icon.style.transition = '';
                }
            }, 100);
        });

        button._hoverColorBound = true;
    }

    // 绑定当前页面中所有社交按钮
    function bindAllSocialButtons() {
        const buttons = document.querySelectorAll('.wrapper .button');
        buttons.forEach(bindHoverEffect);
    }

    // 监听动态添加的社交容器（防止社交按钮后期被异步加载）
    const observer = new MutationObserver((mutations) => {
        let needBind = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                needBind = true;
                break;
            }
        }
        if (needBind) {
            bindAllSocialButtons();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 页面加载完成后执行初始绑定
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindAllSocialButtons);
    } else {
        bindAllSocialButtons();
    }
})();
//禁用F12
document.onkeydown = function(e) {
    if(e.keyCode == 123) { // F12的键码是123
        e.preventDefault(); // 阻止默认行为
        return false; // 阻止事件进一步传播
    }
};

//禁用鼠标右键的检查
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
});