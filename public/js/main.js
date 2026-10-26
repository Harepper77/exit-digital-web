// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      toggle.focus();
    }
  });
}

// Límite de tamaño del archivo (Netlify Forms acepta ~8 MB)
const file = document.querySelector('input[type="file"][data-max-mb]');
if (file) {
  const field = file.closest('.field');
  const msg = document.createElement('p');
  msg.className = 'error';
  msg.setAttribute('role', 'alert');
  file.addEventListener('change', () => {
    const tooBig = file.files[0] && file.files[0].size > Number(file.dataset.maxMb) * 1024 * 1024;
    field.classList.toggle('has-error', Boolean(tooBig));
    file.setCustomValidity(tooBig ? file.dataset.error : '');
    msg.textContent = tooBig ? file.dataset.error : '';
    if (tooBig) field.append(msg); else msg.remove();
  });
}
