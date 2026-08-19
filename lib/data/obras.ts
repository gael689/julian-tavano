export type Obra = {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [lng, lat]
  images?: { src: string; alt: string; caption?: string }[];
  description?: { es: string; en: string };
  year?: number;
  category?: "vivienda" | "comercial" | "modular" | "ampliacion";
};

export const OBRAS: Obra[] = [
  { id: 'cabana-dana',            name: 'Cabaña Dana',           location: 'Monte Hermoso',          coordinates: [-61.314917, -38.984639], category: 'vivienda' },
  { id: 'casa-nestor',            name: 'Casa Néstor',           location: 'Monte Hermoso',          coordinates: [-61.281583, -38.985556], category: 'vivienda' },
  { id: 'proyecto-parador',       name: 'Proyecto Parador',      location: 'Monte Hermoso',          coordinates: [-61.277167, -38.989250], category: 'vivienda' },
  { id: 'casa-agus-l',            name: 'Casa Agus L.',          location: 'Monte Hermoso',          coordinates: [-61.188194, -38.992028], category: 'vivienda' },
  { id: 'modulo-luci',            name: 'Módulo Lucí',           location: 'Monte Hermoso',          coordinates: [-61.320750, -38.980639], category: 'vivienda' },
  { id: 'alpina-liliana',         name: 'Alpina Liliana',        location: 'Monte Hermoso',          coordinates: [-61.218472, -38.990583], category: 'vivienda' },
  { id: 'alpina-liliana-2',       name: 'Alpina Liliana',        location: 'Monte Hermoso',          coordinates: [-61.218472, -38.990639], category: 'vivienda' },
  { id: 'casa-jose',              name: 'Casa José',             location: 'Balneario Sauce Grande', coordinates: [-61.218667, -38.993111], category: 'vivienda' },
  { id: 'proyecto-oscar',         name: 'Proyecto Oscar',        location: 'Monte Hermoso',          coordinates: [-61.238361, -38.989556], category: 'vivienda' },
  { id: 'casa-marisa',            name: 'Casa Marisa',           location: 'Balneario Sauce Grande', coordinates: [-61.233028, -38.991861], category: 'vivienda' },
  { id: 'proyecto-maria-jose',    name: 'Proyecto María José',   location: 'Monte Hermoso',          coordinates: [-61.220972, -38.991944], category: 'vivienda' },
  { id: 'alpinas-hugo',           name: 'Alpinas Hugo',          location: 'Balneario Sauce Grande', coordinates: [-61.209833, -38.993028], category: 'vivienda' },
  { id: 'casa-juanjo',            name: 'Casa Juanjo',           location: 'Monte Hermoso',          coordinates: [-61.195917, -38.996583], category: 'vivienda' },
  { id: 'serafin',                name: 'Serafín',               location: 'Monte Hermoso',          coordinates: [-61.286556, -38.983472], category: 'vivienda' },
  { id: 'proyecto-casa-laurel',   name: 'Proyecto Casa Laurel',  location: 'Monte Hermoso',          coordinates: [-61.294444, -38.975306], category: 'vivienda' },
  { id: 'proyecto-chilena',       name: 'Proyecto Chilena',      location: 'Monte Hermoso',          coordinates: [-61.280333, -38.981306], category: 'vivienda' },
  { id: 'casa-silos',             name: 'Casa Silos',            location: 'Monte Hermoso',          coordinates: [-61.293472, -38.976667], category: 'vivienda' },
  { id: 'proyecto-martin',        name: 'Proyecto Martín',       location: 'Monte Hermoso',          coordinates: [-61.315972, -38.980222], category: 'vivienda' },
  { id: 'proyecto-petroquimicos', name: 'Proyecto Petroquímicos', location: 'Monte Hermoso',         coordinates: [-61.325306, -38.982694], category: 'vivienda' },
  { id: 'casa-pablo-c',           name: 'Casa Pablo C.',         location: 'Monte Hermoso',          coordinates: [-61.328750, -38.982000], category: 'vivienda' },
  { id: 'obra-pablo',             name: 'Obra Pablo',            location: 'Monte Hermoso',          coordinates: [-61.330028, -38.984278], category: 'vivienda' },
  { id: 'casa-cristina',          name: 'Casa Cristina',         location: 'Monte Hermoso',          coordinates: [-61.282944, -38.987056], category: 'vivienda' },
  { id: 'obra-el-pato',           name: 'Obra El Pato',          location: 'Monte Hermoso',          coordinates: [-61.272639, -38.983472], category: 'vivienda' },
  { id: 'duplex-flamencos',       name: 'Dúplex Flamencos',      location: 'Monte Hermoso',          coordinates: [-61.275250, -38.986583], category: 'vivienda' },
  { id: 'casa-daniel-g',          name: 'Casa Daniel G.',        location: 'Monte Hermoso',          coordinates: [-61.279750, -38.982472], category: 'vivienda' },
  { id: 'casa-guille-y-facu',     name: 'Casa Guille y Facu',    location: 'Monte Hermoso',          coordinates: [-61.279722, -38.986083], category: 'vivienda' },
  { id: 'supermercado-chino',     name: 'Supermercado Chino',    location: 'Monte Hermoso',          coordinates: [-61.298611, -38.986861], category: 'vivienda' },
  { id: 'fachada-sansot',         name: 'Fachada Sansot',        location: 'Monte Hermoso',          coordinates: [-61.285278, -38.984528], category: 'vivienda' },
  { id: 'casa-oscar',             name: 'Casa Oscar',            location: 'Monte Hermoso',          coordinates: [-61.312944, -38.980583], category: 'vivienda' },
  { id: 'jordan',                 name: 'Jordan',                location: 'Monte Hermoso',          coordinates: [-61.193028, -38.994222], category: 'vivienda' },
  { id: 'casa-ricar',             name: 'Casa Ricar',            location: 'Monte Hermoso',          coordinates: [-61.324694, -38.986500], category: 'vivienda' },
  { id: 'obra-zenobio',           name: 'Obra Zenobio',          location: 'Monte Hermoso',          coordinates: [-61.188556, -38.996000], category: 'vivienda' },
  { id: 'benito',                 name: 'Benito',                location: 'Monte Hermoso',          coordinates: [-61.282083, -38.980361], category: 'vivienda' },
  { id: 'obra-nora',              name: 'Obra Nora',             location: 'Monte Hermoso',          coordinates: [-61.276889, -38.986889], category: 'vivienda' },
  { id: 'obra-cesarin',           name: 'Obra Cesarín',          location: 'Balneario Sauce Grande', coordinates: [-61.232000, -38.992611], category: 'vivienda' },
  { id: 'obra-goya',              name: 'Obra Goya',             location: 'Monte Hermoso',          coordinates: [-61.273750, -38.981528], category: 'vivienda' },
  { id: 'casa-rafa',              name: 'Casa Rafa',             location: 'Monte Hermoso',          coordinates: [-61.323750, -38.983750], category: 'vivienda' },
  { id: 'casa-nelson',            name: 'Casa Nelson',           location: 'Monte Hermoso',          coordinates: [-61.329083, -38.982750], category: 'vivienda' },
  { id: 'casanova',               name: 'CasaNova',              location: 'Monte Hermoso',          coordinates: [-61.281590, -38.981648], category: 'vivienda' },
  { id: 'casa-amado',             name: 'Casa Amado',            location: 'Monte Hermoso',          coordinates: [-61.321722, -38.985556], category: 'vivienda' },
  { id: 'casa-gaston-lemus',      name: 'Casa Gastón Lemus',     location: 'Monte Hermoso',          coordinates: [-61.234200, -38.990710], category: 'vivienda' },
  { id: 'casa-patricio',          name: 'Casa Patricio',         location: 'Balneario Sauce Grande', coordinates: [-61.194361, -38.993417], category: 'vivienda' },
  { id: 'casa-pepe',              name: 'Casa Pepe',             location: 'Monte Hermoso',          coordinates: [-61.320056, -38.983861], category: 'vivienda' },
  { id: 'casa-de-hormigon',       name: 'Casa de Hormigón',      location: 'Monte Hermoso',          coordinates: [-61.270778, -38.983250], category: 'vivienda' },
];
