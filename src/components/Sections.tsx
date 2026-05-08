import { useEffect } from "react";
import g1 from "@/assets/gallery1.jpg";
import g2 from "@/assets/gallery2.jpg";
import g3 from "@/assets/gallery3.jpg";
import g4 from "@/assets/gallery4.jpg";
import hand from "@/assets/hand.jpg";
import about from "@/assets/about.jpg";
import academy from "@/assets/academy.jpg";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--burgundy)] mb-6">
      {children}
    </p>
  );
}

export function Showcase() {
  return (
    <section id="showcase" className="relative py-20 md:py-44 px-5 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-20 reveal gap-6">
          <div>
            <SectionLabel>The Showcase</SectionLabel>
            <h2 className="font-display text-4xl md:text-7xl leading-[1.05] md:leading-none max-w-2xl">
              Editorial nail artistry, signed by hand.
            </h2>
          </div>
          <p className="md:mt-0 max-w-sm text-muted-foreground text-sm md:text-base">
            From glossy mirror chromes to bridal couture — every set is finished to the millimeter.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <figure className="col-span-12 md:col-span-7 reveal group overflow-hidden">
            <img src={hand} alt="Burgundy manicure" loading="lazy" className="w-full h-[480px] md:h-[640px] object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
            <figcaption className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">01 — Rouge Signature</figcaption>
          </figure>
          <figure className="col-span-6 md:col-span-5 reveal group overflow-hidden md:mt-24">
            <img src={g1} alt="Chrome nails" loading="lazy" className="w-full h-[280px] md:h-[420px] object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
            <figcaption className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">02 — Liquid Chrome</figcaption>
          </figure>
          <figure className="col-span-6 md:col-span-4 reveal group overflow-hidden">
            <img src={g2} alt="Gold foil nails" loading="lazy" className="w-full h-[280px] md:h-[420px] object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
            <figcaption className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">03 — Gilded Nude</figcaption>
          </figure>
          <figure className="col-span-12 md:col-span-4 reveal group overflow-hidden">
            <img src={g3} alt="Black stiletto nails" loading="lazy" className="w-full h-[320px] md:h-[480px] object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
            <figcaption className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">04 — Onyx Couture</figcaption>
          </figure>
          <figure className="col-span-12 md:col-span-4 reveal group overflow-hidden md:mt-16">
            <img src={g4} alt="Bridal nails" loading="lazy" className="w-full h-[320px] md:h-[480px] object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
            <figcaption className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">05 — Bridal Crystal</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="relative py-20 md:py-44 px-5 md:px-12 bg-[var(--beige)]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="reveal overflow-hidden">
          <img src={about} alt="Artisan at work" loading="lazy" className="w-full h-[360px] md:h-[640px] object-cover" />
        </div>
        <div className="reveal">
          <SectionLabel>The House</SectionLabel>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
            A decade of <em className="text-[var(--burgundy)]">precision,</em> patience and polish.
          </h2>
          <p className="mt-8 text-muted-foreground leading-relaxed">
            Founded by Srishti, our atelier blends Parisian beauty rituals with Indian artistry. Every guest is hosted privately. Every nail is sculpted, never rushed.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            What began as a salon is now a destination — and a school for the next generation of beauty professionals.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-foreground/15 pt-10">
            <div>
              <div className="font-display text-4xl">10+</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Years</div>
            </div>
            <div>
              <div className="font-display text-4xl">2k+</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Clients</div>
            </div>
            <div>
              <div className="font-display text-4xl">300+</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Graduates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const services = [
  { title: "Nail Art", desc: "Hand-painted couture, chromes, 3D and editorial sets." },
  { title: "Nail Extensions", desc: "Gel, acrylic and structured overlays — sculpted to length." },
  { title: "Hair Treatments", desc: "Botox, keratin, and bond-repair rituals." },
  { title: "Makeup", desc: "Editorial, soft-glam and event-ready artistry." },
  { title: "Skin Care", desc: "Korean facials, peels and hydra-glow treatments." },
  { title: "Bridal", desc: "Trousseau packages curated for the modern bride." },
  { title: "Spa", desc: "Hot-stone, aroma and signature ritual massages." },
];

export function Services() {
  return (
    <section id="services" className="relative py-20 md:py-44 px-5 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="reveal max-w-3xl mb-12 md:mb-20">
          <SectionLabel>The Menu</SectionLabel>
          <h2 className="font-display text-4xl md:text-7xl leading-[1.05] text-balance">
            Services, refined to a ritual.
          </h2>
        </div>
        <div className="border-t border-foreground/15">
          {services.map((s, i) => (
            <a
              key={s.title}
              href="#contact"
              className="reveal group grid grid-cols-[auto_1fr_auto] md:flex md:items-center md:justify-between gap-x-4 md:gap-12 border-b border-foreground/15 py-6 md:py-10 px-2 transition-colors hover:bg-[var(--beige)]/40"
            >
              <span className="text-xs text-muted-foreground tabular-nums self-center">0{i + 1}</span>
              <div className="md:flex-1">
                <h3 className="font-display text-2xl md:text-5xl group-hover:text-[var(--burgundy)] transition-colors">
                  {s.title}
                </h3>
                <p className="md:hidden mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <div className="hidden md:block max-w-sm text-sm text-muted-foreground text-right">{s.desc}</div>
              <span className="self-center ml-2 md:ml-6 text-[var(--burgundy)] transition-transform group-hover:translate-x-2">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Academy() {
  return (
    <section id="academy" className="relative py-20 md:py-44 px-5 md:px-12 bg-[var(--beige)]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-12 items-center">
        <div className="md:col-span-5 reveal order-2 md:order-1">
          <SectionLabel>The Academy</SectionLabel>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
            Train where the <em className="text-[var(--burgundy)]">artists</em> train.
          </h2>
          <p className="mt-8 text-muted-foreground leading-relaxed">
            Internationally recognised certifications across nails, makeup, skin and hair. Small batches, hands-on practice, real client work.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
            {["Certified Nail Technician — 6 weeks", "Master Nail Art Diploma — 12 weeks", "Pro Makeup Artistry — 8 weeks", "Advanced Aesthetics — 16 weeks"].map((c) => (
              <li key={c} className="flex items-center gap-4 border-b border-foreground/15 pb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--burgundy)]" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="bg-[var(--onyx)] text-[var(--ivory)] px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[var(--burgundy)] transition-colors">
              Join Academy
            </a>
            <a href="#contact" className="border border-foreground/30 px-8 py-4 text-xs uppercase tracking-[0.25em] hover:border-[var(--burgundy)] hover:text-[var(--burgundy)] transition">
              Enquire Now
            </a>
          </div>
        </div>
        <div className="md:col-span-7 reveal order-1 md:order-2">
          <img src={academy} alt="Academy classroom" loading="lazy" className="w-full h-[320px] md:h-[640px] object-cover" />
        </div>
      </div>
    </section>
  );
}

const reviews = [
  { quote: "The most refined nail experience in the city. Worth every minute.", name: "Aanya M.", role: "Editor, Vogue India" },
  { quote: "Srishti's academy launched my career. Practical, premium, and personal.", name: "Riya S.", role: "Nail Artist, Mumbai" },
  { quote: "Bridal trousseau done to perfection. I felt like a couture client.", name: "Tara K.", role: "Bride" },
];

export function Testimonials() {
  return (
    <section className="relative py-20 md:py-44 px-5 md:px-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Said of Us</SectionLabel>
        <div className="grid md:grid-cols-3 gap-10 md:gap-16 mt-8 md:mt-12">
          {reviews.map((r) => (
            <figure key={r.name} className="reveal">
              <div className="font-display text-5xl text-[var(--burgundy)] leading-none mb-6">"</div>
              <blockquote className="font-display text-2xl leading-snug">
                {r.quote}
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-foreground/15">
                <div className="text-sm">{r.name}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{r.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Instagram() {
  const items = [g1, g2, g3, g4, hand, g1, g2, g3];
  return (
    <section className="relative py-16 md:py-24 bg-[var(--beige)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-12 mb-8 md:mb-12 flex items-end justify-between gap-4">
        <div>
          <SectionLabel>@srishtisalon</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl">Live from the studio.</h2>
        </div>
        <a href="#" className="text-xs uppercase tracking-[0.25em] border-b border-foreground/40 pb-1 hover:text-[var(--burgundy)] hover:border-[var(--burgundy)] transition">
          Follow
        </a>
      </div>
      <div className="flex gap-3 md:gap-4 animate-marquee w-max">
        {[...items, ...items].map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" className="h-44 md:h-72 w-44 md:w-72 object-cover flex-none" />
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <section id="contact" className="relative bg-[var(--onyx)] text-[var(--ivory)] grain">
      <div className="max-w-7xl mx-auto px-5 md:px-12 py-24 md:py-44 text-center">
        <SectionLabel>Begin</SectionLabel>
        <h2 className="font-display text-5xl md:text-9xl leading-[0.9] text-balance">
          Ready for your <em className="text-[var(--champagne)] not-italic">next look?</em>
        </h2>
        <p className="mt-8 md:mt-10 text-white/60 max-w-md mx-auto text-sm md:text-base">
          Book a private session at our atelier or speak with our academy advisor.
        </p>
        <div className="mt-10 md:mt-14 flex flex-wrap gap-3 md:gap-4 justify-center">
          <a href="#" className="bg-[var(--burgundy)] hover:bg-[var(--wine)] px-6 md:px-10 py-4 md:py-5 text-[10px] md:text-xs uppercase tracking-[0.25em] transition-colors">Book Appointment</a>
          <a href="#" className="border border-white/30 hover:border-[var(--champagne)] hover:text-[var(--champagne)] px-6 md:px-10 py-4 md:py-5 text-[10px] md:text-xs uppercase tracking-[0.25em] transition-colors">WhatsApp</a>
          <a href="#" className="border border-white/30 hover:border-[var(--champagne)] hover:text-[var(--champagne)] px-6 md:px-10 py-4 md:py-5 text-[10px] md:text-xs uppercase tracking-[0.25em] transition-colors">Instagram</a>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 md:px-12 py-6 md:py-8 flex flex-col md:flex-row justify-between gap-3 md:gap-4 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50">
        <div>Srishti Salon & Academy</div>
        <div>© {new Date().getFullYear()} — Crafted with care</div>
      </div>
    </section>
  );
}

export function Sections() {
  useReveal();
  return (
    <>
      <Showcase />
      <About />
      <Services />
      <Academy />
      <Testimonials />
      <Instagram />
      <Footer />
    </>
  );
}
