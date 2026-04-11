export const mockFavorites = [
  {
    id: 1,
    title: "Mosquée Koutoubia",
    category: "Monument",
    image: "https://images.unsplash.com/photo-1587974928442-7bd927f1fbff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    title: "Jardin Majorelle",
    category: "Jardin",
    image: "https://images.unsplash.com/photo-1590089849504-20412e106da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  }
];

export const mockRequests = [
  {
    id: "req1",
    user: "Elara Rossi",
    service: "Double Room (Medina View)",
    date: "2024-10-15",
    status: "pending",
    amount: "1200 MAD"
  },
  {
    id: "req3",
    user: "Aisha Mansour",
    service: "Airport Transfer (Private)",
    date: "2024-10-20",
    status: "confirmed",
    amount: "200 MAD"
  }
];

export const mockUserServices = [
  {
    id: "s1",
    title: "Chambre Double Traditionnelle",
    type: "Hébergement",
    price: "800 MAD/nuit",
    status: "active",
    bookings: 45
  },
  {
    id: "s2",
    title: "Suite Royale avec Vue Atlas",
    type: "Hébergement",
    price: "2500 MAD/nuit",
    status: "active",
    bookings: 12
  }
];

export const mockUserBookings = [
  {
    id: "b1",
    serviceName: "Riad Monceau - Chambre Luxe",
    provider: "Hotel Riad Monceau",
    date: "2024-03-10",
    price: "1200 MAD",
    status: "completed"
  },
  {
    id: "b3",
    serviceName: "Diner Desert Agafay",
    provider: "Camp Scarlet",
    date: "2024-10-25",
    price: "1500 MAD",
    status: "pending"
  }
];
