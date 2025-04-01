const hourTens = document.getElementById('hour-tens');
const hourOnes = document.getElementById('hour-ones');
const minuteTens = document.getElementById('minute-tens');
const minuteOnes = document.getElementById('minute-ones');
const secondTens = document.getElementById('second-tens');
const secondOnes = document.getElementById('second-ones');

// Get settings
const settings = window.electronAPI.getSettings();
applyTheme(settings.theme);
applyStyle(settings.clockStyle);
let use24Hour = settings.use24Hour;

// Initialize clock
updateClock();
setInterval(updateClock, 1000);

// Listen for theme changes
window.electronAPI.onThemeChanged((event, theme) => {
  applyTheme(theme);
});

// Listen for time format changes
window.electronAPI.onTimeFormatChanged((event, format24Hour) => {
  use24Hour = format24Hour;
  updateClock(); // Update display immediately
});

// Clock style changes
window.electronAPI.onStyleChanged((event, style) => {
  applyStyle(style);
});

function updateClock() {
  const now = new Date();
  
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Convert to 12-hour format if needed
  if (!use24Hour && hours > 12) {
    hours = hours - 12;
  } else if (!use24Hour && hours === 0) {
    hours = 12; // 12 AM
  }
  
  // Update hours
  hourTens.textContent = Math.floor(hours / 10);
  hourOnes.textContent = hours % 10;
  
  // Update minutes
  minuteTens.textContent = Math.floor(minutes / 10);
  minuteOnes.textContent = minutes % 10;
  
  // Update seconds
  secondTens.textContent = Math.floor(seconds / 10);
  secondOnes.textContent = seconds % 10;
  
  // Add flip animation
  if (seconds % 10 === 0) secondOnes.classList.add('flip');
  else secondOnes.classList.remove('flip');
  
  if (seconds === 0) {
    secondTens.classList.add('flip');
    if (minutes % 10 === 0) minuteOnes.classList.add('flip');
    else minuteOnes.classList.remove('flip');
  } else {
    secondTens.classList.remove('flip');
  }
  
  if (seconds === 0 && minutes === 0) {
    minuteTens.classList.add('flip');
    if (hours % 10 === 0) hourOnes.classList.add('flip');
    else hourOnes.classList.remove('flip');
  } else {
    minuteTens.classList.remove('flip');
  }
  
  if (seconds === 0 && minutes === 0 && hours % 10 === 0) {
    hourTens.classList.add('flip');
  } else {
    hourTens.classList.remove('flip');
  }
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
}

function applyStyle(style) {
  // Remove all style classes first
  document.body.classList.remove('cyberpunk-style');
  document.body.classList.remove('vintage-style');
  document.body.classList.remove('elegant-style');
  
  // Apply the selected style
  if (style === 'cyberpunk') {
    document.body.classList.add('cyberpunk-style');
  } else if (style === 'vintage') {
    document.body.classList.add('vintage-style');
  } else if (style === 'elegant') {
    document.body.classList.add('elegant-style');
  }
}