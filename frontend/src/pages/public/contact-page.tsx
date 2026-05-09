import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { FormError } from '../../components/forms/form-error';

const contactSchema = z.object({
  fullName: z.string().min(3, 'Nom requis.'),
  email: z.string().email('Email invalide.'),
  phone: z.string().min(8, 'Telephone requis.'),
  message: z.string().min(12, 'Message trop court.'),
});

type ContactSchema = z.infer<typeof contactSchema>;

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: '',
    },
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
          <h1 className="section-title">Contact</h1>
          <p className="section-subtitle mt-2">
            Besoin d\'un devis rapide ou d\'un accompagnement sur mesure ? Notre equipe vous repond rapidement.
          </p>

          <div className="mt-8 space-y-3 text-sm text-gray-200">
            <p>Telephone: +216 71 900 115</p>
            <p>Email: contact@bourievents.tn</p>
            <p>Adresse: Les Berges du Lac, Tunis</p>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-3xl text-offWhite">Envoyer un message</h2>
          <form className="mt-5 space-y-4" onSubmit={submit}>
            <div>
              <label className="label-base">Nom complet</label>
              <Input {...register('fullName')} />
              <FormError message={errors.fullName?.message} />
            </div>
            <div>
              <label className="label-base">Email</label>
              <Input type="email" {...register('email')} />
              <FormError message={errors.email?.message} />
            </div>
            <div>
              <label className="label-base">Telephone</label>
              <Input {...register('phone')} />
              <FormError message={errors.phone?.message} />
            </div>
            <div>
              <label className="label-base">Message</label>
              <Textarea {...register('message')} />
              <FormError message={errors.message?.message} />
            </div>
            {submitted ? (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                Merci, votre message a bien ete envoye.
              </p>
            ) : null}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi...' : 'Envoyer'}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
};

