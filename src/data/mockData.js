import getImageUrl from '../utils/imageUrl';

export const places = [
  {
    id: 1,
    title: "Mosquée Koutoubia",
    category: "Monument",
    description: "La mosquée Koutoubia est le plus grand monument religieux de Marrakech. Son minaret de 77 mètres, datant du XIIe siècle, est un chef-d'œuvre de l'architecture almohade.",
    coordinates: "31.6235, -7.9936",
    image: "/storage/places/Mosquée Koutoubia/WhatsApp Image 2026-04-06 at 4.02.35 PM (1).jpeg",
    services: {
      hotels: [
        { name: "Riad Monceau", role: "Hôtel de Luxe", description: "Un havre de paix au cœur de la médina.", price: "1200 MAD/nuit" }
      ],
      activites: [
        { name: "Vol en montgolfière", role: "Aventure", description: "Survolez les montagnes de l'Atlas au lever du soleil.", price: "2000 MAD/pers" }
      ],
      restaurants: [
        { name: "Nomad", role: "Moderne", description: "Cuisine marocaine moderne avec vue sur la Place des Épices.", price: "200 MAD/pers" }
      ],
      transport: [
        { name: "Transfert Aéroport", role: "Privé", description: "Accueil personnalisé et transport direct.", price: "200 MAD" }
      ]
    }
  },
  { 
    id: 2, 
    title: "Palais de la Bahia", 
    category: "Palais", 
    description: "Un splendide palais du XIXe siècle, chef-d'œuvre de l'art marocain.", 
    coordinates: "31.6217, -7.9816", 
    image: "/storage/places/Palais de la Bahia/WhatsApp Image 2026-04-06 at 3.39.52 PM (1).jpeg", 
    services: {
      hotels: [{ name: "La Mamounia", role: "Palace", description: "L'icône de Marrakech.", price: "5000 MAD/nuit" }],
      activites: [{ name: "Séance Photo", role: "Art", description: "Capturez vos moments dans les jardins du palais.", price: "800 MAD" }]
    } 
  },
  { 
    id: 3, 
    title: "Jardin Majorelle", 
    category: "Jardin", 
    description: "Un jardin exotique enchanteur créé par Jacques Majorelle avec un bleu vibrant.", 
    coordinates: "31.6416, -8.0033", 
    image: "/storage/places/Jardin Majorelle/WhatsApp Image 2026-04-06 at 3.33.27 PM.jpeg", 
    services: {
      activites: [{ name: "Visite Musée YSL", role: "Mode", description: "Découvrez l'univers d'Yves Saint Laurent.", price: "200 MAD" }]
    } 
  },
  { 
    id: 5, 
    title: "Place Jemaa el-Fna", 
    category: "Atmosphere", 
    description: "Le cœur battant de la ville, une place immense aux mille spectacles.", 
    coordinates: "31.6258, -7.9891", 
    image: "/storage/places/Place Jemaa el-Fna/WhatsApp Image 2026-04-06 at 4.09.59 PM (1).jpeg", 
    services: {
      restaurants: [{ name: "Café de France", role: "Panorama", description: "Le meilleur point de vue sur la place.", price: "100 MAD" }]
    } 
  },
  { id: 6, title: "Désert d'Agafay", category: "Adventure", description: "Une évasion désertique à quelques minutes de la ville ocre.", coordinates: "31.4283, -8.2417", image: "/storage/places/Désert d'Agafay/WhatsApp Image 2026-04-06 at 5.09.11 PM.jpeg", services: {
    activites: [{ name: "Diner sous les étoiles", role: "Romantique", description: "Un moment magique au milieu du désert.", price: "1200 MAD" }]
  } }
];
