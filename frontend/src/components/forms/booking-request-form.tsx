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
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { BUDGET_OPTIONS, CITIES } from '../../data/constants';
import type { BookingFormSchema } from '../../lib/validation';
import { clearBookingDraft, getBookingDraft, saveBookingDraft } from '../../services/bookingService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { FormError } from './form-error';
import { Checkbox } from '../ui/checkbox';
import { getBudgetLabel, getEventTypeLabel, getServiceLabel } from '../../utils/translationLabels';

interface BookingRequestFormProps {
  providers: Array<{ name: string }>;
  defaultValues?: Partial<BookingFormSchema>;
  onSubmit: (values: BookingFormSchema) => Promise<void> | void;
  submitLabel?: string;
  draftKey?: string;
}

interface EventTypeCard {
  value: string;
  descriptionKey: string;
  icon: ComponentType<{ className?: string }>;
}

interface ServiceOption {
  value: string;
}

const TOTAL_STEPS = 5;
const NO_PROVIDER_VALUE = 'Aucun choix';

const EVENT_TYPE_CARDS: EventTypeCard[] = [
  {
    value: 'Mariage',
    descriptionKey: 'client.bookingForm.eventTypeCards.MARIAGE',
    icon: Gem,
  },
  {
    value: 'Anniversaire',
    descriptionKey: 'client.bookingForm.eventTypeCards.ANNIVERSAIRE',
    icon: Cake,
  },
  {
    value: 'Soiree Bac',
    descriptionKey: 'client.bookingForm.eventTypeCards.SOIREE_BAC',
    icon: Sparkles,
  },
  {
    value: 'Fiancailles',
    descriptionKey: 'client.bookingForm.eventTypeCards.FIANCAILLES',
    icon: Heart,
  },
  {
    value: 'Corporate',
    descriptionKey: 'client.bookingForm.eventTypeCards.CORPORATE',
    icon: BriefcaseBusiness,
  },
  {
    value: 'Festival',
    descriptionKey: 'client.bookingForm.eventTypeCards.FESTIVAL',
    icon: Disc3,
  },
  {
    value: 'Autre',
    descriptionKey: 'client.bookingForm.eventTypeCards.AUTRE',
    icon: Sparkles,
  },
];

const SERVICE_OPTIONS: ServiceOption[] = [
  { value: 'Photographe' },
  { value: 'Videaste' },
  { value: 'DJ' },
  { value: 'Band musical' },
  { value: 'Artiste live' },
  { value: 'Decoration' },
  { value: 'Sonorisation' },
  { value: 'Lumiere' },
  { value: 'Salle' },
  { value: 'Animation' },
  { value: 'Organisation complete' },
];

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
  submitLabel,
  draftKey = 'bouri_booking_draft',
}: BookingRequestFormProps) => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');

  const resolvedSubmitLabel = submitLabel || t('client.bookingForm.actions.submit');

  const stepTitles = useMemo(
    () => [
      t('client.bookingForm.steps.eventType'),
      t('client.bookingForm.steps.services'),
      t('client.bookingForm.steps.details'),
      t('client.bookingForm.steps.contact'),
      t('client.bookingForm.steps.confirmation'),
    ],
    [t]
  );

  const bookingSchema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(3, t('client.validation.fullNameMin')),
        email: z.string().email(t('client.validation.invalidEmail')),
        phone: z.string().min(8, t('client.validation.phoneRequired')),
        city: z.string().min(2, t('client.validation.cityRequired')),
        eventType: z.string().min(2, t('client.validation.eventTypeRequired')),
        eventDate: z.string().min(1, t('client.validation.eventDateRequired')),
        location: z.string().min(3, t('client.validation.locationRequired')),
        guestsCount: z.number().min(1, t('client.validation.guestsRequired')),
        budget: z.string().min(1, t('client.validation.budgetRequired')),
        requestedServices: z.array(z.string()).min(1, t('client.validation.servicesRequired')),
        preferredProvider: z.string().min(1, t('client.validation.preferredProviderRequired')),
        message: z.string().max(500, t('client.validation.messageMaxLength')),
      }),
    [t]
  );

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
            <p className="text-xs uppercase tracking-[0.16em] text-goldLuxury">
              {t('client.bookingForm.progress', { step: currentStep, total: TOTAL_STEPS })}
            </p>
            <h3 className="mt-2 font-display text-2xl text-offWhite">{stepTitles[currentStep - 1]}</h3>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-grayLuxury">
            {t('client.bookingForm.badge')}
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
          {stepTitles.map((stepTitle, index) => {
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
                  {t('client.bookingForm.descriptions.eventType')}
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
                      className={`rounded-2xl border p-4 transition-all ${isRTL ? 'text-right' : 'text-left'} ${
                        selectedEventType === eventType.value
                          ? 'border-goldLuxury/45 bg-goldLuxury/10 shadow-glow'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-black/30">
                        <eventType.icon className="h-4 w-4 text-goldLuxury" />
                      </span>
                      <p className="mt-3 font-semibold text-offWhite">{getEventTypeLabel(eventType.value, t)}</p>
                      <p className="mt-1 text-xs text-grayLuxury">{t(eventType.descriptionKey)}</p>
                    </button>
                  ))}
                </div>
                <FormError message={errors.eventType?.message} />
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div>
                <p className="mb-4 text-sm text-grayLuxury">
                  {t('client.bookingForm.descriptions.services')}
                </p>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {SERVICE_OPTIONS.map((service) => (
                    <Checkbox
                      key={service.value}
                      label={getServiceLabel(service.value, t)}
                      checked={selectedServices.includes(service.value)}
                      onChange={() => toggleService(service.value)}
                      className="h-full items-start"
                    />
                  ))}
                </div>

                <div className="mt-3 text-xs text-grayLuxury">
                  {t('client.bookingForm.selectedServicesCount', { count: selectedServices.length })}
                </div>
                <FormError message={errors.requestedServices?.message} />
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-base">{t('client.bookingForm.fields.eventDate')}</label>
                  <Input type="date" {...register('eventDate')} />
                  <FormError message={errors.eventDate?.message} />
                </div>

                <div>
                  <label className="label-base">{t('client.bookingForm.fields.city')}</label>
                  <Select {...register('city')}>
                    <option value="">{t('client.bookingForm.placeholders.selectCity')}</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                  <FormError message={errors.city?.message} />
                </div>

                <div>
                  <label className="label-base">{t('client.bookingForm.fields.location')}</label>
                  <Input placeholder={t('client.bookingForm.placeholders.location')} {...register('location')} />
                  <FormError message={errors.location?.message} />
                </div>

                <div>
                  <label className="label-base">{t('client.bookingForm.fields.guestsCount')}</label>
                  <Input type="number" min={1} {...register('guestsCount', { valueAsNumber: true })} />
                  <FormError message={errors.guestsCount?.message} />
                </div>

                <div>
                  <label className="label-base">{t('client.bookingForm.fields.budget')}</label>
                  <Select {...register('budget')}>
                    <option value="">{t('client.bookingForm.placeholders.selectBudget')}</option>
                    {BUDGET_OPTIONS.map((budget) => (
                      <option key={budget} value={budget}>
                        {getBudgetLabel(budget, t)}
                      </option>
                    ))}
                  </Select>
                  <FormError message={errors.budget?.message} />
                </div>

                <div>
                  <label className="label-base">{t('client.bookingForm.fields.preferredProvider')}</label>
                  <Select {...register('preferredProvider')}>
                    <option value="">{t('client.bookingForm.placeholders.selectProvider')}</option>
                    {providerOptions.map((providerName) => (
                      <option key={providerName} value={providerName}>
                        {providerName}
                      </option>
                    ))}
                    <option value={NO_PROVIDER_VALUE}>{t('client.bookingForm.placeholders.noPreference')}</option>
                  </Select>
                  <FormError message={errors.preferredProvider?.message} />
                </div>
              </div>
            ) : null}

            {currentStep === 4 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-base">{t('client.bookingForm.fields.fullName')}</label>
                  <Input {...register('fullName')} />
                  <FormError message={errors.fullName?.message} />
                </div>

                <div>
                  <label className="label-base">{t('client.bookingForm.fields.email')}</label>
                  <Input type="email" {...register('email')} />
                  <FormError message={errors.email?.message} />
                </div>

                <div className="md:col-span-2">
                  <label className="label-base">{t('client.bookingForm.fields.phone')}</label>
                  <Input {...register('phone')} />
                  <FormError message={errors.phone?.message} />
                </div>

                <div className="md:col-span-2">
                  <label className="label-base">{t('client.bookingForm.fields.message')}</label>
                  <Textarea
                    placeholder={t('client.bookingForm.placeholders.message')}
                    {...register('message')}
                  />
                  <FormError message={errors.message?.message} />
                </div>
              </div>
            ) : null}

            {currentStep === 5 ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">
                  <h4 className="font-display text-xl text-offWhite">{t('client.bookingForm.summary.title')}</h4>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <p>
                      <span className="text-grayLuxury">{t('client.bookingForm.summary.eventType')}:</span>{' '}
                      <span className="text-offWhite">
                        {values.eventType ? getEventTypeLabel(values.eventType, t) : t('client.common.none')}
                      </span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">{t('client.bookingForm.summary.eventDate')}:</span>{' '}
                      <span className="text-offWhite">{values.eventDate || t('client.common.none')}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">{t('client.bookingForm.summary.city')}:</span>{' '}
                      <span className="text-offWhite">{values.city || t('client.common.none')}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">{t('client.bookingForm.summary.budget')}:</span>{' '}
                      <span className="text-offWhite">
                        {values.budget ? getBudgetLabel(values.budget, t) : t('client.common.none')}
                      </span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">{t('client.bookingForm.summary.fullName')}:</span>{' '}
                      <span className="text-offWhite">{values.fullName || t('client.common.none')}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">{t('client.bookingForm.summary.email')}:</span>{' '}
                      <span className="text-offWhite">{values.email || t('client.common.none')}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">{t('client.bookingForm.summary.phone')}:</span>{' '}
                      <span className="text-offWhite">{values.phone || t('client.common.none')}</span>
                    </p>
                    <p>
                      <span className="text-grayLuxury">{t('client.bookingForm.summary.location')}:</span>{' '}
                      <span className="text-offWhite">{values.location || t('client.common.none')}</span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-grayLuxury">{t('client.bookingForm.summary.services')}:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedServices.length ? (
                        selectedServices.map((service) => (
                          <span
                            key={service}
                            className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-offWhite"
                          >
                            {getServiceLabel(service, t)}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-grayLuxury">{t('client.common.none')}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-goldLuxury/20 bg-goldLuxury/8 p-3 text-xs text-grayLuxury">
                    {t('client.bookingForm.summary.finalCheck')}
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
          <p>{t('client.bookingForm.draftNotice')}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentStep > 1 ? (
            <Button type="button" variant="ghost" onClick={goBack}>
              {t('client.bookingForm.actions.back')}
            </Button>
          ) : null}

          {currentStep < TOTAL_STEPS ? (
            <Button type="button" onClick={goNext}>
              {t('client.bookingForm.actions.next')}
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('client.bookingForm.actions.submitting') : resolvedSubmitLabel}
            </Button>
          )}
        </div>
      </section>
    </form>
  );
};
