export const HOME_CATEGORIES = [
  {
    key: 'restaurants',
    title: 'Restaurants',
    subtitle: 'Muchomo, rolex & local plates',
    href: '/restaurants',
    image: '/images/photos/photo-1544025162-d76694265947.jpg',
    meta: '6 kitchens',
    accent: 'Warm & smoky',
  },
  {
    key: 'pharmacy',
    title: 'Pharmacy',
    subtitle: 'Compare published prices',
    href: '/pharmacy',
    image: '/images/photos/photo-1576602976047-174e57a47881.jpg',
    meta: '4 chemists',
    accent: 'Licensed & local',
  },
  {
    key: 'laundry',
    title: 'Laundry',
    subtitle: 'Wash, press & deliver',
    href: '/laundry',
    image: '/images/photos/photo-1582735689369-4fe89db7114c.jpg',
    meta: '2 providers',
    accent: 'Doorstep pickup',
  },
  {
    key: 'rides',
    title: 'Rides',
    subtitle: 'Boda & parcel dispatch',
    href: '/rides',
    image: '/images/curated/boda-decor.jpg',
    meta: '4 ride types',
    accent: 'Fare first',
  },
  {
    key: 'vehicles',
    title: 'Vehicle hire',
    subtitle: 'Self-drive or chauffeured',
    href: '/vehicles',
    image: '/images/curated/vehicle-prado.jpg',
    meta: '5 vehicles',
    accent: 'Western journeys',
  },
];

export const HOME_PROMOTIONS = [
  {
    id: 'promo_muchomo',
    kicker: 'This week in Ishaka',
    title: 'Muchomo evenings, made for sharing.',
    body: 'Charcoal-grilled goat, gonja and kachumbari from Ankole Spice. A proper neighbourhood table.',
    price: 'From UGX 22,000',
    href: '/restaurants/rest_01',
    image: '/images/curated/muchomo-fresh.jpg',
    tone: 'dark' as const,
    cta: 'Order the grill',
  },
  {
    id: 'promo_rolex',
    kicker: 'KIU campus favourite',
    title: 'The 10-minute rolex run.',
    body: 'Three-egg rolex, hot chapati and chilli. Delivered to hostels around Gate 1.',
    price: 'From UGX 6,500',
    href: '/restaurants?category=snacks_rolex',
    image: '/images/curated/rolex-stall.jpg',
    tone: 'light' as const,
    cta: 'See campus picks',
  },
  {
    id: 'promo_laundry',
    kicker: 'Home care',
    title: 'Fresh bedding, without the fuss.',
    body: 'Duvets and blankets collected, deep-cleaned and returned across Ishaka.',
    price: 'UGX 18,000 / set',
    href: '/laundry',
    image: '/images/photos/photo-1517677208171-0bc6725a3e60.jpg',
    tone: 'sage' as const,
    cta: 'Book a pickup',
  },
];

export const RECENTLY_ADDED = [
  {
    name: 'Rwentuha Honey & Dairy',
    category: 'Groceries & farm produce',
    neighbourhood: 'Rwentuha, Bushenyi',
    image: '/images/curated/coffee-hands.jpg',
    note: 'Raw honey, ghee and fresh milk from Rwentuha farms.',
    tag: 'New this week',
  },
  {
    name: 'Kizinda Roast House',
    category: 'Grill & muchomo',
    neighbourhood: 'Kizinda Trading Centre',
    image: '/images/curated/hero-muchomo.jpg',
    note: 'Roadside charcoal grill now taking delivery orders.',
    tag: 'New this week',
  },
  {
    name: 'Nyakabirizi Fresh Market',
    category: 'Fruit & vegetables',
    neighbourhood: 'Nyakabirizi',
    image: '/images/curated/market-produce.jpg',
    note: 'Same-day produce baskets from the morning market.',
    tag: 'Just added',
  },
  {
    name: 'Ishaka Home Pharmacy',
    category: 'Pharmacy & wellness',
    neighbourhood: 'Ishaka Hospital Road',
    image: '/images/curated/pharmacy-display.jpg',
    note: 'Family wellness essentials with published pricing.',
    tag: 'Just added',
  },
];

export const HOME_STATS = [
  { value: '48', label: 'local partners' },
  { value: '25 min', label: 'average delivery' },
  { value: '4.8', label: 'customer rating' },
  { value: '7', label: 'neighbourhoods' },
];

export const TESTIMONIALS = [
  {
    quote:
      'I ordered muchomo for a study group and it arrived hot, properly packed, and exactly on time. SUBURB+ feels like it was built for us.',
    name: 'Brenda Kemigisha',
    role: 'KIU student, Ishaka',
    image: '/images/curated/portrait-woman.jpg',
  },
  {
    quote:
      'Comparing pharmacy prices before walking to town saves me real money. Everything is clear, and the pharmacist calls back.',
    name: 'Grace Ainembabazi',
    role: 'Resident, Hospital Road',
    image: '/images/curated/portrait-woman-2.jpg',
  },
];
