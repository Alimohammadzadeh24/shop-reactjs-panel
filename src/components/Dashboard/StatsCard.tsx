import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  className 
}) => {
  return (
    <Card className={cn("hover:shadow-md transition-shadow duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-sm font-medium text-muted-foreground">
          {title}
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {typeof value === 'number' ? value.toLocaleString('fa-IR') : value}
        </div>
        {trend && (
          <div className={cn(
            "text-xs flex items-center mt-1",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <span>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-muted-foreground mr-1">از ماه قبل</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;