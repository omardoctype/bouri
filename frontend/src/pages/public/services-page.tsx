import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Disc3, Gem, Lightbulb, Mic2, PartyPopper, Settings2, Volume2 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { CtaBanner } from '../../components/sections/cta-banner';
import { SERVICES } from '../../data/constants';
import { Button } from '../../components/ui/button';

const process = [
  {
    title: '1. Brief intelligent',
    description: 'Vous renseignez votre vision, budget, date et niveau de personnalisation.',
  },
  {
    title: '2. Matching premium',
    description: 'Nous alignons les meilleurs prestataires selon votre style et votre ville.',
  },
  {
    title: '3. Offre sur mesure',
    description: 'Une proposition claire avec timeline, options et arbitrages utiles.',
  },
  {
    title: '4. Coordination finale',
    description: 'Suivi operationnel jusqu&apos;au jour J, avec communication centralisee.',
  },
];

const serviceIcons = [Camera, Disc3, Mic2, PartyPopper, Gem, Lightbulb, Volume2, Settings2];

export const ServicesPage = () => {
  return (
    <div className="page-shell py-10">
      <section className="rounded-3xl border border-white/10 bg-cardLuxury/65 px-5 py-8 sm:px-8 lg:px-10">
        <p className="section-kicker">Services premium</p>
        <h1 className="section-title mt-3">Tout ce qu&apos;il faut pour un evenement signature en Tunisie</h1>
        <p className="section-subtitle mt-4">
          De la captation photo-video a la direction artistique complete, notre plateforme vous aide a composer une
          experience coherente, elegante et memorisable.
        </p>

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
                    <p className="text-lg font-semibold text-offWhite">{service}</p>
                    <p className="mt-2 text-xs leading-relaxed text-grayLuxury">
                      Accompagnement professionnel avec options modulables selon format et budget.
                    </p>
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
            <p className="section-kicker">Methodologie</p>
            <h2 className="section-title mt-3">Un process clair, du premier message au jour J</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/register">
              Demarrer mon brief <ArrowRight className="h-4 w-4" />
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

