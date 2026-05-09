import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, TimerReset } from 'lucide-react';
import axios from 'axios';
import { HeroSection } from '../../components/sections/hero-section';
import { CtaBanner } from '../../components/sections/cta-banner';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { HOME_FEATURES, PACKS } from '../../data/demo';
import { getPublicProviders } from '../../services/providerApi';
import type { ProviderResponse } from '../../types/provider';

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

const trustSignals = [
  {
    title: 'Selection stricte',
    description: 'Chaque prestataire est verifie avant publication pour garder un standard premium.',
    icon: ShieldCheck,
  },
  {
    title: 'Direction artistique',
    description: 'Scenographie, ambiance et planning sont alignes avec votre vision.',
    icon: Sparkles,
  },
  {
    title: 'Reponse rapide',
    description: 'Notre equipe revient sous 24h avec une premiere proposition claire.',
    icon: TimerReset,
  },
];

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | string | undefined;
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (payload && typeof payload === 'object' && typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  }

  return 'Impossible de charger les prestataires actuellement.';
};

export const HomePage = () => {
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [providersError, setProvidersError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadProviders = async () => {
      try {
        const data = await getPublicProviders();
        if (!active) return;
        setProviders(data.slice(0, 3));
      } catch (error) {
        if (!active) return;
        setProvidersError(getErrorMessage(error));
      }
    };

    loadProviders();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-shell py-8 sm:py-10">
      <HeroSection />

      <section className="mt-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Pourquoi nous choisir</p>
            <h2 className="section-title mt-3">Une experience agence, avec la fluidite d&apos;une plateforme SaaS</h2>
            <p className="section-subtitle mt-3">
              Bouri Events centralise les demandes, la selection des talents et le suivi des reservations sans perdre la
              touche humaine.
            </p>
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
            <p className="section-kicker">Fonctionnalites</p>
            <h2 className="section-title mt-3">Ce que vous gagnez avec Bouri Events</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/services">
              Explorer les services <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {HOME_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <Card className="h-full p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-grayLuxury">Feature 0{index + 1}</p>
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
            <p className="section-kicker">Packs</p>
            <h2 className="section-title mt-3">Des offres pensees pour chaque niveau d&apos;ambition</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/packs">
              Voir tous les packs <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {PACKS.map((pack, index) => (
            <Card
              key={pack.name}
              className={`flex h-full flex-col p-6 ${index === 1 ? 'border-goldLuxury/45 bg-gradient-to-br from-goldLuxury/12 to-purpleLuxury/10' : ''}`}
            >
              <p className="text-xs uppercase tracking-[0.16em] text-goldLuxury">{pack.price}</p>
              <h3 className="mt-2 font-display text-3xl text-offWhite">{pack.name}</h3>
              <p className="mt-3 text-sm text-grayLuxury">{pack.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-gray-200">
                {pack.items.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
              <div className="mt-6">
                <Button asChild fullWidth variant={index === 1 ? 'primary' : 'secondary'}>
                  <Link to="/register">Choisir ce pack</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-kicker">Prestataires</p>
            <h2 className="section-title mt-3">Talents tunisien en vedette</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/providers">
              Voir le reseau complet <ArrowRight className="h-4 w-4" />
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
                  {API_CATEGORY_LABEL[provider.category] || provider.category}
                </p>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-offWhite">{provider.name}</h3>
                <p className="mt-2 text-sm text-grayLuxury">
                  {provider.city} - Note {provider.rating}/5
                </p>
                <p className="mt-2 text-sm text-gray-200">A partir de {provider.priceFrom} DT</p>
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
