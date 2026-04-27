import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Mail, Truck, HelpCircle, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const footer = footerRef.current;

    if (!section || !left || !right || !footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(left,
        { y: 28, opacity: 0 },
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

      gsap.fromTo(right,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 45%',
            scrub: true,
          }
        }
      );

      gsap.fromTo(footer,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            end: 'top 70%',
            scrub: true,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-[100] bg-charcoal py-24 lg:py-32"
    >
      {/* Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="relative px-6 lg:px-[7vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          {/* Left Column */}
          <div ref={leftRef}>
            <h2 className="font-display text-h2 text-ivory mb-6">
              Bring Ceylon Home
            </h2>
            <p className="text-body text-ivory-muted leading-relaxed mb-8">
              Subscribe for harvest updates, recipes, and early access to limited 
              batches. We share stories from the farms, seasonal recipes, and 
              exclusive offers with our community.
            </p>
            <div className="flex items-center gap-6 text-ivory-muted">
              <a 
                href="#" 
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="font-mono text-label uppercase">Instagram</span>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="font-mono text-label uppercase">Email</span>
              </a>
            </div>
          </div>

          {/* Right Column - Form */}
          <div ref={rightRef}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 px-6 py-4 rounded-pill bg-charcoal-card border border-white/10 text-ivory placeholder:text-ivory-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="btn-gold whitespace-nowrap"
                >
                  {isSubscribed ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Subscribed
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
              {isSubscribed && (
                <p className="text-gold font-mono text-sm">
                  You're on the list. Welcome to Ceylon.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div 
          ref={footerRef}
          className="pt-12 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <a 
              href="#" 
              className="font-display text-2xl font-semibold text-ivory hover:text-gold transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Ceylon
            </a>

            {/* Links */}
            <div className="flex items-center gap-8">
              <a 
                href="#" 
                className="flex items-center gap-2 text-ivory-muted hover:text-gold transition-colors font-mono text-label uppercase"
              >
                <Truck className="w-4 h-4" />
                Shipping
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-ivory-muted hover:text-gold transition-colors font-mono text-label uppercase"
              >
                <HelpCircle className="w-4 h-4" />
                Support
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-ivory-muted hover:text-gold transition-colors font-mono text-label uppercase"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            </div>

            {/* Copyright */}
            <p className="font-mono text-label text-ivory-muted/50">
              © 2025 Ceylon Spice Traders
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
