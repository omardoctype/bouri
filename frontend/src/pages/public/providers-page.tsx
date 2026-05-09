import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Star } from 'lucide-react';
import axios from 'axios';
import { getPublicProviders } from '../../services/providerApi';
import type { ProviderResponse } from '../../types/provider';
import { PROVIDER_CATEGORIES } from '../../data/constants';
import { Card } from '../../components/ui/card';
import { Select } from '../../components/ui/select';
import { PillBadge } from '../../components/ui/badge';

const CATEGORY_TO_API: Record<string, string> = {
  Photographe: 'PHOTOGRAPHE',
  DJ: 'DJ',
  Band: 'BAND',
  Artiste: 'ARTISTE',
  Decorateur: 'DECORATION',
  Videaste: 'VIDEASTE',
  'Son & lumiere': 'SON_LUMIERE',
};

const API_CATEGORY_LABEL: Record<string, string> = {
  PHOTOGRAPHE: 'Photographe',
  DJ: 'DJ',
  BAND: 'Band',
  ARTISTE: 'Artiste',
  DECORATION: 'Decorateur',
  VIDEASTE: 'Videaste',
  SON_LUMIERE: 'Son & lumiere',
  SALLE: 'Salle',
  ANIMATION: 'Animation',
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | string | undefined;
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (payload && typeof payload === 'object' && typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  }

  return 'Impossible de charger les prestataires pour le moment.';
};

export const ProvidersPage = () => {
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('Tous');

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
        setError(getErrorMessage(err));
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
  }, []);

  const filtered = useMemo(
    () =>
      providers.filter((provider) => {
        if (category === 'Tous') return true;
        return provider.category === CATEGORY_TO_API[category];
      }),
    [providers, category],
  );

  return (
    <div className="page-shell py-10">
      <section className="rounded-3xl border border-white/10 bg-cardLuxury/70 px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Reseau de talents</p>
            <h1 className="section-title mt-3">Les meilleurs prestataires evenementiels en Tunisie</h1>
            <p className="section-subtitle mt-4">
              Selection premium de photographes, DJs, bands, videastes et experts son/lumiere pour sublimer votre
              evenement.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <label className="label-base">Categorie</label>
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="Tous">Tous</option>
              {PROVIDER_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-200">
          {loading ? 'Chargement des prestataires...' : `${filtered.length} prestataire(s) disponible(s) dans cette categorie.`}
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
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
                      {API_CATEGORY_LABEL[provider.category] || provider.category}
                    </p>
                    <PillBadge text={provider.available ? 'Disponible' : 'Complet'} className="bg-black/55" />
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
                    <p className="text-sm font-semibold text-goldLuxury">A partir de {provider.priceFrom} DT</p>
                    <a
                      href={provider.instagram || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-grayLuxury transition hover:text-offWhite"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Instagram
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
