// Real dropshipping products (names, categories, photos, and where available, live
// AliExpress prices) sourced from public best-sellers/trending research
// (WinningHunter, CJdropshipping) in September 2026 — see aeUrl on each item for
// the live listing. Demand/growth/competition/opportunity/ad/store data remain
// modeled ESTIMATES (labeled accordingly in the UI): there is no free public feed
// for real sales, ad-spend, or traffic data for arbitrary products.
export interface CategoryItem {
  name: string;
  image: string;
  price?: number; // real AliExpress price (AUD) where available
  aeUrl?: string;
}

export const CATEGORIES: { name: string; priceRange: [number, number]; items: CategoryItem[] }[] = [
  {
    name: "Beauty & Wellness",
    priceRange: [3.75, 30.41],
    items: [
      { name: "LED Therapy Face Mask", image: "/products/01.jpg", price: 17.09, aeUrl: "https://www.aliexpress.com/item/1005006678225060.html" },
      { name: "Red Light Therapy Device", image: "/products/02.jpg", price: 23.39, aeUrl: "https://www.aliexpress.com/item/1005012814890146.html" },
      { name: "Ice Face Roller", image: "/products/03.jpg", price: 6.14, aeUrl: "https://www.aliexpress.com/item/1005009960363129.html" },
      { name: "Electric Scalp Massager", image: "/products/04.jpg", price: 17.19, aeUrl: "https://www.aliexpress.com/item/1005010653137995.html" },
      { name: "Under Eye Patches", image: "/products/05.jpg", price: 4.69, aeUrl: "https://www.aliexpress.com/item/1005007805549894.html" },
    ],
  },
  {
    name: "Tech & Gadgets",
    priceRange: [2.61, 88.39],
    items: [
      { name: "Smart Posture Corrector", image: "/products/06.jpg", price: 4.09, aeUrl: "https://www.aliexpress.com/item/1005006996477472.html" },
      { name: "GaN Fast Charger", image: "/products/07.jpg", price: 5.89, aeUrl: "https://www.aliexpress.com/item/1005012978001229.html" },
      { name: "Magnetic Phone Mount", image: "/products/08.jpg", price: 3.26, aeUrl: "https://www.aliexpress.com/item/1005006994627477.html" },
      { name: "Mini Projector", image: "/products/09.jpg", price: 67.99, aeUrl: "https://www.aliexpress.com/item/1005007791550948.html" },
      { name: "Wireless Lavalier Microphone", image: "/products/10.jpg", price: 5.03, aeUrl: "https://www.aliexpress.com/item/1005006995265158.html" },
    ],
  },
  {
    name: "Home & Kitchen",
    priceRange: [1.12, 65.88],
    items: [
      { name: "Electric Pepper Grinder", image: "/products/11.jpg", price: 1.4, aeUrl: "https://www.aliexpress.com/item/1005010487376364.html" },
      { name: "Adjustable Laptop Desk", image: "/products/12.jpg", price: 50.68, aeUrl: "https://www.aliexpress.com/item/1005006097435222.html" },
      { name: "Smart Plant Pot", image: "/products/13.jpg", price: 1.4, aeUrl: "https://www.aliexpress.com/item/1005006591134817.html" },
      { name: "Sink Organizer Rack", image: "/products/14.jpg", price: 1.4, aeUrl: "https://www.aliexpress.com/item/1005006678016798.html" },
      { name: "Mini Electric Food Chopper", image: "/products/15.jpg", price: 6.93, aeUrl: "https://www.aliexpress.com/item/1005009384210713.html" },
    ],
  },
  {
    name: "Pet Supplies",
    priceRange: [1.12, 271.3],
    items: [
      { name: "GPS Dog Tracker", image: "/products/16.jpg", price: 4.71, aeUrl: "https://www.aliexpress.com/item/1005009185028607.html" },
      { name: "Self-Cleaning Litter Box", image: "/products/17.jpg", price: 208.69, aeUrl: "https://www.aliexpress.com/item/1005007171376294.html" },
      { name: "Orthopedic Pet Bed", image: "/products/18.jpg", price: 1.4, aeUrl: "https://www.aliexpress.com/item/1005006415813548.html" },
      { name: "Smart Pet Feeder", image: "/products/19.jpg", price: 54.99, aeUrl: "https://www.aliexpress.com/item/1005009582394532.html" },
      { name: "Pet Grooming Vacuum Kit", image: "/products/20.jpg", price: 103.99, aeUrl: "https://www.aliexpress.com/item/1005010131768552.html" },
    ],
  },
  {
    name: "Fitness & Recovery",
    priceRange: [1.59, 23.13],
    items: [
      { name: "Mini Massage Gun", image: "/products/21.jpg", price: 17.79, aeUrl: "https://www.aliexpress.com/item/1005007171266187.html" },
      { name: "Smart Jump Rope", image: "/products/22.jpg", price: 9.79, aeUrl: "https://www.aliexpress.com/item/1005006784531336.html" },
      { name: "Resistance Bands Set", image: "/products/23.jpg", price: 3.54, aeUrl: "https://www.aliexpress.com/item/1005012986658635.html" },
      { name: "Adjustable Dumbbells", image: "/products/24.jpg", price: 1.99, aeUrl: "https://www.aliexpress.com/item/1005007403086321.html" },
      { name: "Weighted Vest", image: "/products/25.jpg", price: 13.59, aeUrl: "https://www.aliexpress.com/item/1005006391780913.html" },
    ],
  },
  {
    name: "Travel & Outdoor",
    priceRange: [1.12, 8.98],
    items: [
      { name: "Anti-Theft Backpack", image: "/products/26.jpg", price: 6.91, aeUrl: "https://www.aliexpress.com/item/1005007540999796.html" },
      { name: "Packing Cubes Set", image: "/products/27.jpg", price: 1.4, aeUrl: "https://www.aliexpress.com/item/1005006995093949.html" },
      { name: "Compression Packing Bags", image: "/products/28.jpg", price: 3.46, aeUrl: "https://www.aliexpress.com/item/1005007010271687.html" },
      { name: "RFID Blocking Wallet", image: "/products/29.jpg", price: 1.99, aeUrl: "https://www.aliexpress.com/item/1005005135973833.html" },
      { name: "Collapsible Water Bottle", image: "/products/30.jpg", price: 5.69, aeUrl: "https://www.aliexpress.com/item/1005007306587993.html" },
    ],
  },
  {
    name: "Hobbies & Lifestyle",
    priceRange: [1.59, 56.93],
    items: [
      { name: "Paint by Numbers Kit", image: "/products/31.jpg", price: 7.69, aeUrl: "https://www.aliexpress.com/item/1005004063549476.html" },
      { name: "Blind Box Collectibles", image: "/products/32.jpg", price: 1.99, aeUrl: "https://www.aliexpress.com/item/1005009717071928.html" },
      { name: "Retro Handheld Game Console", image: "/products/33.jpg", price: 43.79, aeUrl: "https://www.aliexpress.com/item/1005007010637229.html" },
    ],
  },
  {
    name: "Seasonal Finds",
    priceRange: [3.16, 40.55],
    items: [
      { name: "Rechargeable LED Book Light", image: "/products/34.jpg", aeUrl: "https://www.aliexpress.com/item/1005007709215192.html" },
      { name: "Portable Electric Lunch Box Warmer", image: "/products/35.jpg", price: 31.19, aeUrl: "https://www.aliexpress.com/item/1005012540930954.html" },
      { name: "Wearable Blanket Hoodie", image: "/products/36.jpg", price: 27.95, aeUrl: "https://www.aliexpress.com/item/1005008772959487.html" },
      { name: "Waterproof Dog Raincoat", image: "/products/37.jpg", price: 3.95, aeUrl: "https://www.aliexpress.com/item/1005007345640230.html" },
    ],
  },
  {
    name: "Baby & Kids",
    priceRange: [2.89, 105.29],
    items: [
      { name: "Baby Sleep Sack", image: "/products/38.jpg", price: 14.89, aeUrl: "https://www.aliexpress.com/item/1005007014381424.html" },
      { name: "Silicone Baby Bibs", image: "/products/39.jpg", price: 3.61, aeUrl: "https://www.aliexpress.com/item/1005007014514270.html" },
      { name: "Baby Monitor Camera", image: "/products/40.jpg", price: 4.99, aeUrl: "https://www.aliexpress.com/item/1005010379046632.html" },
      { name: "Kids Night Light Projector", image: "/products/41.jpg", price: 4.15, aeUrl: "https://www.aliexpress.com/item/1005007938041673.html" },
      { name: "Baby Food Maker", image: "/products/42.jpg", price: 80.99, aeUrl: "https://www.aliexpress.com/item/1005007430035554.html" },
      { name: "Toddler Balance Bike", image: "/products/43.jpg", price: 57.69, aeUrl: "https://www.aliexpress.com/item/1005008542699475.html" },
      { name: "Baby Carrier Wrap", image: "/products/44.jpg", price: 13.79, aeUrl: "https://www.aliexpress.com/item/1005012479730305.html" },
      { name: "Kids Water Bottle with Straw", image: "/products/45.jpg", price: 6.6, aeUrl: "https://www.aliexpress.com/item/1005007791190486.html" },
      { name: "Baby Proofing Corner Guards", image: "/products/46.jpg", aeUrl: "https://www.aliexpress.com/item/1005006755119404.html" },
    ],
  },
  {
    name: "Automotive",
    priceRange: [2.93, 21.44],
    items: [
      { name: "Car Vacuum Cleaner", image: "/products/47.jpg", price: 8.79, aeUrl: "https://www.aliexpress.com/item/1005006995231269.html" },
      { name: "Car Phone Holder Vent Mount", image: "/products/48.jpg", price: 5.29, aeUrl: "https://www.aliexpress.com/item/1005012986708271.html" },
      { name: "Car Seat Gap Filler", image: "/products/49.jpg", price: 4.39, aeUrl: "https://www.aliexpress.com/item/1005008660420186.html" },
      { name: "Dash Cam", image: "/products/50.jpg", price: 16.49, aeUrl: "https://www.aliexpress.com/item/1005006727775126.html" },
      { name: "Car Trunk Organizer", image: "/products/51.jpg", aeUrl: "https://www.aliexpress.com/item/1005005995498062.html" },
      { name: "Car Air Freshener Diffuser", image: "/products/52.jpg", price: 3.66, aeUrl: "https://www.aliexpress.com/item/1005009460604142.html" },
      { name: "Steering Wheel Cover", image: "/products/53.jpg", aeUrl: "https://www.aliexpress.com/item/1005007116675728.html" },
      { name: "Car Windshield Sun Shade", image: "/products/54.jpg", price: 11.29, aeUrl: "https://www.aliexpress.com/item/1005010044051821.html" },
      { name: "Tire Pressure Gauge", image: "/products/55.jpg", price: 6.6, aeUrl: "https://www.aliexpress.com/item/1005006861868198.html" },
    ],
  },
  {
    name: "Outdoor & Garden",
    priceRange: [2.87, 142.99],
    items: [
      { name: "Solar Garden Lights", image: "/products/56.jpg", price: 7.32, aeUrl: "https://www.aliexpress.com/item/1005007171184391.html" },
      { name: "Portable Camping Hammock", image: "/products/57.jpg", price: 34.19, aeUrl: "https://www.aliexpress.com/item/1005007038509234.html" },
      { name: "Garden Kneeler Seat", image: "/products/58.jpg", price: 30.39, aeUrl: "https://www.aliexpress.com/item/1005013158520495.html" },
      { name: "Automatic Plant Watering System", image: "/products/59.jpg", price: 3.65, aeUrl: "https://www.aliexpress.com/item/1005009054868872.html" },
      { name: "Outdoor String Lights", image: "/products/60.jpg", price: 3.59, aeUrl: "https://www.aliexpress.com/item/1005007170965475.html" },
      { name: "Retractable Garden Hose", image: "/products/61.jpg", price: 14.19, aeUrl: "https://www.aliexpress.com/item/1005012370627813.html" },
      { name: "Bug Zapper Lamp", image: "/products/62.jpg", price: 5.61, aeUrl: "https://www.aliexpress.com/item/1005008144989177.html" },
      { name: "Folding Camping Chair", image: "/products/63.jpg", price: 49.69, aeUrl: "https://www.aliexpress.com/item/1005006994770005.html" },
      { name: "Bird Feeder Solar", image: "/products/64.jpg", price: 109.99, aeUrl: "https://www.aliexpress.com/item/1005008660314475.html" },
    ],
  },
  {
    name: "Office & Stationery",
    priceRange: [1.37, 62.65],
    items: [
      { name: "Desk Cable Organizer", image: "/products/65.jpg", price: 1.71, aeUrl: "https://www.aliexpress.com/item/1005012978039292.html" },
      { name: "Mechanical Keyboard", image: "/products/66.jpg", price: 48.19, aeUrl: "https://www.aliexpress.com/item/1005007539958713.html" },
      { name: "Monitor Stand Riser", image: "/products/67.jpg", price: 23.79, aeUrl: "https://www.aliexpress.com/item/1005006727810115.html" },
      { name: "Desk Whiteboard Calendar", image: "/products/68.jpg", price: 1.99, aeUrl: "https://www.aliexpress.com/item/1005006546618402.html" },
      { name: "Ergonomic Wrist Rest", image: "/products/69.jpg", price: 2.59, aeUrl: "https://www.aliexpress.com/item/1005006967321905.html" },
      { name: "Sticky Notes Set", image: "/products/70.jpg", price: 6.99, aeUrl: "https://www.aliexpress.com/item/1005007805504764.html" },
      { name: "Cordless Desk Lamp", image: "/products/71.jpg", aeUrl: "https://www.aliexpress.com/item/1005007709215192.html" },
      { name: "Laptop Stand Foldable", image: "/products/72.jpg", price: 2.34, aeUrl: "https://www.aliexpress.com/item/1005010759406824.html" },
    ],
  },
  {
    name: "Fashion & Jewelry",
    priceRange: [1.99, 14.16],
    items: [
      { name: "Layered Necklace Set", image: "/products/73.jpg", price: 7.9, aeUrl: "https://www.aliexpress.com/item/1005008660218588.html" },
      { name: "Minimalist Ring Set", image: "/products/74.jpg", price: 9.69, aeUrl: "https://www.aliexpress.com/item/1005008500762203.html" },
      { name: "Crossbody Phone Bag", image: "/products/75.jpg", aeUrl: "https://www.aliexpress.com/item/1005006849827462.html" },
      { name: "Silk Hair Scrunchies", image: "/products/76.jpg", aeUrl: "https://www.aliexpress.com/item/1005004144917076.html" },
      { name: "Sunglasses Polarized", image: "/products/77.jpg", price: 3.62, aeUrl: "https://www.aliexpress.com/item/1005007097199237.html" },
      { name: "Claw Clips Set", image: "/products/78.jpg", price: 3.24, aeUrl: "https://www.aliexpress.com/item/1005008660103911.html" },
      { name: "Statement Earrings", image: "/products/79.jpg", price: 2.49, aeUrl: "https://www.aliexpress.com/item/1005007171300136.html" },
      { name: "Waist Bag Fanny Pack", image: "/products/80.jpg", price: 10.89, aeUrl: "https://www.aliexpress.com/item/1005013002506605.html" },
      { name: "Beanie Hat Winter", image: "/products/81.jpg", price: 4.49, aeUrl: "https://www.aliexpress.com/item/1005007171253188.html" },
    ],
  },
  {
    name: "Gaming & Tech Accessories",
    priceRange: [1.43, 25.73],
    items: [
      { name: "Gaming Mouse RGB", image: "/products/82.jpg", price: 5.33, aeUrl: "https://www.aliexpress.com/item/1005006904646242.html" },
      { name: "Controller Charging Dock", image: "/products/83.jpg", price: 19.79, aeUrl: "https://www.aliexpress.com/item/1005010044231303.html" },
      { name: "Phone Cooling Fan", image: "/products/84.jpg", price: 1.79, aeUrl: "https://www.aliexpress.com/item/1005007038349980.html" },
      { name: "Webcam with Ring Light", image: "/products/85.jpg", aeUrl: "https://www.aliexpress.com/item/1005007001401865.html" },
      { name: "Bluetooth Speaker Mini", image: "/products/86.jpg", price: 6.89, aeUrl: "https://www.aliexpress.com/item/1005010037251642.html" },
      { name: "Wireless Earbuds", image: "/products/87.jpg", price: 13.69, aeUrl: "https://www.aliexpress.com/item/1005006677984952.html" },
      { name: "Phone Grip Holder", image: "/products/88.jpg", aeUrl: "https://www.aliexpress.com/item/1005007334674047.html" },
      { name: "USB Hub Multiport", image: "/products/89.jpg", price: 4.49, aeUrl: "https://www.aliexpress.com/item/1005006995270263.html" },
      { name: "Ring Light Tripod Stand", image: "/products/90.jpg", aeUrl: "https://www.aliexpress.com/item/1005006042796066.html" },
    ],
  },
  {
    name: "Cleaning & Household",
    priceRange: [1.59, 12.99],
    items: [
      { name: "Robot Vacuum Mop", image: "/products/91.jpg", price: 1.99, aeUrl: "https://www.aliexpress.com/item/1005007709645715.html" },
      { name: "Reusable Cleaning Cloths", image: "/products/92.jpg", price: 1.99, aeUrl: "https://www.aliexpress.com/item/1005006311851419.html" },
      { name: "Electric Spin Scrubber", image: "/products/93.jpg", price: 9.99, aeUrl: "https://www.aliexpress.com/item/1005010228829507.html" },
      { name: "Mini Handheld Vacuum", image: "/products/94.jpg", price: 1.99, aeUrl: "https://www.aliexpress.com/item/1005009259589970.html" },
      { name: "Squeegee Window Cleaner", image: "/products/95.jpg", price: 3.81, aeUrl: "https://www.aliexpress.com/item/1005007539987481.html" },
      { name: "Lint Remover Electric", image: "/products/96.jpg", price: 8.39, aeUrl: "https://www.aliexpress.com/item/1005007097015654.html" },
      { name: "Shoe Cleaning Brush Kit", image: "/products/97.jpg", price: 2.76, aeUrl: "https://www.aliexpress.com/item/1005008248044820.html" },
      { name: "Dish Drying Rack", image: "/products/98.jpg", aeUrl: "https://www.aliexpress.com/item/1005010103392292.html" },
    ],
  },
  {
    name: "Toys & Games",
    priceRange: [1.59, 36.91],
    items: [
      { name: "Magnetic Building Tiles", image: "/products/99.jpg", price: 5.81, aeUrl: "https://www.aliexpress.com/item/1005010044157341.html" },
      { name: "Fidget Toy Pack", image: "/products/100.jpg", price: 3.93, aeUrl: "https://www.aliexpress.com/item/1005006860978238.html" },
      { name: "RC Stunt Car", image: "/products/101.jpg", price: 26.79, aeUrl: "https://www.aliexpress.com/item/1005009054893258.html" },
      { name: "Puzzle Board Game", image: "/products/102.jpg", aeUrl: "https://www.aliexpress.com/item/1005007746629992.html" },
      { name: "Water Balloon Set", image: "/products/103.jpg", price: 28.39, aeUrl: "https://www.aliexpress.com/item/1005010529988765.html" },
      { name: "Bubble Machine", image: "/products/104.jpg", price: 6.89, aeUrl: "https://www.aliexpress.com/item/1005007171012670.html" },
      { name: "Kinetic Sand Kit", image: "/products/105.jpg", price: 1.99, aeUrl: "https://www.aliexpress.com/item/1005008074640574.html" },
      { name: "Building Blocks Set", image: "/products/106.jpg", price: 2.95, aeUrl: "https://www.aliexpress.com/item/1005009806635886.html" },
    ],
  },
  {
    name: "Camping & Outdoor Gear",
    priceRange: [1.59, 38.21],
    items: [
      { name: "Camping Lantern LED", image: "/products/107.jpg", price: 6.49, aeUrl: "https://www.aliexpress.com/item/1005007938146191.html" },
      { name: "Portable Camping Stove", image: "/products/108.jpg", price: 2.91, aeUrl: "https://www.aliexpress.com/item/1005007109412057.html" },
      { name: "Sleeping Bag Compact", image: "/products/109.jpg", price: 5.71, aeUrl: "https://www.aliexpress.com/item/1005012993963328.html" },
      { name: "Multi-Tool Camping Knife", image: "/products/110.jpg", price: 7.29, aeUrl: "https://www.aliexpress.com/item/1005006996399451.html" },
      { name: "Inflatable Sleeping Pad", image: "/products/111.jpg", price: 29.39, aeUrl: "https://www.aliexpress.com/item/1005007345678083.html" },
      { name: "Camping Cookware Set", image: "/products/112.jpg", price: 14.19, aeUrl: "https://www.aliexpress.com/item/1005006904433857.html" },
      { name: "Headlamp Rechargeable", image: "/products/113.jpg", price: 1.99, aeUrl: "https://www.aliexpress.com/item/1005007255182152.html" },
    ],
  },
  {
    name: "Men's Grooming",
    priceRange: [1.82, 7.83],
    items: [
      { name: "Beard Trimmer Kit", image: "/products/114.jpg", price: 6.02, aeUrl: "https://www.aliexpress.com/item/1005010044147043.html" },
      { name: "Nose Hair Trimmer", image: "/products/115.jpg", price: 5.39, aeUrl: "https://www.aliexpress.com/item/1005009054805899.html" },
      { name: "Electric Shaver", image: "/products/116.jpg", price: 2.27, aeUrl: "https://www.aliexpress.com/item/1005007168655432.html" },
      { name: "Beard Grooming Kit", image: "/products/117.jpg", price: 3.76, aeUrl: "https://www.aliexpress.com/item/1005008554693467.html" },
      { name: "Hair Clipper Set", image: "/products/118.jpg", price: 6.02, aeUrl: "https://www.aliexpress.com/item/1005010044147043.html" },
      { name: "Ear Wax Removal Tool", image: "/products/119.jpg", price: 2.83, aeUrl: "https://www.aliexpress.com/item/1005007096718921.html" },
      { name: "Nail Clipper Set", image: "/products/120.jpg", price: 3.89, aeUrl: "https://www.aliexpress.com/item/1005006966244715.html" },
    ],
  },
  {
    name: "Sports & Fitness Equipment",
    priceRange: [3.8, 22.61],
    items: [
      { name: "Yoga Mat Non-Slip", image: "/products/121.jpg", price: 9.09, aeUrl: "https://www.aliexpress.com/item/1005006995272203.html" },
      { name: "Ab Roller Wheel", image: "/products/122.jpg", price: 7.62, aeUrl: "https://www.aliexpress.com/item/1005006995164472.html" },
      { name: "Pull Up Bar Doorway", image: "/products/123.jpg", price: 16.59, aeUrl: "https://www.aliexpress.com/item/1005009649035630.html" },
      { name: "Foam Roller Massage", image: "/products/124.jpg", price: 15.71, aeUrl: "https://www.aliexpress.com/item/1005004232062585.html" },
      { name: "Skipping Rope Weighted", image: "/products/125.jpg", price: 11.79, aeUrl: "https://www.aliexpress.com/item/1005009508889647.html" },
      { name: "Exercise Bike Pedal", image: "/products/126.jpg", price: 17.39, aeUrl: "https://www.aliexpress.com/item/1005007635835958.html" },
      { name: "Grip Strengthener", image: "/products/127.jpg", price: 6.69, aeUrl: "https://www.aliexpress.com/item/1005012986634622.html" },
      { name: "Sports Water Bottle Insulated", image: "/products/128.jpg", price: 4.75, aeUrl: "https://www.aliexpress.com/item/1005007433246294.html" },
    ],
  },
  {
    name: "Party & Events",
    priceRange: [1.59, 18.66],
    items: [
      { name: "Balloon Arch Kit", image: "/products/129.jpg", price: 1.99, aeUrl: "https://www.aliexpress.com/item/1005007017132943.html" },
      { name: "LED String Curtain Lights", image: "/products/130.jpg", price: 4.09, aeUrl: "https://www.aliexpress.com/item/1005006994725087.html" },
      { name: "Disposable Party Tableware Set", image: "/products/131.jpg", price: 5.9, aeUrl: "https://www.aliexpress.com/item/1005006918825931.html" },
      { name: "Photo Booth Props", image: "/products/132.jpg", aeUrl: "https://www.aliexpress.com/item/1005003653270246.html" },
      { name: "Confetti Balloons", image: "/products/133.jpg", aeUrl: "https://www.aliexpress.com/item/1005008949887087.html" },
      { name: "Party Backdrop Banner", image: "/products/134.jpg", price: 14.35, aeUrl: "https://www.aliexpress.com/item/1005003352843797.html" },
      { name: "Cake Topper Set", image: "/products/135.jpg", price: 3.96, aeUrl: "https://www.aliexpress.com/item/1005007010060113.html" },
    ],
  },
];

export const BRAND_PREFIXES = [
  "Lume", "Nova", "Aero", "Vira", "Bloom", "Zeno", "Orbit", "Kindra", "Vesta", "Halo",
  "Drift", "Cove", "Pulse", "Ember", "Sable", "Rift", "Lush", "Tidal", "Marlo", "Onyx",
];
export const BRAND_SUFFIXES = [
  "Co", "Studio", "Labs", "Supply", "Collective", "House", "Goods", "Market", "Society", "Shop",
];

export const HOOKS = [
  "You're probably using this wrong...",
  "I didn't believe this would work until I tried it",
  "Stop scrolling if you deal with this every day",
  "This sold out 3 times before I could film it",
  "POV: you just found the thing your morning was missing",
  "Nobody tells you this before you buy one",
  "This is why my friends keep asking where I got this",
  "The $0 fix nobody talks about vs this",
  "I wish I found this two years ago",
  "This has been living in my bag for 3 months straight",
];

export const ANGLES = [
  "Problem → Demonstration → Result",
  "Before / After transformation",
  "Founder story + why they built it",
  "Unboxing + first impressions",
  "Myth vs reality comparison",
  "Customer testimonial montage",
  "Side-by-side vs the old way",
  "Listicle: 5 reasons this works",
  "Skeptic-to-believer narrative",
  "Satisfying product demo close-up",
];

export const OBJECTIONS = [
  "Feels too good to be true at this price",
  "Worried it won't fit / work with what I already own",
  "Not sure if it's worth it vs a free alternative",
  "Shipping time uncertainty",
  "Unsure about durability / build quality",
];

export const CUSTOMER_LANGUAGE = [
  "life changing honestly",
  "wish i bought this sooner",
  "so much easier than i expected",
  "actually works unlike other ones ive tried",
  "perfect gift idea",
  "packaging felt premium",
  "exactly as described",
  "didn't expect to use it this much",
];

export const TRUST_SIGNALS = [
  "30-day money-back guarantee",
  "Free shipping over threshold",
  "Verified customer reviews widget",
  "Secure checkout badges",
  "Limited stock counter",
  "Live visitor counter",
  "Influencer as-seen-on strip",
];

export const UPSELLS = [
  "Bundle discount (buy 2 save 15%)",
  "Post-purchase warranty upsell",
  "Frequently bought together carousel",
  "Subscribe & save option",
  "Free gift with 3+ items",
];

export const COUNTRIES: import("@/types").Country[] = [
  "Australia",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
];
