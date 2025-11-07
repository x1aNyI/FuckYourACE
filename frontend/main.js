import { EventsOn, EventsEmit } from './wailsjs/runtime';

// 1. 获取 HTML 元素
const logView = document.getElementById('log-view');
const logPathElement = document.getElementById('log-path');
const progressText = document.getElementById('progress-text'); // (新)
const progressBarFill = document.getElementById('progress-bar-fill'); // (新)

// 2. 监听来自 Go 的 'log-stream' 事件 (替换旧的 'log' 事件)
EventsOn('log-stream', (message) => {
    if (logView) {
        logView.value += message + '\n'; // 追加日志
        logView.scrollTop = logView.scrollHeight; // 自动滚动到底部
    }
});

// 3. 监听来自 Go 的 'logpath' 事件
EventsOn('logpath', (path) => {
    if (logPathElement) {
        logPathElement.textContent = `日志位置: ${path}`;
    }
});

// (新) 4. 监听 "执行开始" 事件
EventsOn('execution-start', (count) => {
    progressText.textContent = `正在执行第 ${count} 次...`;
    // 重置进度条
    progressBarFill.style.transition = 'none'; // 立即重置
    progressBarFill.style.width = '0%';
});

// (新) 5. 监听 "进度更新" 事件
EventsOn('progress-update', (seconds, count) => {
    const remaining = 60 - seconds;
    const percentage = (seconds / 60) * 100;

    // 恢复/设置动画
    progressBarFill.style.transition = 'width 0.5s linear';
    progressBarFill.style.width = percentage + '%';

    progressText.textContent = `下次执行倒计时: ${remaining} 秒 (已执行: ${count} 次)`;
});


// 6. 通知 Go 后端，前端已经准备好了
EventsEmit("frontend:ready");