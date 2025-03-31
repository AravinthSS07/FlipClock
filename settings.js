const { ipcRenderer } = require('electron');

// DOM elements
const themeSelect = document.getElementById('theme');
const startupCheckbox = document.getElementById('startup');
const use24HourCheckbox = document.getElementById('use24Hour');
const saveBtn = document.getElementById('save-btn');
const backBtn = document.getElementById('back-btn');

// Load current settings
const settings = ipcRenderer.sendSync('get-settings');
themeSelect.value = settings.theme;
startupCheckbox.checked = settings.startOnStartup;
use24HourCheckbox.checked = settings.use24Hour;

applyTheme(settings.theme);

// Save settings
saveBtn.addEventListener('click', () => {
  const newSettings = {
    theme: themeSelect.value,
    startOnStartup: startupCheckbox.checked,
    use24Hour: use24HourCheckbox.checked
  };
  
  ipcRenderer.send('save-settings', newSettings);
  ipcRenderer.send('show-clock');
});

// Back to clock without saving
backBtn.addEventListener('click', () => {
  ipcRenderer.send('show-clock');
});

function applyTheme(theme){
  if(theme == 'light'){
    document.body.classList.add('light-theme');
  }else{
    document.body.classList.remove('light-theme')
  }
}