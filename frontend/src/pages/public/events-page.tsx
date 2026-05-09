import { motion } from 'framer-motion';
import { CalendarRange, PartyPopper, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { PUBLIC_EVENTS } from '../../data/demo';
import { CtaBanner } from '../../components/sections/cta-banner';

const indicators = [
  {
    title: 'Capacite',
    value: '20 - 2 000',
    description: 'Formats adaptes aux ceremonies intimes et grandes productions.',
  },
  {
    title: 'Couverture',
    value: 'Nord - Sud',
    description: 'Equipe operationnelle dans toute la Tunisie, selon la saison.',
  },
  {
    title: 'Expertise',
    value: '10+ ans',
    description: 'Experience solide en mariages, B2B, festivals et shows prives.',
  },
];

const eventHighlights = [Sparkles, PartyPopper, CalendarRange, Sparkles];

export const EventsPage = () => {
  return (
    <div className="page-shell py-10">
      <section className="rounded-3xl border border-white/10 bg-cardLuxury/70 px-5 py-8 sm:px-8 lg:px-10">
        <p className="section-kicker">Formats evenementiels</p>
        <h1 className="section-title mt-3">Chaque evenement merite une mise en scene unique</h1>
        <p className="section-subtitle mt-4">
          Bouri Events prend en charge les moments intimes, les celebrations grands publics et les experiences
          corporate avec un meme niveau d&apos;exigence.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PUBLIC_EVENTS.map((event, index) => {
            const Icon = eventHighlights[index % eventHighlights.length];
            return (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card className="h-full p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                    <Icon className="h-5 w-5 text-goldLuxury" />
                  </span>
                  <h3 className="mt-4 font-display text-3xl text-offWhite">{event.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-grayLuxury">{event.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mt-14 grid gap-4 lg:grid-cols-3">
        {indicators.map((indicator, index) => (
          <motion.div
            key={indicator.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Card className="h-full p-6">
              <p className="text-sm uppercase tracking-[0.16em] text-grayLuxury">{indicator.title}</p>
              <p className="mt-3 font-display text-4xl text-offWhite">{indicator.value}</p>
              <p className="mt-3 text-sm text-grayLuxury">{indicator.description}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="mt-14">
        <CtaBanner />
      </section>
    </div>
  );
};

