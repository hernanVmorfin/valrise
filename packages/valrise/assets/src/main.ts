import './main.css';
import { initializeDisclosures } from './disclosure';

document.documentElement.classList.add('valrise-js');
initializeDisclosures();

document.addEventListener('click', (event) => {
  const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!anchor || anchor.hash === '#') return;
  const target = document.querySelector<HTMLElement>(anchor.hash);
  if (target) target.setAttribute('tabindex', '-1');
});
