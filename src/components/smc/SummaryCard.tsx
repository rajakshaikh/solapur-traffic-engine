import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  variant?: 'default' | 'warning' | 'danger' | 'success';
  onClick?: () => void;
}

const variantStyles = {
  default: {
    icon: "bg-primary/10 text-primary",
    border: "hover:border-primary/30",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    border: "hover:border-warning/30",
  },
  danger: {
    icon: "bg-destructive/10 text-destructive",
    border: "hover:border-destructive/30",
  },
  success: {
    icon: "bg-success/10 text-success",
    border: "hover:border-success/30",
  },
};

export function SummaryCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  onClick 
}: SummaryCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={cn(
        "summary-card group",
        styles.border,
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={cn(
              "mt-2 text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "↓" : "↑"} {trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-11 w-11 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
          styles.icon
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
