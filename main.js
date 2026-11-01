document.addEventListener('DOMContentLoaded', () => {
  // 1. Cursor Iluminado Interactivo
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 2. Navbar Inteligente (Transparente a Glassmorphism con Blur al hacer Scroll)
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 3. Navegación Limpia sin modificar la URL
  const scrollTriggers = document.querySelectorAll('[data-scroll]');
  scrollTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-scroll');
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        if (trigger.classList.contains('nav-item')) {
          trigger.classList.add('active');
        }

        const navMenu = document.querySelector('.nav-links');
        const hamburger = document.getElementById('hamburger');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
        }
      }
    });
  });

  // 4. Menú Hamburguesa Móvil
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  // 5. Modales (Ministerios & Admin)
  const btnMinisterios = document.getElementById('btnMinisterios');
  const modalMinisterios = document.getElementById('modalMinisterios');
  const closeMinisterios = document.getElementById('closeMinisterios');

  const btnAdminLogin = document.getElementById('btnAdminLogin');
  const modalAdmin = document.getElementById('modalAdmin');
  const closeAdmin = document.getElementById('closeAdmin');

  btnMinisterios?.addEventListener('click', () => modalMinisterios.classList.add('active'));
  closeMinisterios?.addEventListener('click', () => modalMinisterios.classList.remove('active'));

  btnAdminLogin?.addEventListener('click', () => modalAdmin.classList.add('active'));
  closeAdmin?.addEventListener('click', () => modalAdmin.classList.remove('active'));

  window.addEventListener('click', (e) => {
    if (e.target === modalMinisterios) modalMinisterios.classList.remove('active');
    if (e.target === modalAdmin) modalAdmin.classList.remove('active');
  });

  // 6. Hero Slider Automático e Interactivo (14 Diapositivas)
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length > 0 && dotsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlideFunc() {
      goToSlide(currentSlide + 1);
    }

    nextBtn?.addEventListener('click', () => {
      nextSlideFunc();
      resetInterval();
    });

    prevBtn?.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetInterval();
    });

    function startInterval() {
      slideInterval = setInterval(nextSlideFunc, 6000);
    }

    function resetInterval() {
      clearInterval(slideInterval);
      startInterval();
    }

    startInterval();
  }

  // 7. Sistema de Calendario / Eventos
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
      title: "Encuentro Re.Creadas",
      date: "2026-11-10",
      time: "19:00",
      category: "Mujeres",
      description: "Espacio de edificación, té y taller para mujeres."
    },
    {
      id: 3,
      title: "Reunión de Adolescentes",
      date: "2026-11-14",
      time: "18:00",
      category: "Adolescentes",
      description: "Juegos, charlas y comunión para chicos de secundaria."
    }
  ];

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

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEvents(btn.dataset.filter);
    });
  });

  renderEvents();

  // 8. Panel Admin (Autenticación + Guardado de Eventos)
  const adminAuthForm = document.getElementById('adminAuthForm');
  const adminAuthSection = document.getElementById('adminAuthSection');
  const adminFormSection = document.getElementById('adminFormSection');
  const addEventForm = document.getElementById('addEventForm');

  adminAuthForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    
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
    
    setTimeout(() => {
      adminAuthSection.style.display = 'block';
      adminFormSection.style.display = 'none';
      document.getElementById('adminPassword').value = '';
    }, 400);

    alert('¡Actividad agregada exitosamente al calendario!');
  });

  // 9. Animación Fade-in al hacer Scroll
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

  // 10. Formulario de Contacto
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
