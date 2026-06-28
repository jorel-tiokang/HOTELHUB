"use client";

import { useState, useRef, useCallback } from "react";
import {
  X,
  Plus,
  Trash2,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Car,
  Dumbbell,
  Waves,
  Sprout,
  Martini,
} from "lucide-react";

const PREDEFINED_AMENITIES = [
  { id: "Wifi", label: "Wifi", icon: Wifi },
  { id: "TV", label: "TV", icon: Tv },
  { id: "Climatisation", label: "Climatisation", icon: Wind },
  { id: "Café", label: "Café", icon: Coffee },
  { id: "Parking", label: "Parking", icon: Car },
  { id: "Gym", label: "Salle de sport", icon: Dumbbell },
  { id: "Piscine", label: "Piscine", icon: Waves },
  { id: "Spa", label: "Spa", icon: Sprout },
  { id: "Bar", label: "Minibar", icon: Martini },
];
import type { Chambre, NewChambreFormData } from "../../types/chambre";
import { useCurrencyStore } from "@/store/currencyStore";
import { convertToXAF, getCurrencySymbol } from "@/utils/currency";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddRoomModalProps {
  /** Called with the new room data when the user submits */
  onSave: (data: Omit<Chambre, "id" | "statut">) => void;
  /** Called when the modal is dismissed */
  onClose: () => void;
  /** If provided, the modal pre-fills with this room's data (edit mode) */
  initialData?: Chambre;
}

// ─── Image Preview Strip ──────────────────────────────────────────────────────

interface ImagePreviewProps {
  previews: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
  onRemove: (i: number) => void;
}

function ImagePreviewStrip({
  previews,
  activeIndex,
  onSelect,
  onRemove,
}: ImagePreviewProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
      {previews.map((src, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer
            transition-all duration-200 snap-start
            ${i === activeIndex ? "ring-2 ring-gold scale-105" : "opacity-60 hover:opacity-90"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Photo ${i + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(i);
            }}
            aria-label={`Supprimer photo ${i + 1}`}
            className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/70
              text-white hover:bg-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Image Upload Zone ────────────────────────────────────────────────────────

interface UploadZoneProps {
  previews: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
  onRemove: (i: number) => void;
  onAddFiles: (files: FileList) => void;
}

function ImageUploadZone({
  previews,
  activeIndex,
  onSelect,
  onRemove,
  onAddFiles,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files?.length) onAddFiles(e.dataTransfer.files);
    },
    [onAddFiles],
  );

  return (
    <div className="space-y-3">
      <label className="text-white/50 text-xs uppercase tracking-wider font-semibold block">
        Photos de la chambre
      </label>

      {/* Main preview */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-white/5 border border-white/10">
        {previews.length > 0 ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previews[activeIndex]}
              alt={`Aperçu ${activeIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Nav arrows */}
            {previews.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    onSelect(
                      (activeIndex - 1 + previews.length) % previews.length,
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full
                    bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelect((activeIndex + 1) % previews.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full
                    bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            {/* Counter */}
            <span
              className="absolute top-2 right-2 px-2 py-0.5 rounded-full
              bg-black/50 text-white/80 text-xs backdrop-blur-sm"
            >
              {activeIndex + 1}/{previews.length}
            </span>
            {/* Add more button */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 flex items-center gap-1 px-3 py-1.5
                bg-black/60 hover:bg-black/80 text-white text-xs rounded-lg
                backdrop-blur-sm transition-colors"
            >
              <Plus className="w-3 h-3" />
              Ajouter
            </button>
          </>
        ) : (
          /* Drop zone */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`w-full h-full flex flex-col items-center justify-center gap-3
              cursor-pointer transition-colors
              ${dragging ? "bg-purple/10 border-purple" : "hover:bg-foreground/10"}`}
          >
            <div className="p-3 rounded-full bg-foreground/10">
              <ImagePlus className="w-6 h-6 text-foreground/40" />
            </div>
            <div className="text-center">
              <p className="text-foreground/60 text-sm font-medium">
                Glissez vos photos ici
              </p>
              <p className="text-foreground/30 text-xs mt-1">
                ou cliquez pour sélectionner · JPG, PNG, WEBP
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {previews.length > 0 && (
        <ImagePreviewStrip
          previews={previews}
          activeIndex={activeIndex}
          onSelect={onSelect}
          onRemove={onRemove}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onAddFiles(e.target.files)}
      />
    </div>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold block">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground " +
  "placeholder-foreground/30 text-sm focus:outline-none focus:border-purple transition-colors";

// ─── AddRoomModal ─────────────────────────────────────────────────────────────

export default function AddRoomModal({
  onSave,
  onClose,
  initialData,
}: AddRoomModalProps) {
  const { currency } = useCurrencyStore();
  const currencySymbol = getCurrencySymbol(currency, "fr");
  const isXAF = currency === "XAF";

  const [form, setForm] = useState<NewChambreFormData>({
    numero: initialData ? String(initialData.numero) : "",
    type: initialData?.type ?? "",
    capacite: initialData ? String(initialData.capacite) : "",
    prixParNuit: initialData ? String(initialData.prixParNuit) : "",
    description: initialData?.description ?? "",
    equipements: initialData?.equipements.join(", ") ?? "",
    images: [],
    actif: initialData?.actif ?? true,
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images ?? [],
  );
  const [activePreview, setActivePreview] = useState(0);
  const [errors, setErrors] = useState<
    Partial<Record<keyof NewChambreFormData, string>>
  >({});

  // ── Image handlers ─────────────────────────────────────────────────────────

  const handleAddImages = useCallback((files: FileList) => {
    const newFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!newFiles.length) return;

    setForm((prev) => ({ ...prev, images: [...prev.images, ...newFiles] }));

    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => {
      const updated = [...prev, ...newPreviews];
      setActivePreview(updated.length - 1);
      return updated;
    });
  }, []);

  const handleRemoveImage = useCallback(
    (index: number) => {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(imagePreviews[index]);

      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      setImagePreviews((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        setActivePreview((a) => Math.min(a, Math.max(0, updated.length - 1)));
        return updated;
      });
    },
    [imagePreviews],
  );

  // ── Form validation ────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.numero.trim()) newErrors.numero = "Requis";
    else if (isNaN(Number(form.numero)))
      newErrors.numero = "Doit être un nombre";
    if (!form.type.trim()) newErrors.type = "Requis";
    if (!form.prixParNuit.trim()) newErrors.prixParNuit = "Requis";
    else if (isNaN(Number(form.prixParNuit)))
      newErrors.prixParNuit = "Doit être un nombre";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      numero: Number(form.numero),
      type: form.type.trim(),
      capacite: Number(form.capacite) || 0,
      // If the director is viewing in EUR or USD, convert back to XAF before saving
      prixParNuit: isXAF
        ? Number(form.prixParNuit)
        : Math.round(convertToXAF(Number(form.prixParNuit), currency)),
      description: form.description.trim(),
      equipements: form.equipements
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
      images: imagePreviews, // caller can swap these for uploaded URLs later
      actif: form.actif,
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ── Header ── */}
        <div className="sticky top-0 bg-card z-10 flex items-center justify-between px-4 sm:px-8 py-5 border-b border-foreground/10">
          <h3
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {initialData
              ? `Modifier Chambre ${initialData.numero}`
              : "Nouvelle Chambre"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-foreground/40 hover:text-foreground hover:bg-foreground/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-4 sm:px-8 py-6 space-y-6">
          {/* Image upload — full width, prominent */}
          <ImageUploadZone
            previews={imagePreviews}
            activeIndex={activePreview}
            onSelect={setActivePreview}
            onRemove={handleRemoveImage}
            onAddFiles={handleAddImages}
          />

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Numéro">
              <input
                value={form.numero}
                onChange={(e) => setForm({ ...form, numero: e.target.value })}
                placeholder="101"
                className={`${inputClass} ${errors.numero ? "border-red-400" : ""}`}
              />
              {errors.numero && (
                <p className="text-red-400 text-xs mt-1">{errors.numero}</p>
              )}
            </Field>

            <Field label="Type">
              <input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Simple, Double, Suite…"
                className={`${inputClass} ${errors.type ? "border-red-400" : ""}`}
              />
              {errors.type && (
                <p className="text-red-400 text-xs mt-1">{errors.type}</p>
              )}
            </Field>

            <Field label="Capacité (pers.)">
              <input
                value={form.capacite}
                onChange={(e) => setForm({ ...form, capacite: e.target.value })}
                placeholder="2"
                type="number"
                min={1}
                className={inputClass}
              />
            </Field>

            <Field label={`Prix / nuit (${currencySymbol})`}>
              <input
                value={form.prixParNuit}
                onChange={(e) =>
                  setForm({ ...form, prixParNuit: e.target.value })
                }
                placeholder="85 000"
                type="number"
                min={0}
                className={`${inputClass} ${errors.prixParNuit ? "border-red-400" : ""}`}
              />
              {errors.prixParNuit && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.prixParNuit}
                </p>
              )}
            </Field>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-foreground/10">
            <input
              type="checkbox"
              id="room-actif-checkbox"
              checked={form.actif}
              onChange={(e) => setForm({ ...form, actif: e.target.checked })}
              className="w-5 h-5 accent-purple rounded border-foreground/10 cursor-pointer"
            />
            <label htmlFor="room-actif-checkbox" className="text-foreground text-sm font-semibold cursor-pointer select-none">
              Chambre active (visible dans le catalogue client)
            </label>
          </div>

          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Vue sur piscine, parquet en bois…"
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label="Équipements inclus">
            <div className="flex flex-wrap gap-2 mt-1">
              {PREDEFINED_AMENITIES.map((amenity) => {
                const currentList = form.equipements
                  .split(",")
                  .map((e) => e.trim())
                  .filter(Boolean);
                
                // Match case-insensitively just in case
                const isSelected = currentList.some((e) => e.toLowerCase() === amenity.id.toLowerCase());

                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setForm({
                          ...form,
                          equipements: currentList.filter((e) => e.toLowerCase() !== amenity.id.toLowerCase()).join(", ")
                        });
                      } else {
                        setForm({
                          ...form,
                          equipements: [...currentList, amenity.id].join(", ")
                        });
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border
                      ${isSelected 
                        ? "bg-purple/20 border-purple text-foreground shadow-[0_0_10px_rgba(139,92,246,0.2)]" 
                        : "bg-foreground/5 border-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground hover:border-foreground/10"
                      }`}
                  >
                    <amenity.icon className="w-3.5 h-3.5" />
                    {amenity.label}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        {/* ── Footer ── */}
        <div className="sticky bottom-0 bg-card px-4 sm:px-8 py-5 border-t border-foreground/10 flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-purple hover:bg-purple/90 text-white py-3 rounded-xl
              font-semibold transition-colors shadow-lg shadow-purple/20"
          >
            {initialData
              ? "Sauvegarder les modifications"
              : "Enregistrer la chambre"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-foreground/10 text-foreground/60
              hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
