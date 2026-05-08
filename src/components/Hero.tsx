import { useEffect, useRef } from "react";
import bottle from "@/assets/bottle.png";
import drip from "@/assets/drip.png";
import stroke from "@/assets/stroke.png";
import texture from "@/assets/texture.jpg";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);
  const dripRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / vh));

      if (bottleRef.current) {
        const tilt = p * 55;
        const ty = p * 40;
        bottleRef.current.style.transform = `translateY(${ty}px) rotate(${tilt}deg)`;
      }
      if (dripRef.current) {
        const scale = Math.max(0.001, p * 1.4);
        const opacity = p > 0.05 ? 1 : 0;
        dripRef.current.style.transform = `scaleY(${scale}) translateY(${p * 40}px)`;
        dripRef.current.style.opacity = String(opacity);
      }
      if (contentRef.current) {
        const reveal = Math.min(1, Math.max(0, (p - 0.15) / 0.5));
        contentRef.current.style.opacity = String(reveal);
        contentRef.current.style.filter = `blur(${(1 - reveal) * 8}px)`;
        contentRef.current.style.transform = `translateY(${(1 - reveal) * 30}px)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[180vh]"
      aria-label="Hero"
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden grain vignette"
        style={{
          backgroundImage: `linear-gradient(120deg, oklch(0.94 0.02 80 / 0.85), oklch(0.86 0.03 70 / 0.85)), url(${texture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* nav */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 py-6">
          <div className="font-display text-xl tracking-wider">
            Srishti<span className="text-[var(--burgundy)]">.</span>
          </div>
          <nav className="hidden md:flex gap-10 text-xs uppercase tracking-[0.2em] text-foreground/70">
            <a href="#showcase" className="hover:text-foreground transition">Work</a>
            <a href="#services" className="hover:text-foreground transition">Services</a>
            <a href="#academy" className="hover:text-foreground transition">Academy</a>
            <a href="#contact" className="hover:text-foreground transition">Contact</a>
          </nav>
          <a
            href="#contact"
            className="text-xs uppercase tracking-[0.2em] border-b border-foreground/40 pb-1 hover:border-[var(--burgundy)] hover:text-[var(--burgundy)] transition"
          >
            Book
          </a>
        </header>

        <div className="grid h-full md:grid-cols-2 items-center max-w-7xl mx-auto px-6 md:px-12 pt-24">
          {/* Left content */}
          <div ref={contentRef} className="relative z-20 max-w-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--burgundy)] mb-6">
                Salon · Academy · Est. 2014
            </p>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95] text-balance">
              Art You<br/>
              <em className="not-italic text-[var(--burgundy)]">Wear.</em>
            </h1>
            <p className="mt-8 text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
              Premium nail artistry, beauty services and professional academy training — crafted with the precision of a couture house.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-[var(--onyx)] text-[var(--ivory)] px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[var(--burgundy)] transition-colors"
              >
                Book Appointment
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#academy"
                className="inline-flex items-center gap-3 border border-foreground/30 px-8 py-4 text-xs uppercase tracking-[0.25em] hover:border-[var(--burgundy)] hover:text-[var(--burgundy)] transition"
              >
                Explore Academy
              </a>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative h-full flex items-center justify-center">
            <div className="relative animate-idle-float">
              <img
                ref={bottleRef}
                src={bottle}
                alt="Luxury nail polish"
                className="relative z-10 w-[280px] md:w-[420px] origin-top drop-shadow-[0_40px_60px_oklch(0.16_0.005_60/0.45)] transition-transform duration-300 ease-out"
                style={{ transformOrigin: "top center" }}
              />
              {/* drip stretching down */}
              <img
                ref={dripRef}
                src={drip}
                alt=""
                aria-hidden
                className="absolute left-1/2 -translate-x-1/2 top-[78%] w-[60px] md:w-[90px] origin-top opacity-0 transition-[transform,opacity] duration-300"
                style={{ transformOrigin: "top center" }}
              />
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-foreground/50">
          Scroll
        </div>
      </div>

      {/* paint stroke divider that bleeds into next section */}
      <img
        src={stroke}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[120%] max-w-none opacity-90"
      />
    </section>
  );
}
