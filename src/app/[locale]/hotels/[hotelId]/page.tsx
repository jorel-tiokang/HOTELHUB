import HotelDetailPage from "@/src/components/HotelDetailPage";

// 1. On change le type pour refléter que params est une Promise
interface PageProps {
  params: Promise<{ 
    locale: string;
    hotelId: string; 
  }>;
}

// 2. On rend la fonction de page asynchrone
export default async function HotelDetail({ params }: PageProps) {
  // 3. On "déballe" le paramètre de manière asynchrone
  const resolvedParams = await params;
  
  return <HotelDetailPage hotelId={resolvedParams.hotelId} />;
}