const parseDate = (value: string) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value: string) => {
  const date = parseDate(value);
  if (!date) return '-';
  return new Intl.DateTimeFormat('fr-TN', { dateStyle: 'medium' }).format(date);
};

export const formatDateTime = (value: string) => {
  const date = parseDate(value);
  if (!date) return '-';
  return new Intl.DateTimeFormat('fr-TN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export const formatBudgetLabel = (value: string | null | undefined) => value?.trim() || 'Non specifie';

export const formatBudgetValue = (value: number | null | undefined) => {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return 'Non estime';
  }
  return formatCurrency(value);
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

