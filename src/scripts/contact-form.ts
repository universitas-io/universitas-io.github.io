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

  const lang = (form.getAttribute('data-lang') || 'pt') as 'pt' | 'en';
  const whatsappNumber = form.getAttribute('data-whatsapp') || '551992400792';
  const contactEmail =
    form.getAttribute('data-email') || 'geraldohomero+universitas@pm.me';

  const defaultBtnText =
    btnText?.textContent ||
    (lang === 'pt' ? 'Enviar solicitação' : 'Send proposal inquiry');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

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
