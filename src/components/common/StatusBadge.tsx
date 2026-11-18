import React from 'react';
import { Badge } from '@/components/ui/Badge';

type Tone = 'brand' | 'sage' | 'amber' | 'neutral' | 'success' | 'warning' | 'error';

interface StatusBadgeProps {
  status: string;
  customClass?: string;
}

const LABELS: Record<string, string> = {
  placed: 'Order placed',
  confirmed_by_merchant: 'Merchant confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  scheduled: 'Scheduled',
  pickup: 'Pickup',
  ready: 'Ready',
  ready_for_pickup: 'Ready for pickup',
  in_progress: 'In progress',
  washing: 'Washing',
  ironing: 'Ironing',
  in_stock: 'In stock',
  limited_stock: 'Limited stock',
  out_of_stock: 'Out of stock',
  available: 'Available',
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  completed: 'Completed',
  assigned: 'Assigned',
  arriving: 'Arriving',
  accepted: 'Accepted',
  online: 'Online',
  offline: 'Offline',
};

const labelFor = (status: string) => {
  const key = status.toLowerCase().trim();
  if (LABELS[key]) return LABELS[key];
  const words = status.replace(/_/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const toneFor = (status: string): Tone => {
  const value = status.toLowerCase();

  if (
    value.includes('delivered') ||
    value.includes('completed') ||
    value.includes('in stock') ||
    value.includes('available') ||
    value.includes('approved') ||
    value.includes('confirmed') ||
    value === 'accepted'
  ) {
    return 'success';
  }

  if (
    value.includes('progress') ||
    value.includes('out_for') ||
    value.includes('preparing') ||
    value.includes('washing') ||
    value.includes('arriving') ||
    value.includes('assigned') ||
    value.includes('limited') ||
    value.includes('pending')
  ) {
    return 'warning';
  }

  if (value.includes('cancel') || value.includes('rejected') || value.includes('out of stock')) {
    return 'error';
  }

  if (value.includes('placed') || value.includes('scheduled') || value.includes('pickup') || value.includes('ready')) {
    return 'sage';
  }

  return 'neutral';
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, customClass }) => {
  if (customClass) {
    return (
      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${customClass}`}>
        {labelFor(status)}
      </span>
    );
  }

  return <Badge tone={toneFor(status)}>{labelFor(status)}</Badge>;
};
