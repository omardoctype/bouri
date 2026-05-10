import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PACKS } from '../../data/demo';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export const PacksPage = () => {
  const { t } = useTranslation();

  return (
    <div className="page-shell py-10">
      <section className="rounded-3xl border border-white/10 bg-cardLuxury/70 px-5 py-8 sm:px-8 lg:px-10">
        <p className="section-kicker">{t('public.packs.hero.kicker')}</p>
        <h1 className="section-title mt-3">{t('public.packs.hero.title')}</h1>
        <p className="section-subtitle mt-4">{t('public.packs.hero.subtitle')}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PACKS.map((pack, index) => {
            const featured = index === 1;
            const name = t(`public.packs.catalog.${pack.id}.name`, { defaultValue: pack.name });
            const price = t(`public.packs.catalog.${pack.id}.price`, { defaultValue: pack.price });
            const description = t(`public.packs.catalog.${pack.id}.description`, { defaultValue: pack.description });
            const items = t(`public.packs.catalog.${pack.id}.items`, { returnObjects: true }) as string[];

            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card
                  className={`relative flex h-full flex-col p-6 ${
                    featured ? 'border-goldLuxury/45 bg-gradient-to-br from-goldLuxury/15 via-pinkLuxury/8 to-purpleLuxury/12' : ''
                  }`}
                >
                  {featured ? (
                    <p className="mb-4 inline-flex w-fit items-center gap-1 rounded-full border border-goldLuxury/35 bg-goldLuxury/12 px-3 py-1 text-xs uppercase tracking-[0.12em] text-goldLuxury">
                      <Sparkles className="h-3.5 w-3.5" /> {t('public.packs.mostRequested')}
                    </p>
                  ) : null}

                  <p className="text-xs uppercase tracking-[0.14em] text-goldLuxury">{price}</p>
                  <h3 className="mt-2 font-display text-3xl text-offWhite">{name}</h3>
                  <p className="mt-3 text-sm text-grayLuxury">{description}</p>

                  <ul className="mt-6 space-y-2 text-sm text-gray-200">
                    {(Array.isArray(items) && items.length ? items : pack.items).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-goldLuxury" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7">
                    <Button asChild fullWidth variant={featured ? 'primary' : 'secondary'}>
                      <Link to="/register">{t('public.packs.startWithPack')}</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
