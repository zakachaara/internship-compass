import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatCard({ label, value, subtitle, icon: Icon }: Props) {
  return (
    <div className="glass-card rounded-lg p-4 stat-glow animate-scale-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}
