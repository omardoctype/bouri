import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = ({ label, className, ...props }: CheckboxProps) => (
  <label
    className={cn(
      'flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-offWhite transition-all duration-200 hover:border-goldLuxury/40 hover:bg-white/[0.08]',
      className,
    )}
  >
    <input type="checkbox" className="h-4 w-4 accent-goldLuxury" {...props} />
    <span>{label}</span>
  </label>
);

