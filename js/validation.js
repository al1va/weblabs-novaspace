(() => {
  'use strict';

  // Регулярні вираші для клієнтської валідації email і телефону.
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const REGEX_PHONE = /^\+380\d{9}$/;

  const form = document.getElementById('feedbackForm');
  const submitBtn = document.getElementById('feedbackSubmit');

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const messageInput = document.getElementById('contact-message');
  const agreementInput = document.getElementById('agreement');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const messageError = document.getElementById('messageError');
  const agreementError = document.getElementById('agreementError');

  // Поля, що підлягають валідації, у порядку перевірки при відправці.
  const fields = [
    { input: nameInput, error: nameError, validate: validateName },
    { input: emailInput, error: emailError, validate: validateEmail },
    { input: phoneInput, error: phoneError, validate: validatePhone },
    { input: messageInput, error: messageError, validate: validateMessage },
    { input: agreementInput, error: agreementError, validate: validateAgreement },
  ];

  // Модальне вікно успіху.
  const modal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // Елемент, який мав фокус до відкриття модального вікна.
  let lastFocusedElement = null;
  // Прапор уникнення нескінченного циклу подій input під час нормалізації телефону.
  let isNormalizingPhone = false;
  // Множина полів, з яких користувач уже зняв фокус (blob "touched").
  const touched = new Set();

  // ---------- Валідатори ----------

  function validateName(input) {
    return (input.value || '').trim().length >= 2;
  }

  function validateEmail(input) {
    return REGEX_EMAIL.test((input.value || '').trim());
  }

  function validatePhone(input) {
    // Фактична валідність визначається лише регулярним виразом.
    // Normalizacja у події input — це лише UX-помічник.
    return REGEX_PHONE.test(input.value || '');
  }

  function validateMessage(input) {
    return (input.value || '').trim().length >= 10;
  }

  function validateAgreement(input) {
    return input.checked === true;
  }

  // ---------- UI-функції ----------

  function showError(input, errorEl, msg) {
    input.classList.remove('border-gray', 'border-green-500');
    input.classList.add('border-red-500');
    input.setAttribute('aria-invalid', 'true');

    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }

  function showSuccess(input, errorEl) {
    input.classList.remove('border-gray', 'border-red-500');
    input.classList.add('border-green-500');
    input.setAttribute('aria-invalid', 'false');

    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }

  function clearState(input, errorEl) {
    input.classList.remove('border-red-500', 'border-green-500');
    input.classList.add('border-gray');
    input.setAttribute('aria-invalid', 'false');

    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }

  function getErrorForInput(input) {
    switch (input.id) {
      case 'contact-name': return nameError;
      case 'contact-email': return emailError;
      case 'contact-phone': return phoneError;
      case 'contact-message': return messageError;
      case 'agreement': return agreementError;
      default: return null;
    }
  }

  function checkField(input) {
    const errorEl = getErrorForInput(input);
    if (!errorEl) return false;

    const field = fields.find(f => f.input === input);
    const valid = field ? field.validate(input) : false;

    if (valid) {
      showSuccess(input, errorEl);
    } else {
      const messages = {
        'contact-name': 'Будь ласка, введіть ім’я (мінімум 2 символи).',
        'contact-email': 'Будь ласка, введіть коректну адресу електронної пошти.',
        'contact-phone': 'Будь ласка, введіть телефон у форматі +380501234567.',
        'contact-message': 'Будь ласка, напишіть повідомлення (мінімум 10 символів).',
        agreement: 'Будь ласка, дайте згоду на обробку персональних даних.',
      };
      showError(input, errorEl, messages[input.id] || 'Невірне значення.');
    }

    return valid;
  }

  // ---------- Нормалізація телефону (UX, не валідація) ----------

  function normalizePhone(value) {
    let cleaned = String(value || '').replace(/[^+\d]/g, ''); // лишаємо лише цифри та "+"

    if (cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.slice(1).replace(/\+/g, ''); // тільки перший "+" на початку
    } else {
      cleaned = cleaned.replace(/\+/g, ''); // прибираємо усі "+" із середини
    }

    // Edge cases: "0..." -> "+380...", "380..." -> "+380...", "+0..." -> "+380..."
    if (cleaned.startsWith('+0')) {
      cleaned = '+380' + cleaned.slice(2);
    } else if (cleaned.startsWith('0')) {
      cleaned = '+380' + cleaned.slice(1);
    } else if (cleaned.startsWith('380')) {
      cleaned = '+' + cleaned;
    } else if (cleaned !== '' && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }

    if (cleaned === '' || cleaned === '+') {
      return '';
    }

    return cleaned.slice(0, 13); // "+380" + 9 цифр
  }

  function setCaret(input, index) {
    try {
      const position = Math.min(Math.max(index, 0), input.value.length);
      input.setSelectionRange(position, position);
    } catch (err) {
      // Ігноруємо у браузерах, де setSelectionRange недоступний для цього поля.
    }
  }

  phoneInput.addEventListener('input', () => {
    if (isNormalizingPhone) {
      return;
    }

    isNormalizingPhone = true;

    const start = phoneInput.selectionStart ?? 0;
    const before = phoneInput.value;
    const normalized = normalizePhone(before);

    if (normalized !== before) {
      phoneInput.value = normalized;
      const added = normalized.length - before.length;
      const nextCaret = added > 0
        ? Math.min(start + added, normalized.length)
        : Math.min(start, normalized.length);
      setCaret(phoneInput, nextCaret);
    }

    isNormalizingPhone = false;

    if (touched.has(phoneInput)) {
      checkField(phoneInput);
    }
  });

  // Не блокуємо видалення: Backspace просто видаляє символи, а нормалізація
  // відбувається після події input без перехоплення клавіші.

  // ---------- Динамічна валідація ----------

  fields.forEach(({ input }) => {
    input.addEventListener('blur', () => {
      touched.add(input);
      checkField(input);
    });

    input.addEventListener('input', () => {
      if (touched.has(input)) {
        checkField(input);
      }
    });
  });

  // ---------- Відправка форми ----------

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalid = null;

    // Перевіряємо усі поля, а не зупиняємося на першій помилці.
    fields.forEach(({ input, error }) => {
      const valid = checkField(input);
      if (!valid && isValid) {
        isValid = false;
        firstInvalid = input;
      }
    });

    if (!isValid && firstInvalid) {
      firstInvalid.focus();
      return;
    }

    openSuccessModal();
  });

  // ---------- Модальне вікно успіху ----------

  function openSuccessModal() {
    lastFocusedElement = document.activeElement;

    form.reset();
    resetFormState();

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    document.body.style.overflow = 'hidden';
    submitBtn.disabled = true;

    closeModalBtn.focus();
  }

  function closeSuccessModal() {
    modal.classList.remove('flex');
    modal.classList.add('hidden');

    document.body.style.overflow = '';
    submitBtn.disabled = false;

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  function resetFormState() {
    touched.clear();
    fields.forEach(({ input, error }) => {
      clearState(input, error);
    });
  }

  closeModalBtn.addEventListener('click', closeSuccessModal);

  // Клік по затемненому оверлею (самому модальному контейнері) закриває вікно.
  // Клік всерединої білої картки не попадає у цей обробник, оскільки e.target — картка.
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeSuccessModal();
    }
  });

  // Закриття клавішею Escape.
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeSuccessModal();
    }
  });

  // Focus trap: Tab/Shift+Tab циклічно переміщає фокус всередині модального вікна.
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') {
      return;
    }

    e.preventDefault();

    const focusables = Array.from(
      modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    );

    if (focusables.length === 0) {
      return;
    }

    const currentIndex = focusables.indexOf(document.activeElement);
    let nextIndex;

    if (e.shiftKey) {
      nextIndex = currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex >= focusables.length - 1 ? 0 : currentIndex + 1;
    }

    focusables[nextIndex].focus();
  });
})();