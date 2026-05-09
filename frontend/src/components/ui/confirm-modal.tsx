import { Modal } from './modal';
import { Button } from './button';

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
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  danger = false,
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) => (
  <Modal open={open} title={title} onClose={onCancel} className="max-w-lg">
    <p className="text-sm text-grayLuxury">{description}</p>
    <div className="mt-5 flex justify-end gap-2">
      <Button variant="ghost" onClick={onCancel} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={loading}>
        {loading ? 'Traitement...' : confirmLabel}
      </Button>
    </div>
  </Modal>
);

