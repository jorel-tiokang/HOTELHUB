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
  minDate?: Date;
  variant?: "glass" | "solid";
}

export default function DatePicker({ label, selectedDate, onDateChange, minDate, variant = "glass" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative flex-1 ${isOpen ? "z-30" : "z-10"}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-colors
          ${
            variant === "glass"
              ? "bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10"
              : "bg-foreground/5 hover:bg-foreground/10"
          }
        `}
      >
        <CalendarIcon className={`w-4 h-4 shrink-0 ${variant === "glass" ? "text-gold" : "text-purple dark:text-gold"}`} />
        <div className="flex flex-col min-w-0 flex-1">
          <span className={`text-[10px] uppercase tracking-widest font-semibold ${variant === "glass" ? "text-white/50" : "text-foreground/50"}`}>
            {label}
          </span>
          <span className={`text-sm font-medium whitespace-nowrap ${variant === "glass" ? "text-white" : "text-foreground"}`}>
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
          
          <div className={`absolute top-[calc(100%+8px)] left-0 z-50 p-4 rounded-2xl shadow-2xl border
            ${
              variant === "glass"
                ? "bg-[#1c1714] border-white/10"
                : "bg-card border-border"
            }
          `}>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
                setIsOpen(false);
              }}
              disabled={{ before: minDate || new Date(new Date().setHours(0,0,0,0)) }}
              modifiersClassNames={{
                selected: variant === "glass" 
                  ? "bg-gold text-black font-bold rounded-lg hover:bg-gold/90"
                  : "bg-purple dark:bg-gold text-white dark:text-[#1c1714] font-bold rounded-lg hover:opacity-90",
                today: variant === "glass" ? "text-gold font-bold" : "text-purple dark:text-gold font-bold",
              }}
              className={`text-sm
                ${variant === "glass" ? "text-white" : "text-foreground"}
                [&_.rdp-month_caption]:font-bold 
                ${variant === "glass" 
                  ? "[&_.rdp-month_caption]:text-gold [&_.rdp-head_cell]:text-white/50 [&_.rdp-button_next]:text-gold [&_.rdp-button_previous]:text-gold [&_.rdp-day:hover]:bg-white/10"
                  : "[&_.rdp-month_caption]:text-purple dark:[&_.rdp-month_caption]:text-gold [&_.rdp-head_cell]:text-foreground/50 [&_.rdp-button_next]:text-purple dark:[&_.rdp-button_next]:text-gold [&_.rdp-button_previous]:text-purple dark:[&_.rdp-button_previous]:text-gold [&_.rdp-day:hover]:bg-foreground/5"
                }
                [&_.rdp-head_cell]:font-normal [&_.rdp-head_cell]:pb-2.5
                [&_.rdp-day]:rounded-lg [&_.rdp-day]:transition-colors
              `}
            />
          </div>
        </>
      )}
    </div>
  );
}