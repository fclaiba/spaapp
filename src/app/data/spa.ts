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
    id: "sueroterapia",
    label: "Sueroterapia (IV Therapy)",
    description: "Terapias intravenosas orientadas a energia, recuperacion, inflamacion y soporte metabolico.",
  },
  {
    id: "faciales",
    label: "Tratamientos Faciales (Facials)",
    description: "Protocolos faciales para limpieza profunda, hidratacion avanzada y regeneracion de la piel.",
  },
  {
    id: "esteticos",
    label: "Tratamientos Esteticos (Aesthetic Treatments)",
    description: "Procedimientos esteticos para rejuvenecimiento, firmeza y mejora visible de textura y tono.",
  },
  {
    id: "corporales",
    label: "Tratamientos Corporales (Body Treatments)",
    description: "Tratamientos corporales, terapeuticos y de recuperacion funcional con enfoque clinico.",
  },
  {
    id: "laser",
    label: "Laser (Lasser)",
    description: "Tecnologia laser para manchas, cicatrices, tatuajes y renovacion controlada de la piel.",
  },
];

export const services: ServiceDefinition[] = [
  {
    id: "suero-vida",
    categoryId: "sueroterapia",
    name: "Suero de Vida",
    summary: "Formula integral para hidratacion celular, energia sostenida y recuperacion general.",
    duration: 45,
    price: 185,
    badge: "Mas reservado",
    outcomes: ["Mas vitalidad diaria", "Mejor hidratacion", "Recuperacion acelerada"],
  },
  {
    id: "suero-antiinflamatorio",
    categoryId: "sueroterapia",
    name: "Suero Antiinflamatorio",
    summary: "Soporte intravenoso para reducir procesos inflamatorios y mejorar confort fisico.",
    duration: 45,
    price: 190,
    outcomes: ["Menos inflamacion", "Mayor confort corporal", "Recuperacion funcional"],
  },
  {
    id: "suero-detox",
    categoryId: "sueroterapia",
    name: "Suero Detox",
    summary: "Protocolo orientado a depuracion, soporte hepatico y balance metabolico.",
    duration: 45,
    price: 180,
    outcomes: ["Sensacion de limpieza interna", "Mejor balance metabolico", "Menos fatiga"],
  },
  {
    id: "suero-nad",
    categoryId: "sueroterapia",
    name: "Suero NAD+",
    summary: "Terapia de soporte celular para rendimiento mental, energia y longevidad funcional.",
    duration: 60,
    price: 260,
    outcomes: ["Mayor claridad mental", "Energia sostenida", "Recuperacion celular"],
  },
  {
    id: "suero-hierro",
    categoryId: "sueroterapia",
    name: "Suero de Hierro",
    summary: "Soporte intravenoso para niveles de hierro y mejora de cansancio asociado.",
    duration: 45,
    price: 175,
    outcomes: ["Menos cansancio", "Mejor tolerancia al esfuerzo", "Soporte hematologico"],
  },
  {
    id: "suero-colageno",
    categoryId: "sueroterapia",
    name: "Suero de Colageno",
    summary: "Infusion de soporte para piel, elasticidad y tejido conectivo.",
    duration: 45,
    price: 195,
    outcomes: ["Mejor elasticidad", "Aspecto mas luminoso", "Soporte dermico"],
  },
  {
    id: "suero-hormonal",
    categoryId: "sueroterapia",
    name: "Suero Hormonal",
    summary: "Protocolo de soporte para equilibrio hormonal y bienestar funcional.",
    duration: 50,
    price: 220,
    outcomes: ["Mejor equilibrio", "Menos sintomas funcionales", "Mayor bienestar general"],
  },
  {
    id: "suero-insomnio",
    categoryId: "sueroterapia",
    name: "Suero para el Insomnio",
    summary: "Infusion orientada a relajacion profunda y mejora de calidad de sueño.",
    duration: 45,
    price: 185,
    outcomes: ["Mejor descanso nocturno", "Menor latencia de sueño", "Mayor recuperacion"],
  },
  {
    id: "suero-potencia",
    categoryId: "sueroterapia",
    name: "Suero Potencia",
    summary: "Soporte para rendimiento fisico, energia y respuesta funcional.",
    duration: 45,
    price: 210,
    outcomes: ["Rendimiento mejorado", "Mas energia", "Recuperacion muscular"],
  },
  {
    id: "suero-barbie",
    categoryId: "sueroterapia",
    name: "Suero Barbie",
    summary: "Cocktail estetico de hidratacion y vitaminas para glow inmediato.",
    duration: 45,
    price: 205,
    outcomes: ["Piel mas luminosa", "Hidratacion visible", "Aspecto revitalizado"],
  },
  {
    id: "suero-energy",
    categoryId: "sueroterapia",
    name: "Suero Energy",
    summary: "Infusion vitaminica para combatir fatiga y elevar rendimiento diario.",
    duration: 40,
    price: 180,
    outcomes: ["Mas energia", "Menor fatiga", "Mejor enfoque diario"],
  },
  {
    id: "suero-lactancia",
    categoryId: "sueroterapia",
    name: "Suero Lactancia",
    summary: "Soporte de hidratacion y micronutrientes para etapa de lactancia.",
    duration: 40,
    price: 175,
    outcomes: ["Hidratacion adecuada", "Soporte nutricional", "Mayor bienestar materno"],
  },
  {
    id: "suero-cardio-safe",
    categoryId: "sueroterapia",
    name: "Suero Cardio Safe",
    summary: "Protocolo de soporte cardiovascular y metabólico en contexto preventivo.",
    duration: 50,
    price: 225,
    outcomes: ["Soporte circulatorio", "Equilibrio metabolico", "Mayor bienestar cardiovascular"],
  },
  {
    id: "suero-gluco",
    categoryId: "sueroterapia",
    name: "Suero Gluco para diabeticos",
    summary: "Infusion de soporte para hidratacion y control funcional en pacientes diabeticos.",
    duration: 50,
    price: 215,
    outcomes: ["Hidratacion estable", "Soporte metabolico", "Acompañamiento funcional"],
  },
  {
    id: "prp-estetico",
    categoryId: "esteticos",
    name: "Plasma rico en plaquetas (PRP)",
    summary: "Bioestimulacion con PRP para rejuvenecimiento y reparacion tisular.",
    duration: 70,
    price: 320,
    outcomes: ["Regeneracion celular", "Mejor textura", "Aspecto rejuvenecido"],
  },
  {
    id: "botox",
    categoryId: "esteticos",
    name: "Botox",
    summary: "Aplicacion para suavizar lineas de expresion y prevenir arrugas dinamicas.",
    duration: 45,
    price: 340,
    outcomes: ["Lineas suavizadas", "Rostro descansado", "Prevencion de arrugas"],
  },
  {
    id: "exosomas",
    categoryId: "esteticos",
    name: "Exosomas",
    summary: "Terapia regenerativa avanzada para mejorar calidad y firmeza de la piel.",
    duration: 75,
    price: 390,
    outcomes: ["Piel mas uniforme", "Mayor firmeza", "Recuperacion avanzada"],
  },
  {
    id: "esperma-salmon",
    categoryId: "esteticos",
    name: "Esperma de salmon",
    summary: "Protocolo PDRN para hidratacion profunda y regeneracion de piel.",
    duration: 70,
    price: 360,
    outcomes: ["Hidratacion profunda", "Piel revitalizada", "Textura mejorada"],
  },
  {
    id: "labios-ha",
    categoryId: "esteticos",
    name: "Labios HA",
    summary: "Perfilado y volumen de labios con acido hialuronico de alta calidad.",
    duration: 60,
    price: 380,
    outcomes: ["Labios definidos", "Volumen armonico", "Hidratacion labial"],
  },
  {
    id: "bioestimuladores",
    categoryId: "esteticos",
    name: "Bioestimuladores",
    summary: "Induccion de colageno para firmeza progresiva y contorno facial.",
    duration: 70,
    price: 410,
    outcomes: ["Firmeza progresiva", "Contorno mejorado", "Rejuvenecimiento natural"],
  },
  {
    id: "cauterizacion-verrugas",
    categoryId: "esteticos",
    name: "Cauterizacion de verrugas y lunares",
    summary: "Procedimiento para remocion controlada de lesiones cutaneas benignas.",
    duration: 50,
    price: 210,
    outcomes: ["Piel mas limpia", "Mejor textura localizada", "Recuperacion controlada"],
  },
  {
    id: "fibroblast-full-body",
    categoryId: "esteticos",
    name: "Fibroblast (Full body)",
    summary: "Tecnica de tensionado cutaneo para mejorar firmeza en multiples zonas.",
    duration: 90,
    price: 450,
    outcomes: ["Mayor firmeza", "Piel mas tersa", "Mejor apariencia corporal"],
  },
  {
    id: "prp-cabello-led",
    categoryId: "esteticos",
    name: "PRP cabello con terapia Luz LED",
    summary: "Estimulo capilar con PRP y fototerapia para fortaleza del foliculo.",
    duration: 75,
    price: 330,
    outcomes: ["Fortalecimiento capilar", "Mayor densidad visual", "Soporte al crecimiento"],
  },
  {
    id: "hollywood-peel",
    categoryId: "esteticos",
    name: "Hollywood Peel",
    summary: "Peeling laser para luminosidad, poro refinado y tono uniforme.",
    duration: 55,
    price: 280,
    outcomes: ["Glow inmediato", "Poro refinado", "Tono uniforme"],
  },
  {
    id: "laser-co2-fraccionado",
    categoryId: "laser",
    name: "Laser CO2 fraccionado",
    summary: "Rejuvenecimiento fraccionado para cicatrices, textura y lineas finas.",
    duration: 70,
    price: 420,
    outcomes: ["Textura renovada", "Cicatrices atenuadas", "Rejuvenecimiento visible"],
  },
  {
    id: "inductor-bajar-peso",
    categoryId: "corporales",
    name: "Inductor para bajar de peso",
    summary: "Protocolo corporal para estimular metabolismo y apoyo en control de peso.",
    duration: 60,
    price: 230,
    outcomes: ["Apoyo metabolico", "Plan de reduccion", "Mejor composicion corporal"],
  },
  {
    id: "quemadores-grasa",
    categoryId: "corporales",
    name: "Quemadores de grasa",
    summary: "Terapia orientada a movilizacion de grasa localizada con seguimiento.",
    duration: 55,
    price: 220,
    outcomes: ["Reduccion localizada", "Mayor definicion", "Apoyo al plan corporal"],
  },
  {
    id: "post-quirurgicos",
    categoryId: "corporales",
    name: "Post quirurgicos",
    summary: "Protocolo de recuperacion para disminuir inflamacion y acelerar rehabilitacion.",
    duration: 70,
    price: 260,
    outcomes: ["Menos edema", "Recuperacion guiada", "Mejor confort postoperatorio"],
  },
  {
    id: "terapia-led-corporal",
    categoryId: "corporales",
    name: "Terapia Luz LED",
    summary: "Fototerapia para soporte antiinflamatorio y recuperacion de tejidos.",
    duration: 40,
    price: 150,
    outcomes: ["Menor inflamacion", "Mejor recuperacion tisular", "Tratamiento no invasivo"],
  },
  {
    id: "rehabilitacion-paralisis-facial",
    categoryId: "corporales",
    name: "Rehabilitacion de paralisis facial",
    summary: "Plan terapeutico para estimular musculatura facial y funcion motora.",
    duration: 60,
    price: 240,
    outcomes: ["Mejor simetria facial", "Estimulo neuromuscular", "Recuperacion funcional"],
  },
  {
    id: "lavado-oidos",
    categoryId: "corporales",
    name: "Lavado de oidos",
    summary: "Procedimiento de higiene otica segura para confort y mejor audicion.",
    duration: 35,
    price: 95,
    outcomes: ["Mejor audicion", "Menor molestia", "Higiene segura"],
  },
  {
    id: "remocion-tatuajes",
    categoryId: "laser",
    name: "Remocion de tatuajes",
    summary: "Sesiones laser para atenuar o eliminar pigmento de tatuajes.",
    duration: 50,
    price: 260,
    outcomes: ["Disminucion de pigmento", "Piel mas uniforme", "Seguimiento por fases"],
  },
  {
    id: "remocion-manchas",
    categoryId: "laser",
    name: "Remocion de manchas",
    summary: "Tratamiento laser para reducir hiperpigmentaciones y unificar tono.",
    duration: 45,
    price: 230,
    outcomes: ["Tono mas uniforme", "Menos manchas visibles", "Mejor luminosidad"],
  },
  {
    id: "remocion-cicatrices",
    categoryId: "laser",
    name: "Remocion de cicatrices",
    summary: "Protocolo laser para suavizar relieve y apariencia de cicatrices.",
    duration: 55,
    price: 280,
    outcomes: ["Cicatrices atenuadas", "Textura mas regular", "Mejor apariencia cutanea"],
  },
  {
    id: "facial-avanzado",
    categoryId: "faciales",
    name: "Facial Avanzado",
    summary: "Limpieza profunda + microdermabrasion + mascarilla + terapia Luz LED.",
    duration: 85,
    price: 210,
    outcomes: ["Piel mas limpia", "Textura refinada", "Luminosidad saludable"],
  },
  {
    id: "facial-deluxe",
    categoryId: "faciales",
    name: "Facial Deluxe",
    summary: "Facial profundo complementado con masaje de hombros y manos.",
    duration: 90,
    price: 225,
    outcomes: ["Relajacion profunda", "Piel revitalizada", "Experiencia premium"],
  },
  {
    id: "facial-dermapen",
    categoryId: "faciales",
    name: "Facial Profundo + dermapen",
    summary: "Combinacion de limpieza avanzada y microinduccion para renovar piel.",
    duration: 80,
    price: 240,
    outcomes: ["Mejor textura", "Mayor firmeza", "Poro minimizado"],
  },
  {
    id: "hidrofacial-vitaminas",
    categoryId: "faciales",
    name: "Hidrofacial + vitaminas inducida con dermapen",
    summary: "Hidrofacial combinado con infusion vitaminica asistida por dermapen.",
    duration: 85,
    price: 255,
    outcomes: ["Hidratacion profunda", "Piel luminosa", "Nutricion dermica"],
  },
  {
    id: "hidrofacial-exosomas",
    categoryId: "faciales",
    name: "Hidrofacial + vaporozono + exosomas",
    summary: "Hidrofacial avanzado con exosomas para regeneracion y glow de alto impacto.",
    duration: 90,
    price: 310,
    outcomes: ["Regeneracion visible", "Textura uniforme", "Brillo saludable"],
  },
  {
    id: "hidrofacial-pdrn",
    categoryId: "faciales",
    name: "Hidrofacial + vaporozono + PDRN (esperma de salmon)",
    summary: "Protocolo de hidratacion profunda y bioestimulacion con PDRN.",
    duration: 90,
    price: 320,
    outcomes: ["Piel mas firme", "Hidratacion profunda", "Reparacion avanzada"],
  },
  {
    id: "hidrofacial-peeling",
    categoryId: "faciales",
    name: "Hidrofacial + vaporozono + Peeling Medico",
    summary: "Limpieza e hidratacion combinada con peeling para renovar capa superficial.",
    duration: 85,
    price: 275,
    outcomes: ["Renovacion celular", "Piel mas lisa", "Tono uniforme"],
  },
  {
    id: "hidrofacial-prp",
    categoryId: "faciales",
    name: "Hidrofacial + vaporozono + PRP (plasma rico en plaquetas)",
    summary: "Combinacion regenerativa para mejorar textura, firmeza y luminosidad facial.",
    duration: 95,
    price: 335,
    outcomes: ["Regeneracion activa", "Mayor firmeza", "Aspecto rejuvenecido"],
  },
  {
    id: "facial-espalda",
    categoryId: "faciales",
    name: "Facial de espalda",
    summary: "Limpieza profunda y tratamiento especifico para espalda.",
    duration: 65,
    price: 170,
    outcomes: ["Piel mas limpia", "Menos imperfecciones", "Textura uniforme"],
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
    name: "Dra. Laura Medallo",
    role: "Direccion clinica",
    bio: "Supervisa protocolos esteticos avanzados, seguridad y personalizacion de tratamientos.",
  },
  {
    name: "Carlos Medina",
    role: "Especialista laser",
    bio: "Lidera evaluaciones para remocion de manchas, cicatrices y protocolos CO2 fraccionado.",
  },
  {
    name: "Andrea Solis",
    role: "Especialista IV Therapy",
    bio: "Coordina sueroterapia funcional para energia, recuperacion, detox y soporte metabolico.",
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

export const socialProfiles = {
  instagram: "@medallospa",
  tiktok: "@_lareinadelossueros",
};

export const defaultSettings: SettingsRecord = {
  businessName: "MEDALLO SPA",
  headline: "Tu bienestar, nuestra prioridad. Agenda tu cita ya.",
  phone: "347 362 2889",
  email: "medallospa@gmail.com",
  address: "40-52 Junction Blvd NY 11368 (Oficina 1R / Oficina /R)",
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
    serviceId: "facial-avanzado",
    serviceName: "Facial Avanzado",
    categoryId: "faciales",
    staff: "Equipo Medallo",
    startsAt: createDateAtHour(0, 10, 0),
    duration: 85,
    price: 210,
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
    serviceId: "post-quirurgicos",
    serviceName: "Post quirurgicos",
    categoryId: "corporales",
    staff: "Equipo Medallo",
    startsAt: createDateAtHour(0, 14, 30),
    duration: 70,
    price: 260,
    status: "En sala",
    customerName: "Carlos Rivera",
    email: "carlos@email.com",
    phone: "+54 9 11 3333 2211",
    origin: "Referido",
    createdAt: createDateAtHour(-4, 9, 30),
  },
  {
    id: "apt-seed-3",
    serviceId: "suero-energy",
    serviceName: "Suero Energy",
    categoryId: "sueroterapia",
    staff: "Equipo Medallo",
    startsAt: createDateAtHour(1, 9, 0),
    duration: 40,
    price: 180,
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
    serviceId: "remocion-manchas",
    serviceName: "Remocion de manchas",
    categoryId: "laser",
    staff: "Equipo Medallo",
    startsAt: createDateAtHour(2, 17, 0),
    duration: 45,
    price: 230,
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
    preferredService: "Facial Deluxe",
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
    preferredService: "Suero de Vida",
    totalVisits: 2,
    totalSpent: 340,
    origin: "Google",
    createdAt: createDateAtHour(-20, 16, 0),
  },
];
