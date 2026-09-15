/* ==========================================================================
   CHANDRU PHOTOGRAPHY — INTERACTIVE LOGIC & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Navigation & Scroll Spy ---
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 2. Mobile Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  function toggleMobileMenu() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);

  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) toggleMobileMenu();
    });
  });

  // --- 3. Hero Background Automatic Slideshow (Continuous 2-second interval) ---
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  let currentHeroIndex = 0;
  let heroSlideTimer = null;

  function switchHeroSlide(targetIndex) {
    if (!heroSlides.length) return;
    heroSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === targetIndex);
    });
    heroDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === targetIndex);
    });
    currentHeroIndex = targetIndex;
  }

  function advanceHeroSlide() {
    const nextIndex = (currentHeroIndex + 1) % heroSlides.length;
    switchHeroSlide(nextIndex);
  }

  function startHeroTimer() {
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(advanceHeroSlide, 2000); // 2 seconds continuous
  }

  if (heroSlides.length > 1) {
    startHeroTimer();

    // Click to switch manually & restart 2s timer
    heroDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const slideIdx = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
        switchHeroSlide(slideIdx);
        startHeroTimer();
      });
    });
  }

  // --- 4. Viewport Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Animated Stats Counter ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = target / 50;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              stat.innerText = Math.ceil(count) + suffix;
              requestAnimationFrame(updateCount);
            } else {
              stat.innerText = target + suffix;
            }
          };
          updateCount();
        });
      }
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // --- 5. Portfolio Category Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- 6. Fullscreen Lightbox Gallery Viewer ---
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentGalleryIndex = 0;
  const visibleGalleryItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

  function openLightbox(index) {
    const visibleItems = visibleGalleryItems();
    if (visibleItems.length === 0) return;
    
    currentGalleryIndex = index;
    const currentItem = visibleItems[currentGalleryIndex];
    const img = currentItem.querySelector('img');
    const title = currentItem.querySelector('.gallery-title').innerText;
    const category = currentItem.querySelector('.gallery-category').innerText;

    lightboxImg.src = img.src;
    lightboxTitle.innerText = title;
    lightboxCategory.innerText = category;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextLightbox() {
    const visibleItems = visibleGalleryItems();
    currentGalleryIndex = (currentGalleryIndex + 1) % visibleItems.length;
    openLightbox(currentGalleryIndex);
  }

  function showPrevLightbox() {
    const visibleItems = visibleGalleryItems();
    currentGalleryIndex = (currentGalleryIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const visibleItems = visibleGalleryItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) openLightbox(index);
    });
  });

  // Also enable full photo preview for service cards
  const serviceImages = document.querySelectorAll('.service-image');
  serviceImages.forEach((sImg) => {
    sImg.addEventListener('click', (e) => {
      e.stopPropagation();
      const fullSrc = sImg.getAttribute('data-full-img') || sImg.querySelector('img').src;
      const title = sImg.getAttribute('data-title') || sImg.closest('.service-card').querySelector('.service-title').innerText;
      const category = sImg.getAttribute('data-category') || 'Photography Service';

      lightboxImg.src = fullSrc;
      lightboxTitle.innerText = title;
      lightboxCategory.innerText = category;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextLightbox();
    if (e.key === 'ArrowLeft') showPrevLightbox();
  });

  // --- 7. Testimonials Carousel ---
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    currentSlide = index;
    if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentSlide));
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 6000);
    });
  });

  if (slides.length > 0) {
    slideInterval = setInterval(nextSlide, 6000);
  }

  // --- 8. Booking Modal & Form Submissions ---
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Auto-select service in modal if clicked from a service card
      const serviceCard = btn.closest('.service-card');
      if (serviceCard) {
        const titleEl = serviceCard.querySelector('.service-title');
        const modalSelect = document.getElementById('modalService');
        if (titleEl && modalSelect) {
          const serviceName = titleEl.textContent.trim();
          for (let i = 0; i < modalSelect.options.length; i++) {
            if (modalSelect.options[i].value.toLowerCase() === serviceName.toLowerCase()) {
              modalSelect.selectedIndex = i;
              break;
            }
          }
        }
      }

      if (bookingModal) {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  const WHATSAPP_PHONE = '919894276553';

  window.openWhatsApp = function(text) {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedText}`;
    window.location.href = whatsappUrl;
  };

  window.handleEnquiryForm = function(e, form, isModal = false) {
    if (e && e.preventDefault) e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const emailInput = form.querySelector('[name="email"]');
    const serviceInput = form.querySelector('[name="service"]');
    const dateInput = form.querySelector('[name="date"]');
    const messageInput = form.querySelector('[name="message"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const service = serviceInput ? serviceInput.value.trim() : '';
    const date = dateInput ? dateInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    let text = `Hello Chandru Photography! 📸\n\n`;
    text += `New Photography Session Booking Enquiry:\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    if (name) text += `👤 Name: ${name}\n`;
    if (phone) text += `📞 Phone: ${phone}\n`;
    if (email) text += `📧 Email: ${email}\n`;
    if (service) text += `🎯 Service: ${service}\n`;
    if (date) text += `📅 Date: ${date}\n`;
    if (message) text += `💬 Message: ${message}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━`;

    window.openWhatsApp(text);
    return false;
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => window.handleEnquiryForm(e, contactForm, false));
  }
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => window.handleEnquiryForm(e, modalForm, true));
  }

  // WhatsApp buttons (header, footer, modal)
  const whatsappBtns = document.querySelectorAll('.whatsapp-btn');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const parentForm = btn.closest('form');
      if (parentForm) {
        window.handleEnquiryForm(e, parentForm, true);
        return;
      }

      const defaultText = "Hello Chandru Photography! I am interested in booking a photography session. Please share available details.";
      window.openWhatsApp(defaultText);
    });
  });

  // Toast System
  function showToast(message) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="ri-checkbox-circle-fill" style="color: var(--bronze-primary); font-size: 1.25rem;"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
});
