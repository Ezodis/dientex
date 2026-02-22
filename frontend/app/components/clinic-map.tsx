'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Phone, ChevronDown, X } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

/* ─────────────────── data ─────────────────── */

const clinics = [
  { id: 'monterrey', label: 'Clínica Monterrey', address: 'Monterrey, Nuevo León', phone: '81 8000 0001', lat: 25.6816, lng: -100.3111 },
  { id: 'cdmx', label: 'Clínica CDMX', address: 'Ciudad de México, CDMX', phone: '55 5000 0002', lat: 19.4326, lng: -99.1332 },
  { id: 'guadalajara', label: 'Clínica Guadalajara', address: 'Guadalajara, Jalisco', phone: '33 3000 0003', lat: 20.6597, lng: -103.3496 },
];

type Clinic = typeof clinics[0];

/* ─────────────────── helpers ─────────────────── */

// Custom blue pin shape for clinic markers
const PIN_HTML =
  '<div style="width:28px;height:28px;background:#2563eb;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>';

// Builds a custom blue-pin DivIcon (must run client-side only)
function makeIcon() {
  return L.divIcon({
    className: '',
    html: PIN_HTML,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -32],
  });
}

// Sub-component: smoothly flies the map to a selected clinic
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

/* ─────────────────── component ─────────────────── */

export default function ClinicMap() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Clinic | null>(null);
  const [icon, setIcon] = useState<L.DivIcon | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Create icon after mount to avoid any SSR edge-cases
  useEffect(() => {
    setIcon(makeIcon());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const filtered = clinics.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()),
  );

  function selectClinic(c: Clinic) {
    setSelected(c);
    setOpen(false);
    setSearch('');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-3">

      {/* ── Searchable dropdown ── */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2.5 text-sm hover:bg-accent transition-colors text-left"
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
            {selected ? selected.label : 'Buscar consultorio…'}
          </span>
          {selected ? (
            <button
              type="button"
              aria-label="Limpiar selección"
              className="ml-auto p-0.5 rounded hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(null);
                setSearch('');
              }}
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ) : (
            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {open && (
          <div className="absolute z-[1000] mt-1 w-full bg-white border border-border rounded-md shadow-lg overflow-hidden">
            <div className="p-2 border-b">
              <Input
                autoFocus
                placeholder="Buscar por nombre o ciudad…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-3 py-2.5 text-sm text-muted-foreground text-center">
                  Sin resultados
                </li>
              ) : (
                filtered.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent transition-colors flex items-start gap-2"
                      onClick={() => selectClinic(c)}
                    >
                      <MapPin className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">{c.label}</p>
                        <p className="text-xs text-muted-foreground">{c.address}</p>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* ── Single map with all pins ── */}
      <div className="rounded-xl overflow-hidden border shadow-md h-[460px]">
        {icon && (
          <MapContainer
            center={[23.6345, -102.5528]}
            zoom={5}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selected && <FlyTo lat={selected.lat} lng={selected.lng} />}
            {clinics.map((c) => (
              <Marker
                key={c.id}
                position={[c.lat, c.lng]}
                icon={icon}
                eventHandlers={{ click: () => setSelected(c) }}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>🏥 {c.label}</p>
                    <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>📍 {c.address}</p>
                    <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>📞 {c.phone}</p>
                    <a
                      href="/dashboard"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        fontSize: 12,
                        background: '#2563eb',
                        color: 'white',
                        borderRadius: 6,
                        padding: '5px 10px',
                        textDecoration: 'none',
                      }}
                    >
                      Agendar cita
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* ── Selected clinic detail card ── */}
      {selected && (
        <div className="flex items-start gap-3 rounded-lg border bg-blue-50 p-4">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">🏥 {selected.label}</p>
            <p className="text-xs text-muted-foreground">{selected.address}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Phone className="h-3 w-3" /> {selected.phone}
            </p>
          </div>
          <Link href="/dashboard">
            <Button size="sm">Agendar cita</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
