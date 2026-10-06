export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>(
    'form[data-contact-form]'
  );
  if (!form) return;

  const statusEl = form.querySelector<HTMLElement>('[data-form-status]');
  const submitBtn = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]'
  );
  const btnText = submitBtn?.querySelector<HTMLElement>('[data-btn-text]');
  const btnSpinner =
    submitBtn?.querySelector<HTMLElement>('[data-btn-spinner]');

  const emailInput = form.querySelector<HTMLInputElement>('#contact-email');
  const emailError = form.querySelector<HTMLElement>('#contact-email-error');
  const phoneInput = form.querySelector<HTMLInputElement>('#contact-phone');
  const phoneError = form.querySelector<HTMLElement>('#contact-phone-error');

  const lang = (form.getAttribute('data-lang') || 'pt') as 'pt' | 'en';
  const whatsappNumber = form.getAttribute('data-whatsapp') || '551992400792';
  const contactEmail =
    form.getAttribute('data-email') || 'universitas.contato@gmail.com';

  const defaultBtnText =
    btnText?.textContent ||
    (lang === 'pt' ? 'Enviar solicitação' : 'Send proposal inquiry');

  function setFieldError(
    input: HTMLInputElement,
    errorEl: HTMLElement | null,
    message: string
  ): void {
    input.classList.add(
      'border-red-500',
      'dark:border-red-500',
      'focus:ring-red-500'
    );
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }

  function clearFieldError(
    input: HTMLInputElement,
    errorEl: HTMLElement | null
  ): void {
    input.classList.remove(
      'border-red-500',
      'dark:border-red-500',
      'focus:ring-red-500'
    );
    input.removeAttribute('aria-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  function validateEmail(): boolean {
    if (!emailInput) return true;
    const val = emailInput.value.trim();
    if (!val) {
      if (emailInput.required) {
        setFieldError(
          emailInput,
          emailError,
          lang === 'pt'
            ? 'Por favor, informe seu e-mail.'
            : 'Please enter your email.'
        );
        return false;
      }
      clearFieldError(emailInput, emailError);
      return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(val)) {
      setFieldError(
        emailInput,
        emailError,
        lang === 'pt'
          ? 'Informe um formato de e-mail válido (ex.: nome@instituicao.br).'
          : 'Please enter a valid email format (e.g., name@institution.edu).'
      );
      return false;
    }

    clearFieldError(emailInput, emailError);
    return true;
  }

  function validatePhone(): boolean {
    if (!phoneInput) return true;
    const raw = phoneInput.value.trim();
    if (!raw) {
      clearFieldError(phoneInput, phoneError);
      return true;
    }

    // Only allow digits and phone characters: +, -, (, ), space
    if (/[^\d+\-()\s]/.test(raw)) {
      setFieldError(
        phoneInput,
        phoneError,
        lang === 'pt'
          ? 'O telefone deve conter apenas números e DDD (sem letras ou símbolos especiais).'
          : 'Phone number should only contain numbers and area code.'
      );
      return false;
    }

    const digits = raw.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setFieldError(
        phoneInput,
        phoneError,
        lang === 'pt'
          ? 'Telefone incompleto. Digite o DDD e o número (mínimo de 10 dígitos numéricos).'
          : 'Please enter a valid phone number with area code (at least 10 digits).'
      );
      return false;
    }

    clearFieldError(phoneInput, phoneError);
    return true;
  }

  // Interactive phone formatting/filtering as the user types
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      // Filter out letters and invalid characters immediately
      const filtered = phoneInput.value.replace(/[^\d+\-()\s]/g, '');
      if (phoneInput.value !== filtered) {
        phoneInput.value = filtered;
      }

      // If purely numbers were entered (standard Brazilian mobile/landline without country code)
      const digits = filtered.replace(/\D/g, '');
      if (
        !filtered.startsWith('+') &&
        digits.length > 0 &&
        digits.length <= 11
      ) {
        if (digits.length <= 2) {
          phoneInput.value = `(${digits}`;
        } else if (digits.length <= 6) {
          phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        } else if (digits.length <= 10) {
          phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        } else {
          phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
        }
      }

      clearFieldError(phoneInput, phoneError);
    });

    phoneInput.addEventListener('blur', validatePhone);
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      clearFieldError(emailInput, emailError);
    });
    emailInput.addEventListener('blur', validateEmail);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();

    if (!isEmailValid) {
      emailInput?.focus();
      return;
    }

    if (!isPhoneValid) {
      phoneInput?.focus();
      return;
    }

    if (!form.reportValidity()) {
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
    }
    if (btnText) {
      btnText.textContent =
        lang === 'pt' ? 'Enviando proposta...' : 'Sending inquiry...';
    }
    if (btnSpinner) {
      btnSpinner.classList.remove('hidden');
    }
    if (statusEl) {
      statusEl.className = 'hidden';
      statusEl.innerHTML = '';
    }

    try {
      const formData = new FormData(form);
      const json = JSON.stringify(Object.fromEntries(formData));

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: json
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (statusEl) {
          statusEl.className =
            'p-4 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-sm space-y-1 block';
          statusEl.innerHTML = `
            <p class="font-bold font-display text-base">${
              lang === 'pt'
                ? 'Solicitação recebida com sucesso!'
                : 'Inquiry received successfully!'
            }</p>
            <p class="leading-relaxed">${
              lang === 'pt'
                ? 'Agradecemos o contato. Nossa equipe técnica analisará sua demanda e responderá em até 1 a 2 dias úteis com um memorial metodológico preliminar.'
                : 'Thank you for reaching out. Our team will review your requirements and respond within 1 to 2 business days.'
            }</p>
          `;
        }
        form.reset();
      } else {
        throw new Error(result.message || 'Falha no envio');
      }
    } catch {
      if (statusEl) {
        statusEl.className =
          'p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm space-y-2 block';
        const waUrl = `https://wa.me/${whatsappNumber}`;
        const mailUrl = `mailto:${contactEmail}`;
        const errorTitle =
          lang === 'pt'
            ? 'Houve um erro no envio da mensagem.'
            : 'There was an error sending your message.';
        const errorDesc =
          lang === 'pt'
            ? `Não se preocupe: você pode falar conosco diretamente pelo <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="font-bold underline hover:text-red-950 dark:hover:text-red-100">WhatsApp</a> ou escrever por <a href="${mailUrl}" class="font-bold underline hover:text-red-950 dark:hover:text-red-100">E-mail</a>.`
            : `Please contact us directly via <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="font-bold underline hover:text-red-950 dark:hover:text-red-100">WhatsApp</a> or send an <a href="${mailUrl}" class="font-bold underline hover:text-red-950 dark:hover:text-red-100">Email</a>.`;

        statusEl.innerHTML = `
          <p class="font-bold font-display text-base">${errorTitle}</p>
          <p class="leading-relaxed">${errorDesc}</p>
        `;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
      if (btnText) {
        btnText.textContent = defaultBtnText;
      }
      if (btnSpinner) {
        btnSpinner.classList.add('hidden');
      }
    }
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
}
