'use client';

import { useEffect } from 'react';

export function BadgeTooltip() {
  useEffect(() => {
    // Initialize tooltip functionality
    const tip = document.getElementById('badge-tooltip');
    if (!tip) {
      const tooltip = document.createElement('div');
      tooltip.id = 'badge-tooltip';
      tooltip.className = 'badge-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('aria-hidden', 'true');
      tooltip.style.position = 'fixed';
      tooltip.style.zIndex = '9999';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.opacity = '0';
      document.body.appendChild(tooltip);
    }

    let activeEl: Element | null = null;

    const showTip = (text: string) => {
      const tooltip = document.getElementById('badge-tooltip');
      if (!tooltip) return;
      tooltip.textContent = text || '';
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translate(-50%, -8px) scale(1)';
      tooltip.setAttribute('aria-hidden', 'false');
    };

    const moveTipToPointer = (e: MouseEvent) => {
      const tooltip = document.getElementById('badge-tooltip');
      if (!tooltip) return;
      const offset = 18;
      tooltip.style.left = `${e.clientX}px`;
      tooltip.style.top = `${e.clientY - offset}px`;
    };

    const hideTip = () => {
      const tooltip = document.getElementById('badge-tooltip');
      if (!tooltip) return;
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translate(-50%, 0) scale(.98)';
      tooltip.setAttribute('aria-hidden', 'true');
    };

    const handlePointerOver = (e: PointerEvent) => {
      const el = (e.target as Element)?.closest('[data-tip]');
      if (!el) return;
      activeEl = el;
      const title = el.getAttribute('title');
      if (title) {
        el.setAttribute('data-title-backup', title);
        el.removeAttribute('title');
      }
      showTip(el.getAttribute('data-tip') || '');
      moveTipToPointer(e);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!activeEl) return;
      if (!(e.target as Element)?.closest('[data-tip]')) return;
      moveTipToPointer(e);
    };

    const handlePointerOut = (e: PointerEvent) => {
      if (!activeEl) return;
      if (!(e.relatedTarget as Element)?.closest('[data-tip]')) {
        const backup = activeEl.getAttribute('data-title-backup');
        if (backup) {
          activeEl.setAttribute('title', backup);
          activeEl.removeAttribute('data-title-backup');
        }
        activeEl = null;
        hideTip();
      }
    };

    document.addEventListener('pointerover', handlePointerOver, true);
    document.addEventListener('pointermove', handlePointerMove, true);
    document.addEventListener('pointerout', handlePointerOut, true);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver, true);
      document.removeEventListener('pointermove', handlePointerMove, true);
      document.removeEventListener('pointerout', handlePointerOut, true);
    };
  }, []);

  return <div id="badge-tooltip" className="badge-tooltip" role="tooltip" aria-hidden="true"></div>;
}

