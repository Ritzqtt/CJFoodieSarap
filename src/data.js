/* ============================================================
   CJFoodieSarap — EDIT SITE CONTENT, MENU & PRICES HERE
   Prices are numbers in Philippine pesos. Everything else
   (cards, tabs, tables, form options) is generated from this file.
   ============================================================ */

export const BRAND = {
  name: 'CJFoodieSarap',
  handle: 'wingbreakers',
  since: 2018,
  tagline: 'Budget Friendly. Quality Taste.',
  taglines: [
    'We cook. We serve. You celebrate.',
    'Good Food Brings People Together.',
    'Delicious food, made fresh.',
  ],
  cta: "Let's go, Kafoodies!",
  logo: '/logo.png',
}

export const CONTACT = {
  phoneDisplay: '0976 068 4951',
  phoneTel: '+639760684951',
  whatsapp: 'https://wa.me/639760684951',
  viber: 'viber://chat?number=%2B639760684951',
  email: 'cjfoodiesarap@gmail.com',
  facebook: 'https://www.facebook.com/WingBreakersByCJFoodieSarap',
  messenger: 'https://m.me/WingBreakersByCJFoodieSarap',
  instagram: 'https://www.instagram.com/wingbreakers/',
  tiktok: 'https://www.tiktok.com/@heyitscy',
  address: 'Post Proper Southside, Taguig 1648',
  addressNote: 'Also referred to as "Palar, Taguig" on our flyers',
  hours: '[confirm hours]',
  delivery: 'FREE DELIVERY in Makati & Taguig',
}

export const SOCIALS = [
  { id: 'facebook', label: 'Facebook', handle: 'CJFoodieSarap', href: CONTACT.facebook },
  { id: 'messenger', label: 'Messenger', handle: 'CJFoodieSarap', href: CONTACT.messenger },
  { id: 'instagram', label: 'Instagram', handle: '@wingbreakers', href: CONTACT.instagram },
  { id: 'tiktok', label: 'TikTok', handle: 'HeyItsCy', href: CONTACT.tiktok },
  { id: 'whatsapp', label: 'WhatsApp', handle: CONTACT.phoneDisplay, href: CONTACT.whatsapp },
  { id: 'phone', label: 'Viber', handle: CONTACT.phoneDisplay, href: CONTACT.viber },
]

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Packages', href: '#packages' },
  { label: 'Menu', href: '#menu' },
  { label: 'Bilao', href: '#bilao' },
  { label: 'Packed Meals', href: '#packed-meals' },
  { label: 'Contact', href: '#contact' },
]

/* ---------- The brush-stroke section banner in the hero ---------- */
export const HERO_TILES = [
  { label: 'Food Party Trays', sub: '₱3,000–₱6,500 sets', href: '#packages', icon: 'tray' },
  { label: 'Bilao Packages', sub: 'From ₱1,500', href: '#bilao', icon: 'bilao' },
  { label: 'Food Packed Meals', sub: 'From ₱50', href: '#packed-meals', icon: 'box' },
]

/* ---------- Tray sizes + price groups ---------- */
export const TRAY_SIZES = [
  { id: '5-10', label: '5–10 pax' },
  { id: '10-15', label: '10–15 pax' },
  { id: '15-20', label: '15–20 pax' },
  { id: '20-25', label: '20–25 pax' },
  { id: '25-30', label: '25–30 pax' },
]

export const PRICE_GROUPS = {
  standard: [700, 1000, 1500, 2000, 2500],
  beefSeafood: [1000, 1500, 2000, 2500, 3000],
  vegetables: [500, 800, 1000, 1500, 2000],
}

/* ---------- À la carte tray menu ---------- */
export const MENU_CATEGORIES = [
  {
    id: 'pork',
    name: 'Pork',
    priceGroup: 'standard',
    items: [
      'Sweet & Sour Pork Fillet',
      'Pork Binagoongan',
      'Pork Ribs Caldereta',
      'Breaded Pork Tonkatsu',
      'Pork Salpicao',
      'Pork Menudo',
      'Lechon Paksiw',
      'Pork Hamonado',
      'Crispy Pork Sisig',
      'Pork BBQ',
      'Grilled Liempo',
      'Pork Afritada',
      'Bicol Express',
      'Kare Kare con Lechon',
      'Pork Teriyaki',
      'Pork Picadillo',
      'Pork Tapa (Homemade)',
      'Sweet & Sour Meatballs',
      'Pork Steak',
      'Bagnet',
    ],
    notes: { 'Pork BBQ': 'Also available at ₱30 per stick' },
  },
  {
    id: 'chicken',
    name: 'Chicken',
    priceGroup: 'standard',
    items: [
      'Chicken Afritada',
      'Chicken Hamonado',
      'Chicken Curry',
      'Pickled Chicken',
      'Chicken Pastel with Mushrooms',
      'Chicken Paksiw',
      'Chicken Salpicao',
      'Pininyahang Manok',
      'Chicken Cordon Bleu',
      'Cheesy Buttered Chicken',
      'Creamy Mushroom Chicken',
      'Sweet & Sour Chicken Fillet',
      'Chicken Sisig',
      'Chicken Inasal BBQ',
      'Chicken Bicol Express',
    ],
  },
  {
    id: 'beef',
    name: 'Beef',
    priceGroup: 'beefSeafood',
    items: [
      'Beef Caldereta',
      'Beef Kare-Kare',
      'Beef Salpicao',
      'Beef Teriyaki',
      'Beef Steak',
      'Beef Broccoli',
      'Creamy Beef with Mushrooms and Potatoes',
      'Beef Mechado',
      'Homemade Beef Tapa',
      'Beef Picadillo',
      'Beef with Mushroom Gravy',
      'Beef Bulgogi',
    ],
  },
  {
    id: 'seafood',
    name: 'Seafood',
    priceGroup: 'beefSeafood',
    items: [
      'Spicy Mixed Seafoods',
      'Garlic Buttered Shrimp',
      'Bangus Belly Steak',
      'Calamari with Tartar Sauce',
      'Bangus Sisig',
      'Sweet & Sour Fish Fillet',
      'Sweet Chili Shrimp',
      'Grilled Boneless Bangus',
      'Grilled Pusit',
      'Seafood in Creamy Garlic Sauce',
      'Crispy Fish Fillet',
      'Boneless Bangus Bicol Express',
      'Sweet & Sour Squid',
      'Seafood Kare-Kare',
    ],
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    priceGroup: 'vegetables',
    items: [
      'Chicken Chopsuey',
      'Kare-Kareng Gulay',
      'Pinakbet con Lechon',
      'Creamy Sipo Egg',
      'Buttered Mixed Veggies with Quail Eggs',
      'Ginataang Laing (with Pork & Shrimp)',
      'Spicy Gising-Gising',
      'Ensaladang Talong',
      'Kangkong Tofu with Oyster Sauce',
    ],
  },
  {
    id: 'pasta',
    name: 'Pasta / Pansit',
    priceGroup: 'standard',
    items: [
      'Filipino-Style Spaghetti',
      'Creamy Carbonara',
      'Chicken Alfredo',
      'No Bake Cheesy Macaroni',
      'Tuna Carbonara',
      'Spanish Sardines Pesto',
      'Shrimp Alfredo',
      'Tuna Pesto Linguine',
      'Pansit Bihon',
      'Pansit Canton',
      'Pansit Mix',
      'Pansit Palabok',
      'Pansit Malabon',
    ],
  },
  {
    id: 'finger-foods',
    name: 'Finger Foods',
    priceGroup: 'standard',
    items: [
      'Chicken Fingers',
      'Fish Fingers',
      'Flavored Chicken Wings',
      'Fried Chicken',
      'Shanghai Rolls',
      'Homemade Siomai',
      'Chicken Lollipop',
      'Chicken Pops',
      'Ham & Cheese Rolls',
      'Onion Rings',
      'Lumpiang Togue',
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    priceGroup: 'standard',
    items: [
      'Mango Graham',
      'Oreo Graham',
      'Buko Pandan Salad',
      'Mango Sago',
      'Coffee Jelly',
      'Buko Salad',
      'Fruit Salad',
      'Macaroni Salad',
    ],
    extras: [
      { name: 'Salad in cups', price: 30, unit: 'each' },
      { name: 'Puto Cheese', price: 15, unit: 'each' },
    ],
  },
]

/* ---------- Party tray packages (all include free softdrinks) ---------- */
export const PACKAGES = [
  {
    id: 1,
    price: 3000,
    items: ['1 tray pork or chicken dish', '1 tray vegetables', '1 tray pasta or pansit', '1 tray rice'],
  },
  {
    id: 2,
    price: 3500,
    items: [
      '1 tray pork or chicken dish',
      '1 tray vegetables',
      '1 tray pasta or pansit',
      '1 tray finger foods',
      '1 tray rice',
    ],
  },
  {
    id: 3,
    price: 4000,
    items: ['2 trays pork or chicken dish', '1 tray vegetables', '1 tray pasta or pansit', '1 tray rice'],
  },
  {
    id: 4,
    price: 4500,
    items: [
      '2 trays pork or chicken dish',
      '1 tray vegetables',
      '1 tray pasta or pansit',
      '1 tray finger foods',
      '1 tray rice',
    ],
  },
  {
    id: 5,
    price: 5000,
    items: [
      '1 tray beef or seafood dish',
      '1 tray pork or chicken dish',
      '1 tray vegetables',
      '1 tray pasta or pansit',
      '1 tray rice',
    ],
  },
  {
    id: 6,
    price: 5500,
    items: [
      '1 tray beef or seafood dish',
      '1 tray pork or chicken dish',
      '1 tray vegetables',
      '1 tray pasta or pansit',
      '1 tray finger foods',
      '1 tray rice',
    ],
  },
  {
    id: 7,
    price: 6000,
    items: [
      '2 trays dish of your choice',
      '1 tray vegetables',
      '1 tray pasta or pansit',
      '1 tray rice',
      '1 tray dessert',
    ],
  },
  {
    id: 8,
    price: 6500,
    items: [
      '2 trays dish of your choice',
      '1 tray vegetables',
      '1 tray pasta or pansit',
      '1 tray finger foods',
      '1 tray rice',
      '1 tray dessert',
    ],
  },
]

/* ---------- Bilao packages ---------- */
export const BILAOS = [
  {
    id: 1,
    price: 1500,
    pax: '5–10 pax',
    items: ['1 Bilao Pasta', '1 Bilao Pansit', '1 Bilao Shanghai', '1 Bilao Puto Cheese'],
    drinks: false,
  },
  {
    id: 2,
    price: 2000,
    pax: '5–10 pax',
    items: [
      '1 Bilao Pasta',
      '1 Bilao Pansit',
      '1 Bilao Shanghai',
      '1 Bilao Fried Chicken',
      '1 Bilao Puto Cheese',
    ],
    drinks: false,
  },
  {
    id: 3,
    price: 2500,
    pax: '10–15 pax',
    items: [
      '2 Bilao Pasta',
      '1 Bilao Pansit',
      '1 Bilao Shanghai',
      '1 Bilao Fried Chicken',
      '1 Bilao Puto Cheese',
    ],
    drinks: false,
  },
  {
    id: 4,
    price: 3000,
    pax: '10–15 pax',
    items: [
      '2 Bilao Pasta',
      '1 Bilao Pansit',
      '1 Bilao Shanghai',
      '1 Bilao Fried Chicken',
      '1 Bilao Puto Cheese',
      '10 pcs Pork BBQ',
      'Free 1.5L Softdrinks',
    ],
    drinks: true,
  },
]

/* ---------- Food packed meals ---------- */
export const PACKED_MEALS = [
  {
    group: 'A',
    title: 'Rice Meals · Pork & Chicken',
    items: [
      { code: 'A1', desc: '1 ulam + rice (pork/chicken)', price: 75 },
      { code: 'A2', desc: '1 ulam + veggies + rice (pork/chicken)', price: 80 },
      { code: 'A3', desc: '1 ulam + rice (beef/seafood)', price: 85 },
      { code: 'A4', desc: '1 ulam + veggies + rice (beef/seafood)', price: 90 },
    ],
  },
  {
    group: 'B',
    title: 'Double Ulam Rice Meals',
    items: [
      { code: 'B1', desc: '2 ulam + rice (pork/chicken)', price: 95 },
      { code: 'B2', desc: '2 ulam + rice (beef/seafood)', price: 100 },
    ],
  },
  {
    group: 'C',
    title: 'Pansit Packs',
    items: [
      { code: 'C1', desc: 'Pansit + Puto', price: 50 },
      { code: 'C2', desc: 'Pansit + Shanghai + Puto', price: 60 },
      { code: 'C3', desc: 'Pansit + Fried Chicken', price: 70 },
      { code: 'C4', desc: 'Pansit + Fried Chicken + Puto', price: 80 },
    ],
  },
  {
    group: 'D',
    title: 'Pasta Packs',
    items: [
      { code: 'D1', desc: 'Pasta + Puto', price: 60 },
      { code: 'D2', desc: 'Pasta + Shanghai + Puto', price: 70 },
      { code: 'D3', desc: 'Pasta + Fried Chicken', price: 80 },
      { code: 'D4', desc: 'Pasta + Fried Chicken + Puto', price: 90 },
    ],
  },
]

/* ---------- How to book ---------- */
export const STEPS = [
  {
    title: 'Choose your package or build your own tray order',
    body: "Browse the party trays, bilao sets, or packed meals. You can also tell us your budget and we'll suggest a spread.",
  },
  {
    title: 'Message us on Facebook, call, or send the inquiry form',
    body: "Send your event date, number of guests, and the dishes you have in mind. We'll reply with a quote.",
  },
  {
    title: 'Confirm date, pax, and delivery address',
    body: "We'll finalize the menu, total, and delivery schedule so everything is clear before we cook.",
  },
  {
    title: 'We cook, deliver, and you celebrate!',
    body: 'Your food is cooked fresh and delivered ready to serve. All you have to do is gather everyone and eat.',
  },
]

/* ---------- Helpers ---------- */
export const formatPeso = (amount) => '₱' + Number(amount).toLocaleString('en-PH')

export const messengerUrl = (text) =>
  CONTACT.messenger + '?text=' + encodeURIComponent(text)

export const packageInquiryUrl = (pkg) =>
  messengerUrl(
    `Hi! I'd like to book Package ${pkg.id} (${formatPeso(pkg.price)}). Please send me the available dates and next steps. Salamat!`,
  )

export const bilaoInquiryUrl = (set) =>
  messengerUrl(
    `Hello! I'd like to order Bilao Set ${set.id} (${formatPeso(set.price)} · ${set.pax}). Please send me the available dates. Salamat!`,
  )
