const themeSelect = document.getElementById('theme');
const startupCheckbox = document.getElementById('startup');
const use24HourCheckbox = document.getElementById('use24Hour');
const clockStyleSelect = document.getElementById('clockStyle');
const saveBtn = document.getElementById('save-btn');
const backBtn = document.getElementById('back-btn');

// Load current settings
const settings = window.electronAPI.getSettings();
themeSelect.value = settings.theme;
startupCheckbox.checked = settings.startOnStartup;
use24HourCheckbox.checked = settings.use24Hour;
clockStyleSelect.value = settings.clockStyle;

applyTheme(settings.theme);

// Save settings
saveBtn.addEventListener('click', () => {
  const newSettings = {
    theme: themeSelect.value,
    startOnStartup: startupCheckbox.checked,
    use24Hour: use24HourCheckbox.checked,
    clockStyle: clockStyleSelect.value
  };
  
  window.electronAPI.saveSettings(newSettings);
  window.electronAPI.showClock();
});

// Back to clock without saving
backBtn.addEventListener('click', () => {
  window.electronAPI.showClock();
});

function applyTheme(theme){
  if(theme == 'light'){
    document.body.classList.add('light-theme');
  }else{
    document.body.classList.remove('light-theme')
  }
}