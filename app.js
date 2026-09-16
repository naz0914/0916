/**
 * 陳沐德 (德哥) - 個人檔案與即時時鐘引擎
 * NCHU BME • Digital IC Design & Biomedical Sensing
 */

(function () {
  'use strict';

  // --- 狀態定義 ---
  const STORAGE_KEYS = {
    TIME_FORMAT: 'mude_time_format', // '24' or '12'
    THEME: 'mude_theme',
    STATUS_INDEX: 'mude_status_index'
  };

  const STATUS_LIST = [
    { text: '探索生醫晶片 × AI 醫療', color: '#10b981' },
    { text: '正在研發呼氣 VOCs 感測系統', color: '#06b6d4' },
    { text: '數位 IC 設計與模擬驗證中', color: '#38bdf8' },
    { text: 'HeartPod 專案持續推進', color: '#fbbf24' },
    { text: '電化學阻抗頻譜 (EIS) 分析中', color: '#a855f7' }
  ];

  let is24HourFormat = localStorage.getItem(STORAGE_KEYS.TIME_FORMAT) !== '12';
  let currentStatusIndex = parseInt(localStorage.getItem(STORAGE_KEYS.STATUS_INDEX) || '0', 10);
  if (isNaN(currentStatusIndex) || currentStatusIndex >= STATUS_LIST.length) {
    currentStatusIndex = 0;
  }

  // --- DOM 元素 ---
  const elements = {
    clockTime: document.getElementById('clock-time'),
    clockMeridiem: document.getElementById('clock-meridiem'),
    currentDate: document.getElementById('current-date'),
    currentTimezone: document.getElementById('current-timezone'),
    formatToggleBtn: document.getElementById('time-format-toggle'),
    formatLabel: document.getElementById('format-label'),
    greetingText: document.getElementById('greeting-text'),
    greetingIcon: document.getElementById('greeting-icon'),
    statusPill: document.getElementById('status-pill'),
    statusText: document.getElementById('status-text'),
    copyTimeBtn: document.getElementById('copy-time-btn'),
    copyBtnText: document.getElementById('copy-btn-text'),
    themeDots: document.querySelectorAll('.theme-dot')
  };

  // --- 工具函數 ---
  function padZero(num) {
    return num.toString().padStart(2, '0');
  }

  function getTimezoneString(date) {
    const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Taipei';
    const city = timeZoneName.split('/').pop().replace(/_/g, ' ');
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const hours = Math.floor(absOffset / 60);
    const minutes = absOffset % 60;
    return `UTC${sign}${padZero(hours)}:${padZero(minutes)} (${city})`;
  }

  // --- 動態問候語 ---
  function updateGreeting(hours) {
    let greeting = '';
    let icon = '✨';

    if (hours >= 5 && hours < 12) {
      greeting = '早安，陳沐德 (德哥)';
      icon = '🌅';
    } else if (hours >= 12 && hours < 18) {
      greeting = '午安，陳沐德 (德哥)';
      icon = '☀️';
    } else if (hours >= 18 && hours < 22) {
      greeting = '晚上好，陳沐德 (德哥)';
      icon = '🌆';
    } else {
      greeting = '夜深了，陳沐德 (德哥)';
      icon = '🌙';
    }

    if (elements.greetingText) elements.greetingText.textContent = greeting;
    if (elements.greetingIcon) elements.greetingIcon.textContent = icon;
  }

  // --- 4. Live Clock (即時時鐘更新引擎) ---
  // 使用 JavaScript 的 setInterval() 函數，每 1000 毫秒 (1秒) 抓取系統時間並更新畫面，字型採用等寬設計
  function updateClock() {
    const now = new Date();
    const rawHours = now.getHours();
    const rawMinutes = now.getMinutes();
    const rawSeconds = now.getSeconds();

    let displayHours = rawHours;
    let meridiem = '';

    if (!is24HourFormat) {
      meridiem = rawHours >= 12 ? 'PM' : 'AM';
      displayHours = rawHours % 12 || 12;
      if (elements.clockMeridiem) {
        elements.clockMeridiem.textContent = meridiem;
        elements.clockMeridiem.style.display = 'inline-block';
      }
    } else {
      if (elements.clockMeridiem) {
        elements.clockMeridiem.style.display = 'none';
      }
    }

    // 格式：HH : MM : SS（包含間距與等寬數字顯示）
    if (elements.clockTime) {
      elements.clockTime.textContent = `${padZero(displayHours)} : ${padZero(rawMinutes)} : ${padZero(rawSeconds)}`;
    }

    // 日期顯示（如：2026年9月16日 星期三）
    if (elements.currentDate) {
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekDay = weekDays[now.getDay()];
      elements.currentDate.textContent = `${year}年${month}月${day}日 ${weekDay}`;
    }

    // 時區
    if (elements.currentTimezone) {
      elements.currentTimezone.textContent = getTimezoneString(now);
    }

    // 問候語
    updateGreeting(rawHours);
  }

  // 切換 12H / 24H
  function toggleTimeFormat() {
    is24HourFormat = !is24HourFormat;
    localStorage.setItem(STORAGE_KEYS.TIME_FORMAT, is24HourFormat ? '24' : '12');
    if (elements.formatLabel) {
      elements.formatLabel.textContent = is24HourFormat ? '24H' : '12H';
    }
    updateClock();
  }

  // --- 複製時間 ---
  function copyCurrentTime() {
    const timeStr = elements.clockTime.textContent;
    const meridiem = !is24HourFormat && elements.clockMeridiem ? ' ' + elements.clockMeridiem.textContent : '';
    const dateStr = elements.currentDate.textContent;
    const tzStr = elements.currentTimezone.textContent;

    const fullStr = `陳沐德 (德哥) 的時間戳記：${dateStr} ${timeStr}${meridiem} [${tzStr}]`;

    navigator.clipboard.writeText(fullStr).then(() => {
      if (elements.copyBtnText) {
        elements.copyBtnText.textContent = '已複製時間！✓';
        setTimeout(() => {
          elements.copyBtnText.textContent = '複製時間';
        }, 2000);
      }
    }).catch(() => {
      if (elements.copyBtnText) {
        elements.copyBtnText.textContent = '複製失敗';
        setTimeout(() => {
          elements.copyBtnText.textContent = '複製時間';
        }, 2000);
      }
    });
  }

  // --- 狀態切換 ---
  function applyStatus(index) {
    const status = STATUS_LIST[index % STATUS_LIST.length];
    if (elements.statusText) {
      elements.statusText.textContent = status.text;
    }
  }

  function cycleStatus() {
    currentStatusIndex = (currentStatusIndex + 1) % STATUS_LIST.length;
    localStorage.setItem(STORAGE_KEYS.STATUS_INDEX, currentStatusIndex);
    applyStatus(currentStatusIndex);
  }

  // --- 主題切換 ---
  function setTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem(STORAGE_KEYS.THEME, themeName);

    elements.themeDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.themeName === themeName);
    });
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'biotech-dark';
    setTheme(savedTheme);
  }

  // --- 事件綁定 ---
  function bindEvents() {
    if (elements.formatToggleBtn) {
      elements.formatToggleBtn.addEventListener('click', toggleTimeFormat);
      elements.formatLabel.textContent = is24HourFormat ? '24H' : '12H';
    }

    if (elements.copyTimeBtn) {
      elements.copyTimeBtn.addEventListener('click', copyCurrentTime);
    }

    if (elements.statusPill) {
      elements.statusPill.addEventListener('click', cycleStatus);
      elements.statusPill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cycleStatus();
        }
      });
    }

    elements.themeDots.forEach(dot => {
      dot.addEventListener('click', () => {
        setTheme(dot.dataset.themeName);
      });
    });
  }

  // --- 初始化 ---
  function init() {
    initTheme();
    applyStatus(currentStatusIndex);
    updateClock();
    bindEvents();

    // 啟動每秒即時更新定時器
    setInterval(updateClock, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
