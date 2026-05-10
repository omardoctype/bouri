import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Disc3, Gem, Lightbulb, Mic2, PartyPopper, Settings2, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';
import { CtaBanner } from '../../components/sections/cta-banner';
import { SERVICES } from '../../data/constants';
import { Button } from '../../components/ui/button';
import { getServiceLabel } from '../../utils/translationLabels';

const serviceIcons = [Camera, Disc3, Mic2, PartyPopper, Gem, Lightbulb, Volume2, Settings2];

export const ServicesPage = () => {
  const { t } = useTranslation();

  const process = [
    {
      title: t('public.services.process.steps.brief.title'),
      description: t('public.services.process.steps.brief.description')
    },
    {
      title: t('public.services.process.steps.matching.title'),
      description: t('public.services.process.steps.matching.description')
    },
    {
      title: t('public.services.process.steps.offer.title'),
      description: t('public.services.process.steps.offer.description')
    },
    {
      title: t('public.services.process.steps.coordination.title'),
      description: t('public.services.process.steps.coordination.description')
    }
  ];

  return (
    <div className="page-shell py-10">
      <section className="rounded-3xl border border-white/10 bg-cardLuxury/65 px-5 py-8 sm:px-8 lg:px-10">
        <p className="section-kicker">{t('public.services.hero.kicker')}</p>
        <h1 className="section-title mt-3">{t('public.services.hero.title')}</h1>
        <p className="section-subtitle mt-4">{t('public.services.hero.subtitle')}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <Card className="flex min-h-[132px] items-start gap-3 p-5">
                  <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                    <Icon className="h-5 w-5 text-goldLuxury" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-offWhite">{getServiceLabel(service, t)}</p>
                    <p className="mt-2 text-xs leading-relaxed text-grayLuxury">{t('public.services.serviceCardDescription')}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">{t('public.services.process.kicker')}</p>
            <h2 className="section-title mt-3">{t('public.services.process.title')}</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/register">
              {t('public.services.process.startBrief')} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {process.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="h-full p-6">
                <h3 className="font-display text-2xl text-offWhite">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grayLuxury">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <CtaBanner />
      </section>
    </div>
  );
};
