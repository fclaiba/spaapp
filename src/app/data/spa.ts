export type LeadSource =
  | "Instagram"
  | "Google"
  | "Referido"
  | "WhatsApp"
  | "Walk-in";

export type AppointmentStatus =
  | "Pendiente"
  | "Confirmada"
  | "En sala"
  | "Completada"
  | "Cancelada";

export interface ServiceCategory {
  id: string;
  label: string;
  description: string;
}

export interface ServiceDefinition {
  id: string;
  categoryId: string;
  name: string;
  summary: string;
  duration: number;
  price: number;
  badge?: string;
  outcomes: string[];
}

export interface AppointmentRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  categoryId: string;
  staff: string;
  startsAt: string;
  duration: number;
  price: number;
  status: AppointmentStatus;
  customerName: string;
  email: string;
  phone: string;
  origin: LeadSource;
  notes?: string;
  createdAt: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredService: string;
  totalVisits: number;
  totalSpent: number;
  origin: LeadSource;
  nextAppointment?: string;
  notes?: string;
  createdAt: string;
}

export interface SettingsRecord {
  businessName: string;
  headline: string;
  phone: string;
  email: string;
  address: string;
  bookingLeadTimeHours: number;
  reminderEnabled: boolean;
  cancellationWindowHours: number;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "facial",
    label: "Facial",
    description: "Protocolos para piel luminosa, uniforme y con mejor textura.",
  },
  {
    id: "corporal",
    label: "Corporal",
    description: "Tratamientos para descanso, desinflamacion y alivio muscular.",
  },
  {
    id: "wellness",
    label: "Wellness",
    description: "Planes para energia, recuperacion y equilibrio integral.",
  },
  {
    id: "laser",
    label: "Laser",
    description: "Tecnologia segura para mejorar manchas, textura y depilacion.",
  },
];

export const services: ServiceDefinition[] = [
  {
    id: "hydrafacial-signature",
    categoryId: "facial",
    name: "Hydrafacial Signature",
    summary: "Limpieza profunda, extraccion suave y glow inmediato.",
    duration: 60,
    price: 145,
    badge: "Mas reservado",
    outcomes: ["Poros mas limpios", "Luminosidad visible", "Sin tiempo de recuperacion"],
  },
  {
    id: "lifting-collagen",
    categoryId: "facial",
    name: "Lifting con colageno",
    summary: "Sesión de estimulacion y firmeza para eventos o mantenimiento.",
    duration: 75,
    price: 175,
    outcomes: ["Piel mas firme", "Textura uniforme", "Resultados naturales"],
  },
  {
    id: "massage-deep-reset",
    categoryId: "corporal",
    name: "Deep Reset Massage",
    summary: "Masaje terapeutico para liberar tension y mejorar descanso.",
    duration: 60,
    price: 110,
    outcomes: ["Menos tension", "Sueño mas reparador", "Menor sobrecarga muscular"],
  },
  {
    id: "lymphatic-shape",
    categoryId: "corporal",
    name: "Drenaje y contour",
    summary: "Sesion corporal para desinflamacion y definicion ligera.",
    duration: 75,
    price: 135,
    outcomes: ["Menos retencion", "Piernas ligeras", "Contorno visualmente mas limpio"],
  },
  {
    id: "vitamin-boost",
    categoryId: "wellness",
    name: "Vitamin Boost IV",
    summary: "Sueroterapia guiada para energia, defensa y recuperacion.",
    duration: 45,
    price: 160,
    outcomes: ["Mas energia", "Recuperacion rapida", "Hidratacion profunda"],
  },
  {
    id: "recovery-drip",
    categoryId: "wellness",
    name: "Recovery Drip",
    summary: "Plan de recuperacion para estres, fatiga o viajes intensos.",
    duration: 50,
    price: 180,
    outcomes: ["Recuperacion post viaje", "Menor fatiga", "Soporte inmune"],
  },
  {
    id: "laser-clear-skin",
    categoryId: "laser",
    name: "Laser Clear Skin",
    summary: "Evaluacion y sesion para marcas superficiales y tono desigual.",
    duration: 40,
    price: 190,
    outcomes: ["Tono mas uniforme", "Menos marcas", "Seguimiento profesional"],
  },
  {
    id: "laser-hair-free",
    categoryId: "laser",
    name: "Laser Hair Free",
    summary: "Depilacion laser por zona con protocolo de confort y seguimiento.",
    duration: 30,
    price: 95,
    outcomes: ["Menos vello", "Rutina mas simple", "Plan por sesiones"],
  },
];

export const landingHighlights = [
  {
    label: "Reserva en minutos",
    value: "< 3 min",
    description: "El flujo principal se centra en elegir servicio, horario y confirmar.",
  },
  {
    label: "Satisfaccion promedio",
    value: "4.9/5",
    description: "Clientes recurrentes valoran claridad, trato clinico y puntualidad.",
  },
  {
    label: "Especialistas activos",
    value: "6",
    description: "Equipo mixto de estetica, wellness y soporte post tratamiento.",
  },
];

export const trustPoints = [
  "Evaluacion previa antes de tratamientos clinicos y laser.",
  "Recordatorios automaticos y politicas de cancelacion claras.",
  "Seguimiento posterior cuando el servicio lo requiere.",
];

export const teamMembers = [
  {
    name: "Dra. Isabella Rossi",
    role: "Direccion clinica",
    bio: "Disena protocolos faciales y supervisa seguridad en tratamientos avanzados.",
  },
  {
    name: "Mateo Silva",
    role: "Especialista laser",
    bio: "Lidera evaluaciones de piel y define planes de sesiones progresivas.",
  },
  {
    name: "Clara Vega",
    role: "Wellness therapist",
    bio: "Se enfoca en recuperacion, drenaje y tratamientos para reducir tension.",
  },
];

export const testimonials = [
  {
    name: "Valentina M.",
    role: "Paciente recurrente",
    quote:
      "Antes reservaba por WhatsApp y todo dependia de preguntar. Ahora veo opciones, precios y horarios en un mismo lugar.",
  },
  {
    name: "Sofia R.",
    role: "Agenda ejecutiva",
    quote:
      "La experiencia transmite confianza porque no promete lujo vacio: explica bien el servicio y que esperar despues.",
  },
  {
    name: "Lucia G.",
    role: "Primera visita",
    quote:
      "Lo que mas valore fue entender en segundos que tratamiento me convenia y poder reservar sin pedir ayuda.",
  },
];

export const faqs = [
  {
    question: "¿Cuanto tarda reservar?",
    answer:
      "La reserva esta pensada para completarse en menos de tres minutos. Primero eliges servicio, despues fecha y finalmente tus datos.",
  },
  {
    question: "¿Puedo reprogramar o cancelar?",
    answer:
      "Si. La politica base permite reprogramar o cancelar hasta 24 horas antes desde el equipo de atencion o el panel administrativo.",
  },
  {
    question: "¿Como se confirma la cita?",
    answer:
      "Al finalizar veras una confirmacion inmediata y la cita queda disponible en el panel administrativo para seguimiento.",
  },
  {
    question: "¿Que pasa si no se que servicio elegir?",
    answer:
      "Cada servicio incluye objetivo, duracion y resultado esperado. Si aun dudas, reserva la opcion mas cercana y el equipo ajusta el protocolo en la evaluacion inicial.",
  },
];

export const defaultSettings: SettingsRecord = {
  businessName: "Aman Wellness",
  headline: "Estetica, wellness y reserva clara en un mismo flujo.",
  phone: "+54 11 4321 8765",
  email: "hola@amanwellness.com",
  address: "Av. del Libertador 1234, CABA",
  bookingLeadTimeHours: 4,
  reminderEnabled: true,
  cancellationWindowHours: 24,
};

const createDateAtHour = (daysFromNow: number, hour: number, minute: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const seedAppointments: AppointmentRecord[] = [
  {
    id: "apt-seed-1",
    serviceId: "hydrafacial-signature",
    serviceName: "Hydrafacial Signature",
    categoryId: "facial",
    staff: "Dra. Isabella Rossi",
    startsAt: createDateAtHour(0, 10, 0),
    duration: 60,
    price: 145,
    status: "Confirmada",
    customerName: "Valentina Mendoza",
    email: "valentina@email.com",
    phone: "+54 9 11 1234 5678",
    origin: "Instagram",
    notes: "Primera visita. Busca glow para evento.",
    createdAt: createDateAtHour(-7, 12, 0),
  },
  {
    id: "apt-seed-2",
    serviceId: "massage-deep-reset",
    serviceName: "Deep Reset Massage",
    categoryId: "corporal",
    staff: "Clara Vega",
    startsAt: createDateAtHour(0, 14, 30),
    duration: 60,
    price: 110,
    status: "En sala",
    customerName: "Carlos Rivera",
    email: "carlos@email.com",
    phone: "+54 9 11 3333 2211",
    origin: "Referido",
    createdAt: createDateAtHour(-4, 9, 30),
  },
  {
    id: "apt-seed-3",
    serviceId: "vitamin-boost",
    serviceName: "Vitamin Boost IV",
    categoryId: "wellness",
    staff: "Mateo Silva",
    startsAt: createDateAtHour(1, 9, 0),
    duration: 45,
    price: 160,
    status: "Pendiente",
    customerName: "Sofia Laurent",
    email: "sofia@email.com",
    phone: "+54 9 11 5566 7788",
    origin: "Google",
    notes: "Fatiga post viaje.",
    createdAt: createDateAtHour(-1, 18, 0),
  },
  {
    id: "apt-seed-4",
    serviceId: "laser-clear-skin",
    serviceName: "Laser Clear Skin",
    categoryId: "laser",
    staff: "Mateo Silva",
    startsAt: createDateAtHour(2, 17, 0),
    duration: 40,
    price: 190,
    status: "Confirmada",
    customerName: "Julia San Martin",
    email: "julia@email.com",
    phone: "+54 9 11 9898 7777",
    origin: "WhatsApp",
    createdAt: createDateAtHour(-2, 11, 0),
  },
];

export const seedClients: ClientRecord[] = [
  {
    id: "client-seed-1",
    name: "Luciana Gomez",
    email: "luciana@email.com",
    phone: "+54 9 11 1212 3434",
    preferredService: "Lifting con colageno",
    totalVisits: 4,
    totalSpent: 650,
    origin: "Instagram",
    nextAppointment: createDateAtHour(5, 11, 30),
    notes: "Prefiere turnos de mañana.",
    createdAt: createDateAtHour(-45, 10, 0),
  },
  {
    id: "client-seed-2",
    name: "Diego Silva",
    email: "diego@email.com",
    phone: "+54 9 11 7878 4545",
    preferredService: "Recovery Drip",
    totalVisits: 2,
    totalSpent: 340,
    origin: "Google",
    createdAt: createDateAtHour(-20, 16, 0),
  },
];
