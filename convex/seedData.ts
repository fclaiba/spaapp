export interface ServiceData {
  id: string;
  categoryId: string;
  name: string;
  duration: number;
  price: number;
}

export const services: ServiceData[] = [
  { id: "suero-vida", categoryId: "sueroterapia", name: "Suero de Vida", duration: 45, price: 185 },
  { id: "suero-antiinflamatorio", categoryId: "sueroterapia", name: "Suero Antiinflamatorio", duration: 45, price: 190 },
  { id: "suero-detox", categoryId: "sueroterapia", name: "Suero Detox", duration: 45, price: 180 },
  { id: "suero-nad", categoryId: "sueroterapia", name: "Suero NAD+", duration: 60, price: 260 },
  { id: "suero-hierro", categoryId: "sueroterapia", name: "Suero de Hierro", duration: 45, price: 175 },
  { id: "suero-colageno", categoryId: "sueroterapia", name: "Suero de Colageno", duration: 45, price: 195 },
  { id: "suero-hormonal", categoryId: "sueroterapia", name: "Suero Hormonal", duration: 50, price: 220 },
  { id: "suero-insomnio", categoryId: "sueroterapia", name: "Suero para el Insomnio", duration: 45, price: 185 },
  { id: "suero-potencia", categoryId: "sueroterapia", name: "Suero Potencia", duration: 45, price: 210 },
  { id: "suero-barbie", categoryId: "sueroterapia", name: "Suero Barbie", duration: 45, price: 205 },
  { id: "suero-energy", categoryId: "sueroterapia", name: "Suero Energy", duration: 40, price: 180 },
  { id: "suero-lactancia", categoryId: "sueroterapia", name: "Suero Lactancia", duration: 40, price: 175 },
  { id: "suero-cardio-safe", categoryId: "sueroterapia", name: "Suero Cardio Safe", duration: 50, price: 225 },
  { id: "suero-gluco", categoryId: "sueroterapia", name: "Suero Gluco para diabeticos", duration: 50, price: 215 },
  { id: "prp-estetico", categoryId: "esteticos", name: "Plasma rico en plaquetas (PRP)", duration: 70, price: 320 },
  { id: "botox", categoryId: "esteticos", name: "Botox", duration: 45, price: 340 },
  { id: "exosomas", categoryId: "esteticos", name: "Exosomas", duration: 75, price: 390 },
  { id: "esperma-salmon", categoryId: "esteticos", name: "Esperma de salmon", duration: 70, price: 360 },
  { id: "labios-ha", categoryId: "esteticos", name: "Labios HA", duration: 60, price: 380 },
  { id: "bioestimuladores", categoryId: "esteticos", name: "Bioestimuladores", duration: 70, price: 410 },
  { id: "cauterizacion-verrugas", categoryId: "esteticos", name: "Cauterizacion de verrugas y lunares", duration: 50, price: 210 },
  { id: "fibroblast-full-body", categoryId: "esteticos", name: "Fibroblast (Full body)", duration: 90, price: 450 },
  { id: "prp-cabello-led", categoryId: "esteticos", name: "PRP cabello con terapia Luz LED", duration: 75, price: 330 },
  { id: "hollywood-peel", categoryId: "esteticos", name: "Hollywood Peel", duration: 55, price: 280 },
  { id: "laser-co2-fraccionado", categoryId: "laser", name: "Laser CO2 fraccionado", duration: 70, price: 420 },
  { id: "inductor-bajar-peso", categoryId: "corporales", name: "Inductor para bajar de peso", duration: 60, price: 230 },
  { id: "quemadores-grasa", categoryId: "corporales", name: "Quemadores de grasa", duration: 55, price: 220 },
  { id: "post-quirurgicos", categoryId: "corporales", name: "Post quirurgicos", duration: 70, price: 260 },
  { id: "terapia-led-corporal", categoryId: "corporales", name: "Terapia Luz LED", duration: 40, price: 150 },
  { id: "rehabilitacion-paralisis-facial", categoryId: "corporales", name: "Rehabilitacion de paralisis facial", duration: 60, price: 240 },
  { id: "lavado-oidos", categoryId: "corporales", name: "Lavado de oidos", duration: 35, price: 95 },
  { id: "remocion-tatuajes", categoryId: "laser", name: "Remocion de tatuajes", duration: 50, price: 260 },
  { id: "remocion-manchas", categoryId: "laser", name: "Remocion de manchas", duration: 45, price: 230 },
  { id: "remocion-cicatrices", categoryId: "laser", name: "Remocion de cicatrices", duration: 55, price: 280 },
  { id: "facial-avanzado", categoryId: "faciales", name: "Facial Avanzado", duration: 85, price: 210 },
  { id: "facial-deluxe", categoryId: "faciales", name: "Facial Deluxe", duration: 90, price: 225 },
  { id: "facial-dermapen", categoryId: "faciales", name: "Facial Profundo + dermapen", duration: 80, price: 240 },
  { id: "hidrofacial-vitaminas", categoryId: "faciales", name: "Hidrofacial + vitaminas inducida con dermapen", duration: 85, price: 255 },
  { id: "hidrofacial-exosomas", categoryId: "faciales", name: "Hidrofacial + vaporozono + exosomas", duration: 90, price: 310 },
  { id: "hidrofacial-pdrn", categoryId: "faciales", name: "Hidrofacial + vaporozono + PDRN (esperma de salmon)", duration: 90, price: 320 },
  { id: "hidrofacial-peeling", categoryId: "faciales", name: "Hidrofacial + vaporozono + Peeling Medico", duration: 85, price: 275 },
  { id: "hidrofacial-prp", categoryId: "faciales", name: "Hidrofacial + vaporozono + PRP (plasma rico en plaquetas)", duration: 95, price: 335 },
  { id: "facial-espalda", categoryId: "faciales", name: "Facial de espalda", duration: 65, price: 170 },
];
