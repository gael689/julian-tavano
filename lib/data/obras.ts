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
  { id: 'casa-agus-l', name: 'Casa Agus L.', location: 'Monte Hermoso', coordinates: [-61.188194, -38.992028], category: 'vivienda' },
  { id: 'casa-guille-y-facu', name: 'Casa Guille y Facu', location: 'Monte Hermoso', coordinates: [-61.279722, -38.986083], category: 'vivienda' },
  { id: 'jordan', name: 'Jordan', location: 'Monte Hermoso', coordinates: [-61.193028, -38.994222], category: 'vivienda' },
  { id: 'obra-zenobio', name: 'Obra Zenobio', location: 'Monte Hermoso', coordinates: [-61.188556, -38.996], category: 'vivienda' },
  { id: 'benito', name: 'Benito', location: 'Monte Hermoso, Bosque Alegre 449', coordinates: [-61.281944, -38.980361], category: 'vivienda' },
  { id: 'obra-cesarin', name: 'Obra Cesarín', location: 'Balneario Sauce Grande', coordinates: [-61.232, -38.992611], category: 'vivienda' },
  { id: 'casa-amado', name: 'Casa Amado', location: 'Monte Hermoso', coordinates: [-61.321722, -38.985556], category: 'vivienda' },
  { id: 'casa-gaston-lemus', name: 'Casa Gastón Lemus', location: 'Monte Hermoso', coordinates: [-61.2342, -38.99071], category: 'vivienda' },
  { id: 'casa-patricio', name: 'Casa Patricio', location: 'Balneario Sauce Grande', coordinates: [-61.194361, -38.993417], category: 'vivienda' },
  { id: 'cabaña-dana', name: 'Cabaña Dana', location: 'Monte Hermoso', coordinates: [-61.309392, -38.992160], category: 'vivienda' },
  { id: 'casa-nestor', name: 'Casa Néstor', location: 'Monte Hermoso', coordinates: [-61.310071, -38.999399], category: 'vivienda' },
  { id: 'proyecto-parador', name: 'Proyecto Parador', location: 'Monte Hermoso', coordinates: [-61.285258, -38.982361], category: 'vivienda' },
  { id: 'modulo-luci', name: 'Módulo Lucí', location: 'Monte Hermoso', coordinates: [-61.319952, -38.981062], category: 'vivienda' },
  { id: 'alpina-liliana', name: 'Alpina Liliana', location: 'Monte Hermoso', coordinates: [-61.286284, -38.990331], category: 'vivienda' },
  { id: 'casa-jose', name: 'Casa José', location: 'Monte Hermoso', coordinates: [-61.309067, -38.987856], category: 'vivienda' },
  { id: 'proyecto-oscar', name: 'Proyecto Oscar', location: 'Monte Hermoso', coordinates: [-61.288879, -38.993094], category: 'vivienda' },
  { id: 'casa-marisa', name: 'Casa Marisa', location: 'Monte Hermoso', coordinates: [-61.317211, -38.990958], category: 'vivienda' },
  { id: 'proyecto-maria-jose', name: 'Proyecto María José', location: 'Monte Hermoso', coordinates: [-61.309192, -38.993660], category: 'vivienda' },
  { id: 'alpinas-hugo', name: 'Alpinas Hugo', location: 'Monte Hermoso', coordinates: [-61.291226, -38.997743], category: 'vivienda' },
  { id: 'casa-juanjo', name: 'Casa Juanjo', location: 'Monte Hermoso', coordinates: [-61.305547, -38.991446], category: 'vivienda' },
  { id: 'serafin', name: 'Serafín', location: 'Monte Hermoso', coordinates: [-61.307902, -38.983021], category: 'vivienda' },
  { id: 'proyecto-casa-laurel', name: 'Proyecto Casa Laurel', location: 'Monte Hermoso', coordinates: [-61.310819, -38.981635], category: 'vivienda' },
  { id: 'proyecto-chilena', name: 'Proyecto Chilena', location: 'Monte Hermoso', coordinates: [-61.290326, -38.992460], category: 'vivienda' },
  { id: 'casa-silos', name: 'Casa Silos', location: 'Monte Hermoso', coordinates: [-61.287734, -38.993167], category: 'vivienda' },
  { id: 'proyecto-martin', name: 'Proyecto Martín', location: 'Monte Hermoso', coordinates: [-61.305851, -38.990209], category: 'vivienda' },
  { id: 'proyecto-petroquimicos', name: 'Proyecto Petroquímicos', location: 'Monte Hermoso', coordinates: [-61.300998, -38.986535], category: 'vivienda' },
  { id: 'casa-pablo-c', name: 'Casa Pablo C.', location: 'Monte Hermoso', coordinates: [-61.302246, -38.993948], category: 'vivienda' },
  { id: 'obra-pablo', name: 'Obra Pablo', location: 'Monte Hermoso', coordinates: [-61.316215, -38.987184], category: 'vivienda' },
  { id: 'casa-cristina', name: 'Casa Cristina', location: 'Monte Hermoso', coordinates: [-61.304609, -38.998657], category: 'vivienda' },
  { id: 'obra-el-pato', name: 'Obra El Pato', location: 'Monte Hermoso', coordinates: [-61.285433, -38.984156], category: 'vivienda' },
  { id: 'duplex-flamencos', name: 'Dúplex Flamencos', location: 'Monte Hermoso', coordinates: [-61.312661, -38.986379], category: 'vivienda' },
  { id: 'casa-daniel-g', name: 'Casa Daniel G.', location: 'Monte Hermoso', coordinates: [-61.281513, -38.988138], category: 'vivienda' },
  { id: 'supermercado-chino', name: 'Supermercado Chino', location: 'Monte Hermoso', coordinates: [-61.288665, -38.985271], category: 'vivienda' },
  { id: 'fachada-sansot', name: 'Fachada Sansot', location: 'Monte Hermoso', coordinates: [-61.286649, -38.981941], category: 'vivienda' },
  { id: 'casa-oscar', name: 'Casa Oscar', location: 'Monte Hermoso', coordinates: [-61.316502, -38.997501], category: 'vivienda' },
  { id: 'casa-ricar', name: 'Casa Ricar', location: 'Monte Hermoso', coordinates: [-61.302051, -38.982467], category: 'vivienda' },
  { id: 'leo-de-paz', name: 'Leo de Paz', location: 'Monte Hermoso', coordinates: [-61.289146, -38.996119], category: 'vivienda' },
  { id: 'fideicomiso-aromos', name: 'Fideicomiso Aromos', location: 'Monte Hermoso', coordinates: [-61.312397, -38.982507], category: 'vivienda' },
  { id: 'obra-nora', name: 'Obra Nora', location: 'Monte Hermoso', coordinates: [-61.297129, -38.993261], category: 'vivienda' },
  { id: 'obra-goya', name: 'Obra Goya', location: 'Monte Hermoso', coordinates: [-61.313687, -38.987241], category: 'vivienda' },
  { id: 'casa-rafa', name: 'Casa Rafa', location: 'Monte Hermoso', coordinates: [-61.283089, -38.990616], category: 'vivienda' },
  { id: 'casa-nelson', name: 'Casa Nelson', location: 'Monte Hermoso', coordinates: [-61.282082, -38.981166], category: 'vivienda' },
  { id: 'casanova', name: 'CasaNova', location: 'Monte Hermoso', coordinates: [-61.310068, -38.999294], category: 'vivienda' },
  { id: 'casa-pepe', name: 'Casa Pepe', location: 'Monte Hermoso', coordinates: [-61.305317, -38.996098], category: 'vivienda' },
  { id: 'casa-de-hormigon', name: 'Casa de Hormigón', location: 'Monte Hermoso', coordinates: [-61.311877, -38.983021], category: 'vivienda' },
  { id: 'duplex-rio-salado', name: 'Dúplex Río Salado', location: 'Monte Hermoso', coordinates: [-61.282089, -38.983437], category: 'vivienda' },
];
