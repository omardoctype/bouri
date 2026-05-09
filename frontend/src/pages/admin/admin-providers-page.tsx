import { useEffect, useState } from 'react';
import { Pencil, Plus, Power, RefreshCcw, Trash2 } from 'lucide-react';
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

const fallbackProviderImage =
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80';

const categoryLabel: Record<string, string> = {
  PHOTOGRAPHE: 'Photographe',
  DJ: 'DJ',
  BAND: 'Band',
  ARTISTE: 'Artiste',
  DECORATION: 'Decoration',
  VIDEASTE: 'Videaste',
  SON_LUMIERE: 'Son & lumiere',
  SALLE: 'Salle',
  ANIMATION: 'Animation',
};

const toCategoryLabel = (value: string) => categoryLabel[value] ?? value;

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
      setError(getErrorMessage(err, 'Impossible de charger les prestataires.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

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
      setActionError(getErrorMessage(err, 'Suppression du prestataire impossible.'));
    }
  };

  const handleToggleAvailability = async (provider: ProviderResponse) => {
    setActionError(null);
    try {
      const updated = await toggleAvailability(provider.id, !provider.available);
      setProviders((current) => current.map((item) => (item.id === provider.id ? updated : item)));
    } catch (err) {
      setActionError(getErrorMessage(err, 'Impossible de modifier la disponibilite.'));
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
      setActionError(getErrorMessage(err, "Impossible d'enregistrer le prestataire."));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prestataires"
        description="CRUD complet, disponibilite et contenu social."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Ajouter prestataire
          </Button>
        }
      />

      {loading ? <Card className="p-6 text-sm text-grayLuxury">Chargement des prestataires...</Card> : null}

      {error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm text-rose-200">{error}</p>
          <div className="mt-4">
            <Button variant="ghost" onClick={loadProviders}>
              <RefreshCcw className="h-4 w-4" /> Reessayer
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
            title="Aucun prestataire"
            description="Commencez par ajouter un premier prestataire a votre reseau."
            action={
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" /> Ajouter prestataire
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
                        {toCategoryLabel(provider.category)} - {provider.city}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        provider.available ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
                      }`}
                    >
                      {provider.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-200">{provider.description}</p>
                  <p className="mt-2 text-xs text-grayLuxury">
                    A partir de {provider.priceFrom} DT - Note {provider.rating}/5
                  </p>
                  <a
                    href={provider.instagram || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-xs font-semibold text-pinkLuxury hover:underline"
                  >
                    Instagram
                  </a>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(provider)}>
                      <Pencil className="h-4 w-4" /> Editer
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleToggleAvailability(provider)}>
                      <Power className="h-4 w-4" /> {provider.available ? 'Desactiver' : 'Activer'}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setProviderToDelete(provider)}>
                      <Trash2 className="h-4 w-4" /> Supprimer
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
        title={editing ? 'Modifier prestataire' : 'Ajouter prestataire'}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <ProviderForm initialValues={editing ?? undefined} onSubmit={handleSubmit} />
      </Modal>

      <ConfirmModal
        open={Boolean(providerToDelete)}
        title="Supprimer le prestataire"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer ce prestataire ?"
        confirmLabel="Supprimer"
        danger
        onCancel={() => setProviderToDelete(null)}
        onConfirm={confirmDeleteProvider}
      />
    </div>
  );
};

