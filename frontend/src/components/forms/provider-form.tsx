import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CITIES } from '../../data/constants';
import { providerSchema, type ProviderFormSchema } from '../../lib/validation';
import type { ProviderResponse } from '../../types/provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { FormError } from './form-error';

interface ProviderFormProps {
  initialValues?: ProviderResponse;
  onSubmit: (values: ProviderFormSchema) => void | Promise<void>;
}

const PROVIDER_CATEGORY_OPTIONS = [
  { value: 'PHOTOGRAPHE', label: 'Photographe' },
  { value: 'DJ', label: 'DJ' },
  { value: 'BAND', label: 'Band' },
  { value: 'ARTISTE', label: 'Artiste' },
  { value: 'DECORATION', label: 'Decoration' },
  { value: 'VIDEASTE', label: 'Videaste' },
  { value: 'SON_LUMIERE', label: 'Son & lumiere' },
  { value: 'SALLE', label: 'Salle' },
  { value: 'ANIMATION', label: 'Animation' },
] as const;

export const ProviderForm = ({ initialValues, onSubmit }: ProviderFormProps) => {
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
          <label className="label-base">Nom</label>
          <Input {...register('name')} />
          <FormError message={errors.name?.message} />
        </div>
        <div>
          <label className="label-base">Categorie</label>
          <Select {...register('category')}>
            {PROVIDER_CATEGORY_OPTIONS.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
          <FormError message={errors.category?.message} />
        </div>

        <div>
          <label className="label-base">Ville</label>
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
          <label className="label-base">Telephone</label>
          <Input {...register('phone')} />
          <FormError message={errors.phone?.message} />
        </div>

        <div>
          <label className="label-base">Prix a partir de (DT)</label>
          <Input type="number" min={0} {...register('priceFrom', { valueAsNumber: true })} />
          <FormError message={errors.priceFrom?.message} />
        </div>

        <div>
          <label className="label-base">Note (0-5)</label>
          <Input type="number" min={0} max={5} step={0.1} {...register('rating', { valueAsNumber: true })} />
          <FormError message={errors.rating?.message} />
        </div>
      </div>

      <div>
        <label className="label-base">Image URL</label>
        <Input {...register('imageUrl')} />
        <FormError message={errors.imageUrl?.message} />
      </div>

      <div>
        <label className="label-base">Instagram</label>
        <Input {...register('instagram')} />
        <FormError message={errors.instagram?.message} />
      </div>

      <div>
        <label className="label-base">Description</label>
        <Textarea {...register('description')} />
        <FormError message={errors.description?.message} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-200">
        <input type="checkbox" className="h-4 w-4 accent-goldLuxury" {...register('available')} />
        Disponible actuellement
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : initialValues ? 'Mettre a jour' : 'Ajouter prestataire'}
      </Button>
    </form>
  );
};

