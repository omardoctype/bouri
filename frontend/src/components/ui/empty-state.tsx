import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Card } from './card';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <Card className="p-6 text-center">
    <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/5">
      <Inbox className="h-5 w-5 text-goldLuxury" />
    </span>
    <h3 className="mt-4 font-display text-2xl text-offWhite">{title}</h3>
    <p className="mt-2 text-sm text-grayLuxury">{description}</p>
    {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
  </Card>
);

