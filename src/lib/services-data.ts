import type { IndividualService } from './types';

export const services: IndividualService[] = [
  // Sillas y Mesas
  { id: 'silla-plastica', categoria: 'Sillas y Mesas', nombre: 'Silla plástica estándar', descripcion: 'Silla plástica estándar para eventos.', precioUnitario: 3500, tipoCobro: 'unidad' },
  { id: 'silla-rimas', categoria: 'Sillas y Mesas', nombre: 'Silla en rimas', descripcion: 'Sillas apiladas, sin forro.', precioUnitario: 4000, tipoCobro: 'unidad' },
  { id: 'forro-silla', categoria: 'Sillas y Mesas', nombre: 'Forro para silla', descripcion: 'Elegante forro decorativo para sillas.', precioUnitario: 2500, tipoCobro: 'unidad' },
  { id: 'mesa-plastica', categoria: 'Sillas y Mesas', nombre: 'Mesa plástica', descripcion: 'Mesa redonda o rectangular.', precioUnitario: 15000, tipoCobro: 'unidad' },
  { id: 'mesa-doble', categoria: 'Sillas y Mesas', nombre: 'Mesa doble', descripcion: 'Mesa rectangular para 8-10 personas.', precioUnitario: 20000, tipoCobro: 'unidad' },
  { id: 'mesa-coctel', categoria: 'Sillas y Mesas', nombre: 'Mesa tipo cóctel', descripcion: 'Mesa alta para áreas de socialización.', precioUnitario: 25000, tipoCobro: 'unidad' },
  { id: 'mantel', categoria: 'Sillas y Mesas', nombre: 'Mantel', descripcion: 'Mantel básico para mesas.', precioUnitario: 10000, tipoCobro: 'unidad' },
  { id: 'sobremantel', categoria: 'Sillas y Mesas', nombre: 'Sobremantel', descripcion: 'Cubre-mantel decorativo en varios colores.', precioUnitario: 8000, tipoCobro: 'unidad' },

  // Tarimas
  { id: 'tarima-basica', categoria: 'Tarimas', nombre: 'Tarima básica (2x1 m)', descripcion: 'Módulo de tarima estándar (2x1m).', precioUnitario: 50000, tipoCobro: 'unidad' },
  { id: 'tarima-reforzada', categoria: 'Tarimas', nombre: 'Tarima reforzada', descripcion: 'Módulo de tarima de alta resistencia.', precioUnitario: 70000, tipoCobro: 'unidad' },
  { id: 'tarima-dj', categoria: 'Tarimas', nombre: 'Tarima para DJ', descripcion: 'Estructura elevada para cabina de DJ.', precioUnitario: 150000, tipoCobro: 'paquete' },
  { id: 'tarima-protocolo', categoria: 'Tarimas', nombre: 'Tarima para protocolo', descripcion: 'Tarima elegante para ceremonias.', precioUnitario: 200000, tipoCobro: 'paquete' },
  { id: 'tarima-360-240', categoria: 'Tarimas', nombre: 'Tarima 3.60m x 2.40m', descripcion: 'Por día, transporte según lugar.', precioUnitario: 252000, tipoCobro: 'paquete' },
  { id: 'tarima-360-360', categoria: 'Tarimas', nombre: 'Tarima 3.60m x 3.60m', descripcion: 'Por día, transporte según lugar.', precioUnitario: 364000, tipoCobro: 'paquete' },
  { id: 'tarima-5-5', categoria: 'Tarimas', nombre: 'Tarima 5m x 5m', descripcion: 'Por día, transporte según lugar.', precioUnitario: 770000, tipoCobro: 'paquete' },
  { id: 'tarima-6-5', categoria: 'Tarimas', nombre: 'Tarima 6m x 5m', descripcion: 'Por día, transporte según lugar.', precioUnitario: 840000, tipoCobro: 'paquete' },
  
  // Sonido e Iluminación
  { id: 'sonido-50-100', categoria: 'Sonido e Iluminación', nombre: 'Sonido e iluminación (50-100 personas)', descripcion: 'Paquete de sonido y luces básicas.', precioUnitario: 600000, tipoCobro: 'paquete' },
  { id: 'sonido-100-200', categoria: 'Sonido e Iluminación', nombre: 'Sonido e iluminación (100-200 personas)', descripcion: 'Paquete de sonido y luces estándar.', precioUnitario: 800000, tipoCobro: 'paquete' },
  { id: 'sonido-200-400', categoria: 'Sonido e Iluminación', nombre: 'Sonido e iluminación (200-400 personas)', descripcion: 'Paquete de sonido y luces avanzado.', precioUnitario: 1000000, tipoCobro: 'paquete' },
  { id: 'sonido-400-500', categoria: 'Sonido e Iluminación', nombre: 'Sonido e iluminación (400-500 personas)', descripcion: 'Sonido profesional para grandes audiencias.', precioUnitario: 2500000, tipoCobro: 'paquete' },
  { id: 'sonido-800-1000', categoria: 'Sonido e Iluminación', nombre: 'Sonido e iluminación (800-1000 personas)', descripcion: 'Sistema de sonido para conciertos.', precioUnitario: 4000000, tipoCobro: 'paquete' },

  // Música y Animación
  { id: 'dj', categoria: 'Música y Animación', nombre: 'DJ (evento)', descripcion: 'DJ profesional con mezcla en vivo.', precioUnitario: 250000, tipoCobro: 'paquete' },
  { id: 'animador', categoria: 'Música y Animación', nombre: 'Animador', descripcion: 'Anima y conduce tu evento.', precioUnitario: 200000, tipoCobro: 'paquete' },
  { id: 'maestro-ceremonias', categoria: 'Música y Animación', nombre: 'Maestro de ceremonias', descripcion: 'Conductor profesional para el protocolo.', precioUnitario: 280000, tipoCobro: 'paquete' },
  { id: 'grupo-musical', categoria: 'Música y Animación', nombre: 'Grupo musical en vivo (1 hora)', descripcion: 'Banda en vivo (precio base por hora).', precioUnitario: 1100000, tipoCobro: 'paquete' },
  
  // Alimentación
  { id: 'plato-2-carnes', categoria: 'Alimentación', nombre: 'Plato fuerte 2 carnes', descripcion: 'Menú con dos opciones de proteína.', precioUnitario: 35000, tipoCobro: 'persona' },
  { id: 'plato-3-carnes', categoria: 'Alimentación', nombre: 'Plato fuerte 3 carnes', descripcion: 'Menú premium con tres opciones de proteína.', precioUnitario: 45000, tipoCobro: 'persona' },
  { id: 'menu-ejecutivo', categoria: 'Alimentación', nombre: 'Menú ejecutivo', descripcion: 'Opción balanceada para eventos corporativos.', precioUnitario: 35000, tipoCobro: 'persona' },
  { id: 'menu-infantil', categoria: 'Alimentación', nombre: 'Menú infantil', descripcion: 'Opciones divertidas para los más pequeños.', precioUnitario: 25000, tipoCobro: 'persona' },
  { id: 'pasabocas-salados', categoria: 'Alimentación', nombre: 'Pasabocas salados', descripcion: 'Variedad de bocadillos de sal por persona.', precioUnitario: 2500, tipoCobro: 'persona' },
  { id: 'pasabocas-dulces', categoria: 'Alimentación', nombre: 'Pasabocas dulces', descripcion: 'Variedad de bocadillos de dulce por persona.', precioUnitario: 2000, tipoCobro: 'persona' },
  { id: 'mesa-postres', categoria: 'Alimentación', nombre: 'Mesa de postres', descripcion: 'Mesa surtida con postres variados.', precioUnitario: 800000, tipoCobro: 'paquete' },
  { id: 'pastel', categoria: 'Alimentación', nombre: 'Pastel (50-70 porciones)', descripcion: 'Pastel temático para 50-70 porciones.', precioUnitario: 180000, tipoCobro: 'paquete' },
  { id: 'refrigerios', categoria: 'Alimentación', nombre: 'Refrigerio', descripcion: 'Opción ligera para pausas.', precioUnitario: 12000, tipoCobro: 'persona' },

  // Bebidas
  { id: 'gaseosa', categoria: 'Bebidas', nombre: 'Gaseosa ilimitada', descripcion: 'Gaseosa ilimitada durante el evento.', precioUnitario: 7000, tipoCobro: 'persona' },
  { id: 'agua', categoria: 'Bebidas', nombre: 'Agua', descripcion: 'Agua embotellada con y sin gas.', precioUnitario: 3000, tipoCobro: 'persona' },
  { id: 'jugos-naturales', categoria: 'Bebidas', nombre: 'Jugos naturales', descripcion: 'Barra de jugos naturales.', precioUnitario: 9000, tipoCobro: 'persona' },
  { id: 'bebidas-calientes', categoria: 'Bebidas', nombre: 'Bebidas calientes', descripcion: 'Estación de café, té y aromáticas.', precioUnitario: 8000, tipoCobro: 'persona' },
  { id: 'cocteles-sin-alcohol', categoria: 'Bebidas', nombre: 'Cócteles sin alcohol', descripcion: 'Mocktails y cócteles sin licor.', precioUnitario: 8000, tipoCobro: 'persona' },
  { id: 'whisky', categoria: 'Bebidas', nombre: 'Whisky 700 ml', descripcion: 'Botella de Whisky 700ml (precio base).', precioUnitario: 90000, tipoCobro: 'unidad' },

  // Decoración
  { id: 'decoracion-basica', categoria: 'Decoración', nombre: 'Decoración básica', descripcion: 'Decoración estándar del salón.', precioUnitario: 450000, tipoCobro: 'paquete' },
  { id: 'decoracion-tematica', categoria: 'Decoración', nombre: 'Decoración temática', descripcion: 'Ambiente personalizado para tu evento.', precioUnitario: 850000, tipoCobro: 'paquete' },
  { id: 'decoracion-premium', categoria: 'Decoración', nombre: 'Decoración premium', descripcion: 'Decoración de lujo con detalles exclusivos.', precioUnitario: 3000000, tipoCobro: 'paquete' },
  { id: 'centros-mesa', categoria: 'Decoración', nombre: 'Centro de mesa', descripcion: 'Arreglo floral o temático por mesa.', precioUnitario: 80000, tipoCobro: 'unidad' },
  { id: 'arco-globos', categoria: 'Decoración', nombre: 'Arco de globos', descripcion: 'Arco orgánico de globos para entrada o fondo.', precioUnitario: 450000, tipoCobro: 'paquete' },
  { id: 'flores-naturales', categoria: 'Decoración', nombre: 'Flores naturales', descripcion: 'Arreglos florales adicionales.', precioUnitario: 900000, tipoCobro: 'paquete' },
  { id: 'letras-gigantes', categoria: 'Decoración', nombre: 'Letras gigantes iluminadas', descripcion: 'Letras 3D iluminadas (ej. LOVE, MIS 15).', precioUnitario: 500000, tipoCobro: 'paquete' },
];
