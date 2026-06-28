"use client";

import { useMemo } from "react";
import { Country, City } from "country-state-city";

interface HotelSettings {
  nom: string;
  email: string;
  telephone: string;
  pays: string;
  countryCode: string;
  localisation: string;
  location: { lat: number; lng: number };
  adresse: string;
  receptionHoursOpen: string;
  receptionHoursClose: string;
  cancellationPolicy: string;
  description: string;
  images: string;
  actif: boolean;
}

interface SettingsTabProps {
  t: (key: string) => string;
  settings: HotelSettings;
  setSettings: (s: HotelSettings) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  savedSuccess: boolean;
}

export default function SettingsTab({ t, settings, setSettings, onSave, isSaving, savedSuccess }: SettingsTabProps) {
  const countries = useMemo(() => Country.getAllCountries(), []);
  const cities = useMemo(() => {
    if (!settings.countryCode) return [];
    return City.getCitiesOfCountry(settings.countryCode) || [];
  }, [settings.countryCode]);

  const inputClass = "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-purple transition-colors";

  return (
    <div className="max-w-2xl">
      <div className="bg-charcoal/90 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
          {t("settings.title")}
        </h3>
        <div className="space-y-6">

          {/* Nom */}
          <div className="space-y-2">
            <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("settings.hotelName")}</label>
            <input value={settings.nom} onChange={(e) => setSettings({ ...settings, nom: e.target.value })} className={inputClass} />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("settings.contactEmail")}</label>
            <input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className={inputClass} />
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.modal.phone")}</label>
            <input value={settings.telephone} onChange={(e) => setSettings({ ...settings, telephone: e.target.value })} className={inputClass} />
          </div>

          {/* Pays + Ville (Combobox) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">Pays</label>
              <input
                list="countries-list-settings"
                value={settings.pays}
                onChange={(e) => {
                  const val = e.target.value;
                  const found = countries.find((c) => c.name === val);
                  const isNewCountry = found && found.isoCode !== settings.countryCode;
                  setSettings({
                    ...settings,
                    pays: val,
                    ...(found && { countryCode: found.isoCode }),
                    ...(isNewCountry && { localisation: "", location: { lat: 0, lng: 0 } }),
                  });
                }}
                placeholder="Rechercher un pays..."
                className={inputClass}
              />
              <datalist id="countries-list-settings">
                {countries.map((c) => <option key={c.isoCode} value={c.name} />)}
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">Ville</label>
              <input
                list="cities-list-settings"
                value={settings.localisation}
                disabled={!settings.countryCode}
                onChange={(e) => {
                  const val = e.target.value;
                  const found = cities.find((c) => c.name === val);
                  setSettings({
                    ...settings,
                    localisation: val,
                    ...(found && { location: { lat: Number(found.latitude) || 0, lng: Number(found.longitude) || 0 } }),
                  });
                }}
                placeholder={settings.countryCode ? "Rechercher une ville..." : "Sélectionnez un pays d'abord"}
                className={`${inputClass} disabled:opacity-50`}
              />
              <datalist id="cities-list-settings">
                {cities.map((c) => <option key={c.name} value={c.name} />)}
              </datalist>
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">Adresse complète</label>
            <input value={settings.adresse} onChange={(e) => setSettings({ ...settings, adresse: e.target.value })} className={inputClass} />
          </div>

          {/* Heures de réception */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">Heure d'ouverture</label>
              <input type="time" value={settings.receptionHoursOpen} onChange={(e) => setSettings({ ...settings, receptionHoursOpen: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">Heure de fermeture</label>
              <input type="time" value={settings.receptionHoursClose} onChange={(e) => setSettings({ ...settings, receptionHoursClose: e.target.value })} className={inputClass} />
            </div>
          </div>

          {/* Politique d'annulation */}
          <div className="space-y-2">
            <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">Politique d'annulation et de remboursement</label>
            <textarea value={settings.cancellationPolicy} onChange={(e) => setSettings({ ...settings, cancellationPolicy: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">Description de l'hôtel</label>
            <textarea value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} rows={4} className={`${inputClass} resize-none`} />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">Images (séparées par des virgules)</label>
            <input value={settings.images} onChange={(e) => setSettings({ ...settings, images: e.target.value })} placeholder="https://image1.jpg, https://image2.jpg" className={inputClass} />
          </div>

          {/* Actif toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="actif-checkbox-settings"
              checked={settings.actif}
              onChange={(e) => setSettings({ ...settings, actif: e.target.checked })}
              className="w-5 h-5 accent-purple rounded border-foreground/10 cursor-pointer"
            />
            <label htmlFor="actif-checkbox-settings" className="text-foreground text-sm font-semibold cursor-pointer select-none">
              Hôtel actif sur le catalogue (visible pour les clients)
            </label>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4 pt-4 border-t border-foreground/10">
            <button
              onClick={onSave}
              disabled={isSaving}
              className="bg-purple hover:bg-purple/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {isSaving ? "Enregistrement..." : t("settings.save")}
            </button>
            {savedSuccess && (
              <span className="text-emerald-500 text-sm font-semibold animate-in fade-in">Modifications enregistrées !</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
