import React from 'react';

interface CurrencyProps {
  amount: number;
  className?: string;
  showPrefix?: boolean;
}

export const Currency: React.FC<CurrencyProps> = ({ 
  amount, 
  className = 'font-semibold', 
  showPrefix = true 
}) => {
  const formatted = Math.round(amount).toLocaleString('en-US');
  return (
    <span className={`inline-flex items-baseline space-x-0.5 tabular-nums ${className}`}>
      {showPrefix && (
        <span className="mr-1 text-[0.72em] font-bold uppercase tracking-wider opacity-60">
          UGX
        </span>
      )}
      <span className="tabular-nums tracking-tight">{formatted}</span>
    </span>
  );
};
