import React from 'react';
import { Clock, CheckCircle2, CookingPot, PackageCheck, AlertCircle, XCircle } from 'lucide-react';

export const OrderStatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: Clock,
          label: 'Order Placed'
        };
      case 'Accepted':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          icon: CheckCircle2,
          label: 'Order Confirmed'
        };
      case 'Preparing':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          icon: CookingPot,
          label: 'Preparing'
        };
      case 'Ready':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 animate-pulse',
          icon: PackageCheck,
          label: 'Ready for Pickup'
        };
      case 'Collected':
        return {
          bg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',
          icon: CheckCircle2,
          label: 'Food Collected'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: XCircle,
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          icon: AlertCircle,
          label: status
        };
    }
  };

  const config = getBadgeStyle();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
