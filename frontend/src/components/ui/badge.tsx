import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { getBookingStatusLabel } from '../../utils/translationLabels';

const statusClassMap: Record<string, string> = {
  NOUVELLE_DEMANDE: 'bg-blue-500/15 text-blue-200 border-blue-500/30',
  EN_COURS: 'bg-purpleLuxury/20 text-purple-200 border-purpleLuxury/35',
  OFFRE_ENVOYEE: 'bg-yellow-500/15 text-yellow-200 border-yellow-500/30',
  CONFIRMEE: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
  ANNULEE: 'bg-rose-500/15 text-rose-200 border-rose-500/30',
  'Nouvelle demande': 'bg-blue-500/15 text-blue-200 border-blue-500/30',
  'En cours': 'bg-purpleLuxury/20 text-purple-200 border-purpleLuxury/35',
  'Offre envoyee': 'bg-yellow-500/15 text-yellow-200 border-yellow-500/30',
  Confirmee: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
  Annulee: 'bg-rose-500/15 text-rose-200 border-rose-500/30'
};

const defaultStatusClass = 'bg-white/10 text-offWhite border-white/20';

export const StatusBadge = ({ status, className }: { status: string; className?: string }) => {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        statusClassMap[status] ?? defaultStatusClass,
        className
      )}
    >
      {getBookingStatusLabel(status, t) || status}
    </span>
  );
};

export const PillBadge = ({ text, className }: { text: string; className?: string }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs font-medium text-offWhite',
      className
    )}
  >
    {text}
  </span>
);
