document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú Hamburguesa Móvil
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. Modales (Ministerios & Admin)
  const btnMinisterios = document.getElementById('btnMinisterios');
  const modalMinisterios = document.getElementById('modalMinisterios');
  const closeMinisterios = document.getElementById('closeMinisterios');

  const btnAdminLogin = document.getElementById('btnAdminLogin');
  const modalAdmin = document.getElementById('modalAdmin');
  const closeAdmin = document.getElementById('closeAdmin');

  // Abrir y Cerrar Ministerios
  btnMinisterios?.addEventListener('click', () => modalMinisterios.classList.add('active'));
  closeMinisterios?.addEventListener('click', () => modalMinisterios.classList.remove('active'));

  // Abrir y Cerrar Admin
  btnAdminLogin?.addEventListener('click', () => modalAdmin.classList.add('active'));
  closeAdmin?.addEventListener('click', () => modalAdmin.classList.remove('active'));

  // Cerrar Modales dando clic afuera
  window.addEventListener('click', (e) => {
    if (e.target === modalMinisterios) modalMinisterios.classList.remove('active');
    if (e.target === modalAdmin) modalAdmin.classList.remove('active');
  });

  // 3. Sistema de Calendario / Eventos
  let initialEvents = [
    {
      id: 1,
      title: "Noche de Jóvenes - Diseño Original",
      date: "2026-11-07",
      time: "20:00",
      category: "Jóvenes",
      description: "Una noche increíble de adoración, palabra y fraternidad."
    },
    {
      id: 2,
      title: "Taller de Estudio Bíblico",
      date: "2026-11-12",
      time: "19:30",
      category: "Capacitaciones",
      description: "Profundizando en los fundamentos de las Escrituras."
    },
    {
      id: 3,
      title: "Refugio Kids: Día Especial",
      date: "2026-11-15",
      time: "10:30",
      category: "Niños",
      description: "Juegos, dinámicas y enseñanza para los más chicos."
    }
  ];

  // Cargar eventos guardados en localStorage si existen
  const savedEvents = localStorage.getItem('refugio_events');
  let events = savedEvents ? JSON.parse(savedEvents) : initialEvents;

  const eventsContainer = document.getElementById('eventsContainer');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderEvents(filter = 'todos') {
    if (!eventsContainer) return;
    eventsContainer.innerHTML = '';

    const filtered = filter === 'todos' 
      ? events 
      : events.filter(e => e.category.toLowerCase() === filter.toLowerCase());

    if (filtered.length === 0) {
      eventsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No hay eventos programados en esta categoría.</p>`;
      return;
    }

    filtered.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <span class="event-tag">${ev.category}</span>
        <h4 class="event-title">${ev.title}</h4>
        <div class="event-meta">
          <span><i class="fa-regular fa-calendar"></i> ${ev.date}</span>
          <span><i class="fa-regular fa-clock"></i> ${ev.time} hs</span>
        </div>
        <p class="event-desc">${ev.description}</p>
      `;
      eventsContainer.appendChild(card);
    });
  }

  // Filtrado
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEvents(btn.dataset.filter);
    });
  });

  renderEvents();

  // 4. Panel Admin (Autenticación + Guardado de Eventos)
  const adminAuthForm = document.getElementById('adminAuthForm');
  const adminAuthSection = document.getElementById('adminAuthSection');
  const adminFormSection = document.getElementById('adminFormSection');
  const addEventForm = document.getElementById('addEventForm');

  adminAuthForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    
    // Contraseña por defecto: admin123
    if (pass === 'admin123') {
      adminAuthSection.style.display = 'none';
      adminFormSection.style.display = 'block';
    } else {
      alert('Contraseña incorrecta. (Prueba con "admin123")');
    }
  });

  addEventForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const newEvent = {
      id: Date.now(),
      title: document.getElementById('eventTitle').value,
      date: document.getElementById('eventDate').value,
      time: document.getElementById('eventTime').value,
      category: document.getElementById('eventCategory').value,
      description: document.getElementById('eventDesc').value
    };

    events.unshift(newEvent);
    localStorage.setItem('refugio_events', JSON.stringify(events));

    renderEvents();
    addEventForm.reset();
    modalAdmin.classList.remove('active');
    
    // Resetear formulario admin para el próximo ingreso
    setTimeout(() => {
      adminAuthSection.style.display = 'block';
      adminFormSection.style.display = 'none';
      document.getElementById('adminPassword').value = '';
    }, 400);

    alert('¡Actividad agregada exitosamente al calendario!');
  });

  // 5. Animación Fade-in al hacer Scroll
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

  // 6. Formulario de Contacto
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value;
      alert(`¡Gracias por contactarte, ${nombre}! Te responderemos a la brevedad.`);
      contactForm.reset();
    });
  }
});
