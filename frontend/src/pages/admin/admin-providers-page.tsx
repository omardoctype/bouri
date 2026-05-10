import { useEffect, useState } from 'react';
import { Pencil, Plus, Power, RefreshCcw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import type { ProviderRequest, ProviderResponse } from '../../types/provider';
import type { ProviderFormSchema } from '../../lib/validation';
import {
  createProvider,
  deleteProvider,
  getAdminProviders,
  toggleAvailability,
  updateProvider,
} from '../../services/providerApi';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/modal';
import { ProviderForm } from '../../components/forms/provider-form';
import { EmptyState } from '../../components/ui/empty-state';
import { ConfirmModal } from '../../components/ui/confirm-modal';
import { PageHeader } from '../../components/ui/page-header';
import { getProviderCategoryLabel } from '../../utils/translationLabels';

const fallbackProviderImage =
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | string | undefined;
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
      return payload.message;
    }
  }
  return fallback;
};

const toProviderRequest = (values: ProviderFormSchema): ProviderRequest => ({
  name: values.name.trim(),
  category: values.category as ProviderRequest['category'],
  city: values.city.trim(),
  description: values.description.trim(),
  priceFrom: values.priceFrom,
  rating: values.rating,
  imageUrl: values.imageUrl.trim(),
  phone: values.phone.trim(),
  instagram: values.instagram.trim(),
  available: values.available,
});

export const AdminProvidersPage = () => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProviderResponse | null>(null);
  const [providerToDelete, setProviderToDelete] = useState<ProviderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadProviders = async () => {
    setLoading(true);
    setError(null);
    setActionError(null);
    try {
      const data = await getAdminProviders();
      setProviders(data);
    } catch (err) {
      setError(getErrorMessage(err, t('admin.providers.errors.loadProviders')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProviders();
  }, [t]);

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (provider: ProviderResponse) => {
    setEditing(provider);
    setOpen(true);
  };

  const confirmDeleteProvider = async () => {
    if (!providerToDelete) return;
    setActionError(null);
    try {
      await deleteProvider(providerToDelete.id);
      setProviders((current) => current.filter((provider) => provider.id !== providerToDelete.id));
      setProviderToDelete(null);
    } catch (err) {
      setActionError(getErrorMessage(err, t('admin.providers.errors.deleteProvider')));
    }
  };

  const handleToggleAvailability = async (provider: ProviderResponse) => {
    setActionError(null);
    try {
      const updated = await toggleAvailability(provider.id, !provider.available);
      setProviders((current) => current.map((item) => (item.id === provider.id ? updated : item)));
    } catch (err) {
      setActionError(getErrorMessage(err, t('admin.providers.errors.toggleAvailability')));
    }
  };

  const handleSubmit = async (values: ProviderFormSchema) => {
    setActionError(null);
    const payload = toProviderRequest(values);

    try {
      if (editing) {
        const updated = await updateProvider(editing.id, payload);
        setProviders((current) => current.map((provider) => (provider.id === updated.id ? updated : provider)));
      } else {
        const created = await createProvider(payload);
        setProviders((current) => [created, ...current]);
      }

      setOpen(false);
      setEditing(null);
    } catch (err) {
      setActionError(getErrorMessage(err, t('admin.providers.errors.saveProvider')));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.providers.header.title')}
        description={t('admin.providers.header.description')}
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> {t('admin.providers.actions.add')}
          </Button>
        }
      />

      {loading ? <Card className="p-6 text-sm text-grayLuxury">{t('admin.providers.loading')}</Card> : null}

      {error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm text-rose-200">{error}</p>
          <div className="mt-4">
            <Button variant="ghost" onClick={loadProviders}>
              <RefreshCcw className="h-4 w-4" /> {t('admin.common.retry')}
            </Button>
          </div>
        </Card>
      ) : null}

      {actionError ? (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">{actionError}</Card>
      ) : null}

      {!loading && !error ? (
        providers.length === 0 ? (
          <EmptyState
            title={t('admin.providers.empty.title')}
            description={t('admin.providers.empty.description')}
            action={
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" /> {t('admin.providers.actions.add')}
              </Button>
            }
          />
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {providers.map((provider) => (
              <Card key={provider.id} className="overflow-hidden p-0">
                <img
                  src={provider.imageUrl || fallbackProviderImage}
                  alt={provider.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-offWhite">{provider.name}</h3>
                      <p className="text-xs text-grayLuxury">
                        {getProviderCategoryLabel(provider.category, t)} - {provider.city}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        provider.available ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
                      }`}
                    >
                      {provider.available ? t('admin.providers.status.available') : t('admin.providers.status.unavailable')}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-200">{provider.description}</p>
                  <p className="mt-2 text-xs text-grayLuxury">
                    {t('admin.providers.card.priceFrom', { value: provider.priceFrom })} - {t('admin.providers.card.rating', { value: provider.rating })}
                  </p>
                  <a
                    href={provider.instagram || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-xs font-semibold text-pinkLuxury hover:underline"
                  >
                    {t('admin.providers.card.instagram')}
                  </a>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(provider)}>
                      <Pencil className="h-4 w-4" /> {t('admin.common.edit')}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleToggleAvailability(provider)}>
                      <Power className="h-4 w-4" /> {provider.available ? t('admin.providers.actions.deactivate') : t('admin.providers.actions.activate')}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setProviderToDelete(provider)}>
                      <Trash2 className="h-4 w-4" /> {t('admin.common.delete')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </section>
        )
      ) : null}

      <Modal
        open={open}
        title={editing ? t('admin.providers.modal.editTitle') : t('admin.providers.modal.createTitle')}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <ProviderForm initialValues={editing ?? undefined} onSubmit={handleSubmit} />
      </Modal>

      <ConfirmModal
        open={Boolean(providerToDelete)}
        title={t('admin.providers.deleteConfirm.title')}
        description={t('admin.providers.deleteConfirm.description')}
        confirmLabel={t('admin.providers.deleteConfirm.confirm')}
        cancelLabel={t('admin.common.cancel')}
        danger
        onCancel={() => setProviderToDelete(null)}
        onConfirm={confirmDeleteProvider}
      />
    </div>
  );
};
