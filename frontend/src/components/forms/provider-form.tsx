import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { CITIES } from '../../data/constants';
import type { ProviderFormSchema } from '../../lib/validation';
import type { ProviderResponse } from '../../types/provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { FormError } from './form-error';
import { getProviderCategoryLabel } from '../../utils/translationLabels';

interface ProviderFormProps {
  initialValues?: ProviderResponse;
  onSubmit: (values: ProviderFormSchema) => void | Promise<void>;
}

const PROVIDER_CATEGORY_OPTIONS = [
  { value: 'PHOTOGRAPHE' },
  { value: 'DJ' },
  { value: 'BAND' },
  { value: 'ARTISTE' },
  { value: 'DECORATION' },
  { value: 'VIDEASTE' },
  { value: 'SON_LUMIERE' },
  { value: 'SALLE' },
  { value: 'ANIMATION' },
] as const;

export const ProviderForm = ({ initialValues, onSubmit }: ProviderFormProps) => {
  const { t } = useTranslation();
  const providerSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('admin.validation.requiredField')),
        category: z.string().min(2, t('admin.validation.requiredField')),
        city: z.string().min(2, t('admin.validation.requiredField')),
        description: z.string().min(12, t('admin.validation.descriptionTooShort')),
        priceFrom: z.number().min(0, t('admin.validation.invalidPrice')),
        rating: z.number().min(0, t('admin.validation.invalidRating')).max(5, t('admin.validation.invalidRating')),
        imageUrl: z.string().url(t('admin.validation.invalidImageUrl')),
        phone: z.string().min(8, t('admin.validation.requiredField')),
        instagram: z.string().url(t('admin.validation.invalidInstagramUrl')),
        available: z.boolean(),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProviderFormSchema>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      category: initialValues?.category ?? 'PHOTOGRAPHE',
      city: initialValues?.city ?? CITIES[0],
      description: initialValues?.description ?? '',
      priceFrom: initialValues?.priceFrom ?? 0,
      rating: initialValues?.rating ?? 4.5,
      imageUrl:
        initialValues?.imageUrl ??
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
      phone: initialValues?.phone ?? '',
      instagram: initialValues?.instagram ?? 'https://instagram.com/',
      available: initialValues?.available ?? true,
    },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-base">{t('admin.providers.form.fields.name')}</label>
          <Input {...register('name')} />
          <FormError message={errors.name?.message} />
        </div>
        <div>
          <label className="label-base">{t('admin.providers.form.fields.category')}</label>
          <Select {...register('category')}>
            {PROVIDER_CATEGORY_OPTIONS.map((category) => (
              <option key={category.value} value={category.value}>
                {getProviderCategoryLabel(category.value, t)}
              </option>
            ))}
          </Select>
          <FormError message={errors.category?.message} />
        </div>

        <div>
          <label className="label-base">{t('admin.providers.form.fields.city')}</label>
          <Select {...register('city')}>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
          <FormError message={errors.city?.message} />
        </div>

        <div>
          <label className="label-base">{t('admin.providers.form.fields.phone')}</label>
          <Input {...register('phone')} />
          <FormError message={errors.phone?.message} />
        </div>

        <div>
          <label className="label-base">{t('admin.providers.form.fields.priceFrom')}</label>
          <Input type="number" min={0} {...register('priceFrom', { valueAsNumber: true })} />
          <FormError message={errors.priceFrom?.message} />
        </div>

        <div>
          <label className="label-base">{t('admin.providers.form.fields.rating')}</label>
          <Input type="number" min={0} max={5} step={0.1} {...register('rating', { valueAsNumber: true })} />
          <FormError message={errors.rating?.message} />
        </div>
      </div>

      <div>
        <label className="label-base">{t('admin.providers.form.fields.imageUrl')}</label>
        <Input {...register('imageUrl')} />
        <FormError message={errors.imageUrl?.message} />
      </div>

      <div>
        <label className="label-base">{t('admin.providers.form.fields.instagram')}</label>
        <Input {...register('instagram')} />
        <FormError message={errors.instagram?.message} />
      </div>

      <div>
        <label className="label-base">{t('admin.providers.form.fields.description')}</label>
        <Textarea {...register('description')} />
        <FormError message={errors.description?.message} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-200">
        <input type="checkbox" className="h-4 w-4 accent-goldLuxury" {...register('available')} />
        {t('admin.providers.form.fields.available')}
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? t('admin.providers.form.actions.saving')
          : initialValues
            ? t('admin.providers.form.actions.update')
            : t('admin.providers.form.actions.create')}
      </Button>
    </form>
  );
};
