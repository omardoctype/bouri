import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

interface Item {
  label: string;
  value: number;
}

interface BarListProps {
  title: string;
  items: Item[];
  tone?: 'purple' | 'gold';
}

export const BarList = ({ title, items, tone = 'purple' }: BarListProps) => {
  const max = Math.max(...items.map((item) => item.value), 1);
  const gradient =
    tone === 'purple'
      ? 'from-purpleLuxury/90 via-pinkLuxury/70 to-goldLuxury/80'
      : 'from-goldLuxury/90 via-yellow-500/70 to-pinkLuxury/70';

  return (
    <Card>
      <h3 className="font-display text-xl text-offWhite">{title}</h3>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-gray-200">{item.label}</span>
              <span className="font-semibold text-offWhite">{item.value}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div
                className={cn('h-2 rounded-full bg-gradient-to-r transition-all duration-700', gradient)}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

