"use client";

import { Plus, Search } from "lucide-react";
import RoomCard from "@/src/components/RoomCard";
import AddRoomModal from "@/src/components/AddRoomModal";
import type { Chambre } from "@/types/chambre";
import type { Room } from "@/services/hotel";
import { useState } from "react";

interface RoomsTabProps {
  t: (key: string) => string;
  chambres: Chambre[];
  hotelId: string;
  addRoom: (hotelId: string, room: Room) => void;
  updateRoom: (hotelId: string, room: Room) => void;
  deleteRoom: (hotelId: string, roomId: string) => void;
  toggleRoomStatus: (hotelId: string, roomId: string) => void;
}

export default function RoomsTab({
  t,
  chambres,
  hotelId,
  addRoom,
  updateRoom,
  deleteRoom,
  toggleRoomStatus,
}: RoomsTabProps) {
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Chambre | null>(null);
  const [roomSearchQuery, setRoomSearchQuery] = useState("");

  const filteredRooms = chambres.filter(
    (room) =>
      room.type.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
      room.numero.toString().includes(roomSearchQuery) ||
      (room.description && room.description.toLowerCase().includes(roomSearchQuery.toLowerCase()))
  );

  const toggleStatut = (id: string) => toggleRoomStatus(hotelId, id);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddRoom(true)}
          className="flex items-center gap-2 bg-purple hover:bg-purple/90 text-white px-5 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-purple/20"
        >
          <Plus className="w-5 h-5" />
          {t("rooms.addRoom")}
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-charcoal border border-foreground/10 shadow-sm rounded-xl px-4 py-3">
        <Search className="w-4 h-4 text-foreground/50" />
        <input
          value={roomSearchQuery}
          onChange={(e) => setRoomSearchQuery(e.target.value)}
          placeholder="Rechercher une chambre par numéro, type..."
          className="bg-transparent text-foreground placeholder-foreground/40 text-sm outline-none flex-1"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onEdit={(room) => setEditingRoom(room)}
            onDelete={(id) => deleteRoom(hotelId, id)}
            onToggleStatut={toggleStatut}
          />
        ))}
      </div>

      {showAddRoom && (
        <AddRoomModal
          onSave={(data) => {
            const newRoom: Room = {
              ...data,
              id: `r-${Date.now()}`,
              hotelId,
              statut: "DISPONIBLE",
            };
            addRoom(hotelId, newRoom);
            setShowAddRoom(false);
          }}
          onClose={() => setShowAddRoom(false)}
        />
      )}

      {editingRoom && (
        <AddRoomModal
          initialData={editingRoom}
          onSave={(data) => {
            updateRoom(hotelId, {
              ...data,
              id: editingRoom.id,
              hotelId,
              statut: editingRoom.statut,
            });
            setEditingRoom(null);
          }}
          onClose={() => setEditingRoom(null)}
        />
      )}
    </div>
  );
}
