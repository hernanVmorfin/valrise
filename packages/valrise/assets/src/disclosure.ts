export interface DisclosureTrigger {
  setAttribute(name: string, value: string): void;
}

export interface DisclosurePanel {
  hidden: boolean;
}

export function setDisclosureState(
  trigger: DisclosureTrigger,
  panel: DisclosurePanel,
  expanded: boolean,
): void {
  trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  panel.hidden = !expanded;
}

export function initializeDisclosures(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>('[data-valrise-disclosure]').forEach((trigger) => {
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    trigger.addEventListener('click', () => {
      setDisclosureState(trigger, panel, trigger.getAttribute('aria-expanded') !== 'true');
    });
  });
}
