import RoomDetailPage from "@/src/components/RoomDetailPage";

export default function RoomDetail({
  params,
}: {
  params: { hotelId: string; roomId: string };
}) {
  return <RoomDetailPage hotelId={params.hotelId} roomId={params.roomId} />;
}