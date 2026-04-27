import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "The cinnamon is outrageously fragrant—my pastry chef noticed immediately. We've never worked with spices this fresh.",
    name: "Elena M.",
    role: "Pastry Chef",
  },
  {
    quote: "Finally, a pepper with actual heat and complexity. The difference between this and supermarket pepper is night and day.",
    name: "Rohan S.",
    role: "Home Cook",
  },
  {
    quote: "We switched our tasting menu to Ceylon Spice Traders. Guests ask about the spices on every single plate.",
    name: "Isaac T.",
    role: "Chef-Owner",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;

    if (!section || !header || !cards) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(header,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 45%',
            scrub: true,
          }
        }
      );

      // Cards animation
      gsap.fromTo(cards.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          scrollTrigger: {
            trigger: cards,
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[90] bg-charcoal py-24 lg:py-32"
    >
      {/* Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="relative px-6 lg:px-[7vw]">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <h2 className="font-display text-h2 text-ivory mb-4">
            What Chefs Say
          </h2>
          <p className="text-body text-ivory-muted max-w-xl">
            Trusted in home kitchens and professional stations across Europe.
          </p>
        </div>

        {/* Cards Grid */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card p-8 hover:-translate-y-1.5 transition-transform duration-300"
            >
              <Quote className="w-8 h-8 text-gold/40 mb-6" />
              <p className="text-ivory/90 leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-display text-lg text-ivory">{testimonial.name}</p>
                <p className="font-mono text-label text-ivory-muted uppercase">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
