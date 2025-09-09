import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Driver } from "@shared/schema";

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LeafletMapProps {
  drivers: Driver[];
}

export function LeafletMap({ drivers }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on MBU campus
    mapRef.current = L.map(mapContainerRef.current).setView([0.6103, 30.6463], 14);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for each driver
    drivers.forEach(driver => {
      if (!driver.lat || !driver.lng) return;

      const lat = parseFloat(driver.lat);
      const lng = parseFloat(driver.lng);
      
      const marker = L.marker([lat, lng]).addTo(mapRef.current!);
      
      const statusColor = driver.status === 'available' ? 'green' : 
                         driver.status === 'on-ride' ? 'orange' : 'gray';
      
      marker.bindPopup(`
        <div class="text-center p-2">
          <div class="font-semibold text-lg">${driver.autoNumber}</div>
          <div class="text-sm text-gray-600">Driver: ${driver.name}</div>
          <div class="text-sm capitalize" style="color: ${statusColor}">
            ${driver.status.replace('-', ' ')}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            Rating: ${driver.rating}/5
          </div>
        </div>
      `);
      
      markersRef.current.push(marker);
    });
  }, [drivers]);

  // Simulate auto movement
  useEffect(() => {
    const interval = setInterval(() => {
      markersRef.current.forEach((marker, index) => {
        const driver = drivers[index];
        if (driver && (driver.status === 'available' || driver.status === 'on-ride')) {
          const currentLatLng = marker.getLatLng();
          const newLat = currentLatLng.lat + (Math.random() - 0.5) * 0.002;
          const newLng = currentLatLng.lng + (Math.random() - 0.5) * 0.002;
          marker.setLatLng([newLat, newLng]);
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [drivers]);

  return (
    <div 
      ref={mapContainerRef}
      className="w-full h-96 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5"
      data-testid="map-container"
    />
  );
}
