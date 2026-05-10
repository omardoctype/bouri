import { Modal } from './modal';
import { Button } from './button';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  danger = false,
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  const { t } = useTranslation();
  const finalConfirmLabel = confirmLabel || t('admin.common.confirm');
  const finalCancelLabel = cancelLabel || t('admin.common.cancel');

  return (
    <Modal open={open} title={title} onClose={onCancel} className="max-w-lg">
      <p className="text-sm text-grayLuxury">{description}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          {finalCancelLabel}
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={loading}>
          {loading ? t('admin.common.processing') : finalConfirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
