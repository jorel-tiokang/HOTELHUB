export default function SimpleMap() {
  // Coordonnées pour l'exemple
  const lat = 3.8667;
  const lng = 11.5167;
  
  // CORRECTION TAILWIND : 
  // - h-64 (256px) pour les téléphones (compact et propre)
  // - md:h-96 (384px) pour les tablettes et PC (plus immersif)
  return (
    <div className="h-64 md:h-96 w-full rounded-xl overflow-hidden relative shadow-md bg-gray-100">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        // URL générée par OpenStreetMap
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`}
      ></iframe>
    </div>
  );
}