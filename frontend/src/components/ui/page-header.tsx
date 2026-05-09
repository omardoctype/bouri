import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  kicker?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ title, description, kicker, actions }: PageHeaderProps) => (
  <section className="flex flex-wrap items-end justify-between gap-3">
    <div>
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
      <h1 className="font-display text-3xl text-offWhite sm:text-4xl">{title}</h1>
      {description ? <p className="mt-2 text-sm text-grayLuxury">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
  </section>
);

