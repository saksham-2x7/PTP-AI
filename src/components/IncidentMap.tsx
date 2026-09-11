'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function IncidentMap() {
  return (
    <div className="w-full h-48 rounded-lg overflow-hidden border border-red-900/50 mt-4" aria-label="Live Incident Map - Bengaluru Sector 7">
      <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: '100%', width: '100%', background: '#0a0a0a' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <Marker position={[12.9716, 77.5946]} icon={redIcon}>
          <Popup className="font-mono text-xs">
            <strong>[CODE RED] Sector 7</strong><br/>Mass Casualty Incident
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
