import { useEffect, useRef, useState } from "react";
import latestVideoUrl from "@/assets/Applying_nail_polish_on_nail_49103317_1080p.mp4";

const VIDEO_SRC = latestVideoUrl || "/videos/nails-by-srishti-application.mp4";

/**
 * Calculate dynamic vertical focal point so the 9:16 vertical video
 * keeps all critical moments framed in a widescreen desktop viewport:
 * - 0%–20%: Bottle & branding on the marble pedestal
 * - 20%–45%: Hand lifting the gold cap & brush emerging
 * - 45%–75%: Brush gliding burgundy polish onto the nail
 * - 75%–100%: Finished 5-finger manicure resting on the pedestal
 */
function getFocalPosition(p: number, isLandscape: boolean): string {
  if (!isLandscape) {
    // Portrait/mobile: center composition naturally fills viewport
    return "50% 50%";
  }

  let y = 52;
  if (p < 0.22) {
    // Initial bottle focus
    y = 54;
  } else if (p < 0.42) {
    // Lift up to follow cap removal & brush emergence
    const t = (p - 0.22) / 0.2;
    y = 54 - t * 18; // goes from 54% to 36%
  } else if (p < 0.72) {
    // Move to center for nail application
    const t = (p - 0.42) / 0.3;
    y = 36 + t * 12; // goes from 36% to 48%
  } else {
    // Frame the completed manicure hand on the pedestal
    const t = (p - 0.72) / 0.28;
    y = 48 + t * 8; // goes from 48% to 56%
  }

  return `50% ${Math.round(y * 10) / 10}%`;
}

/**
 * Full-screen, edge-to-edge luxury hero for Nails by Srishti.
 * Synchronizes the campaign video frame-by-frame with scroll position using GSAP ScrollTrigger.
 */
export function ScrollRevealHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // GSAP ScrollTrigger timeline for scroll-controlled scrub
  useEffect(() => {
    if (reducedMotion) return;

    let killed = false;
    let cleanupGsap: (() => void) | null = null;

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // Never autoplay independently
    const onStrayPlay = () => {
      video.pause();
    };
    video.addEventListener("play", onStrayPlay);

    // Efficient seeking management: non-blocking, avoids micro-seeks
    let isSeeking = false;
    let pendingTime: number | null = null;
    let lastAppliedTime = -1;

    const performSeek = (time: number) => {
      if (!video) return;
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 8;
      const clamped = Math.max(0, Math.min(duration, time));

      if (isSeeking) {
        pendingTime = clamped;
        return;
      }

      if (Math.abs(video.currentTime - clamped) > 0.01) {
        isSeeking = true;
        lastAppliedTime = clamped;
        video.currentTime = clamped;
      }
    };

    const onSeeked = () => {
      isSeeking = false;
      if (pendingTime !== null) {
        const next = pendingTime;
        pendingTime = null;
        performSeek(next);
      }
    };
    video.addEventListener("seeked", onSeeked);

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed) return;

      gsap.registerPlugin(ScrollTrigger);

      // Wait for loadedmetadata so video.duration is valid
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) {
          return resolve();
        }
        const onLoaded = () => resolve();
        video.addEventListener("loadedmetadata", onLoaded, { once: true });
        video.addEventListener("loadeddata", onLoaded, { once: true });
        video.addEventListener("error", () => resolve(), { once: true });
      });
      if (killed) return;

      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        // ignore
      }

      const duration =
        Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 8;

      const isLandscape = window.innerWidth > window.innerHeight;
      video.style.objectPosition = getFocalPosition(0, isLandscape);

      const playhead = { time: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => (window.innerWidth < 768 ? "+=240%" : "+=280%"),
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.45, // tuned smoothing between 0.3s and 0.6s
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const landscape = window.innerWidth > window.innerHeight;
            video.style.objectPosition = getFocalPosition(p, landscape);
          },
        },
      });

      // Synchronize video time from 0 to duration
      tl.to(playhead, {
        time: duration,
        ease: "none",
        duration: duration,
        onUpdate: () => {
          performSeek(playhead.time);
        },
      }, 0);

      // Scroll hint fades out promptly at start
      if (hintRef.current) {
        tl.to(hintRef.current, { opacity: 0, y: 15, duration: 0.6, ease: "power1.out" }, 0);
      }

      // Title lifts gently and fades away as the bottle opening begins (0.15 to 0.35)
      if (titleRef.current) {
        tl.to(
          titleRef.current,
          {
            opacity: 0,
            y: -50,
            duration: 1.2,
            ease: "power1.in",
          },
          0.8
        );
      }

      // CTA rises over the completed manicure frame near the end (last 20%)
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 30, pointerEvents: "none" },
          { opacity: 1, y: 0, pointerEvents: "auto", duration: 1.2, ease: "power2.out" },
          duration * 0.78
        );
      }

      ScrollTrigger.refresh();

      // Recalculate on window resize
      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      cleanupGsap = () => {
        window.removeEventListener("resize", handleResize);
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    })();

    return () => {
      killed = true;
      video.removeEventListener("play", onStrayPlay);
      video.removeEventListener("seeked", onSeeked);
      cleanupGsap?.();
    };
  }, [reducedMotion]);

  // Reduced motion alternative: static full-screen presentation
  if (reducedMotion) {
    return (
      <section
        className="relative h-[100svh] min-h-screen w-full overflow-hidden bg-[var(--ivory)]"
        aria-label="Hero"
      >
        <video
          src={VIDEO_SRC}
          muted
          playsInline
          controls
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 50%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />
        <HeroHeader />

        <div className="absolute inset-x-0 top-[14vh] z-20 text-center px-6 pointer-events-none">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.45em] text-[var(--burgundy)] mb-3 md:mb-5 drop-shadow-sm font-medium">
            Salon · Academy · Est. 2014
          </p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.92] text-balance">
            Art You <em className="not-italic text-[var(--burgundy)]">Wear.</em>
          </h1>
        </div>

        <div className="absolute inset-x-0 bottom-8 md:bottom-12 z-30 flex flex-col items-center gap-3 md:gap-4 px-6">
          <p className="text-xs md:text-base text-foreground/90 max-w-md text-center font-serif drop-shadow-sm">
            Premium nail artistry, beauty & academy training — couture precision.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#contact" className="hero-cta-primary shadow-xl">Book Appointment</a>
            <a href="#academy" className="hero-cta-secondary backdrop-blur-md bg-white/60 shadow-md">Explore Academy</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-screen w-full overflow-hidden bg-[var(--ivory)]"
      aria-label="Hero"
    >
      {/* Full-screen edge-to-edge video stage */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover will-change-[object-position] select-none"
        style={{ objectPosition: "50% 52%" }}
      />

      {/* Subtle luxury vignette and film grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--ivory)]/40 via-transparent to-[var(--ivory)]/50 pointer-events-none z-10" />
      <div className="absolute inset-0 grain pointer-events-none z-10" />

      {/* Persistent luxury header */}
      <HeroHeader />

      {/* Main hero typography overlay */}
      <div
        ref={titleRef}
        className="absolute inset-x-0 top-[14vh] md:top-[16vh] z-20 text-center px-6 pointer-events-none will-change-transform"
      >
        <p className="text-[10px] md:text-xs uppercase tracking-[0.45em] text-[var(--burgundy)] font-medium mb-3 md:mb-5">
          Salon · Academy · Est. 2014
        </p>
        <h1 className="font-display text-[clamp(2.5rem,8.5vw,8rem)] leading-[0.92] text-balance drop-shadow-sm">
          Art You <em className="not-italic text-[var(--burgundy)]">Wear.</em>
        </h1>
        <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] text-foreground/75 mt-3 md:mt-4 font-sans">
          The Haute Burgundy Ritual
        </p>
      </div>

      {/* Scroll indicator prompt */}
      <div
        ref={hintRef}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-foreground/70 pointer-events-none flex flex-col items-center gap-2 will-change-transform"
      >
        <span>Scroll to Reveal</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--burgundy)] animate-pulse" />
      </div>

      {/* CTA overlay — revealed smoothly over the finished manicure */}
      <div
        ref={ctaRef}
        className="absolute inset-x-0 bottom-8 md:bottom-12 z-30 flex flex-col items-center gap-3 md:gap-4 px-6 will-change-transform pointer-events-none"
        style={{ opacity: 0 }}
      >
        <p className="text-xs md:text-base text-foreground/95 max-w-md text-center font-serif drop-shadow-sm">
          Premium nail artistry, beauty & academy training — couture precision.
        </p>
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
          <a href="#contact" className="hero-cta-primary shadow-xl">
            Book Appointment
          </a>
          <a
            href="#academy"
            className="hero-cta-secondary backdrop-blur-md bg-white/60 shadow-md"
          >
            Explore Academy
          </a>
        </div>
      </div>
    </section>
  );
}

function HeroHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-5 md:px-12 py-5 md:py-6">
      <a href="/" className="font-display text-xl md:text-2xl tracking-wider hover:opacity-85 transition">
        Srishti<span className="text-[var(--burgundy)] font-serif font-bold">.</span>
      </a>
      <nav className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.25em] text-foreground/75 font-medium">
        <a href="#showcase" className="hover:text-[var(--burgundy)] transition">Work</a>
        <a href="#about" className="hover:text-[var(--burgundy)] transition">The House</a>
        <a href="#services" className="hover:text-[var(--burgundy)] transition">Services</a>
        <a href="#academy" className="hover:text-[var(--burgundy)] transition">Academy</a>
        <a href="#contact" className="hover:text-[var(--burgundy)] transition">Contact</a>
      </nav>
      <a
        href="#contact"
        className="text-[10px] md:text-xs uppercase tracking-[0.25em] border-b border-[var(--burgundy)] text-[var(--burgundy)] pb-0.5 hover:opacity-75 transition font-medium"
      >
        Book Atelier
      </a>
    </header>
  );
}
