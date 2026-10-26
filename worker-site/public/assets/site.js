export function validateInquiry(inquiry) {
  const fields = [];
  if (!inquiry.name?.trim()) fields.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email?.trim() || '')) fields.push('email');
  if (!['consultation', 'speaking'].includes(inquiry.inquiryType)) fields.push('inquiryType');
  if (!inquiry.context?.trim()) fields.push('context');
  return fields;
}

export async function submitInquiry(fetchImplementation, inquiry) {
  const response = await fetchImplementation('/api/inquiry', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(inquiry),
  });
  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.error || 'The inquiry could not be delivered.');
    error.fields = Array.isArray(result.fields) ? result.fields : [];
    throw error;
  }

  return result;
}

function formDataToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function setFieldErrors(form, fields) {
  form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
  fields.forEach((name) => form.elements.namedItem(name)?.setAttribute('aria-invalid', 'true'));
}

function setFormState(form, message, kind = '') {
  const status = form.querySelector('[data-form-status]');
  status.textContent = message;
  status.dataset.kind = kind;
}

async function initializeInquiryForm(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const fieldset = form.querySelector('fieldset');

  try {
    const response = await fetch('/api/inquiry-status');
    const { enabled } = await response.json();
    submitButton.disabled = !enabled;
    fieldset.disabled = !enabled;
    form.dataset.enabled = String(enabled);
    setFormState(
      form,
      enabled
        ? 'Inquiry delivery is ready.'
        : 'Preview mode — inquiries are not being delivered yet.',
      enabled ? 'ready' : 'preview',
    );
  } catch {
    submitButton.disabled = true;
    fieldset.disabled = true;
    form.dataset.enabled = 'false';
    setFormState(form, 'Inquiry delivery status is unavailable. Please try again later.', 'error');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const inquiry = formDataToObject(form);
    const invalid = validateInquiry(inquiry);
    setFieldErrors(form, invalid);

    if (invalid.length) {
      setFormState(form, 'Please complete the highlighted fields.', 'error');
      form.elements.namedItem(invalid[0])?.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.dataset.label = submitButton.textContent;
    submitButton.textContent = 'Sending…';
    setFormState(form, 'Sending your inquiry…', 'loading');

    try {
      await submitInquiry(fetch, inquiry);
      form.reset();
      setFieldErrors(form, []);
      setFormState(form, 'Thank you. Your inquiry has been received.', 'success');
    } catch (error) {
      setFieldErrors(form, error.fields || []);
      setFormState(form, error.message, 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.label || 'Send inquiry';
    }
  });
}

if (typeof document !== 'undefined') {
  const inquiryType = document.querySelector('[name="inquiryType"]');
  if (inquiryType && new URLSearchParams(window.location.search).get('inquiry') === 'speaking') {
    inquiryType.value = 'speaking';
  }
  document.querySelectorAll('[data-inquiry-form]').forEach(initializeInquiryForm);
}
