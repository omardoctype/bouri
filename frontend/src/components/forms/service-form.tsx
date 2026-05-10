import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { SERVICE_CATEGORIES } from '../../data/constants';
import type { ServiceFormSchema } from '../../lib/validation';
import type { ServiceItemResponse } from '../../types/service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { FormError } from './form-error';
import { getServiceCategoryLabel } from '../../utils/translationLabels';

interface ServiceFormProps {
  initialValues?: ServiceItemResponse;
  onSubmit: (values: ServiceFormSchema) => void | Promise<void>;
}

export const ServiceForm = ({ initialValues, onSubmit }: ServiceFormProps) => {
  const { t } = useTranslation();
  const serviceSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('admin.validation.requiredField')),
        category: z.string().min(2, t('admin.validation.requiredField')),
        description: z.string().min(8, t('admin.validation.descriptionTooShort')),
        active: z.boolean(),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      category: initialValues?.category ?? SERVICE_CATEGORIES[0],
      description: initialValues?.description ?? '',
      active: initialValues?.active ?? true,
    },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label-base">{t('admin.services.form.fields.name')}</label>
        <Input {...register('name')} />
        <FormError message={errors.name?.message} />
      </div>

      <div>
        <label className="label-base">{t('admin.services.form.fields.category')}</label>
        <Select {...register('category')}>
          {SERVICE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {getServiceCategoryLabel(category, t)}
            </option>
          ))}
        </Select>
        <FormError message={errors.category?.message} />
      </div>

      <div>
        <label className="label-base">{t('admin.services.form.fields.description')}</label>
        <Textarea {...register('description')} />
        <FormError message={errors.description?.message} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-200">
        <input type="checkbox" className="h-4 w-4 accent-goldLuxury" {...register('active')} />
        {t('admin.services.form.fields.active')}
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? t('admin.services.form.actions.saving')
          : initialValues
            ? t('admin.services.form.actions.update')
            : t('admin.services.form.actions.create')}
      </Button>
    </form>
  );
};
