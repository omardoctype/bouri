import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SERVICE_CATEGORIES } from '../../data/constants';
import { serviceSchema, type ServiceFormSchema } from '../../lib/validation';
import type { ServiceItemResponse } from '../../types/service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { FormError } from './form-error';

interface ServiceFormProps {
  initialValues?: ServiceItemResponse;
  onSubmit: (values: ServiceFormSchema) => void | Promise<void>;
}

export const ServiceForm = ({ initialValues, onSubmit }: ServiceFormProps) => {
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
        <label className="label-base">Nom service</label>
        <Input {...register('name')} />
        <FormError message={errors.name?.message} />
      </div>

      <div>
        <label className="label-base">Categorie</label>
        <Select {...register('category')}>
          {SERVICE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <FormError message={errors.category?.message} />
      </div>

      <div>
        <label className="label-base">Description</label>
        <Textarea {...register('description')} />
        <FormError message={errors.description?.message} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-200">
        <input type="checkbox" className="h-4 w-4 accent-goldLuxury" {...register('active')} />
        Service actif
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : initialValues ? 'Mettre a jour service' : 'Ajouter service'}
      </Button>
    </form>
  );
};
