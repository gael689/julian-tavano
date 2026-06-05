export type Prototipo = {
  id: string;
  type: 'cabaña' | 'casa';
  name: string;
  tagline: { es: string; en: string };
  specs: {
    coveredArea: number;
    semiCoveredArea?: number;
    bedrooms: number;
    bathrooms: number;
    features: { es: string; en: string };
  };
  description: { es: string; en: string };
  images: { src: string; alt: string; caption?: string }[];
};

export const PROTOTIPOS_DATA: Prototipo[] = [
  {
    id: "norte",
    type: "cabaña",
    name: "Norte",
    tagline: {
      es: "Simple. Cálida. Funcional.",
      en: "Simple. Warm. Functional.",
    },
    specs: {
      coveredArea: 30,
      bedrooms: 1,
      bathrooms: 1,
      features: {
        es: "Cocina, estar-comedor integrados · Espacio exterior para disfrutar el entorno",
        en: "Kitchen and living-dining area integrated · Outdoor space to enjoy the surroundings",
      },
    },
    description: {
      es: "Un refugio íntimo y eficiente diseñado para disfrutar la naturaleza sin renunciar al confort. Cada espacio está pensado para que te sientas en casa, donde sea que estés.",
      en: "An intimate and efficient refuge designed to enjoy nature without giving up comfort. Every space is crafted so you feel at home, wherever you are.",
    },
    images: [
      { src: "/prototipos/caba%C3%B1a-norte/imagenes/01.jpg", alt: "Cabaña Norte — exterior con deck en entorno natural", caption: "Exterior" },
      { src: "/prototipos/caba%C3%B1a-norte/imagenes/02.jpg", alt: "Cabaña Norte — interior con luz natural", caption: "Interior" },
      { src: "/prototipos/caba%C3%B1a-norte/imagenes/03.jpg", alt: "Cabaña Norte — cocina integrada", caption: "Cocina" },
      { src: "/prototipos/caba%C3%B1a-norte/imagenes/04.jpg", alt: "Cabaña Norte — habitación principal", caption: "Habitación" },
      { src: "/prototipos/caba%C3%B1a-norte/imagenes/05.jpg", alt: "Cabaña Norte — baño completo", caption: "Baño" },
      { src: "/prototipos/caba%C3%B1a-norte/imagenes/06.jpg", alt: "Cabaña Norte — espacio exterior", caption: "Exterior" },
      { src: "/prototipos/caba%C3%B1a-norte/imagenes/07.jpg", alt: "Cabaña Norte — planta de distribución", caption: "Planta" },
    ],
  },
  {
    id: "brote",
    type: "cabaña",
    name: "Brote",
    tagline: {
      es: "Simple. Natural. Esencial.",
      en: "Simple. Natural. Essential.",
    },
    specs: {
      coveredArea: 35,
      semiCoveredArea: 13,
      bedrooms: 1,
      bathrooms: 1,
      features: {
        es: "Living-comedor y cocina integrados",
        en: "Living-dining room and kitchen integrated",
      },
    },
    description: {
      es: "Cabaña compacta y funcional, diseñada para disfrutar la naturaleza con comodidad y estilo. Luz, calidez y conexión en cada rincón.",
      en: "Compact and functional cabin, designed to enjoy nature with comfort and style. Light, warmth and connection in every corner.",
    },
    images: [
      { src: "/prototipos/caba%C3%B1a-brote/imagenes/01.jpg", alt: "Cabaña Brote — exterior con deck y entorno natural", caption: "Exterior" },
      { src: "/prototipos/caba%C3%B1a-brote/imagenes/02.jpg", alt: "Cabaña Brote — living-comedor con luz natural", caption: "Living · Comedor" },
      { src: "/prototipos/caba%C3%B1a-brote/imagenes/03.jpg", alt: "Cabaña Brote — interior con ventanales al bosque", caption: "Interior" },
      { src: "/prototipos/caba%C3%B1a-brote/imagenes/04.jpg", alt: "Cabaña Brote — habitación principal", caption: "Habitación" },
      { src: "/prototipos/caba%C3%B1a-brote/imagenes/05.jpg", alt: "Cabaña Brote — baño con terminaciones modernas", caption: "Baño" },
      { src: "/prototipos/caba%C3%B1a-brote/imagenes/06.jpg", alt: "Cabaña Brote — galería exterior", caption: "Galería" },
      { src: "/prototipos/caba%C3%B1a-brote/imagenes/07.jpg", alt: "Cabaña Brote — planta aérea de distribución", caption: "Planta" },
    ],
  },
  {
    id: "coral",
    type: "casa",
    name: "Coral",
    tagline: {
      es: "Vida costera. Confort natural.",
      en: "Coastal living. Natural comfort.",
    },
    specs: {
      coveredArea: 50,
      bedrooms: 2,
      bathrooms: 1,
      features: {
        es: "Cocina y comedor integrados · Estar integrado · Ideal para entornos costeros o de playa",
        en: "Kitchen and dining room integrated · Living area integrated · Ideal for coastal or beach settings",
      },
    },
    description: {
      es: "Diseñada para disfrutar la luz, la brisa y la tranquilidad. Espacios amplios e integrados que invitan a compartir y relajarse, en perfecta armonía con el entorno natural.",
      en: "Designed to enjoy the light, the breeze and the tranquility. Spacious, integrated spaces that invite sharing and relaxing in perfect harmony with the natural surroundings.",
    },
    images: [
      { src: "/prototipos/casa-coral/imagenes/01.jpg", alt: "Casa Coral — exterior en entorno costero", caption: "Exterior" },
      { src: "/prototipos/casa-coral/imagenes/02.jpg", alt: "Casa Coral — living integrado con luz natural", caption: "Living" },
      { src: "/prototipos/casa-coral/imagenes/03.jpg", alt: "Casa Coral — cocina y comedor", caption: "Cocina · Comedor" },
      { src: "/prototipos/casa-coral/imagenes/04.jpg", alt: "Casa Coral — habitación principal", caption: "Habitación 1" },
      { src: "/prototipos/casa-coral/imagenes/05.jpg", alt: "Casa Coral — habitación secundaria", caption: "Habitación 2" },
      { src: "/prototipos/casa-coral/imagenes/06.jpg", alt: "Casa Coral — baño completo", caption: "Baño" },
      { src: "/prototipos/casa-coral/imagenes/07.jpg", alt: "Casa Coral — planta de distribución", caption: "Planta" },
    ],
  },
  {
    id: "coihue",
    type: "cabaña",
    name: "Coihue",
    tagline: {
      es: "Amplia. Cálida. Funcional.",
      en: "Spacious. Warm. Functional.",
    },
    specs: {
      coveredArea: 55,
      semiCoveredArea: 25,
      bedrooms: 2,
      bathrooms: 1,
      features: {
        es: "Estar-comedor y cocina integrados · Parrilla en semicubierto",
        en: "Living-dining room and kitchen integrated · BBQ in the semi-covered area",
      },
    },
    description: {
      es: "Diseñada para conectar con el entorno y compartir momentos inolvidables. Espacios amplios, luz natural y una galería con parrilla para disfrutar todo el año.",
      en: "Designed to connect with the surroundings and share unforgettable moments. Spacious areas, natural light and a gallery with BBQ to enjoy all year round.",
    },
    images: [
      { src: "/prototipos/caba%C3%B1a-coihue/imagenes/01.jpg", alt: "Cabaña Coihue — exterior con galería y parrilla", caption: "Exterior" },
      { src: "/prototipos/caba%C3%B1a-coihue/imagenes/02.jpg", alt: "Cabaña Coihue — estar-comedor integrado", caption: "Estar · Comedor" },
      { src: "/prototipos/caba%C3%B1a-coihue/imagenes/03.jpg", alt: "Cabaña Coihue — cocina con luz natural", caption: "Cocina" },
      { src: "/prototipos/caba%C3%B1a-coihue/imagenes/04.jpg", alt: "Cabaña Coihue — habitación principal", caption: "Habitación 1" },
      { src: "/prototipos/caba%C3%B1a-coihue/imagenes/05.jpg", alt: "Cabaña Coihue — habitación secundaria", caption: "Habitación 2" },
      { src: "/prototipos/caba%C3%B1a-coihue/imagenes/06.jpg", alt: "Cabaña Coihue — planta de distribución", caption: "Planta" },
    ],
  },
  {
    id: "jarilla",
    type: "casa",
    name: "Jarilla",
    tagline: {
      es: "Amplitud. Diseño. Naturaleza.",
      en: "Space. Design. Nature.",
    },
    specs: {
      coveredArea: 80,
      bedrooms: 2,
      bathrooms: 1,
      features: {
        es: "Cocina y comedor integrados · Estar integrado · Gran deck de expansión",
        en: "Kitchen and dining room integrated · Living area integrated · Large expansion deck",
      },
    },
    description: {
      es: "Una casa pensada para vivir momentos inolvidables, con espacios amplios y luminosos que se integran con el entorno. Ideal para disfrutar en familia o con amigos, todo el año.",
      en: "A house designed for unforgettable moments, with spacious and luminous spaces that blend with the surroundings. Perfect for family gatherings or friends, all year round.",
    },
    images: [
      { src: "/prototipos/casa-jarilla/imagenes/01.jpg", alt: "Casa Jarilla — exterior con deck de expansión", caption: "Exterior" },
      { src: "/prototipos/casa-jarilla/imagenes/02.jpg", alt: "Casa Jarilla — living integrado con luz natural", caption: "Living" },
      { src: "/prototipos/casa-jarilla/imagenes/03.jpg", alt: "Casa Jarilla — cocina y comedor", caption: "Cocina · Comedor" },
      { src: "/prototipos/casa-jarilla/imagenes/04.jpg", alt: "Casa Jarilla — habitación principal", caption: "Habitación 1" },
      { src: "/prototipos/casa-jarilla/imagenes/05.jpg", alt: "Casa Jarilla — habitación secundaria", caption: "Habitación 2" },
      { src: "/prototipos/casa-jarilla/imagenes/06.jpg", alt: "Casa Jarilla — baño completo", caption: "Baño" },
      { src: "/prototipos/casa-jarilla/imagenes/07.jpg", alt: "Casa Jarilla — deck exterior y entorno", caption: "Deck" },
      { src: "/prototipos/casa-jarilla/imagenes/08.jpg", alt: "Casa Jarilla — planta de distribución", caption: "Planta" },
    ],
  },
];
