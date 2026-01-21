export type Theme = {
  title: string;
  image: string; // Corresponds to the id in placeholder-images.json
};

export type ThemeCategory = {
  id: string;
  title: string;
  description: string;
  themes: Theme[];
};

export const themeCategories: ThemeCategory[] = [
  {
    id: '15-anos',
    title: 'Temáticas para 15 Años',
    description: 'Ideas creativas y originales para una fiesta de 15 años inolvidable.',
    themes: [
      { title: 'Fiesta Neón', image: 'theme-15-neon' },
      { title: 'Noche de Hollywood', image: 'theme-15-hollywood' },
      { title: 'Baile de Máscaras', image: 'theme-15-masquerade' },
      { title: 'Época Vintage', image: 'theme-15-vintage' },
      { title: 'Cuento de Princesas', image: 'theme-15-princess' },
      { title: 'Una Noche en París', image: 'theme-15-paris' },
      { title: 'Fiesta Hawaiana', image: 'theme-15-hawaiian' },
      { title: 'Estilo Boho Chic', image: 'theme-15-boho' },
    ],
  },
  {
    id: 'matrimonios',
    title: 'Temáticas para Matrimonios',
    description: 'Inspírate con estos estilos para dar el "sí, quiero" en un ambiente único.',
    themes: [
      { title: 'Boda Rústica', image: 'theme-wedding-rustic' },
      { title: 'Matrimonio Clásico', image: 'theme-wedding-classic' },
      { title: 'Boda en la Playa', image: 'theme-wedding-beach' },
      { title: 'Celebración en el Jardín', image: 'theme-wedding-garden' },
      { title: 'Estilo Moderno', image: 'theme-wedding-modern' },
      { title: 'Boda Vintage', image: 'theme-wedding-vintage' },
      { title: 'Unión Bohemía', image: 'theme-wedding-bohemian' },
      { title: 'Estilo Industrial', image: 'theme-wedding-industrial' },
    ],
  },
  {
    id: 'empresariales',
    title: 'Temáticas para Fiestas Empresariales',
    description: 'Transforma tu evento corporativo en una experiencia memorable para todos.',
    themes: [
      { title: 'Noche de Casino', image: 'theme-corp-casino' },
      { title: 'Fiesta de los 80', image: 'theme-corp-80s' },
      { title: 'Noche de Premios', image: 'theme-corp-awards' },
      { title: 'Luau Tropical', image: 'theme-corp-luau' },
      { title: 'Superhéroes en la Oficina', image: 'theme-corp-superhero' },
      { title: 'Gala Blanco y Negro', image: 'theme-corp-blackwhite' },
      { title: 'Baile de Máscaras', image: 'theme-corp-masquerade' },
      { title: 'Mundo Invernal', image: 'theme-corp-winter' },
    ],
  },
  {
    id: 'despedidas',
    title: 'Temáticas para Despedidas de Empresa',
    description: 'Cierra el año con broche de oro con una fiesta que nadie olvidará.',
    themes: [
      { title: 'Fiesta Retro', image: 'theme-farewell-retro' },
      { title: 'Noche de Disfraces', image: 'theme-farewell-costume' },
      { title: 'Noche de Casino', image: 'theme-farewell-casino' },
      { title: 'Olimpiadas Deportivas', image: 'theme-farewell-sports' },
      { title: 'Glamour de Hollywood', image: 'theme-farewell-hollywood' },
      { title: 'Fiesta Mexicana', image: 'theme-farewell-mexican' },
      { title: 'Noche Caribeña', image: 'theme-farewell-caribbean' },
      { title: 'Fiesta del Oeste', image: 'theme-farewell-western' },
    ],
  },
];
