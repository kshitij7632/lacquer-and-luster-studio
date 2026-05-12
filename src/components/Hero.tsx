import { useEffect, useRef } from "react";
import bottle from "@/assets/bottle.png";
import hand from "@/assets/hand-hero.png";
import texture from "@/assets/texture.jpg";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);
  const dripRef = useRef<SVGRectElement>(null);
  const dropRef = useRef<SVGCircleElement>(null);
  const splashRef = useRef<SVGGElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastP = -1;

    const tick = () => {
      raf = 0;
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, sec.offsetHeight - vh);
      const p = Math.min(1, Math.max(0, -rect.top / total));
      if (Math.abs(p - lastP) < 0.0015) return;
      lastP = p;

      // Eased stages
      const ease = (t: number) => t * t * (3 - 2 * t);
      const s1 = ease(Math.min(1, p / 0.28));                         // bottle tilt
      const s2 = ease(Math.min(1, Math.max(0, (p - 0.22) / 0.38)));   // drip extend
      const drop = Math.min(1, Math.max(0, (p - 0.45) / 0.25));       // droplet falls
      const s3 = ease(Math.min(1, Math.max(0, (p - 0.6) / 0.3)));     // hand rises
      const splash = Math.min(1, Math.max(0, (p - 0.72) / 0.15));     // splash

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${p * -60}px, 0) scale(${1 + p * 0.06})`;
      }

      if (titleRef.current) {
        const o = 1 - Math.min(1, p / 0.4);
        titleRef.current.style.opacity = String(o);
        titleRef.current.style.transform = `translate3d(0, ${p * -50}px, 0)`;
      }

      // Bottle tips from its neck
      if (bottleRef.current) {
        const tilt = s1 * 78;
        const tx = s1 * 14;
        const ty = s1 * 8;
        bottleRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${tilt}deg)`;
      }

      // Liquid stream stretches; droplet detaches and falls
      if (dripRef.current) {
        const h = s2 * 100; // % of stage
        dripRef.current.setAttribute("height", String(h));
        dripRef.current.style.opacity = s2 > 0.02 ? "0.95" : "0";
      }
      if (dropRef.current) {
        const y = 8 + drop * 92;
        const r = 1.6 + Math.sin(drop * Math.PI) * 0.6;
        dropRef.current.setAttribute("cy", String(y));
        dropRef.current.setAttribute("r", String(r));
        dropRef.current.style.opacity = drop > 0 && splash < 0.4 ? "1" : "0";
      }
      if (splashRef.current) {
        splashRef.current.style.opacity = String(splash);
        splashRef.current.style.transform = `scale(${0.6 + splash * 0.6})`;
      }

      if (handRef.current) {
        const ty = (1 - s3) * 100;
        handRef.current.style.transform = `translate3d(0, ${ty}%, 0)`;
        handRef.current.style.opacity = String(s3);
      }

      if (ctaRef.current) {
        const o = Math.min(1, Math.max(0, (p - 0.82) / 0.15));
        ctaRef.current.style.opacity = String(o);
        ctaRef.current.style.transform = `translate3d(0, ${(1 - o) * 20}px, 0)`;
        ctaRef.current.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[260vh]" aria-label="Hero">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Parallax background */}
        <div
          ref={bgRef}
          className="absolute inset-0 grain vignette will-change-transform"
          style={{
            backgroundImage: `linear-gradient(160deg, oklch(0.96 0.015 80 / 0.92), oklch(0.86 0.035 70 / 0.92)), url(${texture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Nav */}
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

        {/* Title (top of viewport) */}
        <div
          ref={titleRef}
          className="absolute inset-x-0 top-[12vh] md:top-[16vh] z-20 text-center px-6 will-change-transform pointer-events-none"
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--burgundy)] mb-3 md:mb-5">
            Salon · Academy · Est. 2014
          </p>
          <h1 className="font-display text-[clamp(2.5rem,11vw,8rem)] leading-[0.9] text-balance">
            Art You <em className="not-italic text-[var(--burgundy)]">Wear.</em>
          </h1>
        </div>

        {/* Unified stage: bottle → drip → hand, all centered together */}
        <div
          ref={stageRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 z-30 flex flex-col items-center"
          style={{
            width: "min(420px, 85vw)",
            height: "78vh",
            top: "auto",
          }}
        >
          {/* Bottle anchored at top of stage */}
          <img
            ref={bottleRef}
            src={bottle}
            alt="Luxury nail polish"
            className="relative z-30 will-change-transform drop-shadow-[0_25px_35px_oklch(0.16_0.005_60/0.4)] select-none"
            style={{
              width: "clamp(140px, 32vw, 240px)",
              transformOrigin: "50% 18%",
            }}
          />

          {/* Liquid stream (SVG fills the gap between bottle and hand) */}
          <svg
            className="relative z-20 -mt-2"
            style={{ width: "24px", flex: 1 }}
            viewBox="0 0 12 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="liq" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.42 0.16 20)" />
                <stop offset="60%" stopColor="oklch(0.32 0.12 18)" />
                <stop offset="100%" stopColor="oklch(0.28 0.13 18)" />
              </linearGradient>
              <radialGradient id="dropG" cx="0.4" cy="0.35" r="0.7">
                <stop offset="0%" stopColor="oklch(0.55 0.16 20)" />
                <stop offset="100%" stopColor="oklch(0.28 0.13 18)" />
              </radialGradient>
              <filter id="liqBlur" x="-20%" y="-5%" width="140%" height="110%">
                <feGaussianBlur stdDeviation="0.25" />
              </filter>
            </defs>
            {/* falling stream */}
            <rect
              ref={dripRef}
              x="5"
              y="0"
              width="2"
              height="0"
              rx="1"
              fill="url(#liq)"
              filter="url(#liqBlur)"
              style={{ opacity: 0 }}
            />
            {/* detached droplet (teardrop via path scaled) */}
            <circle
              ref={dropRef}
              cx="6"
              cy="8"
              r="1.6"
              fill="url(#dropG)"
              style={{ opacity: 0, filter: "drop-shadow(0 1px 1px oklch(0.16 0.005 60 / 0.4))" }}
            />
            {/* splash on impact */}
            <g ref={splashRef} style={{ opacity: 0, transformOrigin: "6px 100px" }}>
              <ellipse cx="6" cy="99" rx="4" ry="0.8" fill="oklch(0.32 0.12 18 / 0.7)" />
              <circle cx="3" cy="98" r="0.6" fill="oklch(0.42 0.16 20)" />
              <circle cx="9" cy="98" r="0.5" fill="oklch(0.42 0.16 20)" />
              <circle cx="7.5" cy="96.5" r="0.4" fill="oklch(0.42 0.16 20)" />
            </g>
          </svg>
        </div>

        {/* Hand image rising from bottom (full width, behind drip endpoint) */}
        <div
          ref={handRef}
          className="absolute inset-x-0 bottom-0 z-20 will-change-transform pointer-events-none"
          style={{ opacity: 0 }}
        >
          <img
            src={hand}
            alt="Burgundy manicure"
            className="block w-full max-w-[700px] mx-auto select-none"
            style={{
              maskImage: "linear-gradient(to top, black 80%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 80%, transparent 100%)",
            }}
          />
        </div>

        {/* End-of-intro CTA */}
        <div
          ref={ctaRef}
          className="absolute inset-x-0 bottom-6 md:bottom-10 z-40 flex flex-col items-center gap-3 md:gap-4 px-6 will-change-transform"
          style={{ opacity: 0 }}
        >
          <p className="text-xs md:text-base text-foreground/80 max-w-md text-center">
            Premium nail artistry, beauty & academy training — couture precision.
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            <a
              href="#contact"
              className="bg-[var(--onyx)] text-[var(--ivory)] px-5 md:px-8 py-3 md:py-4 text-[10px] md:text-xs uppercase tracking-[0.25em] hover:bg-[var(--burgundy)] transition-colors"
            >
              Book Appointment
            </a>
            <a
              href="#academy"
              className="border border-foreground/30 px-5 md:px-8 py-3 md:py-4 text-[10px] md:text-xs uppercase tracking-[0.25em] hover:border-[var(--burgundy)] hover:text-[var(--burgundy)] transition"
            >
              Explore Academy
            </a>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-foreground/40">
          Scroll
        </div>
      </div>
    </section>
  );
}
