document.addEventListener('DOMContentLoaded', () => {
  // Menú hamburguesa para dispositivos móviles
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Manejo del formulario de contacto
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nombre = document.getElementById('nombre').value;
      
      alert(`¡Gracias por contactarte, ${nombre}! Nos pondremos en contacto a la brevedad.`);
      contactForm.reset();
    });
  }
});