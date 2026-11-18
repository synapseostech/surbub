'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, Info, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

type ToastTone = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  title: string;
  message?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (title: string, message?: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const toneStyles = {
  success: 'bg-brand text-white',
  error: 'bg-status-error text-white',
  info: 'bg-brand-secondary text-white',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (title: string, message?: string, tone: ToastTone = 'success') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev.slice(-2), { id, title, message, tone }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-5 sm:items-end">
        {toasts.map((t) => {
          const Icon = icons[t.tone];
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-white/10 bg-white p-3.5 shadow-float animate-scale-in"
            >
              <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', toneStyles[t.tone])}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-label font-bold text-charcoal">{t.title}</p>
                {t.message && <p className="mt-0.5 text-[12px] leading-snug text-charcoal-secondary">{t.message}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="rounded-lg p-1 text-charcoal-muted transition-colors hover:bg-ivory hover:text-charcoal"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
