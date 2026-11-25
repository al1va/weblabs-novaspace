// Ініціалізація всіх інтерактивних елементів після завантаження DOM.
// Бібліотеки (Typed.js, Swiper, Fancybox) підключаються через CDN у index.html.
document.addEventListener('DOMContentLoaded', () => {
  // 1) Hero-секція: ефект друку Typed.js — 3 слогани, loop.
  if (window.Typed && document.getElementById('typed-slogans')) {
    new Typed('#typed-slogans', {
      strings: [
        'Створюємо продумані інтер\'єри та архітектуру.',
        'Простори, що відображають характер людей і брендів.',
        'Від ідеї до готового простору — з нами.'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true
    });
  }

  // 2) Карусель відгуків Swiper v11 — autoplay 3500 мс, pauseOnMouseEnter, breakpoints.
  if (window.Swiper && document.querySelector('.reviews-swiper')) {
    new Swiper('.reviews-swiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 24,
      autoplay: {
        delay: 3500,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      // Точки переривання: 320 → 1 слайд, 768 → 2, 1024 → 3.
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  // 3) Галерея Fancybox v5 — перехід fade, зум до 3x.
  if (window.Fancybox) {
    Fancybox.bind('[data-fancybox="gallery"]', {
      animated: true,
      showClass: 'fancybox-fade',
      hideClass: 'fancybox-fade',
      // Увімкнення зуму з максимальним коефіцієнтом збільшення 3x.
      zoom: true,
      zoomOpacity: true,
      Hash: false,
      Toolbar: {
        display: { left: [], middle: [], right: ['zoomIn', 'zoomOut', 'toggle1to1', 'close'] }
      },
      Images: {
        zoom: true,
        maxScale: 3
      }
    });
  }
});
