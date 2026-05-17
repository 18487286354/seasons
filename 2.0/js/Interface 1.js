// ---------- 核心配置 ----------
const CORRECT_ANSWER = "王云";      // 唯一正确答案

// DOM 元素
const answerInput = document.getElementById('answerInput');
const verifyBtn = document.getElementById('verifyBtn');
const attemptSpan = document.getElementById('attemptCount');
const lastTimeSpan = document.getElementById('lastAttemptTime');
const errorTextSpan = document.getElementById('errorText');

// localStorage 键名
const STORAGE_ERROR_COUNT = "mirror_error_times";
const STORAGE_LAST_ATTEMPT = "mirror_last_attempt";
const STORAGE_SUCCESS_TIME = "test";

// ---------- 错误次数处理 ----------
function getErrorCount() {
    let val = localStorage.getItem(STORAGE_ERROR_COUNT);
    if (val === null || isNaN(parseInt(val))) return 0;
    return parseInt(val);
}

function setErrorCount(count) {
    if (count < 0) count = 0;
    localStorage.setItem(STORAGE_ERROR_COUNT, count);
    updateAttemptDisplay();
}

function incrementErrorCount() {
    let cur = getErrorCount();
    cur++;
    setErrorCount(cur);
    return cur;
}

function resetErrorCount() {
    localStorage.setItem(STORAGE_ERROR_COUNT, 0);
    updateAttemptDisplay();
}

function updateAttemptDisplay() {
    let err = getErrorCount();
    attemptSpan.innerText = err;
}

// ---------- 上次尝试时间记录 (无论对错) ----------
function updateLastAttemptTime() {
    const now = Date.now();
    localStorage.setItem(STORAGE_LAST_ATTEMPT, now);
    displayLastAttemptTime(now);
}

function displayLastAttemptTime(timestamp) {
    if (!timestamp) {
        let stored = localStorage.getItem(STORAGE_LAST_ATTEMPT);
        if (stored && !isNaN(parseInt(stored))) timestamp = parseInt(stored);
        else {
            lastTimeSpan.innerText = "——";
            return;
        }
    }
    const date = new Date(timestamp);
    const formatted = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    lastTimeSpan.innerText = formatted;
}

function initLastAttemptDisplay() {
    let stored = localStorage.getItem(STORAGE_LAST_ATTEMPT);
    if (stored && !isNaN(parseInt(stored))) {
        displayLastAttemptTime(parseInt(stored));
    } else {
        lastTimeSpan.innerText = "——";
    }
}

// ---------- 动态错误提醒 (3秒后恢复常规提示) ----------
let errorTimeout = null;
function setErrorMessage(msg, isError = true) {
    if (errorTimeout) clearTimeout(errorTimeout);
    errorTextSpan.innerText = msg;
    const errorContainer = document.getElementById('errorMsgArea');
    if (isError) {
        errorContainer.style.color = "#c25d5a";
    } else {
        errorContainer.style.color = "#3a7b6e";
    }
    errorTimeout = setTimeout(() => {
        let curErr = getErrorCount();
        if (curErr > 0) {
            errorTextSpan.innerText = `当前已尝试 ${curErr} 次错误`;
        } else {
            errorTextSpan.innerText = "等待验证";
        }
        errorContainer.style.color = "#c25d5a"; // 恢复默认错误色系基调
    }, 2800);
}

function refreshNeutralMessage() {
    let errCount = getErrorCount();
    if (errCount === 0) {
        errorTextSpan.innerText = "等待验证";
    } else {
        errorTextSpan.innerText = `当前已尝试 ${errCount} 次错误`;
    }
}

// ---------- 核心验证逻辑 ----------
function performVerification() {
    let rawValue = answerInput.value;
    if (!rawValue || rawValue.trim() === "") {
        // 空输入: 记录尝试时间但不增加错误次数，仅提醒
        updateLastAttemptTime();
        setErrorMessage("✧ 请输入答案 ✧", true);
        answerInput.focus();
        return;
    }

    let trimmed = rawValue.trim();
    // 记录本次尝试时间
    updateLastAttemptTime();

    if (trimmed === CORRECT_ANSWER) {
        // ---------- 正确：重置错误计数，记录正确时间戳，跳转 ----------
        localStorage.setItem(STORAGE_SUCCESS_TIME, Date.now());
        resetErrorCount();
        setErrorMessage("✓ 真名正确！ 故事之门即将开启 ✓", false);
        // 视觉反馈
        verifyBtn.style.transform = "scale(0.97)";
        setTimeout(() => { verifyBtn.style.transform = ""; }, 200);
        setTimeout(() => {
            window.location.href = "interface 3.html";
        }, 1000);
    } else {
        // ---------- 错误：增加错误次数并显示提醒 ----------
        let newErrCount = incrementErrorCount();
        let hintMsg = `❌ 回答错误 (已累计 ${newErrCount} 次错误) ❌`;
        setErrorMessage(hintMsg, true);
        // 输入框轻微抖动
        answerInput.style.transform = "translateX(2px)";
        setTimeout(() => { answerInput.style.transform = ""; }, 120);
        answerInput.focus();
        // 确保错误次数超过3次后，在timeout结束时保留累计信息
        if (errorTimeout) clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => {
            let curErr = getErrorCount();
            errorTextSpan.innerText = `当前已尝试 ${curErr} 次错误`;
        }, 2800);
    }
}

// 回车键监听
function onEnter(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        performVerification();
    }
}

// ---------- 页面初始化 ----------
function init() {
    let curErrors = getErrorCount();
    updateAttemptDisplay();
    initLastAttemptDisplay();
    if (curErrors > 0) {
        errorTextSpan.innerText = `当前已尝试 ${curErrors} 次错误`;
    } else {
        errorTextSpan.innerText = "等待验证";
    }
    verifyBtn.addEventListener('click', performVerification);
    answerInput.addEventListener('keydown', onEnter);
    answerInput.focus();
}

init();
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