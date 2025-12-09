import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function StatCard({ title, value, icon: Icon, variant = 'default' }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              variant === 'primary' && 'bg-primary/10 text-primary',
              variant === 'success' && 'bg-success/10 text-success',
              variant === 'warning' && 'bg-warning/10 text-warning',
              variant === 'default' && 'bg-muted text-muted-foreground'
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
