import { MapPin, Star, ArrowRight, LogIn, Phone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import Link from 'next/link';

/* ─────────────────────────── static data ─────────────────────────── */

const clinicsWithMap = [
  {
    value: 'monterrey',
    label: 'Clínica Monterrey',
    address: 'Monterrey, Nuevo León',
    phone: '81 8000 0001',
    mapSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=-100.3461%2C25.6666%2C-100.2761%2C25.6966&layer=mapnik&marker=25.6816%2C-100.3111',
  },
  {
    value: 'cdmx',
    label: 'Clínica CDMX',
    address: 'Ciudad de México, CDMX',
    phone: '55 5000 0002',
    mapSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=-99.1632%2C19.4126%2C-99.0932%2C19.4526&layer=mapnik&marker=19.4326%2C-99.1332',
  },
  {
    value: 'guadalajara',
    label: 'Clínica Guadalajara',
    address: 'Guadalajara, Jalisco',
    phone: '33 3000 0003',
    mapSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=-103.3796%2C20.6397%2C-103.3096%2C20.6797&layer=mapnik&marker=20.6597%2C-103.3496',
  },
];

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

const allDentists = Object.entries(dentistsByClinic).flatMap(([clinic, dentists]) =>
  dentists.map((d) => ({
    ...d,
    clinic,
    clinicLabel: clinicsWithMap.find((c) => c.value === clinic)?.label ?? clinic,
  }))
);

/* ─────────────────────────── component ─────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

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

      {/* ── Hero ── */}
      <section className="container mx-auto px-4 pt-8 pb-4 text-center">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight">
          Agenda tu Cita Dental
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Rápido, fácil — para ti y para quien quieras.
        </p>
      </section>

      {/* ── Clinics Map ── */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Nuestros consultorios</h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Encuéntranos en las siguientes ubicaciones
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {clinicsWithMap.map((clinic) => (
            <Card key={clinic.value} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 w-full">
                <iframe
                  src={clinic.mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title={`Mapa de ubicación de ${clinic.label}`}
                />
              </div>
              <CardContent className="pt-4 pb-4 px-4 space-y-2">
                <p className="font-semibold text-sm">🏥 {clinic.label}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{clinic.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{clinic.phone}</span>
                </div>
                <Link href="/dashboard">
                  <Button size="sm" className="w-full mt-1">
                    Agendar cita
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Dentist Profiles Preview ── */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Nuestros dentistas</h2>
        <p className="text-center text-muted-foreground text-sm mb-8">Especialistas en todas las clínicas</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
          {allDentists.map((d) => (
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
          ))}
        </div>
      </section>

      {/* ── Login / Account Section ── */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-sm mx-auto space-y-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <LogIn className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold">Crea tu cuenta</h2>
          <ul className="text-sm text-muted-foreground space-y-1 text-left list-none">
            <li>✅ Guarda perfiles de pacientes (novia, mamá, amigos)</li>
            <li>✅ Reservas más rápidas en el futuro</li>
            <li>✅ Historial de citas siempre disponible</li>
          </ul>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard">
              <Button className="min-w-[110px]">Registrarme</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="min-w-[110px]">
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
    </div>
  );
}
