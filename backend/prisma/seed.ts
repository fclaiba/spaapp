import bcrypt from "bcryptjs";
import { PrismaClient, Role, LeadSource, AppointmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    externalId: "suero-vida",
    categoryId: "sueroterapia",
    name: "Suero de Vida",
    summary: "Formula integral para hidratacion celular y recuperacion general.",
    duration: 45,
    price: 185,
  },
  {
    externalId: "suero-antiinflamatorio",
    categoryId: "sueroterapia",
    name: "Suero Antiinflamatorio",
    summary: "Soporte intravenoso para procesos inflamatorios y confort fisico.",
    duration: 45,
    price: 190,
  },
  {
    externalId: "suero-detox",
    categoryId: "sueroterapia",
    name: "Suero Detox",
    summary: "Protocolo orientado a depuracion y balance metabolico.",
    duration: 45,
    price: 180,
  },
  {
    externalId: "suero-nad",
    categoryId: "sueroterapia",
    name: "Suero NAD+",
    summary: "Terapia de soporte celular para energia y rendimiento.",
    duration: 60,
    price: 260,
  },
  {
    externalId: "suero-hierro",
    categoryId: "sueroterapia",
    name: "Suero de Hierro",
    summary: "Soporte intravenoso para mejorar cansancio asociado a hierro.",
    duration: 45,
    price: 175,
  },
  {
    externalId: "suero-colageno",
    categoryId: "sueroterapia",
    name: "Suero de Colageno",
    summary: "Infusion para soporte dermico y elasticidad.",
    duration: 45,
    price: 195,
  },
  {
    externalId: "suero-hormonal",
    categoryId: "sueroterapia",
    name: "Suero Hormonal",
    summary: "Protocolo de soporte para equilibrio funcional hormonal.",
    duration: 50,
    price: 220,
  },
  {
    externalId: "suero-insomnio",
    categoryId: "sueroterapia",
    name: "Suero para el Insomnio",
    summary: "Infusion orientada a relajacion y calidad de sueño.",
    duration: 45,
    price: 185,
  },
  {
    externalId: "suero-potencia",
    categoryId: "sueroterapia",
    name: "Suero Potencia",
    summary: "Soporte para rendimiento fisico y respuesta funcional.",
    duration: 45,
    price: 210,
  },
  {
    externalId: "suero-barbie",
    categoryId: "sueroterapia",
    name: "Suero Barbie",
    summary: "Cocktail estetico de hidratacion y vitaminas para glow rapido.",
    duration: 45,
    price: 205,
  },
  {
    externalId: "suero-energy",
    categoryId: "sueroterapia",
    name: "Suero Energy",
    summary: "Infusion vitaminica para combatir fatiga.",
    duration: 40,
    price: 180,
  },
  {
    externalId: "suero-lactancia",
    categoryId: "sueroterapia",
    name: "Suero Lactancia",
    summary: "Soporte de hidratacion y micronutrientes durante lactancia.",
    duration: 40,
    price: 175,
  },
  {
    externalId: "suero-cardio-safe",
    categoryId: "sueroterapia",
    name: "Suero Cardio Safe",
    summary: "Protocolo de soporte cardiovascular en contexto preventivo.",
    duration: 50,
    price: 225,
  },
  {
    externalId: "suero-gluco",
    categoryId: "sueroterapia",
    name: "Suero Gluco para diabeticos",
    summary: "Soporte metabolico funcional para pacientes diabeticos.",
    duration: 50,
    price: 215,
  },
  {
    externalId: "prp-estetico",
    categoryId: "esteticos",
    name: "Plasma rico en plaquetas (PRP)",
    summary: "Bioestimulacion con PRP para rejuvenecimiento.",
    duration: 70,
    price: 320,
  },
  {
    externalId: "botox",
    categoryId: "esteticos",
    name: "Botox",
    summary: "Aplicacion para suavizar lineas de expresion.",
    duration: 45,
    price: 340,
  },
  {
    externalId: "exosomas",
    categoryId: "esteticos",
    name: "Exosomas",
    summary: "Terapia regenerativa avanzada para piel.",
    duration: 75,
    price: 390,
  },
  {
    externalId: "esperma-salmon",
    categoryId: "esteticos",
    name: "Esperma de salmon",
    summary: "Protocolo PDRN para hidratacion profunda.",
    duration: 70,
    price: 360,
  },
  {
    externalId: "labios-ha",
    categoryId: "esteticos",
    name: "Labios HA",
    summary: "Perfilado y volumen de labios con acido hialuronico.",
    duration: 60,
    price: 380,
  },
  {
    externalId: "bioestimuladores",
    categoryId: "esteticos",
    name: "Bioestimuladores",
    summary: "Induccion de colageno para firmeza progresiva.",
    duration: 70,
    price: 410,
  },
  {
    externalId: "cauterizacion-verrugas",
    categoryId: "esteticos",
    name: "Cauterizacion de verrugas y lunares",
    summary: "Remocion controlada de lesiones cutaneas benignas.",
    duration: 50,
    price: 210,
  },
  {
    externalId: "fibroblast-full-body",
    categoryId: "esteticos",
    name: "Fibroblast (Full body)",
    summary: "Tensionado cutaneo para mejorar firmeza en zonas corporales.",
    duration: 90,
    price: 450,
  },
  {
    externalId: "prp-cabello-led",
    categoryId: "esteticos",
    name: "PRP cabello con terapia Luz LED",
    summary: "Estimulo capilar con PRP y fototerapia.",
    duration: 75,
    price: 330,
  },
  {
    externalId: "hollywood-peel",
    categoryId: "esteticos",
    name: "Hollywood Peel",
    summary: "Peeling laser para luminosidad y tono uniforme.",
    duration: 55,
    price: 280,
  },
  {
    externalId: "laser-co2-fraccionado",
    categoryId: "laser",
    name: "Laser CO2 fraccionado",
    summary: "Rejuvenecimiento fraccionado para cicatrices y textura.",
    duration: 70,
    price: 420,
  },
  {
    externalId: "inductor-bajar-peso",
    categoryId: "corporales",
    name: "Inductor para bajar de peso",
    summary: "Protocolo para estimular metabolismo y control de peso.",
    duration: 60,
    price: 230,
  },
  {
    externalId: "quemadores-grasa",
    categoryId: "corporales",
    name: "Quemadores de grasa",
    summary: "Terapia orientada a grasa localizada con seguimiento.",
    duration: 55,
    price: 220,
  },
  {
    externalId: "post-quirurgicos",
    categoryId: "corporales",
    name: "Post quirurgicos",
    summary: "Protocolo de recuperacion postoperatoria.",
    duration: 70,
    price: 260,
  },
  {
    externalId: "terapia-led-corporal",
    categoryId: "corporales",
    name: "Terapia Luz LED",
    summary: "Fototerapia corporal antiinflamatoria.",
    duration: 40,
    price: 150,
  },
  {
    externalId: "rehabilitacion-paralisis-facial",
    categoryId: "corporales",
    name: "Rehabilitacion de paralisis facial",
    summary: "Plan terapeutico para estimular musculatura facial.",
    duration: 60,
    price: 240,
  },
  {
    externalId: "lavado-oidos",
    categoryId: "corporales",
    name: "Lavado de oidos",
    summary: "Procedimiento de higiene otica segura.",
    duration: 35,
    price: 95,
  },
  {
    externalId: "remocion-tatuajes",
    categoryId: "laser",
    name: "Remocion de tatuajes",
    summary: "Sesiones laser para atenuar pigmento de tatuajes.",
    duration: 50,
    price: 260,
  },
  {
    externalId: "remocion-manchas",
    categoryId: "laser",
    name: "Remocion de manchas",
    summary: "Tratamiento laser para reducir hiperpigmentaciones.",
    duration: 45,
    price: 230,
  },
  {
    externalId: "remocion-cicatrices",
    categoryId: "laser",
    name: "Remocion de cicatrices",
    summary: "Protocolo laser para suavizar cicatrices.",
    duration: 55,
    price: 280,
  },
  {
    externalId: "facial-avanzado",
    categoryId: "faciales",
    name: "Facial Avanzado",
    summary: "Limpieza profunda + microdermabrasion + mascarilla + LED.",
    duration: 85,
    price: 210,
  },
  {
    externalId: "facial-deluxe",
    categoryId: "faciales",
    name: "Facial Deluxe",
    summary: "Facial profundo con masaje de hombros y manos.",
    duration: 90,
    price: 225,
  },
  {
    externalId: "facial-dermapen",
    categoryId: "faciales",
    name: "Facial Profundo + dermapen",
    summary: "Limpieza avanzada y microinduccion para renovar piel.",
    duration: 80,
    price: 240,
  },
  {
    externalId: "hidrofacial-vitaminas",
    categoryId: "faciales",
    name: "Hidrofacial + vitaminas inducida con dermapen",
    summary: "Hidrofacial con infusion vitaminica asistida.",
    duration: 85,
    price: 255,
  },
  {
    externalId: "hidrofacial-exosomas",
    categoryId: "faciales",
    name: "Hidrofacial + vaporozono + exosomas",
    summary: "Hidrofacial avanzado con exosomas para regeneracion.",
    duration: 90,
    price: 310,
  },
  {
    externalId: "hidrofacial-pdrn",
    categoryId: "faciales",
    name: "Hidrofacial + vaporozono + PDRN (esperma de salmon)",
    summary: "Protocolo de hidratacion y bioestimulacion con PDRN.",
    duration: 90,
    price: 320,
  },
  {
    externalId: "hidrofacial-peeling",
    categoryId: "faciales",
    name: "Hidrofacial + vaporozono + Peeling Medico",
    summary: "Limpieza e hidratacion con peeling medico.",
    duration: 85,
    price: 275,
  },
  {
    externalId: "hidrofacial-prp",
    categoryId: "faciales",
    name: "Hidrofacial + vaporozono + PRP (plasma rico en plaquetas)",
    summary: "Combinacion regenerativa para firmeza y luminosidad.",
    duration: 95,
    price: 335,
  },
  {
    externalId: "facial-espalda",
    categoryId: "faciales",
    name: "Facial de espalda",
    summary: "Limpieza profunda y tratamiento especifico para espalda.",
    duration: 65,
    price: 170,
  },
];

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@medallospa.com" },
    update: {},
    create: {
      email: "admin@medallospa.com",
      fullName: "Admin Medallo",
      role: Role.admin,
      passwordHash: adminPassword,
    },
  });

  await prisma.settings.upsert({
    where: { id: "default-settings" },
    update: {},
    create: {
      id: "default-settings",
      businessName: "MEDALLO SPA",
      headline: "Tu bienestar, nuestra prioridad. Agenda tu cita ya.",
      phone: "347 362 2889",
      email: "medallospa@gmail.com",
      address: "40-52 Junction Blvd NY 11368 (Oficina 1R / Oficina /R)",
      bookingLeadTimeHours: 4,
      reminderEnabled: true,
      cancellationWindowHours: 24,
      updatedByUserId: adminUser.id,
    },
  });

  for (const service of services) {
    await prisma.service.upsert({
      where: { externalId: service.externalId },
      update: service,
      create: service,
    });
  }

  const sampleClient = await prisma.client.upsert({
    where: { email: "valentina@email.com" },
    update: {},
    create: {
      name: "Valentina Mendoza",
      email: "valentina@email.com",
      phone: "+54 9 11 1234 5678",
      preferredService: "Facial Deluxe",
      origin: LeadSource.Instagram,
      totalVisits: 1,
      totalSpent: 145,
    },
  });

  const service = await prisma.service.findUnique({
    where: { externalId: "facial-avanzado" },
  });

  if (service) {
    await prisma.appointment.upsert({
      where: { id: "seed-appointment-1" },
      update: {},
      create: {
        id: "seed-appointment-1",
        serviceId: service.id,
        clientId: sampleClient.id,
        staff: "Dra. Isabella Rossi",
        startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: service.duration,
        price: service.price,
        status: AppointmentStatus.Confirmada,
        source: LeadSource.Instagram,
        notes: "Semilla inicial de entorno dev.",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
