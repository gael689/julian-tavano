'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

import type { LatLng } from '@/lib/admin/coords';

/**
 * Mapa de selección de ubicación.
 *
 * Igual que en el mapa público: Leaflet se instancia de forma imperativa
 * dentro de useEffect y React nunca toca su DOM.
 */
export default function AdminMap({
  value,
  onChange,
}: {
  value: LatLng;
  onChange: (next: LatLng) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  // El callback cambia en cada render; se lee por ref para no reinstanciar.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    let cancelled = false;

    const init = async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [value.lat, value.lng],
        zoom: 16,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap · © CARTO',
        maxZoom: 20,
      }).addTo(map);

      const icon = L.divIcon({
        className: '',
        html: `<svg width="34" height="44" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))">
                 <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22s12-13 12-22c0-6.63-5.37-12-12-12Z" fill="#3A4A2A" stroke="white" stroke-width="2"/>
                 <circle cx="12" cy="12" r="5" fill="white"/>
               </svg>`,
        iconSize: [34, 44],
        iconAnchor: [17, 44],
      });

      const marker = L.marker([value.lat, value.lng], { draggable: true, icon }).addTo(map);

      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng();
        onChangeRef.current({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
      });

      map.on('click', (event: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = event.latlng;
        marker.setLatLng([lat, lng]);
        onChangeRef.current({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
      });

      mapRef.current = map;
      markerRef.current = marker;

      // El contenedor puede montarse antes de tener su alto final.
      setTimeout(() => map.invalidateSize(), 120);
    };

    void init();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Sólo se inicializa una vez; las actualizaciones van por el efecto de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando el valor cambia desde afuera (buscador o campo de coordenadas),
  // se mueve el pin sin recrear el mapa.
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    const current = marker.getLatLng();
    if (
      Math.abs(current.lat - value.lat) < 1e-7 &&
      Math.abs(current.lng - value.lng) < 1e-7
    ) {
      return;
    }

    marker.setLatLng([value.lat, value.lng]);
    map.setView([value.lat, value.lng], Math.max(map.getZoom(), 16), { animate: true });
  }, [value.lat, value.lng]);

  return <div ref={containerRef} className="h-[340px] w-full rounded-xl bg-charcoal/5" />;
}
