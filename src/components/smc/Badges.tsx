import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white",
        priority === 'high' && "bg-priority-high",
        priority === 'medium' && "bg-priority-medium",
        priority === 'low' && "bg-priority-low",
        className
      )}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'new' | 'approved' | 'enforced' | 'ignored';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const labels = {
    new: 'New',
    approved: 'Approved',
    enforced: 'Enforced',
    ignored: 'Ignored',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white",
        status === 'new' && "bg-status-new",
        status === 'approved' && "bg-status-approved",
        status === 'enforced' && "bg-status-enforced",
        status === 'ignored' && "bg-status-ignored",
        className
      )}
    >
      {labels[status]}
    </span>
  );
}

interface TrendBadgeProps {
  trend: 'increasing' | 'stable' | 'reducing';
  className?: string;
}

export function TrendBadge({ trend, className }: TrendBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
        trend === 'increasing' && "bg-destructive/10 text-destructive",
        trend === 'stable' && "bg-warning/10 text-warning",
        trend === 'reducing' && "bg-success/10 text-success",
        className
      )}
    >
      {trend === 'increasing' && '↑'}
      {trend === 'stable' && '→'}
      {trend === 'reducing' && '↓'}
      {trend.charAt(0).toUpperCase() + trend.slice(1)}
    </span>
  );
}

interface AlertTypeBadgeProps {
  type: 'watch' | 'act';
  className?: string;
}

export function AlertTypeBadge({ type, className }: AlertTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white",
        type === 'watch' && "bg-warning",
        type === 'act' && "bg-destructive animate-pulse-slow",
        className
      )}
    >
      {type === 'watch' ? 'Watch' : 'Act Now'}
    </span>
  );
}
