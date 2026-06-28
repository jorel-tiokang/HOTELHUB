"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { useHotelsStore } from "@/store/hotelsStore";
import { useReservationStore } from "@/store/reservationStore";
import { useMessagesStore } from "@/store/messagesStore";
import * as bookingService from "@/src/services/bookingService";
import * as reviewService from "@/src/services/reviewService";
import type { BackendReviewDTO } from "@/services/api.types";
import type { Chambre } from "@/types/chambre";
import { ThemeToggle } from "@/src/components/Header";
import LanguageToggle from "@/src/components/LanguageToggle";
import CurrencyToggle from "@/src/components/CurrencyToggle";
import {
  mockDirecteurHotel,
  weeklyOccupancyData,
  staffMembers,
} from "@/mocks/dashboardMocks";
import {
  LayoutDashboard, BedDouble, CalendarCheck, BarChart3,
  Star, Users, Settings, Bell, Menu, MessageSquare, CalendarRange
} from "lucide-react";

// Sub-components
import DashboardSidebar from "@/src/components/director/shared/DashboardSidebar";
import OverviewTab from "@/src/components/director/tabs/OverviewTab";
import RoomsTab from "@/src/components/director/tabs/RoomsTab";
import BookingsTab from "@/src/components/director/tabs/BookingsTab";
import ReviewsTab from "@/src/components/director/tabs/ReviewsTab";
import StatisticsTab from "@/src/components/director/tabs/StatisticsTab";
import StaffTab from "@/src/components/director/tabs/StaffTab";
import SettingsTab from "@/src/components/director/tabs/SettingsTab";
import GanttCalendarTab from "@/src/components/director/tabs/GanttCalendarTab";
import MessagesTab from "@/src/components/shared/MessagesTab";

type Tab = "overview" | "rooms" | "bookings" | "calendar" | "reviews" | "statistics" | "staff" | "settings" | "messages";

export default function DirectorDashboard() {
  const t = useTranslations("directeurDashboard");
  const { user, logout, directors } = useAuthStore();
  const { currency } = useCurrencyStore();
  const { getUnreadCount, messages } = useMessagesStore();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isSidebarExpanded = sidebarHovered || isMobileMenuOpen;

  const { addRoom, updateRoom, deleteRoom, toggleRoomStatus, getHotelRooms, updateHotel } = useHotelsStore();
  const DIRECTOR_HOTEL_ID = (user as any)?.hotelId ?? (user as any)?.assigned_hotel_id ?? "h1";
  const chambres = getHotelRooms(DIRECTOR_HOTEL_ID) as Chambre[];

  const { bookings, fetchHotelBookings } = useReservationStore();
  const [directorReviews, setDirectorReviews] = useState<BackendReviewDTO[]>([]);

  useEffect(() => {
    fetchHotelBookings(DIRECTOR_HOTEL_ID);
    reviewService.getReviewsForHotel(DIRECTOR_HOTEL_ID).then(setDirectorReviews);
  }, [DIRECTOR_HOTEL_ID, fetchHotelBookings]);

  // Settings state
  const [hotelSettings, setHotelSettings] = useState({
    nom: mockDirecteurHotel.nom,
    email: mockDirecteurHotel.email,
    telephone: mockDirecteurHotel.telephone,
    pays: (mockDirecteurHotel as any).pays || "Cameroun",
    countryCode: (mockDirecteurHotel as any).countryCode || "CM",
    localisation: mockDirecteurHotel.localisation,
    location: (mockDirecteurHotel as any).location || { lat: 4.0511, lng: 9.7679 },
    adresse: (mockDirecteurHotel as any).adresse || "",
    receptionHoursOpen: (mockDirecteurHotel as any).receptionHours?.open || "00:00",
    receptionHoursClose: (mockDirecteurHotel as any).receptionHours?.close || "23:59",
    cancellationPolicy: (mockDirecteurHotel as any).cancellationPolicy || "",
    description: (mockDirecteurHotel as any).description || "",
    images: (mockDirecteurHotel as any).images?.join(", ") || "",
    actif: (mockDirecteurHotel as any).actif ?? true,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsSavedSuccess(false);
    await new Promise((resolve) => setTimeout(resolve, 600));
    mockDirecteurHotel.nom = hotelSettings.nom;
    mockDirecteurHotel.email = hotelSettings.email;
    mockDirecteurHotel.telephone = hotelSettings.telephone;
    (mockDirecteurHotel as any).pays = hotelSettings.pays;
    (mockDirecteurHotel as any).countryCode = hotelSettings.countryCode;
    mockDirecteurHotel.localisation = hotelSettings.localisation;
    (mockDirecteurHotel as any).location = hotelSettings.location;
    (mockDirecteurHotel as any).adresse = hotelSettings.adresse;
    (mockDirecteurHotel as any).receptionHours = { open: hotelSettings.receptionHoursOpen, close: hotelSettings.receptionHoursClose };
    (mockDirecteurHotel as any).cancellationPolicy = hotelSettings.cancellationPolicy;
    (mockDirecteurHotel as any).description = hotelSettings.description;
    (mockDirecteurHotel as any).images = hotelSettings.images.split(",").map((i: string) => i.trim()).filter(Boolean);
    (mockDirecteurHotel as any).actif = hotelSettings.actif;
    updateHotel(DIRECTOR_HOTEL_ID, {
      name: hotelSettings.nom,
      country: hotelSettings.pays,
      countryCode: hotelSettings.countryCode,
      city: hotelSettings.localisation,
      location: hotelSettings.location,
      address: hotelSettings.adresse,
      description: hotelSettings.description,
      cancellationPolicy: hotelSettings.cancellationPolicy,
      receptionHours: { open: hotelSettings.receptionHoursOpen, close: hotelSettings.receptionHoursClose },
      actif: hotelSettings.actif,
      images: hotelSettings.images.split(",").map((i: string) => i.trim()).filter(Boolean),
    });
    setIsSavingSettings(false);
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 3000);
  };

  const handleBookingAction = async (bookingRef: string, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
    try {
      await bookingService.updateBookingStatus(bookingRef, status);
      await fetchHotelBookings(DIRECTOR_HOTEL_ID);
    } catch (err) {
      console.error("Failed to update booking:", err);
    }
  };

  const handleReplyReview = async (reviewId: string, text: string) => {
    try {
      const updated = await reviewService.replyToReview(reviewId, text, chambres[0]?.hotelId || DIRECTOR_HOTEL_ID);
      setDirectorReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
    } catch (err) {
      console.error("Failed to reply to review:", err);
    }
  };

  // Messages Integration
  const currentUser = { id: user?.id || "u-dir", name: user?.nom || "Directeur", role: "Directeur" };
  const pdgContact = { id: "u-pdg-001", name: t("messages.pdgName"), role: "PDG", avatarInitial: "P" };
  const otherDirectors = directors.filter(d => d.id !== currentUser.id).map(d => ({
    id: d.id,
    name: d.nom,
    role: "Directeur",
    avatarInitial: d.nom.charAt(0)
  }));

  // Unique clients from bookings
  const clientContacts = Array.from(new Map(bookings.map(b => [b.clientId, b])).values())
    .map(b => ({
      id: b.clientId,
      name: b.clientName || "Client",
      role: "Client",
      avatarInitial: (b.clientName || "C").charAt(0).toUpperCase()
    }));

  const baseContacts = [pdgContact, ...clientContacts, ...otherDirectors];
  const messageContacts = [...baseContacts];
  const contactIds = new Set(baseContacts.map(c => c.id));

  // Add any client who sent a message but hasn't booked yet
  const chatIds = new Set(
    messages
      .filter(m => m.senderId === currentUser.id || m.receiverId === currentUser.id)
      .map(m => m.senderId === currentUser.id ? m.receiverId : m.senderId)
  );

  chatIds.forEach(id => {
    if (!contactIds.has(id)) {
      messageContacts.push({
        id,
        name: "Client (Nouveau)",
        role: "Client",
        avatarInitial: "C"
      });
      contactIds.add(id);
    }
  });
  const unreadMessagesCount = getUnreadCount(currentUser.id);

  const navItems = [
    { id: "overview", label: t("nav.overview"), icon: LayoutDashboard },
    { id: "rooms", label: t("nav.rooms"), icon: BedDouble },
    { id: "bookings", label: t("nav.bookings"), icon: CalendarCheck },
    { id: "calendar", label: t("nav.calendar") || "Calendrier", icon: CalendarRange },
    { id: "statistics", label: t("nav.statistics"), icon: BarChart3 },
    { id: "reviews", label: t("nav.reviews"), icon: Star },
    { id: "staff", label: t("nav.staff"), icon: Users },
    { id: "messages", label: t("nav.messages"), icon: MessageSquare, unreadCount: unreadMessagesCount },
    { id: "settings", label: t("nav.settings"), icon: Settings },
  ];

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[url('/blurRoom.jpg')] bg-cover bg-no-repeat relative overflow-hidden">
      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
      />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <DashboardSidebar
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as Tab)}
        isSidebarExpanded={isSidebarExpanded}
        setSidebarHovered={setSidebarHovered}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userName={user?.nom}
        userInitial={user?.nom?.charAt(0) ?? "D"}
        roleLabel={t("role")}
        espaceLabel={t("espace")}
        logoutLabel={t("logout")}
        onLogout={logout}
      />

      <main className={`transition-all duration-300 min-h-screen ${sidebarHovered ? "md:ml-[240px]" : "md:ml-[72px]"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-black/60 backdrop-blur-md border-b border-gold/10">
          <div className="px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 -ml-2 text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t(`nav.${activeTab}`)}
                </h1>
                <p className="text-white/80 text-xs md:text-sm capitalize">{currentDate}</p>
              </div>
            </div>
            <div className="dark flex flex-wrap items-center gap-2 md:gap-4 self-end sm:self-auto">
              <ThemeToggle />
              <LanguageToggle />
              <CurrencyToggle />
              <button onClick={() => setActiveTab("messages")} className="relative p-3 rounded-xl bg-purple/30 hover:bg-purple/50 transition-colors">
                <Bell className="w-5 h-5 text-white" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-charcoal rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {activeTab === "overview" && (
            <OverviewTab
              t={t}
              chambres={chambres}
              bookings={bookings}
              filteredBookings={bookings}
              directorReviews={directorReviews}
              weeklyOccupancyData={weeklyOccupancyData}
              tauxOccupation={mockDirecteurHotel.tauxOccupation}
              setActiveTab={(tab) => setActiveTab(tab as Tab)}
              currency={currency}
              locale={locale}
            />
          )}
          {activeTab === "rooms" && (
            <RoomsTab
              t={t}
              chambres={chambres}
              hotelId={DIRECTOR_HOTEL_ID}
              addRoom={addRoom}
              updateRoom={updateRoom}
              deleteRoom={deleteRoom}
              toggleRoomStatus={toggleRoomStatus}
            />
          )}
          {activeTab === "bookings" && (
            <BookingsTab
              t={t}
              bookings={bookings}
              currency={currency}
              locale={locale}
              onAction={handleBookingAction}
            />
          )}
          {activeTab === "calendar" && (
            <GanttCalendarTab
              t={t}
              chambres={chambres}
              bookings={bookings}
            />
          )}
          {activeTab === "reviews" && (
            <ReviewsTab
              t={t}
              reviews={directorReviews}
              chambres={chambres}
              onReply={handleReplyReview}
            />
          )}
          {activeTab === "statistics" && (
            <StatisticsTab
              t={t}
              chambres={chambres}
              tauxOccupation={mockDirecteurHotel.tauxOccupation}
              statReservations={mockDirecteurHotel.statReservations}
              statRecettes={mockDirecteurHotel.statRecettes}
              currency={currency}
              locale={locale}
            />
          )}
          {activeTab === "staff" && (
            <StaffTab t={t} staffMembers={staffMembers} />
          )}
          {activeTab === "settings" && (
            <SettingsTab
              t={t}
              settings={hotelSettings}
              setSettings={setHotelSettings}
              onSave={handleSaveSettings}
              isSaving={isSavingSettings}
              savedSuccess={settingsSavedSuccess}
            />
          )}
          {activeTab === "messages" && (
            <MessagesTab currentUser={currentUser} contacts={messageContacts} t={t} />
          )}
        </div>
      </main>
    </div>
  );
}
