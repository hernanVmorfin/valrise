import './inquiry.css';
import { setSpeakingFieldsState } from './inquiry-behavior';

document.querySelectorAll<HTMLElement>('[data-valrise-inquiry]').forEach((formRoot) => {
  const type = formRoot.querySelector<HTMLSelectElement>('[data-inquiry-type]');
  const panel = formRoot.querySelector<HTMLFieldSetElement>('[data-speaking-fields]');
  if (!type || !panel) return;

  const fields = Array.from(panel.querySelectorAll<HTMLInputElement>('[data-speaking-required]'));
  const sync = () => setSpeakingFieldsState(panel, fields, type.value === 'speaking');
  type.addEventListener('change', sync);
  sync();
});
