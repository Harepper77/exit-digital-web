const header = document.querySelector('.site-header');

// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (header && toggle && nav) {
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

// Header transparente sobre el hero; sólido al hacer scroll
if (header) {
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Sección activa en el menú
const navLinks = [...document.querySelectorAll('.nav ul a[href*="#"]')];
if ('IntersectionObserver' in window && navLinks.length) {
  const byId = new Map(navLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((a) => a.removeAttribute('aria-current'));
      byId.get(entry.target.id)?.setAttribute('aria-current', 'true');
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

// Partidas del formulario: todas existen en el HTML (Netlify solo guarda campos que conoce);
// las ocultas van deshabilitadas para que no se validen ni se envíen.
const form = document.querySelector('form[name="cotizacion"]');
const add = form?.querySelector('.item-add');
if (form && add) {
  const items = [...form.querySelectorAll('.item')];
  const full = document.createElement('p');
  full.className = 'hint items-full';
  full.textContent = add.dataset.full;
  full.hidden = true;
  add.after(full);

  const sync = () => {
    const visible = items.filter((it) => !it.hidden);
    visible.forEach((it, i) => {
      it.querySelectorAll('.item-n').forEach((el) => { el.textContent = String(i + 1); });
    });
    const isFull = visible.length === items.length;
    add.hidden = isFull;
    full.hidden = !isFull;
  };

  add.addEventListener('click', () => {
    const next = items.find((it) => it.hidden);
    if (!next) return;
    next.hidden = false;
    next.disabled = false;
    sync();
    next.querySelector('select, input')?.focus();
  });

  form.addEventListener('click', (e) => {
    const remove = e.target.closest('.item-remove');
    if (!remove) return;
    const item = remove.closest('.item');
    item.querySelectorAll('select, input').forEach((el) => { el.value = ''; });
    item.hidden = true;
    item.disabled = true;
    sync();
    (add.hidden ? form.querySelector('.item:not([hidden]) select') : add).focus();
  });
}

// Archivo: muestra el nombre y limita el tamaño (Netlify Forms acepta ~8 MB)
for (const input of document.querySelectorAll('input[type="file"][data-max-mb]')) {
  const name = input.closest('.file')?.querySelector('.file__name');
  input.addEventListener('change', () => {
    const file = input.files[0];
    const tooBig = Boolean(file) && file.size > Number(input.dataset.maxMb) * 1024 * 1024;
    input.setCustomValidity(tooBig ? input.dataset.error : '');
    if (tooBig) input.reportValidity();
    if (name) name.textContent = file ? file.name : name.dataset.none;
  });
}
