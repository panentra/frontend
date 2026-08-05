"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocateFixed, Loader2 } from "lucide-react";
import Snackbar, { useSnackbar } from "./Snackbar";

// Fix standard Leaflet default marker icon paths in Next.js
const farmMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number, addressText: string) => void;
}

// Sub-component to handle map click events
function MapClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Google Maps-style Floating Circular "Lokasi Saya" Target Button Component
function GoogleMapsLocationButton({
  onLocationFound,
}: {
  onLocationFound: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);
  const { snackbar, showSnackbar, dismissSnackbar } = useSnackbar();

  const handleLocate = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLocating(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setIsLocating(false);
          // Smoothly pan & zoom to current position like Google Maps
          map.flyTo([lat, lng], 15, { animate: true, duration: 1.2 });
          onLocationFound(lat, lng);
        },
        (err) => {
          console.warn("GPS Access Error/Denied:", err);
          setIsLocating(false);
          showSnackbar("Gagal mengakses lokasi GPS. Menggunakan lokasi fallback.", "error");
          const fallbackLat = -7.25045;
          const fallbackLng = 112.76885;
          map.flyTo([fallbackLat, fallbackLng], 15, { animate: true, duration: 1 });
          onLocationFound(fallbackLat, fallbackLng);
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      showSnackbar("Browser tidak mendukung Geolocation.", "error");
    }
  };

  return (
    <div className="absolute bottom-5 right-3 z-[450]">
      <button
        type="button"
        onClick={handleLocate}
        disabled={isLocating}
        title="Lokasi Saya Saat Ini"
        className="w-10 h-10 bg-white hover:bg-emerald-50 text-[#1B5E20] border border-gray-300 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        {isLocating ? (
          <Loader2 className="w-5 h-5 animate-spin text-[#1B5E20]" />
        ) : (
          <LocateFixed className="w-5 h-5 text-[#1B5E20]" />
        )}
      </button>

      <Snackbar snackbar={snackbar} onDismiss={dismissSnackbar} />
    </div>
  );
}

export default function LeafletMapPicker({
  initialLat = -7.250445,
  initialLng = 112.768845,
  onLocationSelect,
}: LeafletMapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [formattedAddress, setFormattedAddress] = useState<string>("Lokasi Lahan Pertanian");

  // Helper to reverse geocode Lat/Lng into a clean human-readable Indonesian address string
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`,
        {
          headers: {
            "User-Agent": "PanentraApp/1.0",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const addr = data.address || {};
          const road = addr.road || addr.pedestrian || addr.suburb || "";
          const village = addr.village || addr.neighbourhood || addr.suburb || "";
          const district = addr.town || addr.city_district || addr.county || "";
          const city = addr.city || addr.regency || "";
          const state = addr.state || "";

          let cleanText = "";
          if (road) cleanText += `${road}, `;
          if (village) cleanText += `${village}, `;
          if (district) cleanText += `${district}, `;
          if (city) cleanText += `${city}, `;
          if (state) cleanText += `${state}`;

          const resultString = cleanText.trim() || data.display_name;
          setFormattedAddress(resultString);
          return resultString;
        }
      }
    } catch (err) {
      console.warn("Reverse Geocode Fetch Error:", err);
    }
    const fallbackText = "Jl. Swadaya II, Condongcatur, Sleman, DI Yogyakarta";
    setFormattedAddress(fallbackText);
    return fallbackText;
  };

  useEffect(() => {
    reverseGeocode(initialLat, initialLng).then((addrText) => {
      onLocationSelect(initialLat, initialLng, addrText);
    });
  }, []);

  const handleSelectPosition = async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    const addrText = await reverseGeocode(lat, lng);
    onLocationSelect(lat, lng, addrText);
  };

  return (
    <div className="w-full h-60 rounded-2xl overflow-hidden border border-[#CBD5E1] shadow-sm relative z-0">
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={farmMarkerIcon}>
          <Popup>
            <div className="text-xs font-bold text-[#1B5E20]">
              🌱 Lokasi Lahan Pertanian
              <p className="text-[10px] text-gray-600 font-normal mt-0.5 max-w-[180px]">
                {formattedAddress}
              </p>
            </div>
          </Popup>
        </Marker>
        <MapClickHandler onSelect={handleSelectPosition} />
        {/* Google Maps Style Circular Floating Location Target Button */}
        <GoogleMapsLocationButton onLocationFound={handleSelectPosition} />
      </MapContainer>
    </div>
  );
}
