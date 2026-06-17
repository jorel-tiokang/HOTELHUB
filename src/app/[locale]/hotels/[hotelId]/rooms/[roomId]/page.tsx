import RoomDetailPage from "@/src/components/RoomDetailPage";

interface PageProps {
  params: Promise<{
    locale: string;
    hotelId: string;
    roomId: string;
  }>;
}

export default async function RoomDetail({ params }: PageProps) {
  const resolvedParams = await params;
  return <RoomDetailPage hotelId={resolvedParams.hotelId} roomId={resolvedParams.roomId} />;
}