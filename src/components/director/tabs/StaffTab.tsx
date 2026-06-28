"use client";

import { useState } from "react";
import { Edit3, X } from "lucide-react";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  contact: string;
  status: string;
}

interface StaffTabProps {
  t: (key: string) => string;
  staffMembers: StaffMember[];
}

export default function StaffTab({ t, staffMembers }: StaffTabProps) {
  const [localStaff, setLocalStaff] = useState<StaffMember[]>(staffMembers);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
          {t("staff.title")}
        </h3>
        <div className="space-y-4">
          {localStaff.map((staff) => (
            <div
              key={staff.id}
              className="flex items-center justify-between p-4 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold">
                  {staff.name.charAt(0)}
                </div>
                <div>
                  <p className="text-foreground font-semibold">{staff.name}</p>
                  <p className="text-foreground/50 text-sm">{staff.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-foreground/50 text-sm hidden sm:block">{staff.contact}</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    staff.status === "Actif" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {staff.status}
                </span>
                <button
                  onClick={() => setEditingStaff(staff)}
                  className="p-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-foreground/50 hover:text-foreground transition-colors ml-2"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-charcoal w-full max-w-md rounded-2xl shadow-2xl p-6 border border-foreground/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
                Modifier le profil
              </h3>
              <button onClick={() => setEditingStaff(null)} className="text-foreground/50 hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Nom complet", key: "name" as keyof StaffMember, type: "text" },
                { label: "Rôle", key: "role" as keyof StaffMember, type: "text" },
                { label: "Contact", key: "contact" as keyof StaffMember, type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-foreground/50 text-xs font-semibold uppercase tracking-wider mb-2 block">{label}</label>
                  <input
                    type={type}
                    value={editingStaff[key] as string}
                    onChange={(e) => setEditingStaff({ ...editingStaff, [key]: e.target.value })}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="text-foreground/50 text-xs font-semibold uppercase tracking-wider mb-2 block">Statut</label>
                <select
                  value={editingStaff.status}
                  onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                  className="w-full bg-[#1c1714] border border-foreground/10 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setLocalStaff((prev) => prev.map((s) => (s.id === editingStaff.id ? editingStaff : s)));
                  setEditingStaff(null);
                }}
                className="flex-1 bg-gold hover:bg-gold/90 text-charcoal font-semibold py-3 rounded-xl transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
