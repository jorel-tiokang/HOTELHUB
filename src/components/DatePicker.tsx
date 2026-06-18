"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Base styles

interface DatePickerProps {
  label: string;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export default function DatePicker({ label, selectedDate, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative flex-1 ${isOpen ? "z-30" : "z-10"}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 w-full text-left
          bg-white/10 dark:bg-white/5 rounded-xl
          hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
      >
        <CalendarIcon className="w-4 h-4 text-gold shrink-0" />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">
            {label}
          </span>
          <span className="text-white text-sm font-medium whitespace-nowrap">
            {selectedDate ? format(selectedDate, "PPP") : "Sélectionner une date"}
          </span>
        </div>
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <>
          {/* Invisible backdrop to close calendar when clicking outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div className="absolute top-[calc(100%+8px)] left-0 z-50 p-4 
            bg-[#1c1714] border border-white/10 rounded-2xl shadow-2xl">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
                setIsOpen(false);
              }}
              modifiersClassNames={{
                selected: "bg-gold text-black font-bold rounded-lg hover:bg-gold/90",
                today: "text-gold font-bold",
              }}
              className="text-white text-sm
                [&_.rdp-month_caption]:text-gold [&_.rdp-month_caption]:font-bold
                [&_.rdp-head_cell]:text-white/50 [&_.rdp-head_cell]:font-normal [&_.rdp-head_cell]:pb-2.5
                [&_.rdp-button_next]:text-gold [&_.rdp-button_previous]:text-gold"
            />
          </div>
        </>
      )}
    </div>
  );
}