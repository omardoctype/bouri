import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export const CtaBanner = () => (
  <section className="glass-card relative overflow-hidden rounded-3xl p-7 sm:p-10">
    <div className="pointer-events-none absolute -left-14 top-6 h-44 w-44 rounded-full bg-goldLuxury/25 blur-3xl" />
    <div className="pointer-events-none absolute -right-10 -bottom-10 h-52 w-52 rounded-full bg-purpleLuxury/30 blur-3xl" />
    <div className="pointer-events-none absolute right-20 top-4 h-24 w-24 rounded-full bg-blue-400/20 blur-2xl" />

    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="section-kicker">Accompagnement complet</p>
        <h3 className="mt-3 font-display text-3xl leading-tight text-offWhite sm:text-4xl">
          Pret a creer un evenement memorable en Tunisie ?
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-gray-200 sm:text-base">
          Partagez votre vision, nous vous repondons sous 24h avec une proposition structuree, des talents verifies et
          un plan clair jusqu&apos;au jour J.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/register">
            Organiser mon evenement <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link to="/services">Voir nos services</Link>
        </Button>
      </div>
    </div>
  </section>
);

