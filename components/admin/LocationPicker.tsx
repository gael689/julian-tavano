'use client';

import { Check, Loader2, MapPin, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import type { GeocodeHit } from '@/app/api/admin/geocode/route';
import { formatLatLng, isInArgentina, parseCoordinates, type LatLng } from '@/lib/admin/coords';

import { Button, Callout, Field, Input } from './ui';

// Leaflet no corre en el servidor.
const AdminMap = dynamic(() => import('./AdminMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[340px] w-full items-center justify-center rounded-xl bg-charcoal/5 text-sm text-charcoal/40">
      Cargando mapa…
    </div>
  ),
});

type Mode = 'direccion' | 'coordenadas';

export default function LocationPicker({
  value,
  onChange,
  address,
  onAddressChange,
}: {
  value: LatLng;
  onChange: (next: LatLng) => void;
  address: string;
  onAddressChange: (next: string) => void;
}) {
  const [mode, setMode] = useState<Mode>('direccion');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-lg bg-charcoal/5 p-1">
        <TabButton active={mode === 'direccion'} onClick={() => setMode('direccion')}>
          Buscar por dirección
        </TabButton>
        <TabButton active={mode === 'coordenadas'} onClick={() => setMode('coordenadas')}>
          Pegar coordenadas
        </TabButton>
      </div>

      {mode === 'direccion' ? (
        <AddressSearch onPick={onChange} onAddressChange={onAddressChange} />
      ) : (
        <CoordinatePaste onPick={onChange} />
      )}

      <Field
        label="Dirección (texto que se guarda)"
        hint="Opcional, sólo referencia interna. Lo que se muestra en el mapa es el nombre y la zona."
      >
        <Input
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Av. Costanera 1200, Monte Hermoso"
          maxLength={300}
        />
      </Field>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-olive-deep">
            Ajuste fino en el mapa
          </p>
          <p className="text-xs text-charcoal/50">
            Arrastrá el pin o hacé clic donde va exactamente la obra.
          </p>
        </div>
        <AdminMap value={value} onChange={onChange} />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white px-4 py-3 ring-1 ring-charcoal/10">
        <MapPin size={15} className="text-olive-deep" />
        <span className="font-mono text-sm text-charcoal">{formatLatLng(value)}</span>
        <span className="text-xs text-charcoal/45">(latitud, longitud)</span>
        {!isInArgentina(value) && (
          <span className="ml-auto text-xs font-semibold text-wood">
            Este punto cae fuera de Argentina
          </span>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
        active ? 'bg-white text-olive-deep shadow-sm' : 'text-charcoal/50 hover:text-charcoal'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Buscar por dirección ─────────────────────────────────────────────────── */

function AddressSearch({
  onPick,
  onAddressChange,
}: {
  onPick: (value: LatLng) => void;
  onAddressChange: (value: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeHit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  async function search() {
    const q = query.trim();
    if (q.length < 3) {
      setError('Escribí al menos 3 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setPicked(null);

    try {
      const response = await fetch(`/api/admin/geocode?q=${encodeURIComponent(q)}`);
      const data = (await response.json()) as { results?: GeocodeHit[]; error?: string };

      if (!response.ok) {
        setError(data.error ?? 'No pude buscar esa dirección.');
        return;
      }
      setResults(data.results ?? []);
    } catch {
      setError('No pude conectarme al servicio de direcciones.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Callout tone="info" title="Cómo escribir la dirección">
        Poné <strong>calle y número, después la localidad</strong>. Cuanto más completo, mejor:
        <br />
        <span className="font-mono text-xs">Faro Recalada 235, Monte Hermoso</span>
        <br />
        Si la calle no tiene numeración, usá una esquina:{' '}
        <span className="font-mono text-xs">Dorrego y Patagonia, Monte Hermoso</span>. Si no
        aparece, cambiá a &laquo;Pegar coordenadas&raquo; o marcá el punto a mano en el mapa.
      </Callout>

      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void search();
            }
          }}
          placeholder="Faro Recalada 235, Monte Hermoso"
        />
        <Button type="button" variant="secondary" onClick={() => void search()} disabled={loading}>
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          Buscar
        </Button>
      </div>

      {error && <Callout tone="error">{error}</Callout>}

      {results?.length === 0 && (
        <Callout tone="warn">
          No encontré esa dirección. Probá con menos detalle (sólo calle y localidad), o marcá el
          punto directamente en el mapa de abajo.
        </Callout>
      )}

      {results && results.length > 0 && (
        <ul className="divide-y divide-charcoal/8 overflow-hidden rounded-lg border border-charcoal/12 bg-white">
          {results.map((hit) => {
            const key = `${hit.lat},${hit.lng}`;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => {
                    onPick({ lat: hit.lat, lng: hit.lng });
                    onAddressChange(hit.label);
                    setPicked(key);
                  }}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-olive/5"
                >
                  {picked === key ? (
                    <Check size={15} className="mt-0.5 shrink-0 text-olive-deep" />
                  ) : (
                    <MapPin size={15} className="mt-0.5 shrink-0 text-charcoal/30" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm text-charcoal">{hit.label}</span>
                    <span className="block font-mono text-xs text-charcoal/40">
                      {formatLatLng({ lat: hit.lat, lng: hit.lng })}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ── Pegar coordenadas ────────────────────────────────────────────────────── */

function CoordinatePaste({ onPick }: { onPick: (value: LatLng) => void }) {
  const [raw, setRaw] = useState('');
  const [feedback, setFeedback] = useState<{ tone: 'error' | 'warn' | 'ok'; text: string } | null>(
    null
  );

  function apply() {
    const result = parseCoordinates(raw);

    if (!result.ok) {
      setFeedback({ tone: 'error', text: result.error });
      return;
    }

    onPick(result.value);
    setFeedback(
      result.note
        ? { tone: 'warn', text: result.note }
        : { tone: 'ok', text: `Ubicación cargada en ${formatLatLng(result.value)}.` }
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Callout tone="info" title="Cómo sacar las coordenadas de Google Maps">
        Abrí Google Maps, <strong>hacé clic derecho sobre el punto exacto</strong> y clickeá los
        números que aparecen arriba de todo (se copian solos). Después pegalos acá.
        <br />
        <span className="mt-2 block">Acepta cualquiera de estos formatos:</span>
        <ul className="mt-1 list-disc pl-5 font-mono text-xs">
          <li>-38.984639, -61.314917</li>
          <li>-38.984639 -61.314917</li>
          <li>38°59&apos;04.7&quot;S 61°18&apos;53.7&quot;W</li>
          <li>https://www.google.com/maps/@-38.984639,-61.314917,17z</li>
        </ul>
        <span className="mt-2 block">
          Primero la latitud (empieza con -38 por acá), después la longitud (-61). Si te confundís
          el orden, lo corrijo solo.
        </span>
      </Callout>

      <div className="flex gap-2">
        <Input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              apply();
            }
          }}
          placeholder="-38.984639, -61.314917"
        />
        <Button type="button" variant="secondary" onClick={apply}>
          Usar
        </Button>
      </div>

      {feedback && (
        <Callout tone={feedback.tone === 'ok' ? 'info' : feedback.tone}>{feedback.text}</Callout>
      )}
    </div>
  );
}
