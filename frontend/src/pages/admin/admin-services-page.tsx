import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, RefreshCcw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import type { ServiceItemResponse } from '../../types/service';
import type { ServiceFormSchema } from '../../lib/validation';
import { getAllBookings } from '../../services/bookingApi';
import {
  createService,
  deleteService,
  getAdminServices,
  updateService,
} from '../../services/serviceApi';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/modal';
import { ServiceForm } from '../../components/forms/service-form';
import { ConfirmModal } from '../../components/ui/confirm-modal';
import { EmptyState } from '../../components/ui/empty-state';
import { PageHeader } from '../../components/ui/page-header';
import { getServiceCategoryLabel, getServiceLabel } from '../../utils/translationLabels';

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

export const AdminServicesPage = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<ServiceItemResponse[]>([]);
  const [bookingServices, setBookingServices] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceItemResponse | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItemResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    setActionError(null);
    try {
      const [servicesData, bookingsData] = await Promise.all([getAdminServices(), getAllBookings()]);
      setServices(servicesData);
      setBookingServices(bookingsData.flatMap((booking) => booking.requestedServices));
    } catch (err) {
      setError(getErrorMessage(err, t('admin.services.errors.loadServices')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [t]);

  const serviceUsage = useMemo(
    () =>
      services
        .map((service) => ({
          ...service,
          usage: bookingServices.filter((item) => item === service.name).length,
        }))
        .sort((a, b) => b.usage - a.usage),
    [services, bookingServices],
  );

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleSubmit = async (values: ServiceFormSchema) => {
    setActionError(null);
    try {
      if (editing) {
        const updated = await updateService(editing.id, values);
        setServices((current) => current.map((service) => (service.id === updated.id ? updated : service)));
      } else {
        const created = await createService(values);
        setServices((current) => [created, ...current]);
      }

      setOpen(false);
      setEditing(null);
    } catch (err) {
      setActionError(getErrorMessage(err, t('admin.services.errors.saveService')));
    }
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    setActionError(null);
    try {
      await deleteService(serviceToDelete.id);
      setServices((current) => current.filter((service) => service.id !== serviceToDelete.id));
      setServiceToDelete(null);
    } catch (err) {
      setActionError(getErrorMessage(err, t('admin.services.errors.deleteService')));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.services.header.title')}
        description={t('admin.services.header.description')}
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> {t('admin.services.actions.add')}
          </Button>
        }
      />

      {loading ? <Card className="p-6 text-sm text-grayLuxury">{t('admin.services.loading')}</Card> : null}

      {error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm text-rose-200">{error}</p>
          <div className="mt-4">
            <Button variant="ghost" onClick={loadData}>
              <RefreshCcw className="h-4 w-4" /> {t('admin.common.retry')}
            </Button>
          </div>
        </Card>
      ) : null}

      {actionError ? (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">{actionError}</Card>
      ) : null}

      {!loading && !error ? (
        serviceUsage.length === 0 ? (
          <EmptyState
            title={t('admin.services.empty.title')}
            description={t('admin.services.empty.description')}
            action={
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" /> {t('admin.services.actions.add')}
              </Button>
            }
          />
        ) : (
          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="font-display text-2xl text-offWhite">{t('admin.services.catalog.title')}</h2>
              <div className="mt-4 space-y-3">
                {serviceUsage.map((service) => (
                  <div key={service.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-offWhite">{getServiceLabel(service.name, t)}</p>
                        <p className="text-xs text-grayLuxury">{getServiceCategoryLabel(service.category, t)}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                          service.active ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
                        }`}
                      >
                        {service.active ? t('admin.services.status.active') : t('admin.services.status.inactive')}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-200">{service.description}</p>
                    <p className="mt-2 text-xs text-grayLuxury">{t('admin.services.catalog.usageCount', { count: service.usage })}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(service);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" /> {t('admin.common.edit')}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setServiceToDelete(service)}>
                        <Trash2 className="h-4 w-4" /> {t('admin.common.delete')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="font-display text-2xl text-offWhite">{t('admin.services.usagePreview.title')}</h2>
              <div className="mt-4 space-y-2">
                {serviceUsage.slice(0, 8).map((service) => (
                  <div key={`usage-${service.id}`} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-200">{getServiceLabel(service.name, t)}</span>
                      <span className="font-semibold text-goldLuxury">{service.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )
      ) : null}

      <Modal
        open={open}
        title={editing ? t('admin.services.modal.editTitle') : t('admin.services.modal.createTitle')}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <ServiceForm initialValues={editing ?? undefined} onSubmit={handleSubmit} />
      </Modal>

      <ConfirmModal
        open={Boolean(serviceToDelete)}
        title={t('admin.services.deleteConfirm.title')}
        description={t('admin.services.deleteConfirm.description')}
        confirmLabel={t('admin.services.deleteConfirm.confirm')}
        cancelLabel={t('admin.common.cancel')}
        danger
        onCancel={() => setServiceToDelete(null)}
        onConfirm={confirmDeleteService}
      />
    </div>
  );
};
