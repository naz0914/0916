/**
 * Personal Portal & Live Clock Application
 */

(function () {
  'use strict';

  // --- State & Preferences ---
  const STORAGE_KEYS = {
    NAME: 'personal_page_user_name',
    ROLE: 'personal_page_user_role',
    STATUS_INDEX: 'personal_page_status_index',
    FOCUS: 'personal_page_user_focus',
    TIME_FORMAT: 'personal_page_time_format', // '24' or '12'
    THEME: 'personal_page_theme'
  };

  const STATUS_LIST = [
    { text: 'Creating something amazing', color: '#10b981' },
    { text: 'In deep focus mode', color: '#6366f1' },
    { text: 'Exploring new technologies', color: '#06b6d4' },
    { text: 'Available for collaboration', color: '#22c55e' },
    { text: 'Recharging & daydreaming', color: '#f59e0b' }
  ];

  let is24HourFormat = localStorage.getItem(STORAGE_KEYS.TIME_FORMAT) !== '12';
  let currentStatusIndex = parseInt(localStorage.getItem(STORAGE_KEYS.STATUS_INDEX) || '0', 10);
  if (isNaN(currentStatusIndex) || currentStatusIndex >= STATUS_LIST.length) {
    currentStatusIndex = 0;
  }

  // --- DOM Elements ---
  const elements = {
    // Clock
    clockTime: document.getElementById('clock-time'),
    clockMeridiem: document.getElementById('clock-meridiem'),
    currentDate: document.getElementById('current-date'),
    currentTimezone: document.getElementById('current-timezone'),
    formatToggleBtn: document.getElementById('time-format-toggle'),
    formatLabel: document.getElementById('format-label'),

    // Greeting
    greetingText: document.getElementById('greeting-text'),
    greetingIcon: document.getElementById('greeting-icon'),

    // Identity
    userName: document.getElementById('user-name'),
    userRole: document.getElementById('user-role'),
    avatarMonogram: document.getElementById('avatar-monogram'),
    statusPill: document.getElementById('status-pill'),
    statusIndicator: document.querySelector('.status-indicator'),
    statusText: document.getElementById('status-text'),
    focusText: document.getElementById('focus-text'),

    // Buttons & Interactivity
    editNameBtn: document.getElementById('edit-name-btn'),
    editRoleBtn: document.getElementById('edit-role-btn'),
    copyTimeBtn: document.getElementById('copy-time-btn'),
    copyBtnText: document.getElementById('copy-btn-text'),

    // Modal
    modal: document.getElementById('edit-modal'),
    modalCancelBtn: document.getElementById('modal-cancel-btn'),
    modalSaveBtn: document.getElementById('modal-save-btn'),
    inputName: document.getElementById('input-name'),
    inputRole: document.getElementById('input-role'),

    // Themes
    themeSelector: document.getElementById('theme-selector'),
    themeDots: document.querySelectorAll('.theme-dot')
  };

  // --- Clock & Time Functions ---

  function formatTimeNumber(num) {
    return num.toString().padStart(2, '0');
  }

  function getTimezoneString(date) {
    const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const hours = Math.floor(absOffset / 60);
    const minutes = absOffset % 60;
    const formattedOffset = `UTC${sign}${formatTimeNumber(hours)}:${formatTimeNumber(minutes)}`;
    return `${formattedOffset} (${timeZoneName.split('/').pop().replace(/_/g, ' ')})`;
  }

  function updateGreeting(hours, name) {
    const firstName = name.trim().split(' ')[0] || 'there';
    let greeting = '';
    let icon = '✨';

    if (hours >= 5 && hours < 12) {
      greeting = `Good morning, ${firstName}`;
      icon = '🌅';
    } else if (hours >= 12 && hours < 17) {
      greeting = `Good afternoon, ${firstName}`;
      icon = '☀️';
    } else if (hours >= 17 && hours < 21) {
      greeting = `Good evening, ${firstName}`;
      icon = '🌆';
    } else {
      greeting = `Hello, night owl ${firstName}`;
      icon = '🌙';
    }

    elements.greetingText.textContent = greeting;
    elements.greetingIcon.textContent = icon;
  }

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
      elements.clockMeridiem.textContent = meridiem;
      elements.clockMeridiem.style.display = 'inline-block';
    } else {
      elements.clockMeridiem.style.display = 'none';
    }

    elements.clockTime.textContent = `${formatTimeNumber(displayHours)}:${formatTimeNumber(rawMinutes)}:${formatTimeNumber(rawSeconds)}`;

    // Date formatting (e.g. Wednesday, September 16, 2026)
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.currentDate.textContent = now.toLocaleDateString(undefined, dateOptions);

    // Timezone
    elements.currentTimezone.textContent = getTimezoneString(now);

    // Update greeting
    updateGreeting(rawHours, elements.userName.textContent);
  }

  function toggleTimeFormat() {
    is24HourFormat = !is24HourFormat;
    localStorage.setItem(STORAGE_KEYS.TIME_FORMAT, is24HourFormat ? '24' : '12');
    elements.formatLabel.textContent = is24HourFormat ? '24H' : '12H';
    updateClock();
  }

  // --- Identity & Monogram ---

  function updateMonogram(name) {
    const parts = name.trim().split(/\s+/);
    let initials = 'U';
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }
    elements.avatarMonogram.textContent = initials;
  }

  function loadIdentity() {
    const savedName = localStorage.getItem(STORAGE_KEYS.NAME) || 'Alex Morgan';
    const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE) || 'Innovator & Digital Explorer';
    const savedFocus = localStorage.getItem(STORAGE_KEYS.FOCUS) || '"Make each moment of the day count."';

    elements.userName.textContent = savedName;
    elements.userRole.textContent = savedRole;
    elements.focusText.textContent = savedFocus;
    updateMonogram(savedName);

    applyStatus(currentStatusIndex);
  }

  function applyStatus(index) {
    const status = STATUS_LIST[index % STATUS_LIST.length];
    elements.statusText.textContent = status.text;
    elements.statusIndicator.style.backgroundColor = status.color;
    elements.statusIndicator.style.boxShadow = `0 0 8px ${status.color}`;
  }

  function cycleStatus() {
    currentStatusIndex = (currentStatusIndex + 1) % STATUS_LIST.length;
    localStorage.setItem(STORAGE_KEYS.STATUS_INDEX, currentStatusIndex);
    applyStatus(currentStatusIndex);
  }

  // --- Modal Logic ---

  function openModal() {
    elements.inputName.value = elements.userName.textContent;
    elements.inputRole.value = elements.userRole.textContent;
    elements.modal.classList.remove('hidden');
    elements.modal.setAttribute('aria-hidden', 'false');
    elements.inputName.focus();
  }

  function closeModal() {
    elements.modal.classList.add('hidden');
    elements.modal.setAttribute('aria-hidden', 'true');
  }

  function saveIdentity() {
    const newName = elements.inputName.value.trim() || 'Alex Morgan';
    const newRole = elements.inputRole.value.trim() || 'Innovator & Digital Explorer';

    localStorage.setItem(STORAGE_KEYS.NAME, newName);
    localStorage.setItem(STORAGE_KEYS.ROLE, newRole);

    elements.userName.textContent = newName;
    elements.userRole.textContent = newRole;
    updateMonogram(newName);
    updateClock();
    closeModal();
  }

  // --- Daily Focus Inline Edit ---

  function editFocus() {
    const current = elements.focusText.textContent.replace(/^"|"$/g, '');
    const newFocus = prompt('Enter your focus or thought for today:', current);
    if (newFocus !== null && newFocus.trim() !== '') {
      const formatted = `"${newFocus.trim()}"`;
      elements.focusText.textContent = formatted;
      localStorage.setItem(STORAGE_KEYS.FOCUS, formatted);
    }
  }

  // --- Theme Management ---

  function setTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem(STORAGE_KEYS.THEME, themeName);

    elements.themeDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.themeName === themeName);
    });
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'obsidian';
    setTheme(savedTheme);
  }

  // --- Copy Time Functionality ---

  function copyCurrentTime() {
    const timeStr = elements.clockTime.textContent;
    const meridiem = !is24HourFormat ? ' ' + elements.clockMeridiem.textContent : '';
    const dateStr = elements.currentDate.textContent;
    const tzStr = elements.currentTimezone.textContent;

    const fullStr = `${dateStr} | ${timeStr}${meridiem} (${tzStr})`;

    navigator.clipboard.writeText(fullStr).then(() => {
      elements.copyBtnText.textContent = 'Copied! ✓';
      setTimeout(() => {
        elements.copyBtnText.textContent = 'Copy Time';
      }, 2000);
    }).catch(() => {
      elements.copyBtnText.textContent = 'Error copying';
      setTimeout(() => {
        elements.copyBtnText.textContent = 'Copy Time';
      }, 2000);
    });
  }

  // --- Event Listeners ---

  function bindEvents() {
    // 12/24 format toggle
    elements.formatToggleBtn.addEventListener('click', toggleTimeFormat);
    elements.formatLabel.textContent = is24HourFormat ? '24H' : '12H';

    // Status cycle
    elements.statusPill.addEventListener('click', cycleStatus);
    elements.statusPill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cycleStatus();
      }
    });

    // Identity edit triggers
    elements.userName.addEventListener('click', openModal);
    elements.editNameBtn.addEventListener('click', openModal);
    elements.userRole.addEventListener('click', openModal);
    elements.editRoleBtn.addEventListener('click', openModal);

    // Modal controls
    elements.modalCancelBtn.addEventListener('click', closeModal);
    elements.modalSaveBtn.addEventListener('click', saveIdentity);
    elements.modal.addEventListener('click', (e) => {
      if (e.target === elements.modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !elements.modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    elements.inputName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveIdentity();
    });
    elements.inputRole.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveIdentity();
    });

    // Focus edit
    elements.focusText.addEventListener('click', editFocus);

    // Theme dots
    elements.themeDots.forEach(dot => {
      dot.addEventListener('click', () => {
        setTheme(dot.dataset.themeName);
      });
    });

    // Copy time button
    elements.copyTimeBtn.addEventListener('click', copyCurrentTime);
  }

  // --- Initialization ---

  function init() {
    initTheme();
    loadIdentity();
    updateClock();
    bindEvents();

    // Start precision interval
    setInterval(updateClock, 1000);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
