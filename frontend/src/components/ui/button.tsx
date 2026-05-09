import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:
    'border border-goldLuxury/45 bg-gradient-to-r from-goldLuxury via-pinkLuxury to-purpleLuxury text-offWhite shadow-glow hover:-translate-y-0.5 hover:brightness-110',
  secondary:
    'border border-goldLuxury/45 bg-gradient-to-r from-goldLuxury/20 via-goldLuxury/10 to-transparent text-goldLuxury hover:-translate-y-0.5 hover:bg-goldLuxury/20',
  ghost: 'border border-white/15 bg-white/5 text-offWhite hover:-translate-y-0.5 hover:bg-white/10',
  danger: 'border border-red-500/45 bg-red-500/15 text-red-200 hover:-translate-y-0.5 hover:bg-red-500/25',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-10 px-3.5 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', fullWidth = false, type = 'button', asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goldLuxury/45 focus-visible:ring-offset-2 focus-visible:ring-offset-blackLuxury disabled:cursor-not-allowed disabled:opacity-60',
          variantClass[variant],
          sizeClass[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

