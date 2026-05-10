import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { FormError } from '../../components/forms/form-error';

type ContactSchema = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

export const ContactPage = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const contactSchema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(3, t('public.contact.validation.fullName')),
        email: z.string().email(t('public.contact.validation.email')),
        phone: z.string().min(8, t('public.contact.validation.phone')),
        message: z.string().min(12, t('public.contact.validation.message'))
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const submit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitted(true);
    reset();
  });

  return (
    <div className="page-shell py-10">
      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <h1 className="section-title">{t('public.contact.hero.title')}</h1>
          <p className="section-subtitle mt-2">{t('public.contact.hero.subtitle')}</p>

          <div className="mt-8 space-y-3 text-sm text-gray-200">
            <p>{t('public.contact.details.phone')}: +216 71 900 115</p>
            <p>{t('public.contact.details.email')}: contact@bourievents.tn</p>
            <p>{t('public.contact.details.address')}: {t('public.contact.details.addressValue')}</p>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-3xl text-offWhite">{t('public.contact.form.title')}</h2>
          <form className="mt-5 space-y-4" onSubmit={submit}>
            <div>
              <label className="label-base">{t('public.contact.form.fullName')}</label>
              <Input {...register('fullName')} />
              <FormError message={errors.fullName?.message} />
            </div>
            <div>
              <label className="label-base">{t('public.contact.form.email')}</label>
              <Input type="email" {...register('email')} />
              <FormError message={errors.email?.message} />
            </div>
            <div>
              <label className="label-base">{t('public.contact.form.phone')}</label>
              <Input {...register('phone')} />
              <FormError message={errors.phone?.message} />
            </div>
            <div>
              <label className="label-base">{t('public.contact.form.message')}</label>
              <Textarea {...register('message')} />
              <FormError message={errors.message?.message} />
            </div>
            {submitted ? (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                {t('public.contact.form.success')}
              </p>
            ) : null}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('public.contact.form.sending') : t('public.contact.form.submit')}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
};
