import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="page-shell py-10">
      <section>
        <h1 className="section-title">{t('public.about.hero.title')}</h1>
        <p className="section-subtitle">{t('public.about.hero.subtitle')}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="font-display text-2xl">{t('public.about.vision.title')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-grayLuxury">{t('public.about.vision.description')}</p>
          </Card>

          <Card>
            <h2 className="font-display text-2xl">{t('public.about.method.title')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-grayLuxury">{t('public.about.method.description')}</p>
          </Card>
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm uppercase tracking-[0.16em] text-grayLuxury">{t('public.about.values.elegance.label')}</p>
          <h3 className="mt-3 text-xl font-bold text-offWhite">{t('public.about.values.elegance.title')}</h3>
          <p className="mt-2 text-sm text-grayLuxury">{t('public.about.values.elegance.description')}</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.16em] text-grayLuxury">{t('public.about.values.rigor.label')}</p>
          <h3 className="mt-3 text-xl font-bold text-offWhite">{t('public.about.values.rigor.title')}</h3>
          <p className="mt-2 text-sm text-grayLuxury">{t('public.about.values.rigor.description')}</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.16em] text-grayLuxury">{t('public.about.values.emotion.label')}</p>
          <h3 className="mt-3 text-xl font-bold text-offWhite">{t('public.about.values.emotion.title')}</h3>
          <p className="mt-2 text-sm text-grayLuxury">{t('public.about.values.emotion.description')}</p>
        </Card>
      </section>
    </div>
  );
};
