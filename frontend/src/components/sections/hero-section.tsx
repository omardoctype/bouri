import { motion } from 'framer-motion';
import { ArrowRight, Camera, Disc3, Gem, Music4 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const stats = [
  { value: '+50', label: 'evenements realises' },
  { value: '+20', label: 'prestataires verifies' },
  { value: '24h', label: 'delai moyen de reponse' },
];

const floatingCards = [
  {
    title: 'DJ',
    subtitle: 'Set premium & ambiance live',
    icon: Disc3,
    className: 'left-2 top-8 md:left-6 md:top-10',
    glow: 'bg-purpleLuxury/30',
  },
  {
    title: 'Photographe',
    subtitle: 'Storytelling emotionnel',
    icon: Camera,
    className: 'right-1 top-28 md:right-6 md:top-20',
    glow: 'bg-pinkLuxury/30',
  },
  {
    title: 'Mariage',
    subtitle: 'Direction artistique complete',
    icon: Gem,
    className: 'left-4 bottom-16 md:left-10 md:bottom-14',
    glow: 'bg-goldLuxury/25',
  },
  {
    title: 'Soiree Bac',
    subtitle: 'Production son et lumiere',
    icon: Music4,
    className: 'right-0 bottom-6 md:right-8 md:bottom-6',
    glow: 'bg-blue-400/25',
  },
];

export const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden rounded-[30px] border border-white/15 bg-cardLuxury/75 px-5 pb-8 pt-10 sm:px-8 lg:px-12 lg:pb-12 lg:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-hero" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-purpleLuxury/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-6 h-80 w-80 rounded-full bg-pinkLuxury/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="max-w-2xl"
        >
          <p className="section-kicker">Plateforme evenementielle premium en Tunisie</p>

          <h1 className="mt-5 font-display text-4xl leading-[1.06] text-offWhite sm:text-5xl lg:text-6xl">
            Organisez votre evenement en Tunisie avec les meilleurs talents.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-200 sm:text-base">
            Photographes, DJs, bands, artistes, decoration, son et lumiere: une seule plateforme pour creer une
            experience inoubliable.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/register">
                Organiser mon evenement <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/providers">Voir les prestataires</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                className="rounded-xl border border-white/15 bg-black/35 px-4 py-3"
              >
                <p className="text-2xl font-extrabold text-offWhite">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-grayLuxury">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative min-h-[340px] rounded-3xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl sm:p-6"
        >
          <div className="absolute left-4 top-4 rounded-full border border-goldLuxury/35 bg-goldLuxury/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-goldLuxury">
            Selection VIP
          </div>

          {floatingCards.map((card, index) => (
            <motion.div
              key={card.title}
              className={`absolute w-[46%] rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl ${card.className}`}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + index, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            >
              <div className={`pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full blur-2xl ${card.glow}`} />
              <div className="relative flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/35">
                  <card.icon className="h-4 w-4 text-offWhite" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-offWhite">{card.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-grayLuxury">{card.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/10 bg-black/45 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-grayLuxury">Couverture nationale</p>
            <p className="mt-1 text-sm text-gray-200">Tunis, Sousse, Sfax, Nabeul, Djerba et plus.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

