import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Place {
  _id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address?: string;
  summary?: string;
  description?: string;
  minGroupSize?: number;
  maxGroupSize?: number;
  startDate?: string;
  endDate?: string;
  images?: string[];
  companions?: string[];
}

interface MapViewProps {
  places: Place[];
  onMarkerClick?: (place: Place) => void;
}

const centerSeoul: [number, number] = [37.5665, 126.978]; // 서울 중심

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

function FitBounds({ places }: { places: Place[] }) {
  const map = useMap();
  useEffect(() => {
    if (places.length === 0) return;
    if (places.length === 1) {
      map.setView([places[0].lat, places[0].lng], 13);
    } else {
      const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [places, map]);
  return null;
}

const MapView: React.FC<MapViewProps> = ({ places, onMarkerClick }) => {
  return (
    <MapContainer center={centerSeoul} zoom={13} style={{ height: '420px', width: '100%' }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds places={places} />
      {places.map(place => (
        <Marker key={place._id} position={[place.lat, place.lng]} eventHandlers={onMarkerClick ? { click: () => onMarkerClick(place) } : undefined}>
          <Popup>
            <b>{place.name}</b><br />
            {place.category}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView; 