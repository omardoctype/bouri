import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  CalendarDays,
  Cake,
  Disc3,
  Gem,
  Heart,
  MapPin,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BUDGET_OPTIONS, CITIES } from '../../data/constants';
import { bookingSchema, type BookingFormSchema } from '../../lib/validation';
import { clearBookingDraft, getBookingDraft, saveBookingDraft } from '../../services/bookingService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { FormError } from './form-error';
import { Checkbox } from '../ui/checkbox';

interface BookingRequestFormProps {
  providers: Array<{ name: string }>;
  defaultValues?: Partial<BookingFormSchema>;
  onSubmit: (values: BookingFormSchema) => Promise<void> | void;
  submitLabel?: string;
  draftKey?: string;
}

interface EventTypeCard {
  value: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

interface ServiceOption {
  value: string;
  label: string;
  description: string;
}

const TOTAL_STEPS = 5;

const EVENT_TYPE_CARDS: EventTypeCard[] = [
  {
    value: 'Mariage',
    title: 'Mariage',
    description: 'Ceremonie et reception haut de gamme',
    icon: Gem,
  },
  {
    value: 'Anniversaire',
    title: 'Anniversaire',
    description: 'Celebration personnalisee et festive',
    icon: Cake,
  },
  {
    value: 'Soiree Bac',
    title: 'Soiree Bac',
    description: 'Production dynamique avec ambiance club',
    icon: Sparkles,
  },
  {
    value: 'Fiancailles',
    title: 'Fiancailles',
    description: 'Evenement elegant et intime',
    icon: Heart,
  },
  {
    value: 'Corporate',
    title: 'Corporate',
    description: 'Lancements, galas et activations marque',
    icon: BriefcaseBusiness,
  },
  {
    value: 'Festival',
    title: 'Festival / Club',
    description: 'Formats grand public et scenes live',
    icon: Disc3,
  },
  {
    value: 'Autre',
    title: 'Autre',
    description: 'Projet special sur mesure',
    icon: Sparkles,
  },
];

const SERVICE_OPTIONS: ServiceOption[] = [
  { value: 'Photographe', label: 'Photographe', description: 'Reportage photo premium' },
  { value: 'Videaste', label: 'Videaste', description: 'Captation video cinematic' },
  { value: 'DJ', label: 'DJ', description: 'Set musical sur mesure' },
  { value: 'Band musical', label: 'Band', description: 'Groupe live pour ambiance scene' },
  { value: 'Artiste live', label: 'Artiste live', description: 'Performance signature' },
  { value: 'Decoration', label: 'Decoration', description: 'Concept visuel et scenographie' },
  { value: 'Sonorisation', label: 'Sonorisation', description: 'Systeme audio professionnel' },
  { value: 'Lumiere', label: 'Lumiere', description: 'Design lumiere immersif' },
  { value: 'Salle', label: 'Salle', description: 'Selection et reservation de lieu' },
  { value: 'Animation', label: 'Animation', description: 'MC et activations invites' },
  { value: 'Organisation complete', label: 'Organisation complete', description: 'Pilotage integral du projet' },
];

const STEP_TITLES = [
  'Type d\'evenement',
  'Services souhaites',
  'Budget et details',
  'Coordonnees',
  'Confirmation',
] as const;

const STEP_FIELDS: Record<number, (keyof BookingFormSchema)[]> = {
  1: ['eventType'],
  2: ['requestedServices'],
  3: ['eventDate', 'city', 'location', 'guestsCount', 'budget', 'preferredProvider'],
  4: ['fullName', 'email', 'phone', 'message'],
  5: [],
};

export const BookingRequestForm = ({
  providers,
  defaultValues,
  onSubmit,
  submitLabel = 'Envoyer la demande',
  draftKey = 'bouri_booking_draft',
}: BookingRequestFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const providerOptions = useMemo(() => providers.map((provider) => provider.name), [providers]);

  const initialValues = useMemo<BookingFormSchema>(() => {
    const draftValues = getBookingDraft<Partial<BookingFormSchema>>(draftKey) ?? {};

    const baseValues: BookingFormSchema = {
      fullName: defaultValues?.fullName ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      city: defaultValues?.city ?? '',
      eventType: defaultValues?.eventType ?? '',
      eventDate: defaultValues?.eventDate ?? '',
      location: defaultValues?.location ?? '',
      guestsCount: defaultValues?.guestsCount ?? 80,
      budget: defaultValues?.budget ?? '',
      requestedServices: defaultValues?.requestedServices?.length ? defaultValues.requestedServices : [],
      preferredProvider: defaultValues?.preferredProvider ?? '',
      message: defaultValues?.message ?? '',
    };

    const mergedValues = {
      ...baseValues,
      ...draftValues,
      requestedServices:
        draftValues.requestedServices && draftValues.requestedServices.length
          ? draftValues.requestedServices
          : baseValues.requestedServices,
    };

    return {
      ...mergedValues,
      preferredProvider: mergedValues.preferredProvider || '',
      city: mergedValues.city || '',
      eventType: mergedValues.eventType || '',
      budget: mergedValues.budget || '',
      message: mergedValues.message || '',
      fullName: mergedValues.fullName || '',
      email: mergedValues.email || '',
      phone: mergedValues.phone || '',
      location: mergedValues.location || '',
      eventDate: mergedValues.eventDate || '',
      guestsCount: Number(mergedValues.guestsCount) || 80,
      requestedServices: mergedValues.requestedServices || [],
    };
  }, [defaultValues, draftKey]);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const values = useWatch({ control });
  const selectedServices = values.requestedServices ?? [];
  const selectedEventType = values.eventType ?? '';

  useEffect(() => {
    if (!values) return;

    saveBookingDraft(draftKey, values);
  }, [values, draftKey]);

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setValue(
        'requestedServices',
        selectedServices.filter((item) => item !== service),
        { shouldValidate: true, shouldDirty: true },
      );
      return;
    }

    setValue('requestedServices', [...selectedServices, service], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const goNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    if (fields.length > 0) {
      const valid = await trigger(fields, { shouldFocus: true });
      if (!valid) return;
    }

    setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const progressPercent = (currentStep / TOTAL_STEPS) * 100;

  const submit = handleSubmit(async (formValues) => {
    await onSubmit(formValues);
    clearBookingDraft(draftKey);
  });

  return (
    <form onSubmit={submit} className="space-y-5">
      <section className="surface-muted p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-goldLuxury">Etape {currentStep} / {TOTAL_STEPS}</p>
            <h3 className="mt-2 font-display text-2xl text-offWhite">{STEP_TITLES[currentStep - 1]}</h3>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-grayLuxury">
            Processus premium
          </span>
        </div>

        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-goldLuxury via-pinkLuxury to-purpleLuxury"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        <div className="grid grid-cols-5 gap-1 text-center text-[10px] uppercase tracking-[0.12em] text-grayLuxury sm:text-[11px]">
          {STEP_TITLES.map((stepTitle, index) => {
            const stepNumber = index + 1;
            const active = currentStep === stepNumber;
            const done = currentStep > stepNumber;

            return (
              <div
                key={stepTitle}
                className={`rounded-lg border px-2 py-1.5 ${
                  active
                    ? 'border-goldLuxury/45 bg-goldLuxury/10 text-goldLuxury'
                    : done
                      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
                      : 'border-white/10 bg-white/5'
                }`}
              >
                {stepNumber}
              </div>
            );
          })}
        </div>
      </section>

      <section className="surface-muted overflow-hidden p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            {currentStep === 1 ? (
              <div>
                <p className="mb-4 text-sm text-grayLuxury">
                  Choisissez le type d'evenement qui correspond a votre projet.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {EVENT_TYPE_CARDS.map((eventType) => (
                    <button
                      key={eventType.value}
                      type="button"
                      onClick={() =>
                        setValue('eventType', eventType.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        selectedEventType === eventType.value
                          ? 'border-goldLuxury/45 bg-goldLuxury/10 shadow-glow'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-black/30">
                        <eventType.icon className="h-4 w-4 text-goldLuxury" />
                      </span>
                      <p className="mt-3 font-semibold text-offWhite">{eventType.title}</p>
                      <p className="mt-1 text-xs text-grayLuxury">{eventType.description}</p>
                    </button>
                  ))}
                </div>
                <FormError message={errors.eventType?.message} />
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div>
                <p className="mb-4 text-sm text-grayLuxury">
                  Selectionnez les prestations souhaitees. Vous pouvez en choisir plusieurs.
                </p>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {SERVICE_OPTIONS.map((service) => (
                    <Checkbox
                      key={service.value}
                      label={service.label}
                      checked={selectedServices.includes(service.value)}
                      onChange={() => toggleService(service.value)}
                      className="h-full items-start"
                    />
                  ))}
                </div>

                <div className="mt-3 text-xs text-grayLuxury">{selectedServices.length} service(s) selectionne(s).</div>
                <FormError message={errors.requestedServices?.message} />
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-base">Date de l'evenement</label>
                  <Input type="date" {...register('eventDate')} />
                  <FormError message={errors.eventDate?.message} />
                </div>

                <div>
                  <label className="label-base">Ville</label>
                  <Select {...register('city')}>
                    <option value="">Choisir une ville</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                  <FormError message={errors.city?.message} />
                </div>

                <div>
                  <label className="label-base">Lieu</label>
                  <Input placeholder="Hotel, salle, villa..." {...register('location')} />
                  <FormError message={errors.location?.message} />
                </div>

                <div>
                  <label className="label-base">Nombre d'invites</label>
                  <Input type="number" min={1} {...register('guestsCount', { valueAsNumber: true })} />
                  <FormError message={errors.guestsCount?.message} />
                </div>

                <div>
                  <label className="label-base">Budget</label>
                  <Select {...register('budget')}>
                    <option value="">Choisir un budget</option>
                    {BUDGET_OPTIONS.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </Select>
                  <FormError message={errors.budget?.message} />
                </div>

                <div>
                  <label className="label-base">Prestataire prefere</label>
                  <Select {...register('preferredProvider')}>
                    <option value="">Choisir un prestataire</option>
                    {providerOptions.map((providerName) => (
                      <option key={providerName} value={providerName}>
                        {providerName}
                      </option>
                    ))}
                    <option value="Aucun choix">Aucun choix</option>
                  </Select>
                  <FormError message={errors.preferredProvider?.message} />
                </div>
              </div>
            ) : null}

            {currentStep === 4 ? (
              <div className="grid gap-4 md:grid-cols-2">
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

                <div className="md:col-span-2">
                  <label className="label-base">Telephone</label>
                  <Input {...register('phone')} />
                  <FormError message={errors.phone?.message} />
                </div>

                <div className="md:col-span-2">
                  <label className="label-base">Message (optionnel)</label>
                  <Textarea
                    placeholder="Partagez votre ambiance souhaitee, inspirations ou contraintes importantes..."
                    {...register('message')}
                  />
                  <FormError message={errors.message?.message} />
                </div>
              </div>
            ) : null}

            {currentStep === 5 ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">
                  <h4 className="font-display text-xl text-offWhite">Resume de votre demande</h4>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <p>
                      <span className="text-grayLuxury">Type d'evenement:</span>{' '}
                      <span className="text-offWhite">{values.eventType || '-'}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">Date:</span>{' '}
                      <span className="text-offWhite">{values.eventDate || '-'}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">Ville:</span>{' '}
                      <span className="text-offWhite">{values.city || '-'}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">Budget:</span>{' '}
                      <span className="text-offWhite">{values.budget || '-'}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">Nom:</span>{' '}
                      <span className="text-offWhite">{values.fullName || '-'}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">Email:</span>{' '}
                      <span className="text-offWhite">{values.email || '-'}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">Telephone:</span>{' '}
                      <span className="text-offWhite">{values.phone || '-'}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">Lieu:</span>{' '}
                      <span className="text-offWhite">{values.location || '-'}</span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-grayLuxury">Services:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedServices.length ? (
                        selectedServices.map((service) => (
                          <span
                            key={service}
                            className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-offWhite"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-grayLuxury">-</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-goldLuxury/20 bg-goldLuxury/8 p-3 text-xs text-grayLuxury">
                    Verification finale: assurez-vous que toutes les informations sont correctes avant l'envoi.
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="surface-muted flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6 sm:py-5">
        <div className="inline-flex items-start gap-2 text-xs text-grayLuxury">
          {currentStep <= 3 ? <CalendarDays className="mt-0.5 h-4 w-4 text-goldLuxury" /> : null}
          {currentStep === 4 ? <UserCircle2 className="mt-0.5 h-4 w-4 text-goldLuxury" /> : null}
          {currentStep === 5 ? <MapPin className="mt-0.5 h-4 w-4 text-goldLuxury" /> : null}
          <p>Brouillon enregistre automatiquement dans votre navigateur.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentStep > 1 ? (
            <Button type="button" variant="ghost" onClick={goBack}>
              Retour
            </Button>
          ) : null}

          {currentStep < TOTAL_STEPS ? (
            <Button type="button" onClick={goNext}>
              Suivant
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi en cours...' : submitLabel}
            </Button>
          )}
        </div>
      </section>
    </form>
  );
};

