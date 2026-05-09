import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('glass-card p-5 transition-all duration-300 sm:p-6', className)} {...props} />
);

