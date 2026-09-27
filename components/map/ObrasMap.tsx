'use client';

import { useEffect, useRef } from 'react';
import { Obra } from '@/lib/data/obras';
import 'leaflet/dist/leaflet.css';

interface ObrasMapProps {
  obras: Obra[];
  activeObraId: string | null;
  hoveredObraId: string | null;
  onObraClick: (id: string) => void;
  onObraHover: (id: string | null) => void;
}

function buildPinSvg(isActive: boolean) {
  const size = isActive ? 44 : 32;
  const color = isActive ? '#274A46' : '#315C57'; // petróleo / petróleo oscuro (paleta sep/2026)
  const shadow = isActive 
    ? 'drop-shadow(0px 8px 12px rgba(0,0,0,0.4))'
    : 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))';

  // Teardrop standard map pin path
  return `<div style="
    filter: ${shadow};
    transition: all 200ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: bottom center;
  ">
    <svg width="${size}" height="${size * 1.3}" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 34 12 34C12 34 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  </div>`;
}

export default function ObrasMap({
  obras,
  activeObraId,
  hoveredObraId,
  onObraClick,
  onObraHover,
}: ObrasMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // Store refs to the Leaflet instances so we can manipulate them without re-mounting
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());
  const isInitialized = useRef(false);

  // --- Init map once (imperative, no React re-renders touch this) ---
  useEffect(() => {
    if (isInitialized.current || !mapRef.current) return;
    isInitialized.current = true;
    const markers = markersRef.current;

    const init = async () => {
      const L = (await import('leaflet')).default;

      const map = L.map(mapRef.current!, {
        center: [-38.988, -61.25],
        zoom: 13,
        zoomControl: false,
      });

      // CARTO cerró el acceso sin clave el 28/ago/2026 (devuelve 200 con un
      // tile de aviso "API KEY REQUIRED" en vez de fallar). La key que nos
      // dieron no es una key de basemaps válida — probada directo contra el
      // server de CARTO, devuelve 403 "a valid, authorized API key is
      // required" con o sin Referer. Falta sacar la key correcta en
      // https://carto.com/basemaps/apikey (gratis, ~1 min).
      //
      // Con NEXT_PUBLIC_CARTO_API_KEY cargada (una vez que sea la correcta),
      // vuelve a usar Voyager solo. Sin ella, tiles de OpenStreetMap sin
      // clave, con el pane desaturado para no chocar con la paleta
      // cream/petróleo del resto del sitio.
      const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;
      if (cartoKey) {
        L.tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoKey}`, {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://openstreetmap.org">OSM</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);
      } else {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          subdomains: 'abc',
          maxZoom: 19,
          className: 'map-tiles-muted',
        }).addTo(map);
      }

      const clusterGroup = L.layerGroup();

      // Override Leaflet attribution: tiny, olive-soft, bottom-left
      const attrStyle = document.createElement('style');
      attrStyle.textContent = `
        .leaflet-control-attribution {
          font-size: 9px !important;
          color: #3A4A2A !important;
          opacity: 0.45 !important;
          background: transparent !important;
          box-shadow: none !important;
          bottom: 0 !important;
          left: 0 !important;
          right: auto !important;
          padding: 2px 6px !important;
        }
        .leaflet-control-attribution a {
          color: #666 !important;
        }
      `;
      document.head.appendChild(attrStyle);

      obras.forEach((obra) => {
        const lat = obra.coordinates[1];
        const lng = obra.coordinates[0];

        const icon = L.divIcon({
          html: buildPinSvg(false),
          className: '',
          iconSize: [32, 41],
          iconAnchor: [16, 41],
        });

        const marker = L.marker([lat, lng], { icon });

        marker.on('click', () => onObraClick(obra.id));
        marker.on('mouseover', () => onObraHover(obra.id));
        marker.on('mouseout', () => onObraHover(null));

        markersRef.current.set(obra.id, marker);
        clusterGroup.addLayer(marker);
      });

      map.addLayer(clusterGroup);

      leafletMapRef.current = map;
      clusterGroupRef.current = clusterGroup;
    };

    init();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        clusterGroupRef.current = null;
        markers.clear();
        isInitialized.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- FlyTo when activeObraId changes ---
  useEffect(() => {
    if (!leafletMapRef.current || !activeObraId) return;
    const obra = obras.find((o) => o.id === activeObraId);
    if (!obra) return;
    const lat = obra.coordinates[1];
    const lng = obra.coordinates[0];
    leafletMapRef.current.flyTo([lat, lng], 15, { duration: 1.2, easeLinearity: 0.25 });
  }, [activeObraId, obras]);



  // --- Update marker icons when active/hover changes ---
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    if (!L) return;

    markersRef.current.forEach((marker, id) => {
      const isActive = id === activeObraId;
      const isHovered = id === hoveredObraId;
      const active = isActive || isHovered;
      const size: [number, number] = active ? [44, 57] : [32, 41];
      const anchor: [number, number] = active ? [22, 57] : [16, 41];

      marker.setIcon(
        L.divIcon({
          html: buildPinSvg(active),
          className: '',
          iconSize: size,
          iconAnchor: anchor,
        })
      );
    });
  }, [activeObraId, hoveredObraId]);

  return (
    <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
  );
}
