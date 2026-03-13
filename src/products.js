export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Classic White Tee",
    price: 25.00,
    before_price: 50,
    discount: 50,
    rating: 4.5,
    reviewCount: 128,
    category: "Apparel",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500",
      "https://images.unsplash.com/photo-1622445275576-721325763afe?w=500"
    ],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
    description: "A comfortable, everyday essential.",
    fullDescription: "This classic white t-shirt is crafted from 100% premium cotton for ultimate comfort and durability. Perfect for layering or wearing on its own, this versatile piece features a relaxed fit that works for any body type.",
    specifications: {
      brand: "Essentials",
      material: "100% Cotton",
      fit: "Regular Fit",
      sleeveLength: "Short Sleeve",
      careInstructions: "Machine Wash Cold",
      warranty: "30 Days"
    },
    reviews: [
      { id: 1, user: "John D.", rating: 5, comment: "Great quality! Fits perfectly.", helpful: 24 },
      { id: 2, user: "Sarah M.", rating: 4, comment: "Very comfortable.", helpful: 12 }
    ],
    colors: ["white", "black", "gray", "navy"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: 150
  },
  {
    id: 2,
    name: "Leather Boots",
    price: 120.00,
    before_price: 180,
    discount: 33,
    rating: 4.8,
    reviewCount: 89,
    category: "Footwear",
    images: [
      "https://images.unsplash.com/photo-1542840410-3092f99611a3?w=500",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500",
      "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500",
      "https://images.unsplash.com/photo-1605812860391-0093d7f51d8b?w=500"
    ],
    image: "https://images.unsplash.com/photo-1542840410-3092f99611a3?w=300",
    description: "Durable boots for any weather.",
    fullDescription: "Premium leather boots designed for both style and functionality. Featuring a sturdy rubber sole for excellent traction, cushioned insole for all-day comfort, and water-resistant leather upper.",
    specifications: {
      brand: "TimberPro",
      material: "Genuine Leather Upper",
      sole: "Rubber Sole",
      closure: "Lace-Up",
      warranty: "1 Year"
    },
    reviews: [
      { id: 1, user: "Alex K.", rating: 5, comment: "Amazing quality!", helpful: 45 }
    ],
    colors: ["brown", "black", "tan"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    inStock: true,
    stockCount: 45
  },
  {
    id: 3,
    name: "Canvas Backpack",
    price: 45.00,
    before_price: 70,
    discount: 36,
    rating: 4.3,
    reviewCount: 156,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=500"
    ],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
    description: "Perfect for school or travel.",
    fullDescription: "A versatile canvas backpack built to last. Features a spacious main compartment with laptop sleeve, front zip pocket for easy access, and padded shoulder straps for comfort.",
    specifications: {
      brand: "TravelMate",
      material: "12oz Canvas",
      dimensions: "18 x 12 x 6 inches",
      warranty: "Lifetime"
    },
    reviews: [
      { id: 1, user: "Emily R.", rating: 4, comment: "Great backpack!", helpful: 28 }
    ],
    colors: ["navy", "olive", "gray", "black"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 200
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: 89.00,
    before_price: 149,
    discount: 40,
    rating: 4.7,
    reviewCount: 342,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500"
    ],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
    description: "Premium sound quality.",
    fullDescription: "Experience immersive audio with these premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium 40mm drivers for rich, detailed sound.",
    specifications: {
      brand: "SoundMax",
      driverSize: "40mm",
      batteryLife: "30 Hours",
      bluetoothVersion: "5.0",
      warranty: "2 Years"
    },
    reviews: [
      { id: 1, user: "David W.", rating: 5, comment: "Best headphones ever!", helpful: 67 }
    ],
    colors: ["black", "white", "blue", "red"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 120
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: 75.00,
    before_price: 120,
    discount: 38,
    rating: 4.6,
    reviewCount: 98,
    category: "Apparel",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500"
    ],
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300",
    description: "Classic style for any season.",
    fullDescription: "A timeless denim jacket crafted from premium ring-spun cotton. This classic trucker jacket features button closure, two chest pockets, and adjustable side tabs.",
    specifications: {
      brand: "DenimCo",
      material: "100% Cotton Denim",
      warranty: "90 Days"
    },
    reviews: [
      { id: 1, user: "Ryan P.", rating: 5, comment: "Perfect fit!", helpful: 42 }
    ],
    colors: ["light blue", "dark blue", "black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    stockCount: 75
  },
  {
    id: 6,
    name: "Smart Watch",
    price: 199.00,
    before_price: 299,
    discount: 33,
    rating: 4.9,
    reviewCount: 567,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500"
    ],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
    description: "Track your fitness goals.",
    fullDescription: "The ultimate smartwatch for fitness enthusiasts. Track your heart rate, steps, sleep, and over 100 workout modes. With a stunning AMOLED display and 7-day battery life.",
    specifications: {
      brand: "TechFit Pro",
      display: "1.4 inch AMOLED",
      batteryLife: "7 Days",
      waterResistance: "5ATM",
      warranty: "2 Years"
    },
    reviews: [
      { id: 1, user: "Mark T.", rating: 5, comment: "Best smartwatch!", helpful: 89 }
    ],
    colors: ["black", "silver", "rose gold", "blue"],
    sizes: ["40mm", "44mm"],
    inStock: true,
    stockCount: 200
  },
  {
    id: 7,
    name: "Sunglasses",
    price: 55.00,
    before_price: 80,
    discount: 31,
    rating: 4.2,
    reviewCount: 234,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500"
    ],
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300",
    description: "UV protection with style.",
    fullDescription: "Protect your eyes in style with these premium sunglasses. Features UV400 protection blocking 100% of harmful UVA and UVB rays with polarized lenses.",
    specifications: {
      brand: "SunStyle",
      lensType: "Polarized",
      UVProtection: "UV400",
      warranty: "1 Year"
    },
    reviews: [
      { id: 1, user: "Patricia G.", rating: 5, comment: "Very stylish!", helpful: 34 }
    ],
    colors: ["black", "gold", "silver", "brown"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 180
  },
  {
    id: 8,
    name: "Running Shoes",
    price: 95.00,
    before_price: 140,
    discount: 32,
    rating: 4.5,
    reviewCount: 289,
    category: "Footwear",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500"
    ],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
    description: "Lightweight and comfortable.",
    fullDescription: "Engineered for peak performance, these running shoes feature responsive cushioning, breathable mesh upper, and a durable rubber outsole.",
    specifications: {
      brand: "RunPro",
      upperMaterial: "Breathable Mesh",
      soleMaterial: "Rubber",
      warranty: "6 Months"
    },
    reviews: [
      { id: 1, user: "Michael B.", rating: 5, comment: "Super comfortable!", helpful: 56 }
    ],
    colors: ["red", "blue", "black", "white"],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    inStock: true,
    stockCount: 150
  },
  {
    id: 9,
    name: "Leather Wallet",
    price: 35.00,
    before_price: 55,
    discount: 36,
    rating: 4.4,
    reviewCount: 167,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500",
      "https://images.unsplash.com/photo-1606503824805-595d979e5b3c?w=500",
      "https://images.unsplash.com/photo-1606503824805-595d979e5b3c?w=500"
    ],
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300",
    description: "Genuine leather craftsmanship.",
    fullDescription: "Handcrafted from premium full-grain leather, this bifold wallet features 6 card slots, 2 bill compartments, and RFID blocking technology.",
    specifications: {
      brand: "LeatherCraft",
      material: "Full-Grain Leather",
      RFIDBlocking: "Yes",
      warranty: "Lifetime"
    },
    reviews: [
      { id: 1, user: "Robert H.", rating: 5, comment: "Beautiful leather!", helpful: 42 }
    ],
    colors: ["black", "brown", "tan", "burgundy"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 220
  },
  {
    id: 10,
    name: "Hoodie",
    price: 49.00,
    before_price: 75,
    discount: 35,
    rating: 4.6,
    reviewCount: 312,
    category: "Apparel",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=500",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500"
    ],
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300",
    description: "Cozy and stylish.",
    fullDescription: "Ultra-soft fleece hoodie perfect for layering or lounging. Features a spacious kangaroo pocket, adjustable drawstring hood, and ribbed cuffs.",
    specifications: {
      brand: "CozyWear",
      material: "80% Cotton, 20% Polyester",
      warranty: "30 Days"
    },
    reviews: [
      { id: 1, user: "Amanda L.", rating: 5, comment: "So soft!", helpful: 67 }
    ],
    colors: ["gray", "black", "navy", "burgundy", "olive"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: 300
  },
  {
    id: 11,
    name: "Laptop Bag",
    price: 65.00,
    before_price: 100,
    discount: 35,
    rating: 4.3,
    reviewCount: 145,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500",
      "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"
    ],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
    description: "Professional and protective.",
    fullDescription: "Sleek laptop bag designed for professionals. Padded laptop compartment fits laptops up to 15.6 inches with multiple organizational pockets.",
    specifications: {
      brand: "ProTech",
      material: "Water-Resistant Nylon",
      laptopSize: "Up to 15.6 inches",
      warranty: "1 Year"
    },
    reviews: [
      { id: 1, user: "Chris W.", rating: 5, comment: "Perfect for laptop!", helpful: 38 }
    ],
    colors: ["black", "gray", "blue"],
    sizes: ["15.6 inch"],
    inStock: true,
    stockCount: 85
  },
  {
    id: 12,
    name: "Sneakers",
    price: 79.00,
    before_price: 120,
    discount: 34,
    rating: 4.7,
    reviewCount: 423,
    category: "Footwear",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500"
    ],
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300",
    description: "Casual everyday wear.",
    fullDescription: "Classic sneakers reimagined for modern comfort. Features a cushioned insole, breathable canvas upper, and durable rubber outsole.",
    specifications: {
      brand: "StreetStyle",
      upperMaterial: "Premium Canvas",
      warranty: "90 Days"
    },
    reviews: [
      { id: 1, user: "Jason M.", rating: 5, comment: "Super comfortable!", helpful: 78 }
    ],
    colors: ["white", "black", "red", "navy"],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    inStock: true,
    stockCount: 250
  },
  {
    id: 13,
    name: "Mechanical Keyboard",
    price: 120.00,
    before_price: 180,
    discount: 33,
    rating: 4.8,
    reviewCount: 234,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b0852de?w=500",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500",
      "https://images.unsplash.com/photo-1587829741301-dc798b0852de?w=500"
    ],
    image: "https://images.unsplash.com/photo-1587829741301-dc798b0852de?w=300",
    description: "Tactile typing experience.",
    fullDescription: "Premium mechanical keyboard with hot-swappable switches. Features RGB backlighting with 16.8 million colors and aircraft-grade aluminum frame.",
    specifications: {
      brand: "KeyMaster",
      switchType: "Hot-Swappable",
      backlighting: "RGB",
      warranty: "2 Years"
    },
    reviews: [
      { id: 1, user: "GamerPro99", rating: 5, comment: "Amazing feel!", helpful: 89 }
    ],
    colors: ["black", "white", "silver"],
    sizes: ["Full Size"],
    inStock: true,
    stockCount: 65
  },
  {
    id: 14,
    name: "Yoga Mat",
    price: 25.00,
    before_price: 40,
    discount: 38,
    rating: 4.5,
    reviewCount: 189,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1599301787868-500586292715?w=500",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500",
      "https://images.unsplash.com/photo-1599301787868-500586292715?w=500"
    ],
    image: "https://images.unsplash.com/photo-1599301787868-500586292715?w=300",
    description: "Non-slip surface for yoga practice.",
    fullDescription: "Premium eco-friendly yoga mat with superior grip and cushioning. Non-slip surface works well for both wet and dry practice.",
    specifications: {
      brand: "ZenFlow",
      material: "TPE",
      thickness: "6mm",
      warranty: "1 Year"
    },
    reviews: [
      { id: 1, user: "YogaLover", rating: 5, comment: "Perfect grip!", helpful: 45 }
    ],
    colors: ["purple", "blue", "green", "pink", "black"],
    sizes: ["Standard (72x24)"],
    inStock: true,
    stockCount: 180
  },
  {
    id: 15,
    name: "Water Bottle",
    price: 18.00,
    before_price: 30,
    discount: 40,
    rating: 4.4,
    reviewCount: 456,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
      "https://images.unsplash.com/photo-1517148581080-5bc4d6d24bef?w=500",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"
    ],
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300",
    description: "Insulated stainless steel bottle.",
    fullDescription: "Premium insulated water bottle keeping drinks cold for 24 hours or hot for 12 hours. Made from 18/8 stainless steel with double-wall vacuum insulation.",
    specifications: {
      brand: "HydroMax",
      material: "18/8 Stainless Steel",
      capacity: "32 oz",
      warranty: "Lifetime"
    },
    reviews: [
      { id: 1, user: "HydrationHero", rating: 5, comment: "Keeps water cold all day!", helpful: 92 }
    ],
    colors: ["black", "white", "blue", "red", "green", "rose gold"],
    sizes: ["32 oz"],
    inStock: true,
    stockCount: 400
  },
  {
    id: 16,
    name: "Tote Bag",
    price: 32.00,
    before_price: 50,
    discount: 36,
    rating: 4.6,
    reviewCount: 178,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d8567e79d3e?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      "https://images.unsplash.com/photo-1556228578-0d8567e79d3e?w=500"
    ],
    image: "https://images.unsplash.com/photo-1556228578-0d8567e79d3e?w=300",
    description: "Reusable canvas tote bag.",
    fullDescription: "Eco-friendly canvas tote bag perfect for shopping, work, or everyday use. Made from 100% organic cotton canvas.",
    specifications: {
      brand: "EcoCarry",
      material: "Organic Cotton Canvas",
      warranty: "90 Days"
    },
    reviews: [
      { id: 1, user: "EcoWarrior", rating: 5, comment: "Great eco choice!", helpful: 67 }
    ],
    colors: ["natural", "black", "navy", "olive", "burgundy"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 350
  },
  {
    id: 17,
    name: "Desk Lamp",
    price: 45.00,
    before_price: 70,
    discount: 36,
    rating: 4.3,
    reviewCount: 123,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1507473888900-52e1f1683486?w=500",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500",
      "https://images.unsplash.com/photo-1507473888900-52e1f1683486?w=500"
    ],
    image: "https://images.unsplash.com/photo-1507473888900-52e1f1683486?w=300",
    description: "LED desk lamp with adjustable brightness.",
    fullDescription: "Modern LED desk lamp with touch-sensitive brightness control and 3 color temperature modes. Includes USB charging port.",
    specifications: {
      brand: "LumiTech",
      power: "12W",
      warranty: "2 Years"
    },
    reviews: [
      { id: 1, user: "OfficeWorker", rating: 5, comment: "Perfect for office!", helpful: 38 }
    ],
    colors: ["white", "black", "silver"],
    sizes: ["Standard"],
    inStock: true,
    stockCount: 95
  },
  {
    id: 18,
    name: "Coffee Mug",
    price: 15.00,
    before_price: 25,
    discount: 40,
    rating: 4.2,
    reviewCount: 267,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500",
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500"
    ],
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300",
    description: "Ceramic coffee mug with unique design.",
    fullDescription: "Elegant ceramic coffee mug with comfortable handle. Microwave and dishwasher safe with beautiful glaze finish.",
    specifications: {
      brand: "CupStyle",
      material: "Ceramic",
      capacity: "12 oz",
      warranty: "30 Days"
    },
    reviews: [
      { id: 1, user: "CoffeeAddict", rating: 5, comment: "Love the design!", helpful: 48 }
    ],
    colors: ["white", "blue", "green", "pink", "black"],
    sizes: ["12 oz"],
    inStock: true,
    stockCount: 280
  },
  {
    id: 19,
    name: "Notebook",
    price: 12.00,
    before_price: 20,
    discount: 40,
    rating: 4.4,
    reviewCount: 198,
    category: "Office",
    images: [
      "https://images.unsplash.com/photo-1584466844281-261cc3cd2d70?w=500",
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
      "https://images.unsplash.com/photo-1584466844281-261cc3cd2d70?w=500"
    ],
    image: "https://images.unsplash.com/photo-1584466844281-261cc3cd2d70?w=300",
    description: "Hardcover notebook with blank pages.",
    fullDescription: "Premium hardcover notebook with 200 pages of high-quality paper. Perfect for journaling or note-taking with lay-flat binding.",
    specifications: {
      brand: "NoteCraft",
      pages: "200 Pages",
      size: "A5",
      warranty: "90 Days"
    },
    reviews: [
      { id: 1, user: "JournalFan", rating: 5, comment: "Beautiful paper!", helpful: 56 }
    ],
    colors: ["black", "brown", "navy", "forest green", "burgundy"],
    sizes: ["A5"],
    inStock: true,
    stockCount: 420
  },
  {
    id: 20,
    name: "Phone Case",
    price: 20.00,
    before_price: 35,
    discount: 43,
    rating: 4.5,
    reviewCount: 534,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500",
      "https://images.unsplash.com/photo-1556656793-02774a8c577a?w=500",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500",
      "https://images.unsplash.com/photo-1556656793-02774a8c577a?w=500"
    ],
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300",
    description: "Durable phone case with shock absorption.",
    fullDescription: "Military-grade protection case with shock-absorbing technology. Features raised bezels for screen and camera protection.",
    specifications: {
      brand: "GuardTech",
      protection: "Military Grade",
      wirelessCharging: "Compatible",
      warranty: "1 Year"
    },
    reviews: [
      { id: 1, user: "PhoneProtector", rating: 5, comment: "Saved my phone!", helpful: 112 }
    ],
    colors: ["clear", "black", "blue", "purple", "pink"],
    sizes: ["iPhone 14", "iPhone 14 Pro", "iPhone 13"],
    inStock: true,
    stockCount: 500
  },
  {
    id: 21,
    name: "Fitness Tracker Band",
    price: 49.00,
    before_price: 79,
    discount: 38,
    rating: 4.4,
    reviewCount: 289,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500",
      "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500"
    ],
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300",
    description: "Track your daily fitness activities.",
    fullDescription: "Sleek fitness tracker with 24/7 heart rate monitoring, sleep tracking, and 14-day battery life. Water-resistant up to 50m.",
    specifications: {
      brand: "FitBand",
      batteryLife: "14 Days",
      waterResistance: "5ATM",
      warranty: "1 Year"
    },
    reviews: [
      { id: 1, user: "FitnessFreak", rating: 5, comment: "Great value!", helpful: 67 }
    ],
    colors: ["black", "navy", "pink", "green"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 180
  },
  {
    id: 22,
    name: "Portable Speaker",
    price: 35.00,
    before_price: 55,
    discount: 36,
    rating: 4.3,
    reviewCount: 345,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      "https://images.unsplash.com/photo-1558537348-c0f8e733989d?w=500",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      "https://images.unsplash.com/photo-1558537348-c0f8e733989d?w=500"
    ],
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300",
    description: "Compact Bluetooth speaker with powerful sound.",
    fullDescription: "Compact yet powerful Bluetooth speaker with 12-hour playtime and IPX7 waterproof rating. Built-in microphone for hands-free calls.",
    specifications: {
      brand: "SoundWave",
      batteryLife: "12 Hours",
      waterproofRating: "IPX7",
      warranty: "1 Year"
    },
    reviews: [
      { id: 1, user: "MusicLover", rating: 5, comment: "Amazing sound!", helpful: 89 }
    ],
    colors: ["black", "blue", "red", "green"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 220
  },
  {
    id: 23,
    name: "Travel Pillow",
    price: 22.00,
    before_price: 35,
    discount: 37,
    rating: 4.6,
    reviewCount: 412,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=500",
      "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=500",
      "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=500",
      "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=500"
    ],
    image: "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=300",
    description: "Memory foam neck pillow for travel.",
    fullDescription: "Premium memory foam travel pillow with ergonomic design for ultimate neck support. Includes eye mask and earplugs.",
    specifications: {
      brand: "ComfortCarry",
      material: "Memory Foam",
      warranty: "1 Year"
    },
    reviews: [
      { id: 1, user: "FrequentFlyer", rating: 5, comment: "Saved my neck!", helpful: 124 }
    ],
    colors: ["gray", "blue", "pink", "black"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 290
  },
  {
    id: 24,
    name: "Wireless Earbuds",
    price: 59.00,
    before_price: 99,
    discount: 40,
    rating: 4.5,
    reviewCount: 678,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500"
    ],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300",
    description: "True wireless earbuds with ANC.",
    fullDescription: "Premium true wireless earbuds with Active Noise Cancellation. 8-hour battery life with 24-hour total using charging case.",
    specifications: {
      brand: "SoundPods Pro",
      batteryLife: "8 Hours (Earbuds), 24 Hours (Total)",
      ANC: "Yes",
      warranty: "2 Years"
    },
    reviews: [
      { id: 1, user: "AudioPhile", rating: 5, comment: "Best earbuds!", helpful: 156 }
    ],
    colors: ["white", "black", "navy"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 350
  },
  {
    id: 25,
    name: "Winter Jacket",
    price: 129.00,
    before_price: 199,
    discount: 35,
    rating: 4.8,
    reviewCount: 178,
    category: "Apparel",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500"
    ],
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300",
    description: "Warm and stylish winter parka.",
    fullDescription: "Premium winter parka with 800-fill power down insulation for extreme warmth. Waterproof and windproof outer shell.",
    specifications: {
      brand: "ArcticWear",
      insulation: "800-Fill Power Down",
      waterproofRating: "20,000mm",
      warranty: "Lifetime"
    },
    reviews: [
      { id: 1, user: "WinterSurvivor", rating: 5, comment: "Keeps me warm!", helpful: 89 }
    ],
    colors: ["black", "navy", "olive", "burgundy"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: 85
  }
];
