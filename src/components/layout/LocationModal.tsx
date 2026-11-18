'use client';

import React from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, Check, Navigation } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ open, onClose }) => {
  const { selectedLocation, setSelectedLocation, allLocations } = useLocation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Choose your neighbourhood"
      description="Delivery times, fares and nearby partners update for your area."
      size="sm"
    >
      <div className="space-y-2">
        {allLocations.map((loc) => {
          const selected = loc.id === selectedLocation.id;
          return (
            <button
              key={loc.id}
              onClick={() => {
                setSelectedLocation(loc);
                onClose();
              }}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all ${
                selected
                  ? 'border-brand/30 bg-sage-light'
                  : 'border-border bg-white hover:border-brand/25 hover:bg-ivory-soft'
              }`}
            >
              <span className="flex min-w-0 items-start gap-3">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    selected ? 'bg-brand text-white' : 'bg-ivory text-charcoal-secondary'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-bold text-charcoal">{loc.name}</span>
                  <span className="mt-0.5 block truncate text-[11.5px] text-charcoal-secondary">
                    {loc.landmark} · {loc.subCounty}
                  </span>
                </span>
              </span>
              {selected && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-ivory p-3.5 text-[11.5px] leading-relaxed text-charcoal-secondary">
        <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p>
          Currently serving Greater Ishaka–Bushenyi. More Western Uganda neighbourhoods are being added
          neighbourhood by neighbourhood.
        </p>
      </div>
    </Modal>
  );
};
