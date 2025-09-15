// =============================
// Portfolio Interactivity JS
// =============================

// Sticky nav active link + smooth scroll
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section'); // includes newly added #skills and #certificates
const header = document.querySelector('.site-header');
const hamburger = document.getElementById('hamburger');
const mainNav = document.querySelector('.main-nav');

// Smooth scroll for nav and buttons
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').replace('#','');
    const targetSection = document.getElementById(targetId);
    if(targetSection){
      targetSection.scrollIntoView({behavior:'smooth'});
      // Close mobile nav
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  });
});

// Hero button scroll
const scrollBtns = document.querySelectorAll('.scroll-btn');
scrollBtns.forEach(btn => {
  btn.addEventListener('click', function(e){
    e.preventDefault();
    const href = btn.getAttribute('href');
    const target = document.querySelector(href);
    if(target){
      target.scrollIntoView({behavior:'smooth'});
    }
  });
});

// Hamburger menu toggle
hamburger.addEventListener('click', function(){
  mainNav.classList.toggle('open');
  hamburger.classList.toggle('open');
  document.body.classList.toggle('nav-open');
  hamburger.setAttribute('aria-expanded', mainNav.classList.contains('open'));
});

// Close nav on outside click (mobile)
document.addEventListener('click', function(e){
  if(mainNav.classList.contains('open') && !mainNav.contains(e.target) && !hamburger.contains(e.target)){
    mainNav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('nav-open');
  }
});

// Highlight nav link on scroll
function setActiveNav(){
  let scrollPos = window.scrollY + header.offsetHeight + 10;
  sections.forEach(section => {
    if(scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight){
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector('.nav-link[href="#'+section.id+'"]');
      if(activeLink) activeLink.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveNav);
window.addEventListener('resize', setActiveNav);
setActiveNav();

// Reveal animation on scroll (intersection observer)
const revealEls = document.querySelectorAll('.reveal, .fade-in-up, .reveal-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      // Add class to start animation
      entry.target.classList.add('in-view');
    } else {
      // Remove to allow replay on re-enter
      entry.target.classList.remove('in-view');
    }
  });
},{ threshold: 0.2 });
revealEls.forEach(el => observer.observe(el));


// Footer year
const yearEl = document.getElementById('year');
if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

// Contact form validation (basic)
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    let valid = true;
    const name = contactForm.name;
    const email = contactForm.email;
    const message = contactForm.message;
    // Reset errors
    contactForm.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    contactForm.querySelectorAll('input, textarea').forEach(el => el.classList.remove('error'));
    // Name
    if(!name.value.trim()){
      name.classList.add('error');
      name.nextElementSibling.textContent = 'Name is required.';
      valid = false;
    }
    // Email
    if(!email.value.trim()){
      email.classList.add('error');
      email.nextElementSibling.textContent = 'Email is required.';
      valid = false;
    } else if(!/^\S+@\S+\.\S+$/.test(email.value)){
      email.classList.add('error');
      email.nextElementSibling.textContent = 'Enter a valid email.';
      valid = false;
    }
    // Message
    if(!message.value.trim()){
      message.classList.add('error');
      message.nextElementSibling.textContent = 'Message is required.';
      valid = false;
    }
    // Status
    const status = document.getElementById('formStatus');
    if(valid){
      status.textContent = 'Message sent! (Demo only)';
      contactForm.reset();
      setTimeout(()=>{ status.textContent = ''; }, 3500);
    } else {
      status.textContent = '';
    }
  });
}

// =============================
// Project & Certificates Carousels
// =============================
document.querySelectorAll('.project-carousel, .cert-carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const indicatorsWrap = carousel.querySelector('.carousel-indicators');
  let index = 0;
  const isCertCarousel = carousel.classList.contains('cert-carousel');
  let autoTimer;

  // Build indicators
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if(i===0) dot.classList.add('active');
    dot.setAttribute('aria-label', 'Go to slide ' + (i+1));
    dot.addEventListener('click', () => goTo(i));
    indicatorsWrap.appendChild(dot);
  });
  const dots = Array.from(indicatorsWrap.children);

  function goTo(i){
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d=>d.classList.remove('active'));
    dots[index].classList.add('active');
    if(!isCertCarousel) restartAuto();
  }
  function next(){ goTo(index+1); }
  function prev(){ goTo(index-1); }
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  function startAuto(){ autoTimer = setInterval(next, 5000); }
  function stopAuto(){ if(autoTimer) clearInterval(autoTimer); }
  function restartAuto(){ stopAuto(); startAuto(); }

  if(!isCertCarousel){
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    startAuto();
  }
});

// =============================
// Hero Re-Trigger Animation
// =============================
const heroSection = document.getElementById('home');
const heroAnimEls = heroSection ? heroSection.querySelectorAll('.fade-in-up') : [];

function restartHeroAnimation(){
  heroAnimEls.forEach(el => {
    el.classList.remove('in-view');
    void el.offsetWidth; // force reflow
    el.classList.add('in-view');
  });
}

// Re-trigger when nav link to home is clicked
navLinks.forEach(l => {
  l.addEventListener('click', e => {
    const targetId = l.getAttribute('href').slice(1);
    if(targetId === 'home') {
      // Wait for smooth scroll to roughly complete
      setTimeout(restartHeroAnimation, 650);
    }
  });
});

// Re-trigger when scrolling back to hero after leaving it
let heroPreviouslyVisible = true; // it's visible at initial load
if(heroSection){
  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting){
        heroPreviouslyVisible = false; // we left the hero
      } else if(entry.isIntersecting && heroPreviouslyVisible === false){
        restartHeroAnimation();
        heroPreviouslyVisible = true;
      }
    });
  }, { threshold: 0.65 });
  heroObserver.observe(heroSection);
}

// Optional: ensure initial load animation fires (in case of bfcache restore)
window.addEventListener('pageshow', (evt) => {
  if (evt.persisted) { // coming from bfcache
    setTimeout(restartHeroAnimation, 90);
  }
});

// Back-to-top button also replays hero animation
const backToTopBtn = document.querySelector('.back-to-top');
if(backToTopBtn){
  backToTopBtn.addEventListener('click', () => {
    setTimeout(restartHeroAnimation, 650);
  });
}
