import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getPublicProviders } from '../../services/providerApi';
import type { ProviderResponse } from '../../types/provider';
import { Card } from '../../components/ui/card';
import { Select } from '../../components/ui/select';
import { PillBadge } from '../../components/ui/badge';
import { getServiceLabel } from '../../utils/translationLabels';

type ProviderCategory =
  | 'PHOTOGRAPHE'
  | 'DJ'
  | 'BAND'
  | 'ARTISTE'
  | 'DECORATION'
  | 'VIDEASTE'
  | 'SON_LUMIERE'
  | 'SALLE'
  | 'ANIMATION';

const PROVIDER_CATEGORY_OPTIONS: ProviderCategory[] = [
  'PHOTOGRAPHE',
  'DJ',
  'BAND',
  'ARTISTE',
  'DECORATION',
  'VIDEASTE',
  'SON_LUMIERE',
  'SALLE',
  'ANIMATION'
];

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

export const ProvidersPage = () => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<'ALL' | ProviderCategory>('ALL');

  useEffect(() => {
    let active = true;

    const loadProviders = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPublicProviders();
        if (!active) return;
        setProviders(data);
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err, t('public.providers.error')));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProviders();

    return () => {
      active = false;
    };
  }, [t]);

  const filtered = useMemo(
    () => providers.filter((provider) => (category === 'ALL' ? true : provider.category === category)),
    [providers, category]
  );

  return (
    <div className="page-shell py-10">
      <section className="rounded-3xl border border-white/10 bg-cardLuxury/70 px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">{t('public.providers.hero.kicker')}</p>
            <h1 className="section-title mt-3">{t('public.providers.hero.title')}</h1>
            <p className="section-subtitle mt-4">{t('public.providers.hero.subtitle')}</p>
          </div>
          <div className="w-full sm:w-64">
            <label className="label-base">{t('public.providers.filter.category')}</label>
            <Select value={category} onChange={(event) => setCategory(event.target.value as 'ALL' | ProviderCategory)}>
              <option value="ALL">{t('public.providers.filter.all')}</option>
              {PROVIDER_CATEGORY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {getServiceLabel(item, t)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-200">
          {loading
            ? t('public.providers.loading')
            : t('public.providers.availableCount', {
                count: filtered.length,
                value: filtered.length
              })}
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <Card className="h-full overflow-hidden p-0">
                <div className="relative">
                  <img
                    src={provider.imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'}
                    alt={provider.name}
                    className="h-52 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <p className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs text-offWhite">
                      {getServiceLabel(provider.category, t)}
                    </p>
                    <PillBadge
                      text={provider.available ? t('public.providers.status.available') : t('public.providers.status.full')}
                      className="bg-black/55"
                    />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-offWhite">{provider.name}</h3>
                    <span className="inline-flex items-center gap-1 text-sm text-goldLuxury">
                      <Star className="h-4 w-4 fill-goldLuxury text-goldLuxury" />
                      {provider.rating}
                    </span>
                  </div>

                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-grayLuxury">
                    <MapPin className="h-3.5 w-3.5" /> {provider.city}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-200">{provider.description}</p>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-goldLuxury">
                      {t('public.providers.priceFrom')} {provider.priceFrom} DT
                    </p>
                    <a
                      href={provider.instagram || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-grayLuxury transition hover:text-offWhite"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> {t('public.providers.instagram')}
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
