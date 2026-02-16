'use client';

import { useState } from 'react';
import { Calendar } from '@/app/components/ui/calendar';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useToast } from '@/app/hooks/use-toast';
import { CalendarDays, Clock, User, Phone, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import apiClient from '@/app/lib/api';
import Link from 'next/link';

interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    consultationType: 'first_visit',
    notes: '',
  });

  const consultationTypes = [
    { value: 'first_visit', label: 'Primera Visita' },
    { value: 'follow_up', label: 'Seguimiento' },
    { value: 'cleaning', label: 'Limpieza' },
    { value: 'extraction', label: 'Extracción' },
    { value: 'filling', label: 'Empaste' },
    { value: 'emergency', label: 'Emergencia' },
    { value: 'other', label: 'Otro' },
  ];

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime('');
    
    if (date) {
      setLoading(true);
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const response = await fetch(`/api/appointments/public_booking/?date=${formattedDate}`);
        
        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data.slots || []);
        } else {
          toast({
            title: 'Error',
            description: 'No se pudieron cargar los horarios disponibles',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        toast({
          title: 'Error',
          description: 'Error al cargar horarios disponibles',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona una fecha y hora',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // First create or find the patient
      const patientData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email,
      };

      // Create appointment
      const slot = availableSlots.find(s => s.start_time === selectedTime);
      const appointmentData = {
        patient: patientData,
        consultation_type: formData.consultationType,
        date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: selectedTime,
        end_time: slot?.end_time || selectedTime,
        notes: formData.notes,
        public_booking: true,
      };

      const response = await fetch('/api/appointments/public_booking/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        setBookingSuccess(true);
        toast({
          title: 'Cita agendada',
          description: '¡Tu cita ha sido reservada exitosamente!',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'No se pudo agendar la cita',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: 'Error',
        description: 'Error al agendar la cita',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Cita Confirmada!</CardTitle>
            <CardDescription>
              Tu cita ha sido agendada exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                <span className="font-medium">
                  {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{formData.firstName} {formData.lastName}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Recibirás un recordatorio antes de tu cita. Si necesitas cancelar o reprogramar, 
              por favor contáctanos.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Agendar otra cita
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className="text-xl font-bold">Dientex</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Acceso Consultorio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Agenda tu Cita Dental
          </h2>
          <p className="text-lg text-muted-foreground">
            Reserva tu cita de forma rápida y sencilla. Selecciona el día y hora que mejor te convenga.
          </p>
        </div>

        {/* Booking Form */}
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Cita</CardTitle>
              <CardDescription>
                Complete todos los campos para agendar su cita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Personal Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Datos Personales</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input
                        id="firstName"
                        placeholder="Tu nombre"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos *</Label>
                      <Input
                        id="lastName"
                        placeholder="Tus apellidos"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(000) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="consultationType">Tipo de Consulta *</Label>
                      <Select
                        value={formData.consultationType}
                        onValueChange={(value) => setFormData({ ...formData, consultationType: value })}
                      >
                        <SelectTrigger id="consultationType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {consultationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas (opcional)</Label>
                      <Input
                        id="notes"
                        placeholder="Algún comentario adicional"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Right Column - Date & Time */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Fecha y Hora</h3>
                    
                    <div className="space-y-2">
                      <Label>Selecciona una fecha *</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-md border"
                      />
                    </div>

                    {selectedDate && (
                      <div className="space-y-2">
                        <Label>Horarios disponibles *</Label>
                        {loading ? (
                          <div className="text-sm text-muted-foreground">
                            Cargando horarios...
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                            {availableSlots.filter(slot => slot.available).map((slot) => (
                              <Button
                                key={slot.start_time}
                                type="button"
                                variant={selectedTime === slot.start_time ? 'default' : 'outline'}
                                onClick={() => setSelectedTime(slot.start_time)}
                                className="w-full"
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {slot.start_time}
                              </Button>
                            ))}
                            {availableSlots.filter(slot => slot.available).length === 0 && (
                              <p className="col-span-2 text-sm text-muted-foreground text-center py-4">
                                No hay horarios disponibles para esta fecha
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button 
                    type="submit" 
                    disabled={loading || !selectedDate || !selectedTime}
                    className="px-8"
                  >
                    {loading ? 'Agendando...' : 'Agendar Cita'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Dientex - Sistema de Gestión Dental</p>
        </div>
      </footer>
    </div>
  );
}
