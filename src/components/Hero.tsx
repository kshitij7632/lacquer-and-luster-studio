import { useEffect, useRef, useState } from "react";
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
  const svgRef = useRef<SVGSVGElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect reduced-motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", onchange as never);
  }, []);

  // Recalibrate stage sizing on resize / orientation
  useEffect(() => {
    if (reducedMotion) return;
    const recalc = () => {
      const stage = stageRef.current;
      const svg = svgRef.current;
      if (!stage || !svg) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768;
      // Bottle width via clamp already; tune stage height per viewport
      const stageH = isMobile ? Math.min(h * 0.7, 560) : Math.min(h * 0.78, 760);
      stage.style.height = `${stageH}px`;
      stage.style.width = `${Math.min(isMobile ? w * 0.78 : 420, 460)}px`;
      // Stream width responsive
      svg.style.width = isMobile ? "16px" : "22px";
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(document.documentElement);
    window.addEventListener("orientationchange", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", recalc);
    };
  }, [reducedMotion]);

  // Scroll-driven animation (skipped under reduced motion)
  useEffect(() => {
    if (reducedMotion) {
      // Set static end-state styles
      if (titleRef.current) titleRef.current.style.opacity = "1";
      if (handRef.current) {
        handRef.current.style.opacity = "1";
        handRef.current.style.transform = "translate3d(0,0,0)";
      }
      if (ctaRef.current) {
        ctaRef.current.style.opacity = "1";
        ctaRef.current.style.pointerEvents = "auto";
      }
      return;
    }

    let raf = 0;
    let lastP = -1;
    let cached = { top: 0, total: 1 };

    const measure = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      cached = {
        top: r.top + window.scrollY,
        total: Math.max(1, sec.offsetHeight - window.innerHeight),
      };
    };

    const tick = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, (window.scrollY - cached.top) / cached.total));
      if (Math.abs(p - lastP) < 0.0015) return;
      lastP = p;

      const ease = (t: number) => t * t * (3 - 2 * t);
      const s1 = ease(Math.min(1, p / 0.28));
      const s2 = ease(Math.min(1, Math.max(0, (p - 0.22) / 0.38)));
      const drop = Math.min(1, Math.max(0, (p - 0.45) / 0.25));
      const s3 = ease(Math.min(1, Math.max(0, (p - 0.6) / 0.3)));
      const splash = Math.min(1, Math.max(0, (p - 0.72) / 0.15));

      const bg = bgRef.current;
      if (bg) bg.style.transform = `translate3d(0, ${p * -60}px, 0) scale(${1 + p * 0.06})`;

      const title = titleRef.current;
      if (title) {
        const o = 1 - Math.min(1, p / 0.4);
        title.style.opacity = `${o}`;
        title.style.transform = `translate3d(0, ${p * -50}px, 0)`;
      }

      const b = bottleRef.current;
      if (b) b.style.transform = `translate3d(${s1 * 14}px, ${s1 * 8}px, 0) rotate(${s1 * 78}deg)`;

      const d = dripRef.current;
      if (d) {
        d.setAttribute("height", String(s2 * 100));
        d.style.opacity = s2 > 0.02 ? "0.95" : "0";
      }
      const dp = dropRef.current;
      if (dp) {
        dp.setAttribute("cy", String(8 + drop * 92));
        dp.setAttribute("r", String(1.6 + Math.sin(drop * Math.PI) * 0.6));
        dp.style.opacity = drop > 0 && splash < 0.4 ? "1" : "0";
      }
      const sp = splashRef.current;
      if (sp) {
        sp.style.opacity = `${splash}`;
        sp.style.transform = `scale(${0.6 + splash * 0.6})`;
      }

      const hd = handRef.current;
      if (hd) {
        hd.style.transform = `translate3d(0, ${(1 - s3) * 100}%, 0)`;
        hd.style.opacity = `${s3}`;
      }

      const cta = ctaRef.current;
      if (cta) {
        const o = Math.min(1, Math.max(0, (p - 0.82) / 0.15));
        cta.style.opacity = `${o}`;
        cta.style.transform = `translate3d(0, ${(1 - o) * 20}px, 0)`;
        cta.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measure();
      lastP = -1;
      onScroll();
    };

    measure();
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);

    const ro = new ResizeObserver(onResize);
    if (sectionRef.current) ro.observe(sectionRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={reducedMotion ? "relative min-h-screen" : "relative h-[260vh]"}
      aria-label="Hero"
    >
      <div className={reducedMotion ? "relative min-h-screen w-full overflow-hidden" : "sticky top-0 h-screen w-full overflow-hidden"}>
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

        {/* Title */}
        <div
          ref={titleRef}
          className="absolute inset-x-0 top-[14vh] md:top-[16vh] z-20 text-center px-6 will-change-transform pointer-events-none"
          style={{ opacity: reducedMotion ? 1 : undefined }}
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--burgundy)] mb-3 md:mb-5">
            Salon · Academy · Est. 2014
          </p>
          <h1 className="font-display text-[clamp(2.25rem,10vw,8rem)] leading-[0.9] text-balance">
            Art You <em className="not-italic text-[var(--burgundy)]">Wear.</em>
          </h1>
        </div>

        {/* Stage */}
        {!reducedMotion && (
          <div
            ref={stageRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 z-30 flex flex-col items-center"
            style={{ width: "min(420px, 78vw)", height: "70vh" }}
          >
            <img
              ref={bottleRef}
              src={bottle}
              alt="Luxury nail polish"
              className="relative z-30 will-change-transform drop-shadow-[0_25px_35px_oklch(0.16_0.005_60/0.4)] select-none"
              style={{ width: "clamp(120px, 28vw, 220px)", transformOrigin: "50% 18%" }}
            />

            <svg
              ref={svgRef}
              className="relative z-20 -mt-2"
              style={{ width: "18px", flex: 1 }}
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
              </defs>
              <rect ref={dripRef} x="5" y="0" width="2" height="0" rx="1" fill="url(#liq)" style={{ opacity: 0 }} />
              <circle ref={dropRef} cx="6" cy="8" r="1.6" fill="url(#dropG)" style={{ opacity: 0 }} />
              <g ref={splashRef} style={{ opacity: 0, transformOrigin: "6px 100px" }}>
                <ellipse cx="6" cy="99" rx="4" ry="0.8" fill="oklch(0.32 0.12 18 / 0.7)" />
                <circle cx="3" cy="98" r="0.6" fill="oklch(0.42 0.16 20)" />
                <circle cx="9" cy="98" r="0.5" fill="oklch(0.42 0.16 20)" />
              </g>
            </svg>
          </div>
        )}

        {/* Static composition for reduced motion */}
        {reducedMotion && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-30 flex flex-col items-center pointer-events-none"
            style={{ width: "min(420px, 78vw)" }}>
            <img
              src={bottle}
              alt="Luxury nail polish"
              className="select-none drop-shadow-[0_25px_35px_oklch(0.16_0.005_60/0.4)]"
              style={{ width: "clamp(120px, 28vw, 220px)", transform: "rotate(20deg)" }}
            />
          </div>
        )}

        {/* Hand */}
        <div
          ref={handRef}
          className="absolute inset-x-0 bottom-0 z-20 will-change-transform pointer-events-none"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <img
            src={hand}
            alt="Burgundy manicure"
            className="block w-full max-w-[560px] md:max-w-[700px] mx-auto select-none"
            style={{
              maskImage: "linear-gradient(to top, black 78%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 78%, transparent 100%)",
            }}
          />
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="absolute inset-x-0 bottom-6 md:bottom-10 z-40 flex flex-col items-center gap-3 md:gap-4 px-6 will-change-transform"
          style={{ opacity: reducedMotion ? 1 : 0, pointerEvents: reducedMotion ? "auto" : "none" }}
        >
          <p className="text-xs md:text-base text-foreground/80 max-w-md text-center">
            Premium nail artistry, beauty & academy training — couture precision.
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            <a href="#contact" className="bg-[var(--onyx)] text-[var(--ivory)] px-5 md:px-8 py-3 md:py-4 text-[10px] md:text-xs uppercase tracking-[0.25em] hover:bg-[var(--burgundy)] transition-colors">
              Book Appointment
            </a>
            <a href="#academy" className="border border-foreground/30 px-5 md:px-8 py-3 md:py-4 text-[10px] md:text-xs uppercase tracking-[0.25em] hover:border-[var(--burgundy)] hover:text-[var(--burgundy)] transition">
              Explore Academy
            </a>
          </div>
        </div>

        {!reducedMotion && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-foreground/40">
            Scroll
          </div>
        )}
      </div>
    </section>
  );
}
