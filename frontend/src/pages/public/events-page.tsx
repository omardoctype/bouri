import { motion } from 'framer-motion';
import { CalendarRange, PartyPopper, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';
import { CtaBanner } from '../../components/sections/cta-banner';
import { getEventTypeLabel } from '../../utils/translationLabels';

const eventHighlights = [Sparkles, PartyPopper, CalendarRange, Sparkles];
const EVENT_KEYS = ['MARIAGE', 'ANNIVERSAIRE', 'SOIREE_BAC', 'FIANCAILLES', 'CORPORATE', 'FESTIVAL', 'SOIREE_PRIVEE'] as const;

export const EventsPage = () => {
  const { t } = useTranslation();

  const indicators = [
    {
      title: t('public.events.indicators.capacity.title'),
      value: t('public.events.indicators.capacity.value'),
      description: t('public.events.indicators.capacity.description')
    },
    {
      title: t('public.events.indicators.coverage.title'),
      value: t('public.events.indicators.coverage.value'),
      description: t('public.events.indicators.coverage.description')
    },
    {
      title: t('public.events.indicators.expertise.title'),
      value: t('public.events.indicators.expertise.value'),
      description: t('public.events.indicators.expertise.description')
    }
  ];

  return (
    <div className="page-shell py-10">
      <section className="rounded-3xl border border-white/10 bg-cardLuxury/70 px-5 py-8 sm:px-8 lg:px-10">
        <p className="section-kicker">{t('public.events.hero.kicker')}</p>
        <h1 className="section-title mt-3">{t('public.events.hero.title')}</h1>
        <p className="section-subtitle mt-4">{t('public.events.hero.subtitle')}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {EVENT_KEYS.map((eventKey, index) => {
            const Icon = eventHighlights[index % eventHighlights.length];
            return (
              <motion.div
                key={eventKey}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card className="h-full p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                    <Icon className="h-5 w-5 text-goldLuxury" />
                  </span>
                  <h3 className="mt-4 font-display text-3xl text-offWhite">{getEventTypeLabel(eventKey, t)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-grayLuxury">
                    {t(`public.events.cards.${eventKey}.description`)}
                  </p>
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
