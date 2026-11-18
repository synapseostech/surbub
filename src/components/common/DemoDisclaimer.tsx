import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DemoDisclaimerProps {
  type?: 'general' | 'pharmacy' | 'fare';
  className?: string;
}

export const DemoDisclaimer: React.FC<DemoDisclaimerProps> = ({ type = 'general', className }) => {
  if (type === 'pharmacy') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-card border border-amber/30 bg-amber-wash px-4 py-3.5',
          className,
        )}
      >
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-status-warning" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A5A12]">
            Regulatory boundary · NDA
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-charcoal-secondary">
            Published prices and availability indicators are demonstration data reported by each chemist. SUBURB+ does
            not dispense medicines online. Prescription items are available only after in-person verification by a
            licensed pharmacist.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'fare') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-card border border-border bg-sage-soft px-4 py-3.5',
          className,
        )}
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p className="text-[11.5px] leading-relaxed text-charcoal-secondary">
          <strong className="font-bold text-charcoal">Simulated fare model.</strong> Base fare plus a per-kilometre
          rate on estimated road distances across Greater Ishaka–Bushenyi. No live GPS or payment dispatch is active.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-start gap-3 rounded-card border border-border bg-white px-4 py-3.5', className)}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <p className="text-[11.5px] leading-relaxed text-charcoal-secondary">
        <strong className="font-bold text-charcoal">Demonstration platform.</strong> Listings, riders and transactions
        are simulated locally for the Ishaka–Bushenyi preview.
      </p>
    </div>
  );
};
