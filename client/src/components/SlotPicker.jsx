import React from 'react';
import { Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';

export const SlotPicker = ({ slots = [], selectedSlot, onSelectSlot }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" /> Select Pickup Time Slot
        </label>
        <span className="text-xs text-slate-400">
          Morning / Afternoon / Evening
        </span>
      </div>

      {slots.length === 0 ? (
        <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center text-slate-400 text-sm">
          No pickup slots available right now. Please check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {slots.map((slot) => {
            const isFull = slot.bookedCount >= slot.capacity;
            const isSelected = selectedSlot?._id === slot._id;
            const availableSeats = Math.max(0, slot.capacity - slot.bookedCount);

            return (
              <button
                key={slot._id}
                type="button"
                disabled={isFull || !slot.isActive}
                onClick={() => onSelectSlot(slot)}
                className={`relative p-3.5 rounded-xl border text-left transition-all ${
                  isFull || !slot.isActive
                    ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/50 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-800/60 border-slate-700/70 hover:border-indigo-500/50 hover:bg-slate-800 text-slate-300'
                }`}
              >
                {isSelected && (
                  <CheckCircle className="w-4 h-4 text-indigo-400 absolute top-2 right-2" />
                )}

                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wide text-indigo-300 font-bold">
                    {slot.category || 'Pickup'}
                  </span>
                </div>

                <div className="font-bold text-sm mb-1 text-white">
                  {slot.startTime} - {slot.endTime}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3 h-3" />
                    {slot.bookedCount}/{slot.capacity}
                  </span>

                  {isFull ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
                      FULL
                    </span>
                  ) : availableSeats <= 3 ? (
                    <span className="text-amber-400 font-semibold text-[10px] flex items-center gap-0.5">
                      <AlertTriangle className="w-3 h-3" /> {availableSeats} left
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium text-[10px]">
                      Available
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SlotPicker;
