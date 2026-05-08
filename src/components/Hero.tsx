import { useEffect, useRef } from "react";
import bottle from "@/assets/bottle.png";
import drip from "@/assets/drip.png";
import hand from "@/assets/hand-hero.png";
import texture from "@/assets/texture.jpg";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);
  const dripRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = sec.offsetHeight - vh;
      const p = Math.min(1, Math.max(0, -rect.top / total));

      // Stages
      const s1 = Math.min(1, p / 0.35);                    // bottle tilt
      const s2 = Math.min(1, Math.max(0, (p - 0.25) / 0.4)); // drip grow
      const s3 = Math.min(1, Math.max(0, (p - 0.55) / 0.4)); // hand rise

      // Parallax background
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${p * -80}px, 0) scale(${1 + p * 0.08})`;
      }

      // Title fades & lifts
      if (titleRef.current) {
        const o = 1 - Math.min(1, p / 0.45);
        titleRef.current.style.opacity = String(o);
        titleRef.current.style.transform = `translate3d(0, ${p * -60}px, 0)`;
      }

      // Bottle: tilt and drift down/right
      if (bottleRef.current) {
        const tilt = s1 * 75;
        const ty = s1 * 60 + s3 * 40;
        const tx = s1 * 20;
        const fade = 1 - s3 * 0.6;
        bottleRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${tilt}deg)`;
        bottleRef.current.style.opacity = String(fade);
      }

      // Drip: stretches from bottle towards the hand
      if (dripRef.current) {
        const scale = Math.max(0.001, s2 * 1);
        dripRef.current.style.transform = `scaleY(${scale})`;
        dripRef.current.style.opacity = s2 > 0.02 ? "1" : "0";
      }

      // Hand rises from bottom
      if (handRef.current) {
        const ty = (1 - s3) * 110;
        handRef.current.style.transform = `translate3d(0, ${ty}%, 0)`;
        handRef.current.style.opacity = String(s3);
      }

      // CTA appears at end
      if (ctaRef.current) {
        const o = Math.min(1, Math.max(0, (p - 0.75) / 0.2));
        ctaRef.current.style.opacity = String(o);
        ctaRef.current.style.transform = `translate3d(0, ${(1 - o) * 24}px, 0)`;
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

        {/* Centered title */}
        <div
          ref={titleRef}
          className="absolute inset-x-0 top-[14vh] md:top-[18vh] z-20 text-center px-6 will-change-transform"
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--burgundy)] mb-4 md:mb-6">
            Salon · Academy · Est. 2014
          </p>
          <h1 className="font-display text-[clamp(3rem,12vw,9rem)] leading-[0.9] text-balance">
            Art You <em className="not-italic text-[var(--burgundy)]">Wear.</em>
          </h1>
        </div>

        {/* Bottle (stage center) */}
        <img
          ref={bottleRef}
          src={bottle}
          alt="Luxury nail polish"
          className="absolute left-1/2 top-[34vh] md:top-[36vh] z-30 w-[180px] sm:w-[220px] md:w-[300px] -translate-x-1/2 will-change-transform drop-shadow-[0_30px_40px_oklch(0.16_0.005_60/0.45)]"
          style={{ transformOrigin: "top center" }}
        />

        {/* Drip stretching from bottle to hand */}
        <div
          ref={dripRef}
          aria-hidden
          className="absolute left-1/2 top-[44vh] md:top-[48vh] z-20 -translate-x-1/2 origin-top will-change-transform"
          style={{
            width: "10px",
            height: "55vh",
            background:
              "linear-gradient(to bottom, var(--burgundy) 0%, var(--wine) 60%, var(--burgundy) 100%)",
            borderRadius: "999px",
            boxShadow: "0 0 24px oklch(0.32 0.12 18 / 0.5)",
            opacity: 0,
          }}
        >
          <img
            src={drip}
            alt=""
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 md:w-14"
          />
        </div>

        {/* Hand image rising from bottom */}
        <div
          ref={handRef}
          className="absolute inset-x-0 bottom-0 z-30 will-change-transform"
          style={{ opacity: 0 }}
        >
          <img
            src={hand}
            alt="Burgundy manicure"
            className="block w-full max-w-[900px] mx-auto select-none"
            style={{
              maskImage:
                "linear-gradient(to top, black 75%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 75%, transparent 100%)",
            }}
          />
        </div>

        {/* End-of-intro CTA */}
        <div
          ref={ctaRef}
          className="absolute inset-x-0 bottom-8 md:bottom-12 z-40 flex flex-col items-center gap-4 px-6 will-change-transform"
          style={{ opacity: 0 }}
        >
          <p className="text-sm md:text-base text-foreground/80 max-w-md text-center">
            Premium nail artistry, beauty & academy training — crafted with couture precision.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="#contact"
              className="bg-[var(--onyx)] text-[var(--ivory)] px-6 md:px-8 py-3 md:py-4 text-[10px] md:text-xs uppercase tracking-[0.25em] hover:bg-[var(--burgundy)] transition-colors"
            >
              Book Appointment
            </a>
            <a
              href="#academy"
              className="border border-foreground/30 px-6 md:px-8 py-3 md:py-4 text-[10px] md:text-xs uppercase tracking-[0.25em] hover:border-[var(--burgundy)] hover:text-[var(--burgundy)] transition"
            >
              Explore Academy
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-foreground/40">
          Scroll
        </div>
      </div>
    </section>
  );
}
