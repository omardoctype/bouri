import { ArrowUpRight } from 'lucide-react';
import { Card } from './card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export const StatCard = ({ title, value, subtitle }: StatCardProps) => (
  <Card className="relative overflow-hidden p-5">
    <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-purpleLuxury/25 blur-2xl" />
    <div className="absolute -left-5 bottom-0 h-16 w-16 rounded-full bg-goldLuxury/15 blur-2xl" />
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-grayLuxury">{title}</p>
    <p className="mt-3 font-display text-3xl text-offWhite">{value}</p>
    {subtitle ? (
      <p className="mt-2 inline-flex items-center gap-1 text-xs text-grayLuxury">
        <ArrowUpRight className="h-3.5 w-3.5 text-goldLuxury" />
        {subtitle}
      </p>
    ) : null}
  </Card>
);

