import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Leaf, Droplets, Sun } from 'lucide-react';
import SEOHead, { breadcrumbSchema } from '@/components/SEOHead';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  {
    year: '~300 BC',
    title: 'Ancient Trade Routes',
    description: 'Sri Lankan cinnamon and pepper were traded across Arabia and Egypt long before European exploration. Ancient manuscripts mention "Kinnamon" from Taprobane (Sri Lanka) as a prized commodity in the courts of pharaohs and Roman emperors.',
    image: '/300.png',
  },
  {
    year: '1518',
    title: 'Portuguese Arrival',
    description: 'Portuguese explorer Lourenço de Almeida landed in Ceylon and discovered vast cinnamon gardens. They established the first European monopoly over Ceylon cinnamon — the most coveted spice in the world — and held it for over a century.',
    image: '/1518.png',
  },
  {
    year: '1658',
    title: 'Dutch Spice Empire',
    description: 'The Dutch East India Company (VOC) wrested control of the cinnamon trade from the Portuguese. They created the first organised cultivation system, requiring local Sinhalese families to peel set quotas of cinnamon bark every year.',
    image: '/1658.png',
  },
  {
    year: 'Today',
    title: "Sri Lanka's Spice Legacy",
    description: 'Sri Lanka produces over 80% of the world\'s true Ceylon cinnamon. Small family farms in the Western and Central Provinces continue centuries-old traditions — hand-peeling bark, sun-drying pepper vines, and picking clove buds by hand at dawn.',
    image: '/Today.png',
  },
];

const spices = [
  {
    name: 'Ceylon Cinnamon',
    subtitle: 'Cinnamomum verum — The Real Cinnamon',
    region: 'Western Province (Galle, Matara, Kalutara)',
    image: '/cinnamon_signature.jpg',
    facts: [
      'Sri Lanka supplies over 80% of the world\'s true cinnamon',
      'Bark is hand-peeled by skilled artisans called "chaliya" — a tradition passed down for generations',
      'Multiple thin layers of inner bark are rolled together to form delicate, papery quills',
      'Naturally lower in coumarin than cassia, making it safer for daily use',
      'Fragrance is delicate and sweet — nothing like the harsh bite of common cassia',
    ],
    description: `What most of the world calls "cinnamon" is actually cassia — a cheaper, harsher bark from China and Indonesia. True cinnamon, Cinnamomum verum, grows almost exclusively in Sri Lanka's Western Province, in a warm coastal belt stretching from Kalutara to Matara.

The harvest is entirely by hand. Skilled artisans, known as chaliya, use a curved blade to score the outer bark, then carefully peel away the inner skin in long strips. These strips are placed inside one another and rolled into the delicate, multi-layered quills that distinguish genuine Ceylon cinnamon. The quills are then dried in the shade — never in direct sun — to preserve their essential oils.

The result is a spice that smells of warm sweetness with floral and citrus undertones, and contains far less coumarin than cassia, making it the preferred cinnamon of health-conscious cooks worldwide.`,
  },
  {
    name: 'Black Pepper',
    subtitle: 'Piper nigrum — The King of Spices',
    region: 'Kandy, Matale & Kurunegala Districts',
    image: '/pepper_palette.jpg',
    facts: [
      'Sri Lanka has been exporting pepper since at least the 1st century AD',
      'Vines are trained to climb native shade trees and can be productive for 30+ years',
      'Berries are harvested green and mature — before they turn red — for maximum piperine content',
      'Sun-dried on woven mats for 3–5 days until the outer skin wrinkles to a dark black',
      'Sri Lankan pepper is bold, aromatic, and complex — with floral and earthy undertones',
    ],
    description: `Pepper was the spice that drove European exploration. When Vasco da Gama rounded the Cape of Good Hope in 1498, his goal was to reach the pepper markets of the East — and Sri Lanka was already one of its great suppliers, known to Arab and Chinese traders for more than a thousand years.

Sri Lankan black pepper grows in the humid foothills of the central highlands, where pepper vines (Piper nigrum) climb the trunks of jak, breadfruit, and silver-oak trees. The harvest season follows the northeast monsoon — farmers and their families pick each berry by hand, checking for that precise moment of ripeness when the berry is plump, green, and bursting with essential oils.

After harvest, the berries are spread across woven mats and sun-dried for three to five days. The skin wrinkles and darkens to a deep, matte black. What remains is a dense, aromatic peppercorn with a heat that builds slowly and a finish that lingers with floral and woody notes — a world away from the one-dimensional burn of commodity pepper.`,
  },
  {
    name: 'Cloves',
    subtitle: 'Syzygium aromaticum — The Nail Spice',
    region: 'Matale & Kandy Districts',
    image: '/whole_spices.jpg',
    facts: [
      'The name "clove" comes from the Latin clavus, meaning nail — describing the bud\'s distinctive shape',
      'Sri Lankan cloves are harvested by hand, picking each bud just before it opens',
      'High eugenol content gives Sri Lankan cloves an exceptionally powerful, warm aroma',
      'Trees can produce for over 50 years once established',
      'Used in Ayurvedic medicine for over 2,000 years to treat digestion and inflammation',
    ],
    description: `The clove tree (Syzygium aromaticum) is one of the most beautiful in the world — an evergreen with glossy leaves and clusters of vivid pink buds. Those buds are the spice. They must be picked at precisely the right moment: after they have plumped up but before the petals open. Once the flower opens, the essential oil dissipates and the clove loses most of its value.

In Sri Lanka, clove cultivation is concentrated in the Matale and Kandy districts of the Central Province, where the altitude, rainfall, and red laterite soil create ideal conditions. Harvest is a family affair — men, women, and children spread across the trees at dawn, filling baskets by hand before the heat of the day arrives.

Sri Lankan cloves are prized for their extraordinarily high eugenol content — the compound responsible for that intense, warm, almost medicinal aroma. They are the foundation of Sri Lankan curry blends, an essential element in festive rice dishes, and a cornerstone of traditional Ayurvedic remedies that have been passed down for more than two thousand years.`,
  },
];

const regions = [
  {
    name: 'Western Province',
    elevation: 'Sea level – 100m',
    products: 'Ceylon Cinnamon',
    description: 'The warm, humid coastal strip from Kalutara to Matara is the heartland of true cinnamon. The rich, red soil and steady rainfall make it the only region in the world where Cinnamomum verum thrives at commercial scale.',
  },
  {
    name: 'Central Highlands',
    elevation: '900–2,000m',
    products: 'Black Pepper, Cardamom',
    description: 'The misty mountain slopes around Kandy, Matale, and Nuwara Eliya produce Sri Lanka\'s finest pepper and cardamom. Cool nights and warm days concentrate the essential oils that give these spices their exceptional depth.',
  },
  {
    name: 'Southern Province',
    elevation: '50–400m',
    products: 'Cloves, Black Pepper',
    description: 'The rolling hills of Matale and the southern districts support large clove plantations. The iron-rich red soil and monsoon rains of the south produce cloves with an unusually high eugenol content and a powerful, lasting aroma.',
  },
];

export default function OriginsPage() {
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const story = storyRef.current;
    const timeline = timelineRef.current;

    if (!hero || !story || !timeline) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(hero.querySelector('.hero-content'),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(story.querySelector('.story-image'),
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: story, start: 'top 70%' }
        }
      );

      gsap.fromTo(story.querySelector('.story-text'),
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: story, start: 'top 70%' }
        }
      );

      const timelineItems = timeline.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, index) => {
        gsap.fromTo(item,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%' }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-charcoal pt-20">
      <SEOHead
        title="Our Story — The Origins of Ceylon Spices — Silonka"
        description="Discover Silonka's story: from ancient spice trade routes through Sri Lanka's hill country to your kitchen. Learn about Ceylon cinnamon, black pepper, and cloves — and the families who cultivate them."
        keywords="Ceylon spice history, Sri Lanka cinnamon origin, spice trade routes, organic spice farms, Silonka story, Ceylon pepper, cloves Sri Lanka"
        canonicalPath="/origins"
        ogImage="/cgarden.png"
        jsonLd={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Our Origins', url: '/origins' },
        ])}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative px-4 sm:px-6 lg:px-[7vw]">
          <div className="hero-content text-center max-w-3xl mx-auto">
            <span className="font-mono text-[10px] sm:text-label text-gold uppercase tracking-[0.2em] mb-4 block">
              Our Story
            </span>
            <h1 className="font-display text-[clamp(32px,6vw,56px)] text-ivory mb-6 leading-tight">
              From Sri Lanka to Your Kitchen
            </h1>
            <p className="text-sm sm:text-body text-ivory-muted leading-relaxed px-4">
              For centuries, the island of Sri Lanka — once known to the world as Ceylon — has been
              the source of the globe's most prized spices. Silonka works directly with the families
              who still cultivate them using methods passed down through generations.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section ref={storyRef} className="relative py-16 sm:py-24 bg-charcoal-light">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative px-4 sm:px-6 lg:px-[7vw]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="story-image relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-card overflow-hidden">
                <img
                  src="/cgarden.png"
                  alt="Silonka spice farm"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
            <div className="story-text order-1 lg:order-2">
              <h2 className="font-display text-[clamp(24px,4vw,40px)] text-ivory mb-6">
                An Island Built on Spice
              </h2>
              <p className="text-sm sm:text-body text-ivory-muted mb-4 leading-relaxed">
                Sri Lanka's spice story is one of the oldest in the world. Ancient Arab merchants
                called the island "Serendib" and anchored in its harbours to load cinnamon and pepper
                before sailing north to Persia, Egypt, and Rome. Long before the word "Ceylon" existed,
                this island's fragrance had already circled the globe.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: Leaf, label: '100% Organic' },
                  { icon: Droplets, label: 'Rain-Fed' },
                  { icon: Sun, label: 'Sun-Dried' },
                  { icon: MapPin, label: 'Traceable' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                    <span className="font-mono text-[10px] sm:text-label text-ivory uppercase">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spice Deep Dives */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative px-4 sm:px-6 lg:px-[7vw]">
          <div className="text-center mb-12 sm:mb-20">
            <span className="font-mono text-[10px] sm:text-label text-gold uppercase tracking-[0.2em] mb-4 block">
              The Spices
            </span>
            <h2 className="font-display text-[clamp(24px,4vw,40px)] text-ivory">
              Where Every Spice Comes From
            </h2>
          </div>

          <div className="space-y-20 sm:space-y-32">
            {spices.map((spice, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start ${index % 2 === 1 ? '' : ''}`}>
                {/* Image side */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] rounded-card overflow-hidden mb-6">
                    <img
                      src={spice.image}
                      alt={spice.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {/* Fast Facts */}
                  <div className="p-5 sm:p-6 rounded-card bg-charcoal-card border border-white/5">
                    <p className="font-mono text-[10px] sm:text-label text-gold uppercase tracking-widest mb-4">Fast Facts</p>
                    <ul className="space-y-3">
                      {spice.facts.map((fact, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                          <span className="text-ivory-muted text-xs sm:text-sm leading-relaxed">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Text side */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="font-mono text-[10px] sm:text-label text-gold uppercase tracking-[0.2em] mb-3 block">
                    {spice.region}
                  </span>
                  <h3 className="font-display text-[clamp(24px,3.5vw,40px)] text-ivory mb-1">
                    {spice.name}
                  </h3>
                  <p className="font-mono text-[10px] sm:text-label text-ivory-muted uppercase tracking-widest mb-6 italic">
                    {spice.subtitle}
                  </p>
                  <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent mb-6" />
                  {spice.description.split('\n\n').map((para, i) => (
                    <p key={i} className="text-sm sm:text-body text-ivory-muted leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Timeline */}
      <section className="relative py-16 sm:py-24 bg-charcoal-light">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative px-4 sm:px-6 lg:px-[7vw]">
          <div className="text-center mb-10 sm:mb-16">
            <span className="font-mono text-[10px] sm:text-label text-gold uppercase tracking-[0.2em] mb-4 block">
              History
            </span>
            <h2 className="font-display text-[clamp(24px,4vw,40px)] text-ivory">
              Millennia of Spice Trade
            </h2>
          </div>

          <div ref={timelineRef} className="space-y-12 sm:space-y-16">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className="timeline-item grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center"
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="aspect-video rounded-card overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1 lg:text-right' : ''}>
                  <span className="font-display text-4xl sm:text-5xl text-gold/30 mb-2 block">{event.year}</span>
                  <h3 className="font-display text-xl sm:text-2xl text-ivory mb-3 sm:mb-4">{event.title}</h3>
                  <p className="text-sm sm:text-body text-ivory-muted leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative px-4 sm:px-6 lg:px-[7vw]">
          <div className="text-center mb-10 sm:mb-16">
            <span className="font-mono text-[10px] sm:text-label text-gold uppercase tracking-[0.2em] mb-4 block">
              Growing Regions
            </span>
            <h2 className="font-display text-[clamp(24px,4vw,40px)] text-ivory">
              Where Our Spices Grow
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {regions.map((region, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 rounded-card bg-charcoal-light border border-white/5 hover:border-gold/30 transition-colors duration-300"
              >
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-gold mb-4 sm:mb-6" />
                <h3 className="font-display text-lg sm:text-xl text-ivory mb-1 sm:mb-2">{region.name}</h3>
                <p className="font-mono text-[10px] sm:text-label text-gold uppercase mb-3 sm:mb-4">{region.elevation}</p>
                <p className="text-ivory-muted text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{region.description}</p>
                <p className="font-mono text-[10px] sm:text-label text-ivory-muted uppercase">
                  Known for: {region.products}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
