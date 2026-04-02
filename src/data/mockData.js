export const places = [
  {
    id: 1,
    title: "Mosquée Koutoubia",
    category: "Monument",
    description: "La mosquée Koutoubia est le plus grand monument religieux de Marrakech. Son minaret de 77 mètres, datant du XIIe siècle, est un chef-d'œuvre de l'architecture almohade. Elle a servi de modèle à la Giralda de Séville et à la Tour Hassan de Rabat.",
    coordinates: "31.6235, -7.9936",
    image: "https://images.unsplash.com/photo-1587974928442-7bd927f1fbff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    services: {
      guides: [
        { name: "Ahmed", role: "Guide Certifié", description: "Expert de la médina et des souks depuis 15 ans.", price: "300 MAD/jour" },
        { name: "Fatima", role: "Guide Culturel", description: "Spécialiste de l'histoire et de l'architecture.", price: "350 MAD/jour" }
      ],
      hotels: [
        { name: "Riad Monceau", role: "Hôtel de Luxe", description: "Un havre de paix au cœur de la médina.", price: "1200 MAD/nuit" },
        { name: "Selman Marrakech", role: "Palace", description: "L'élégance marocaine moderne.", price: "2500 MAD/nuit" }
      ],
      activites: [
        { name: "Vol en montgolfière", role: "Aventure", description: "Survolez les montagnes de l'Atlas au lever du soleil.", price: "2000 MAD/pers" },
        { name: "Cours de cuisine", role: "Culture", description: "Apprenez à préparer un tajine traditionnel.", price: "500 MAD/pers" }
      ],
      restaurants: [
        { name: "Nomad", role: "Moderne", description: "Cuisine marocaine moderne avec vue sur la Place des Épices.", price: "200 MAD/pers" },
        { name: "Le Jardin", role: "Traditionnel", description: "Un jardin secret pour une pause déjeuner paisible.", price: "150 MAD/pers" }
      ],
      transport: [
        { name: "Transfert Aéroport", role: "Privé", description: "Accueil personnalisé et transport direct.", price: "200 MAD" },
        { name: "Location de Voiture", role: "4x4", description: "Idéal pour explorer les environs de Marrakech.", price: "600 MAD/jour" }
      ]
    }
  },
  { id: 2, title: "Palais de la Bahia", category: "Palais", description: "Un splendide palais du XIXe siècle, chef-d'œuvre de l'art marocain.", coordinates: "31.6217, -7.9816", image: "https://images.unsplash.com/photo-1549429141-8f553f1f7ca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", services: {} },
  { id: 3, title: "Les Souks", category: "Marché", description: "Un labyrinthe coloré de marchés traditionnels remplis d'artisanat local.", coordinates: "31.6271, -7.9891", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", services: {} },
  { id: 4, title: "Jardin Majorelle", category: "Jardin", description: "Un jardin exotique enchanteur créé par Jacques Majorelle avec un bleu vibrant.", coordinates: "31.6416, -8.0033", image: "https://images.unsplash.com/photo-1590089849504-20412e106da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", services: {} },
  { id: 5, title: "Place Jemaa el-Fna", category: "Atmosphere", description: "Le cœur battant de la ville, une place immense aux mille spectacles.", coordinates: "31.6258, -7.9891", image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", services: {} },
  { id: 6, title: "Désert d'Agafay", category: "Adventure", description: "Une évasion désertique à quelques minutes de la ville ocre.", coordinates: "31.4283, -8.2417", image: "https://images.unsplash.com/photo-1598967069123-5e744a569a7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", services: {} },
  { id: 7, title: "Musée de Marrakech", category: "Culture", description: "Un palais transformé en musée, abritant des trésors de l'artisanat marocain.", coordinates: "31.6300, -7.9875", image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", services: {} }
];
