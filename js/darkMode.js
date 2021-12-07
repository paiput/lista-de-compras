const toggleSwitch = document.getElementById('theme-checkbox');

// se fija si el color del tema esta guardado en el localStorage 
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
  // documentElement refiere a la etiqueta <html>
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
  }
}
 
// cambia de un tema a otro y guarda el valor en el localStorage
const switchTheme = (e) => {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}

toggleSwitch.addEventListener('change', switchTheme);