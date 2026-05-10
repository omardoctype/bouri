import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, TimerReset } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { HeroSection } from '../../components/sections/hero-section';
import { CtaBanner } from '../../components/sections/cta-banner';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PACKS } from '../../data/demo';
import { getPublicProviders } from '../../services/providerApi';
import type { ProviderResponse } from '../../types/provider';
import { getServiceLabel } from '../../utils/translationLabels';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | string | undefined;
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (payload && typeof payload === 'object' && typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  }

  return fallback;
};

export const HomePage = () => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [providersError, setProvidersError] = useState<string | null>(null);

  const trustSignals = [
    {
      title: t('public.home.trustSignals.strictSelection.title'),
      description: t('public.home.trustSignals.strictSelection.description'),
      icon: ShieldCheck
    },
    {
      title: t('public.home.trustSignals.artDirection.title'),
      description: t('public.home.trustSignals.artDirection.description'),
      icon: Sparkles
    },
    {
      title: t('public.home.trustSignals.fastResponse.title'),
      description: t('public.home.trustSignals.fastResponse.description'),
      icon: TimerReset
    }
  ];

  const homeFeatures = [
    {
      title: t('public.home.features.items.smartPlanning.title'),
      description: t('public.home.features.items.smartPlanning.description')
    },
    {
      title: t('public.home.features.items.verifiedProviders.title'),
      description: t('public.home.features.items.verifiedProviders.description')
    },
    {
      title: t('public.home.features.items.premiumExecution.title'),
      description: t('public.home.features.items.premiumExecution.description')
    }
  ];

  useEffect(() => {
    let active = true;

    const loadProviders = async () => {
      try {
        const data = await getPublicProviders();
        if (!active) return;
        setProviders(data.slice(0, 3));
      } catch (error) {
        if (!active) return;
        setProvidersError(getErrorMessage(error, t('public.home.providers.error')));
      }
    };

    loadProviders();

    return () => {
      active = false;
    };
  }, [t]);

  return (
    <div className="page-shell py-8 sm:py-10">
      <HeroSection />

      <section className="mt-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">{t('public.home.why.kicker')}</p>
            <h2 className="section-title mt-3">{t('public.home.why.title')}</h2>
            <p className="section-subtitle mt-3">{t('public.home.why.subtitle')}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {trustSignals.map((signal, index) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <Card className="h-full p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                  <signal.icon className="h-5 w-5 text-goldLuxury" />
                </span>
                <h3 className="mt-4 font-display text-2xl text-offWhite">{signal.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grayLuxury">{signal.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-kicker">{t('public.home.features.kicker')}</p>
            <h2 className="section-title mt-3">{t('public.home.features.title')}</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/services">
              {t('public.home.features.explore')} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {homeFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <Card className="h-full p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-grayLuxury">
                  {t('public.home.features.featureLabel', { index: index + 1 })}
                </p>
                <h3 className="mt-3 font-display text-2xl text-offWhite">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-grayLuxury">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-kicker">{t('public.home.packs.kicker')}</p>
            <h2 className="section-title mt-3">{t('public.home.packs.title')}</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/packs">
              {t('public.home.packs.viewAll')} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {PACKS.slice(0, 3).map((pack, index) => {
            const name = t(`public.packs.catalog.${pack.id}.name`, { defaultValue: pack.name });
            const price = t(`public.packs.catalog.${pack.id}.price`, { defaultValue: pack.price });
            const description = t(`public.packs.catalog.${pack.id}.description`, { defaultValue: pack.description });
            const items = t(`public.packs.catalog.${pack.id}.items`, { returnObjects: true }) as string[];

            return (
              <Card
                key={pack.id}
                className={`flex h-full flex-col p-6 ${index === 1 ? 'border-goldLuxury/45 bg-gradient-to-br from-goldLuxury/12 to-purpleLuxury/10' : ''}`}
              >
                <p className="text-xs uppercase tracking-[0.16em] text-goldLuxury">{price}</p>
                <h3 className="mt-2 font-display text-3xl text-offWhite">{name}</h3>
                <p className="mt-3 text-sm text-grayLuxury">{description}</p>
                <ul className="mt-5 space-y-2 text-sm text-gray-200">
                  {(Array.isArray(items) && items.length ? items : pack.items).map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button asChild fullWidth variant={index === 1 ? 'primary' : 'secondary'}>
                    <Link to="/register">{t('public.home.packs.choosePack')}</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-kicker">{t('public.home.providers.kicker')}</p>
            <h2 className="section-title mt-3">{t('public.home.providers.title')}</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/providers">
              {t('public.home.providers.viewAll')} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {providersError ? (
          <Card className="mb-4 border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-100">{providersError}</Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          {providers.map((provider) => (
            <Card key={provider.id} className="overflow-hidden p-0">
              <div className="relative">
                <img
                  src={provider.imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'}
                  alt={provider.name}
                  className="h-52 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <p className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs text-offWhite">
                  {getServiceLabel(provider.category, t)}
                </p>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-offWhite">{provider.name}</h3>
                <p className="mt-2 text-sm text-grayLuxury">
                  {provider.city} - {t('public.home.providers.rating')}: {provider.rating}/5
                </p>
                <p className="mt-2 text-sm text-gray-200">
                  {t('public.home.providers.priceFrom')} {provider.priceFrom} DT
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <CtaBanner />
      </section>
    </div>
  );
};
