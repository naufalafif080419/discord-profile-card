'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const ENTER_ANIMATION_DELAY = 900;
const FADE_DURATION = 600;

export function EntryFadeOverlay() {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isFaded, setIsFaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/embed')) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    setIsFaded(false);
    setIsReady(false);

    const handleLoad = () => setIsReady(true);
    if (document.readyState === 'complete') {
      setIsReady(true);
    } else {
      window.addEventListener('load', handleLoad);
    }

    const delayId = window.setTimeout(() => setIsReady(true), ENTER_ANIMATION_DELAY);

    return () => {
      window.removeEventListener('load', handleLoad);
      window.clearTimeout(delayId);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isReady) return;
    setIsFaded(true);
    const fadeId = window.setTimeout(() => setIsVisible(false), FADE_DURATION);
    return () => window.clearTimeout(fadeId);
  }, [isReady]);

  if (!isVisible || !pathname || pathname.startsWith('/embed')) {
    return null;
  }

  return (
    <div className={`entry-fade-overlay${isFaded ? ' entry-fade-overlay--fade' : ''}`}>
      <div className="entry-fade-overlay__content">
        <div className="entry-fade-pulse">
          <span />
          <span />
          <span />
        </div>
        <p className="entry-fade-overlay__text">Landing your profile...</p>
      </div>
    </div>
  );
}

