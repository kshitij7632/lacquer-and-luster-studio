import { createFileRoute } from "@tanstack/react-router";
import { ScrollRevealHero } from "@/components/ScrollRevealHero";
import { Sections } from "@/components/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Srishti Salon & Academy — Premium Nail Artistry" },
      { name: "description", content: "Luxury nail artistry, beauty services, and professional academy training. Book your private session." },
      { property: "og:title", content: "Srishti Salon & Academy" },
      { property: "og:description", content: "Premium nail artistry, beauty services, and professional academy training." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative bg-background text-foreground">
      <ScrollRevealHero />
      <Sections />
    </main>
  );
}
