import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { registerSchema, type RegisterFormSchema } from '../../lib/validation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormError } from './form-error';

interface RegisterFormProps {
  onSubmit: (values: RegisterFormSchema) => { ok: boolean; message: string } | Promise<{ ok: boolean; message: string }>;
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      city: '',
    },
  });

  const submit = handleSubmit(async (values) => {
    const result = await onSubmit(values);
    setFeedback({
      type: result.ok ? 'success' : 'error',
      message: result.message,
    });
  });

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label className="label-base">Nom complet</label>
        <Input placeholder="Ex: Amal Ben Hmida" {...register('fullName')} />
        <FormError message={errors.fullName?.message} />
      </div>

      <div>
        <label className="label-base">Email</label>
        <Input type="email" placeholder="vous@email.tn" {...register('email')} />
        <FormError message={errors.email?.message} />
      </div>

      <div>
        <label className="label-base">Telephone</label>
        <Input placeholder="+216 xx xxx xxx" {...register('phone')} />
        <FormError message={errors.phone?.message} />
      </div>

      <div>
        <label className="label-base">Ville</label>
        <Input placeholder="Ex: Tunis" {...register('city')} />
        <FormError message={errors.city?.message} />
      </div>

      <div>
        <label className="label-base">Mot de passe</label>
        <div className="relative">
          <Input type={showPassword ? 'text' : 'password'} placeholder="Minimum 6 caracteres" {...register('password')} />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-grayLuxury transition hover:text-offWhite"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FormError message={errors.password?.message} />
      </div>

      {feedback ? (
        <p
          className={`rounded-lg border px-3 py-2 text-sm ${
            feedback.type === 'error'
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      <Button fullWidth type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creation...' : 'Creer mon compte'}
      </Button>
    </form>
  );
};

