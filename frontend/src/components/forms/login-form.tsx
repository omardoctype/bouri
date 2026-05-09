import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormSchema } from '../../lib/validation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormError } from './form-error';

interface LoginFormProps {
  onSubmit: (values: LoginFormSchema) => { ok: boolean; message: string } | Promise<{ ok: boolean; message: string }>;
  submitLabel?: string;
}

export const LoginForm = ({ onSubmit, submitLabel = 'Se connecter' }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
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
        <label className="label-base">Email</label>
        <Input type="email" placeholder="vous@email.tn" {...register('email')} />
        <FormError message={errors.email?.message} />
      </div>

      <div>
        <label className="label-base">Mot de passe</label>
        <div className="relative">
          <Input type={showPassword ? 'text' : 'password'} placeholder="Votre mot de passe" {...register('password')} />
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
        {isSubmitting ? 'Connexion...' : submitLabel}
      </Button>
    </form>
  );
};

