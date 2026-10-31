import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const SoftAurora = lazy(() => import('./SoftAurora'));
const CircularCarousel = lazy(() => import('./CircularCarousel'));

// Keep each section's existing size; defer its heavy code until it is nearby.
function useNearby(ref, margin = '250px') {
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setNearby(entry.isIntersecting), { rootMargin: margin });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, margin]);
  return nearby;
}

export function DeferredCarousel(props) {
  const ref = useRef(null);
  const nearby = useNearby(ref);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (nearby) setMounted(true); }, [nearby]);
  return <div ref={ref} style={{ width: '100%', height: '100%' }}>
    {mounted && <Suspense fallback={null}><CircularCarousel {...props}/></Suspense>}
  </div>;
}

export function AuroraSurface(props) {
  const ref = useRef(null);
  const nearby = useNearby(ref, '100px');
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    const update = () => setEnabled(!query.matches && !connection?.saveData);
    update();
    query.addEventListener('change', update);
    connection?.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
      connection?.removeEventListener('change', update);
    };
  }, []);
  useEffect(() => { if (nearby) setMounted(true); }, [nearby]);
  return <div ref={ref} className="aurora-surface__layer" data-active={nearby && enabled} aria-hidden="true">
    {mounted && enabled && <Suspense fallback={null}><SoftAurora {...props}/></Suspense>}
  </div>;
}

// Poster paints first. Decorative video starts after page load/idle, only on screen.
export function MotionVideo({ src, poster, ...props }) {
  const ref = useRef(null);
  const nearby = useNearby(ref, '100px');
  useEffect(() => {
    const video = ref.current;
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    let visible = false;
    let ready = false;
    let disposed = false;
    let idle = 0;
    let timer = 0;
    const sync = () => {
      if (disposed) return;
      if (ready && visible && !document.hidden && !query.matches && !connection?.saveData) {
        if (!video.getAttribute('src')) { video.src = src; video.load(); }
        video.play().catch(() => {});
      } else video.pause();
    };
    const schedule = () => {
      timer = setTimeout(() => {
        if ('requestIdleCallback' in window) idle = requestIdleCallback(() => { ready = true; sync(); }, { timeout: 2000 });
        else { ready = true; sync(); }
      }, 800);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(video);
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    document.addEventListener('visibilitychange', sync);
    query.addEventListener('change', sync);
    connection?.addEventListener('change', sync);
    return () => {
      disposed = true;
      clearTimeout(timer);
      if (idle) cancelIdleCallback(idle);
      observer.disconnect();
      window.removeEventListener('load', schedule);
      document.removeEventListener('visibilitychange', sync);
      query.removeEventListener('change', sync);
      connection?.removeEventListener('change', sync);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [src]);
  return <video ref={ref} {...props} poster={nearby ? poster : undefined} muted loop playsInline preload="none"/>;
}
