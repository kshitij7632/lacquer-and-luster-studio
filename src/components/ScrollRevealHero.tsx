import { useEffect, useRef, useState } from "react";
import videoAsset from "@/assets/nail-reveal-hero.mp4.asset.json";
import posterAsset from "@/assets/nail-reveal-hero-poster.jpg.asset.json";

const FPS = 24; // source footage frame rate — scrubbing is quantized to frames

/**
 * Cinematic scroll-controlled hero: a pinned stage where scroll position
 * scrubs the supplied campaign video frame by frame (no independent playback).
 */
export function ScrollRevealHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let killed = false;
    let timeline: { scrollTrigger?: { kill(): void }; kill(): void } | null = null;

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const onStrayPlay = () => {
      // The scroll timeline owns the playhead — nothing may autoplay.
      video.pause();
    };
    video.addEventListener("play", onStrayPlay);

    let cleanupGsap: (() => void) | null = null;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);

      // Wait for metadata so duration is known before mapping scroll → time.
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) return resolve();
        video.addEventListener("loadedmetadata", () => resolve(), { once: true });
        video.addEventListener("error", () => resolve(), { once: true });
      });
      if (killed) return;

      const duration =
        Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 8;
      const totalFrames = Math.max(1, Math.round(duration * FPS));

      let lastTime = -1;
      const setVideoTime = (p: number) => {
        // Quantize to whole source frames so we never micro-seek.
        const target = Math.round(p * (totalFrames - 1)) / FPS;
        if (Math.abs(target - lastTime) < 1 / FPS) return;
        lastTime = target;
        video.currentTime = target;
        // On narrow screens, ease the crop toward the manicure as it appears.
        if (window.innerWidth < 768) {
          const shift = Math.max(0, Math.min(1, (p - 0.6) / 0.4)) * 14;
          video.style.objectPosition = `${50 + shift}% 50%`;
        }
      };

      video.pause();

      const state = { p: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => (window.innerWidth < 768 ? "+=220%" : "+=300%"),
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => setVideoTime(self.progress),
        },
      });
      timeline = tl;

      // 0–10%: scroll hint fades; 10–28%: title lifts away.
      tl.to(hintRef.current, { opacity: 0, duration: 0.6, ease: "none" }, 0);
      tl.to(
        titleRef.current,
        { opacity: 0, y: -60, duration: 1.4, ease: "power1.in" },
        0.8,
      );
      // 0–100%: scrub the video across its full length.
      tl.to(state, { p: 1, ease: "none", duration: 8, onUpdate: () => setVideoTime(state.p) }, 0);
      // 82–97%: CTA rises over the finished manicure.
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 24, pointerEvents: "none" },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 1.1, ease: "power1.out" },
        6.6,
      );

      ScrollTrigger.refresh();
      cleanupGsap = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    })();

    return () => {
      killed = true;
      video.removeEventListener("play", onStrayPlay);
      cleanupGsap?.();
      timeline = null;
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="relative h-[100svh] w-full overflow-hidden" aria-label="Hero">
        <img
          src={posterAsset.url}
          alt="Burgundy manicure reveal"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 grain" />
        <HeroHeader />
        <div className="absolute inset-x-0 top-[14vh] z-20 text-center px-6">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--burgundy)] mb-3 md:mb-5">
            Salon · Academy · Est. 2014
          </p>
          <h1 className="font-display text-[clamp(2.25rem,10vw,8rem)] leading-[0.9] text-balance">
            Art You <em className="not-italic text-[var(--burgundy)]">Wear.</em>
          </h1>
        </div>
        <div className="absolute inset-x-0 bottom-6 md:bottom-10 z-40 flex flex-col items-center gap-3 md:gap-4 px-6">
          <p className="text-xs md:text-base text-foreground/80 max-w-md text-center">
            Premium nail artistry, beauty & academy training — couture precision.
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            <a href="#contact" className="hero-cta-primary">Book Appointment</a>
            <a href="#academy" className="hero-cta-secondary">Explore Academy</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-[var(--ivory)]"
      aria-label="Hero"
    >
      {/* Pinned video stage — playback is owned by scroll, never autoplayed */}
      <video
        ref={videoRef}
        src={videoAsset.url}
        poster={posterAsset.url}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover will-change-[object-position]"
        style={{ objectPosition: "50% 50%" }}
      />
      <div className="absolute inset-0 grain" />

      <HeroHeader />

      {/* Title */}
      <div
        ref={titleRef}
        className="absolute inset-x-0 top-[12vh] md:top-[14vh] z-20 text-center px-6 pointer-events-none will-change-transform"
      >
        <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--burgundy)] mb-3 md:mb-5">
          Salon · Academy · Est. 2014
        </p>
        <h1 className="font-display text-[clamp(2.25rem,10vw,8rem)] leading-[0.9] text-balance">
          Art You <em className="not-italic text-[var(--burgundy)]">Wear.</em>
        </h1>
      </div>

      {/* Scroll hint */}
      <div
        ref={hintRef}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-foreground/50 pointer-events-none"
      >
        Scroll
      </div>

      {/* CTA over the final manicure frame */}
      <div
        ref={ctaRef}
        className="absolute inset-x-0 bottom-6 md:bottom-10 z-40 flex flex-col items-center gap-3 md:gap-4 px-6 will-change-transform"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        <p className="text-xs md:text-base text-foreground/80 max-w-md text-center">
          Premium nail artistry, beauty & academy training — couture precision.
        </p>
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
          <a href="#contact" className="hero-cta-primary">Book Appointment</a>
          <a href="#academy" className="hero-cta-secondary">Explore Academy</a>
        </div>
      </div>
    </section>
  );
}

function HeroHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-5 md:px-12 py-5 md:py-6">
      <div className="font-display text-lg md:text-xl tracking-wider">
        Srishti<span className="text-[var(--burgundy)]">.</span>
      </div>
      <nav className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.25em] text-foreground/70">
        <a href="#showcase" className="hover:text-foreground transition">Work</a>
        <a href="#services" className="hover:text-foreground transition">Services</a>
        <a href="#academy" className="hover:text-foreground transition">Academy</a>
        <a href="#contact" className="hover:text-foreground transition">Contact</a>
      </nav>
      <a
        href="#contact"
        className="text-[10px] md:text-xs uppercase tracking-[0.2em] border-b border-foreground/40 pb-1 hover:border-[var(--burgundy)] hover:text-[var(--burgundy)] transition"
      >
        Book
      </a>
    </header>
  );
}
