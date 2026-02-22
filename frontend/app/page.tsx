'use client';

import { useState } from 'react';
import { Calendar } from '@/app/components/ui/calendar';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import {
  CalendarDays,
  Clock,
  MapPin,
  Star,
  Users,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Smile,
  Zap,
  Heart,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

/* ─────────────────────────── static data ─────────────────────────── */

const clinics = [
  { value: 'monterrey', label: '🏥 Clínica Monterrey' },
  { value: 'cdmx', label: '🏥 Clínica CDMX' },
  { value: 'guadalajara', label: '🏥 Clínica Guadalajara' },
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
    clinicLabel: clinics.find((c) => c.value === clinic)?.label ?? clinic,
  }))
);

const reasonOptions = [
  { value: 'consultation', label: '🦷 Consulta', icon: Stethoscope },
  { value: 'cleaning', label: '✨ Limpieza', icon: Smile },
  { value: 'emergency', label: '🚨 Dolor / Emergencia', icon: Zap },
  { value: 'braces', label: '😁 Brackets / Invisalign', icon: Heart },
  { value: 'other', label: '📋 Otro', icon: CheckCircle2 },
];

const whoOptions = [
  { value: 'myself', label: '👤 Para mí' },
  { value: 'someone', label: '👥 Para otra persona' },
  { value: 'new', label: '➕ Agregar nueva persona' },
];

const howItWorksSteps = [
  { number: '1', title: 'Elige clínica y dentista', description: 'Selecciona la clínica más cercana y el especialista que prefieras.' },
  { number: '2', title: 'Escoge fecha y hora', description: 'Ve los horarios disponibles en tiempo real y reserva en segundos.' },
  { number: '3', title: 'Confirma para ti o para alguien más', description: 'Agenda citas para tus familiares y amigos desde una sola cuenta.' },
];

const patientProfiles = [
  { name: 'Mi novia', emoji: '💑', detail: 'Alergia a la penicilina · Braces' },
  { name: 'Mi mamá', emoji: '👩‍👦', detail: 'Ansiedad dental · Notas especiales' },
  { name: 'Mi hijo', emoji: '👦', detail: '10 años · Revisión de brackets' },
];

const upcomingAppointments = [
  { who: 'Mi novia', dentist: 'Dra. Ana López', clinic: 'Monterrey', date: '25 Feb', time: '10:00 AM', color: 'bg-pink-100 text-pink-700' },
  { who: 'Para mí', dentist: 'Dr. Carlos García', clinic: 'Monterrey', date: '2 Mar', time: '9:30 AM', color: 'bg-blue-100 text-blue-700' },
];

/* ─────────────────────────── component ─────────────────────────── */

export default function Home() {
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedDentist, setSelectedDentist] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedWho, setSelectedWho] = useState('myself');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showSlots, setShowSlots] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const availableDentists = selectedClinic ? (dentistsByClinic[selectedClinic] || []) : [];

  // Demo time slots shown after "Find Available Slots" is clicked
  const demoSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '3:00 PM', '3:30 PM', '4:00 PM'];

  const handleFindSlots = () => {
    if (!selectedClinic || !selectedDentist || !selectedReason || !selectedDate) return;
    setSelectedSlot('');
    setShowSlots(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;
    setShowSlots(false);
    setBookingSuccess(true);
  };

  if (showSlots) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base">Horarios disponibles</CardTitle>
            <p className="text-xs text-muted-foreground">
              {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })} · {availableDentists.find((d) => d.value === selectedDentist)?.label}
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {demoSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`flex items-center justify-center gap-1.5 text-sm px-3 py-2.5 rounded-lg border transition-colors ${
                    selectedSlot === slot
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-foreground border-border hover:bg-accent'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {slot}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowSlots(false)}>
                Volver
              </Button>
              <Button className="flex-1" disabled={!selectedSlot} onClick={handleConfirmBooking}>
                Confirmar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="pt-8 pb-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
            <h2 className="text-xl font-bold">¡Cita Confirmada!</h2>
            <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-2 text-left">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{selectedDate && format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{clinics.find((c) => c.value === selectedClinic)?.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{availableDentists.find((d) => d.value === selectedDentist)?.label}</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => { setBookingSuccess(false); setSelectedDate(undefined); }}>
              Agendar otra cita
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      {/* ── Hero + Quick Booking Widget ── */}
      <section className="container mx-auto px-4 pt-8 pb-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            Agenda tu Cita Dental
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Rápido, fácil — para ti y para quien quieras.
          </p>
        </div>

        <Card className="max-w-lg mx-auto shadow-md">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base">Reservar cita</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">

            {/* Who */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> ¿Para quién es la cita?
              </Label>
              <div className="flex gap-2 flex-wrap">
                {whoOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedWho(opt.value)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      selectedWho === opt.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-foreground border-border hover:bg-accent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Clínica
              </Label>
              <Select
                value={selectedClinic}
                onValueChange={(v) => { setSelectedClinic(v); setSelectedDentist(''); }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una clínica" />
                </SelectTrigger>
                <SelectContent>
                  {clinics.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dentist */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Stethoscope className="h-3.5 w-3.5" /> Dentista
              </Label>
              <Select
                value={selectedDentist}
                onValueChange={setSelectedDentist}
                disabled={!selectedClinic}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedClinic ? 'Elige un dentista' : 'Primero selecciona clínica'} />
                </SelectTrigger>
                <SelectContent>
                  {availableDentists.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label} — {d.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> Fecha
              </Label>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                {selectedDate
                  ? format(selectedDate, "EEE d 'de' MMM", { locale: es })
                  : <span className="text-muted-foreground">Selecciona una fecha</span>}
              </button>
              {showCalendar && (
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => { setSelectedDate(d); setShowCalendar(false); }}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-md border"
                  />
                </div>
              )}
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Smile className="h-3.5 w-3.5" /> Motivo
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {reasonOptions.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setSelectedReason(r.value)}
                    className={`text-sm px-3 py-2 rounded-lg border transition-colors text-left ${
                      selectedReason === r.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-foreground border-border hover:bg-accent'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full mt-2"
              size="lg"
              onClick={handleFindSlots}
              disabled={!selectedClinic || !selectedDentist || !selectedReason || !selectedDate}
            >
              <Clock className="h-4 w-4" />
              Ver horarios disponibles
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* ── How It Works ── */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">¿Cómo funciona?</h2>
        <div className="grid gap-6 sm:grid-cols-3 max-w-2xl mx-auto">
          {howItWorksSteps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                {step.number}
              </div>
              <div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Multi-Person Booking Feature ── */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Agenda para toda tu familia</h2>
          <p className="text-center text-blue-100 text-sm mb-8">
            Guarda perfiles de tus seres queridos y reserva en segundos.
          </p>
          <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
            {patientProfiles.map((p) => (
              <Card key={p.name} className="bg-white/10 border-white/20 text-white">
                <CardContent className="pt-5 pb-4 px-4 flex items-start gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-blue-200 mt-0.5">{p.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
              <UserPlus className="h-4 w-4" />
              Agregar perfil
            </Button>
          </div>
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
                <Button
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => {
                    setSelectedClinic(d.clinic);
                    setSelectedDentist(d.value);
                    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    window.scrollTo({ top: 0, behavior: prefersReduced ? 'instant' : 'smooth' });
                  }}
                >
                  Reservar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── My Appointments Dashboard Preview ── */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Mis próximas citas</h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Gestiona las citas de todos desde un solo lugar
          </p>
          <div className="max-w-lg mx-auto space-y-3">
            {upcomingAppointments.map((appt, i) => (
              <Card key={i} className="hover:shadow-sm transition-shadow">
                <CardContent className="py-4 px-4 flex items-center gap-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${appt.color}`}>
                    {appt.who}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{appt.dentist}</p>
                    <p className="text-xs text-muted-foreground truncate">{appt.clinic}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold">{appt.date}</p>
                    <p className="text-xs text-muted-foreground">{appt.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/dashboard">
              <Button variant="outline">
                Ver todas mis citas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
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
