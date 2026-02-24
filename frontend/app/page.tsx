'use client';

import { useState, useRef } from 'react';
import { MapPin, Star, ArrowRight, LogIn, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import Link from 'next/link';
import ClinicMapClient from '@/app/components/clinic-map-client';

/* ─────────────────────────── static data ─────────────────────────── */

const dentistsByClinic: Record<string, { value: string; label: string; specialty: string; rating: number }[]> = {
  monterrey: [
    { value: 'dr_garcia', label: 'Dr. Carlos García', specialty: 'Ortodoncia', rating: 4.9 },
    { value: 'dra_lopez', label: 'Dra. Ana López', specialty: 'General', rating: 4.8 },
  ],
  cdmx: [
    { value: 'dr_martinez', label: 'Dr. Luis Martínez', specialty: 'Endodoncia', rating: 4.7 },
    { value: 'dra_hernandez', label: 'Dra. Sofía Hernández', specialty: 'General', rating: 4.9 },
  ],
  guadalajara: [
    { value: 'dr_ramirez', label: 'Dr. Jorge Ramírez', specialty: 'Periodoncia', rating: 4.8 },
    { value: 'dra_torres', label: 'Dra. María Torres', specialty: 'Ortodoncia', rating: 4.7 },
  ],
};

const clinicLabels: Record<string, string> = {
  monterrey: 'Clínica Monterrey',
  cdmx: 'Clínica CDMX',
  guadalajara: 'Clínica Guadalajara',
};

const allDentists = Object.entries(dentistsByClinic).flatMap(([clinic, dentists]) =>
  dentists.map((d) => ({
    ...d,
    clinic,
    clinicLabel: clinicLabels[clinic] ?? clinic,
  }))
);

/* ─────────────────────────── component ─────────────────────────── */

const INITIAL_DENTIST_COUNT = 3;

export default function Home() {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const mapSectionRef = useRef<HTMLElement>(null);

  const filteredDentists = allDentists.filter(
    (d) =>
      d.label.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      d.clinicLabel.toLowerCase().includes(search.toLowerCase()),
  );

  const visibleDentists = showAll ? filteredDentists : filteredDentists.slice(0, INITIAL_DENTIST_COUNT);
  const hasMore = !showAll && filteredDentists.length > INITIAL_DENTIST_COUNT;

  function scrollToMap() {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">

      {/* ── Header ── */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-lg font-bold">Dientex</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Acceso Consultorio
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="sm:hidden">
                <LogIn className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Section 1: Hero + Dentists ── */}
      <section className="min-h-screen flex flex-col">
        {/* Hero */}
        <div className="container mx-auto px-4 pt-8 pb-4 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            Agenda tu Cita Dental
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Rápido, fácil — para ti y para quien quieras.
          </p>
        </div>

        {/* Dentist Profiles */}
        <div className="container mx-auto px-4 py-6 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Nuestros dentistas</h2>
          <p className="text-center text-muted-foreground text-sm mb-4">Especialistas en todas las clínicas</p>

          {/* Search bar */}
          <div className="relative max-w-xs mx-auto mb-6">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar dentista, especialidad…"
              aria-label="Buscar dentista por nombre, especialidad o clínica"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowAll(false); }}
              className="pl-9"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
            {filteredDentists.length === 0 ? (
              <p className="col-span-full text-center text-sm text-muted-foreground py-8">
                Sin resultados para &ldquo;{search}&rdquo;
              </p>
            ) : (
              visibleDentists.map((d) => (
                <Card key={d.value} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-4 px-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl shrink-0">
                        🦷
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{d.label}</p>
                        <p className="text-xs text-muted-foreground">{d.specialty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{d.clinicLabel}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-medium">{d.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard">
                      <Button size="sm" className="w-full mt-3">
                        Reservar
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* ── Ver más ── */}
          {hasMore && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(true)}
              >
                Ver más
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {/* ── Click to see more ── */}
        <div className="text-center py-8">
          <button
            type="button"
            onClick={scrollToMap}
            className="inline-flex flex-col items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors group"
          >
            <span className="font-medium">Ver nuestros consultorios</span>
            <ChevronDown className="h-5 w-5 animate-bounce group-hover:animate-none" />
          </button>
        </div>
      </section>

      {/* ── Section 2: Clinics Map ── */}
      <section ref={mapSectionRef} className="min-h-screen flex flex-col bg-white">
        <div className="container mx-auto px-4 py-8 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Nuestros consultorios</h2>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Encuéntranos en las siguientes ubicaciones
          </p>
          <ClinicMapClient />
        </div>

        {/* ── Footer ── */}
        <footer className="border-t bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
              <a href="#" className="hover:text-foreground transition-colors">Clínicas</a>
              <a href="#" className="hover:text-foreground transition-colors">Contacto</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
              <a href="#" className="hover:text-foreground transition-colors">Términos</a>
            </div>
            <p className="text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Dientex — Agenda dental inteligente</p>
          </div>
        </footer>
      </section>
    </div>
  );
}
