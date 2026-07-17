/**
 * DAW Branding Agency Landing Page - Core Interaction Script
 * Performance-focused custom micro-animations (No large libraries)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypography();
  initStickyHeader();
  initMagneticButtons();
  initScrollReveal();
  initContactForm();
  initMarquee();
});

/**
 * 1. Sticky Pinned Header Morph Behavior
 * Performance optimized with passive scroll listeners
 */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const scrollThreshold = 60;
  
  const checkScroll = () => {
    if (window.scrollY > scrollThreshold) {
      if (!header.classList.contains('is-scrolled')) {
        header.classList.add('is-scrolled');
      }
    } else {
      if (header.classList.contains('is-scrolled')) {
        header.classList.remove('is-scrolled');
      }
    }
  };

  // Run immediately on page load
  checkScroll();

  window.addEventListener('scroll', checkScroll, { passive: true });
}

/**
 * 2. Magnetic Button Physics (Dynamic Cursor Snapping)
 * Performs physical mouse-pull translations inside bounds
 */
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.cta-pill-wrapper, .btn');
  
  if (magneticElements.length === 0) return;

  magneticElements.forEach((el) => {
    // We target the inner interactive element for actual motion
    const target = el.querySelector('.cta-pill, .btn-inner') || el;
    
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate pull vector (max 15px travel for high-end subtle tactile feedback)
      const pullForce = 0.35; 
      const moveX = x * pullForce;
      const moveY = y * pullForce;
      
      target.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      target.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
    });
    
    el.addEventListener('mouseleave', () => {
      // Smoothly snap back to origin using premium spring timing
      target.style.transform = 'translate3d(0, 0, 0)';
      target.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

/**
 * 3. Intersection Observer Scroll Reveal Sequences
 * Staggered animations using sequential reveals
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.text-reveal, .project-card, .service-card');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null, // Viewport
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: '0px 0px -50px 0px' // Slightly offset bottom threshold to trigger organically
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add active classes
        entry.target.classList.add('visible');
        
        // Stagger list elements or siblings if they match index conditions
        if (entry.target.classList.contains('project-card') || entry.target.classList.contains('service-card')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = entry.target.style.transform.replace('translateY(30px)', '') + ' translateY(0)';
        }
        
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    // Add base classes for portfolio/services cards to reveal cleanly
    if (el.classList.contains('project-card') || el.classList.contains('service-card')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
      // Apply micro-delay depending on card cascade
      el.style.transitionDelay = `${(index % 2) * 150}ms`;
    }
    
    revealObserver.observe(el);
  });
}

/**
 * 4. Premium Form Handling
 * Validation status indicators, inline messaging, and submission shimmer
 */
function initContactForm() {
  const form = document.getElementById('daw-contact-form');
  const statusMessage = document.getElementById('form-status-message');
  
  if (!form || !statusMessage) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Fetch input values
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    // Simple verification
    if (!name || !email || !message) {
      showStatus('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }
    
    if (!validateEmail(email)) {
      showStatus('Veuillez entrer une adresse e-mail valide.', 'error');
      return;
    }
    
    // Simulate premium submit loading state
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="animation: spin 0.8s linear infinite; margin-right: 0.5rem;">
        <circle cx="12" cy="12" r="10" stroke-dasharray="35 20"></circle>
      </svg>
      ENVOI EN COURS...
    `;
    
    // Inject animation CSS rule for spinner dynamically
    if (!document.getElementById('spinner-anim-style')) {
      const style = document.createElement('style');
      style.id = 'spinner-anim-style';
      style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }
    
    fetch("https://submit-form.com/w5Zw3SKfz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: document.getElementById('form-phone') ? document.getElementById('form-phone').value.trim() : '',
        message: message
      }),
    })
    .then((response) => {
      if (response.ok) {
        showStatus('Merci! Votre demande a été transmise avec succès. L’équipe DAW vous contactera rapidement.', 'success');
        form.reset();
      } else {
        showStatus('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.', 'error');
      }
    })
    .catch((error) => {
      showStatus('Erreur de connexion. Veuillez vérifier votre réseau.', 'error');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
  });
  
  function showStatus(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.className = `form-status ${type}`;
    
    // Smooth scroll down to read status if needed
    statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-fade warning messages after time, success persists
    if (type === 'error') {
      setTimeout(() => {
        statusMessage.style.opacity = '0';
        statusMessage.style.transition = 'opacity 0.6s ease';
        setTimeout(() => {
          statusMessage.className = 'form-status';
          statusMessage.style.opacity = '1';
        }, 600);
      }, 5000);
    }
  }
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

/**
 * 5. Scroll Velocity Weather & Time Marquee (Caen, France)
 * Simulates React Bits ScrollVelocity dynamic scrolling with spring physics.
 */
async function initMarquee() {
  const scroller1 = document.getElementById('marquee-scroller-1');
  const scroller2 = document.getElementById('marquee-scroller-2');
  if (!scroller1 || !scroller2) return;

  // Fetch real-time weather from Open-Meteo API (Caen coordinates: 49.18, -0.37)
  let weatherText = "CAEN, FRANCE • CIEL DÉGAGÉ 22°C";
  try {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=49.18&longitude=-0.37&current_weather=true");
    const data = await res.json();
    if (data && data.current_weather) {
      const temp = Math.round(data.current_weather.temperature);
      const code = data.current_weather.weathercode;
      const descriptions = {
        0: "CIEL DÉGAGÉ", 1: "PLUTÔT DÉGAGÉ", 2: "PARTIELLEMENT NUAGEUX", 3: "COUVERT",
        45: "BROUILLARD", 48: "BROUILLARD DE GIVRE", 51: "BRINE LÉGÈRE", 53: "BRINE", 55: "BRINE DENSE",
        61: "PLUIE LÉGÈRE", 63: "PLUIE", 65: "FORTE PLUIE", 71: "NEIGE LÉGÈRE", 73: "NEIGE", 75: "FORTE NEIGE",
        80: "AVERSE LÉGÈRE", 81: "AVERSE", 82: "FORTE AVERSE", 95: "ORAGE"
      };
      const desc = descriptions[code] || "CIEL DÉGAGÉ";
      weatherText = `CAEN, FRANCE • ${desc} ${temp}°C`;
    }
  } catch (e) {
    console.error("Failed to fetch weather:", e);
  }

  // Calculate Caen time in Europe/Paris timezone (Hour and Minute only)
  function getCaenTime() {
    return new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());
  }

  // Populate marquee copy
  let marqueeString = "";
  let copyWidth = 0;

  function measureWidth() {
    const spanElement = scroller1.querySelector('span');
    if (spanElement) {
      copyWidth = spanElement.offsetWidth;
    }
  }

  function updateText() {
    const caenTime = getCaenTime();
    marqueeString = `${weatherText} • HEURE LOCALE ${caenTime} • `;
    
    // Create multiple copies for infinite wrapping
    const numCopies = 10;
    const itemsHtml = Array(numCopies).fill(`<span>${marqueeString}</span>`).join('');
    
    // Only update innerHTML if it has changed to prevent DOM thrashing
    if (scroller1.innerHTML !== itemsHtml) {
      scroller1.innerHTML = itemsHtml;
      scroller2.innerHTML = itemsHtml;
      // Measure width after DOM updates
      requestAnimationFrame(measureWidth);
    }
  }
  
  updateText();
  setInterval(updateText, 5000); // Update every 5 seconds to track minute transitions
  window.addEventListener('resize', measureWidth, { passive: true });

  // Physics animation variables
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let smoothVelocity = 0;
  
  // Track scroll speed
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollVelocity = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
  }, { passive: true });

  let x1 = 0;
  let x2 = 0;
  const baseSpeed = 1.0; // Base scrolling speed (px/frame)
  
  function animate() {
    // Spring physics simulation: decay raw velocity and interpolate (lerp)
    scrollVelocity *= 0.96; // friction (slightly reduced decay for more momentum)
    smoothVelocity += (scrollVelocity - smoothVelocity) * 0.05; // spring interpolation
    
    if (copyWidth === 0) {
      measureWidth();
    }

    if (copyWidth > 0) {
      // Calculate scroll-speed multiplier (increased multiplier factor to 0.25 for dynamic acceleration)
      const speedMultiplier = 1 + Math.abs(smoothVelocity) * 0.25;
      
      // Row 1 goes left
      x1 -= baseSpeed * speedMultiplier;
      if (x1 <= -copyWidth) {
        x1 += copyWidth;
      }
      scroller1.style.transform = `translate3d(${x1}px, 0, 0)`;
      
      // Row 2 goes right
      x2 += baseSpeed * speedMultiplier;
      if (x2 >= 0) {
        x2 -= copyWidth;
      }
      scroller2.style.transform = `translate3d(${x2}px, 0, 0)`;
    }
    
    requestAnimationFrame(animate);
  }
  
  // Wait short delay for font layouts to compute widths accurately
  setTimeout(() => {
    measureWidth();
    animate();
  }, 150);
}

/**
 * 6. Typography Formatting
 * Automatically applies line-breaking and widow prevention rules to block level elements
 */
function initTypography() {
  if (typeof TypographyFormatter !== 'undefined') {
    const formatter = new TypographyFormatter({ locale: 'fr' });
    formatter.init();
  }
}
