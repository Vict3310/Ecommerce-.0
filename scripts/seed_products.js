import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const productData = {
  Electronics: {
    titles: ['Ultra HD Smart TV', 'Pro Wireless Headphones', 'Silver Gaming Laptop', 'Compact Mirrorless Camera', 'Next-Gen Smartwatch', 'Bass Boost Soundbar', 'Ergonomic Gaming Mouse', 'Mechanical RGB Keyboard', 'Dual Sense Controller', 'Portable Bluetooth Speaker'],
    specs: () => ({
      Brand: ['Sony', 'Samsung', 'Logitech', 'Apple', 'Dell', 'HP'][Math.floor(Math.random() * 6)],
      Warranty: '2 Years Manufacturer',
      Power: 'Battery / AC Adapter',
      Material: 'Metal & Composite'
    }),
    tags: ['4k', 'oled', 'wireless', 'bluetooth']
  },
  Fashion: {
    titles: ['Slim Fit Cotton Shirt', 'Classic Denim Jacket', 'Leather Chelsea Boots', 'Wool Blend Sweater', 'Lightweight Running Shoes', 'Premium Silk Tie', 'Chino Trousers', 'V-Neck Summer Dress', 'Waterproof Trekking Jacket', 'Designer Polarized Sunglasses'],
    specs: () => ({
      Material: ['100% Cotton', 'Synthetic Fiber', 'Premium Leather', 'Wool Blend'][Math.floor(Math.random() * 4)],
      Fit: ['Regular', 'Slim', 'Oversized'][Math.floor(Math.random() * 3)],
      Care: 'Machine Washable / Dry Clean Only',
      Origin: 'Made in Italy'
    }),
    tags: ['casual', 'luxury', 'cotton', 'summer']
  },
  'Home & Kitchen': {
    titles: ['Stainless Steel Cookware Set', 'Digital Air Fryer', 'Memory Foam Pillow', 'Automatic Espresso Machine', 'Handwoven Area Rug', 'Ceramic Table Lamp', 'Smart Air Purifier', 'Cordless Stick Vacuum', 'Modern Office Chair', 'Bamboo Cutting Board'],
    specs: () => ({
      Dimensions: 'Various Sizes Available',
      Weight: `${(Math.random() * 5 + 1).toFixed(1)} kg`,
      Installation: 'Self-Assembly Required',
      Safety: 'BPA Free / Fire Retardant'
    }),
    tags: ['home', 'kitchen', 'cleaning', 'decor']
  },
  Beauty: {
    titles: ['Revitalizing Night Cream', 'Matte Finish Lipstick', 'Hydrating Skin Serum', 'Organic Essential Oil Set', 'Luxury Perfume Mist', 'Charcoal Face Mask', 'Professional Hair Dryer', 'Mineral Sunscreen SPF 50', 'Exfoliating Body Scrub', 'Velvet Makeup Sponge'],
    specs: () => ({
      SkinType: ['All Skin Types', 'Oily', 'Sensitive', 'Dry'][Math.floor(Math.random() * 4)],
      Volume: '100ml / 3.4 fl oz',
      Benefits: 'Anti-aging / Hydration',
      Ingredients: 'Natural / Paraben-Free'
    }),
    tags: ['skinCare', 'organic', 'vegan', 'cruelty-free']
  },
  Sports: {
    titles: ['Pro Series Yoga Mat', 'Adjustable Dumbbell Set', 'Aerodynamic Road Bike', 'Graphite Tennis Racket', 'High-Impact Sports Bra', 'Resistance Band Bundle', 'Digital Jump Rope', 'Hydration Pack 2L', 'All-Terrain Soccer Ball', 'Lightweight Running Shorts'],
    specs: () => ({
      Level: ['Beginner', 'Intermediate', 'Professional'][Math.floor(Math.random() * 3)],
      Grip: 'Non-slip standard',
      Durability: 'Weather Resistant',
      Sport: 'Versatile / Multi-sport'
    }),
    tags: ['fitness', 'yoga', 'training', 'outdoor']
  }
};

const unsplashThemes = {
  Electronics: 'tech,gadget,computer',
  Fashion: 'clothing,fashion,style',
  'Home & Kitchen': 'interior,kitchen,furniture',
  Beauty: 'cosmetics,skincare,perfume',
  Sports: 'fitness,sport,gym'
};

const unsplashIds = {
  Electronics: ['1498228415842-d368ce7a24b7', '1523275335684-37898b6baf30', '1505740420928-5e560c06d30e', '1526733166137-af78f7311aea', '1496181133206-80ce9b88a853', '1519389950473-47ba0277781c', '1550009158-b1fd0b796930', '1611186873850-d57c2f3a6a1c'],
  Fashion: ['1515886657613-9f3515b0c78f', '1539109136881-3be0616acf4b', '1483389127117-b6a210072019', '1523381235312-d728ce8bd9ff', '1490481651871-ab68ff25d43d', '1558769132-cb1aea458c5e', '1445205170230-053b83016050', '1537832816519-689ad1631148'],
  'Home & Kitchen': ['1556910103-1c02745aae4d', '1584622650111-993a426fbf0a', '1583847268964-b28dc8f51f92', '1513506495261-ce1583152062', '1524758631624-e2822e304c36', '1616489953149-8f6ec9a657c4', '1552566626-52f8b828add9', '1567016432779-094069958ad5'],
  Beauty: ['1596462502278-27bfdc4033c8', '1522335789203-aabd1fc54bc9', '1571781926291-c477ebfd024b', '1512446817577-4ad20a442a03', '1526067766100-8ca0312449ca', '1598440444633-82084534a06d', '1612817288484-6f916006741a', '1501103056119-f082e75ee06a'],
  Sports: ['1517836357463-d25dfeac3438', '1534438327276-14e5300c3a48', '1461896756961-d703772f913e', '1526506118085-60ce8714f8c5', '1441926955861-17ca48eb702d', '1506126613408-eca07ce68773', '1540491792459-d93f5d22f180', '1574673849312-61fc147235a5']
};

async function seed() {
  console.log("Fetching existing categories...");
  const { data: catData, error: catError } = await supabase
    .from('categories')
    .select('*');

  if (catError) {
    console.error("Error fetching categories:", catError);
    return;
  }

  if (!catData || catData.length === 0) {
    console.error("No categories found. Please create categories in the dashboard first or via SQL.");
    return;
  }

  console.log(`Found ${catData.length} categories.`);

  // Clear existing products to avoid duplicates during this overhaul
  console.log("Deleting existing products for overhaul...");
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 

  const products = [];
  const categoryMap = catData.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.id }), {});

  for (let i = 1; i <= 200; i++) {
    const categoryName = Object.keys(productData)[Math.floor(Math.random() * Object.keys(productData).length)];
    const categoryId = categoryMap[categoryName];
    const itemData = productData[categoryName];
    const baseTitle = itemData.titles[Math.floor(Math.random() * itemData.titles.length)];
    const title = `${baseTitle} Series ${Math.floor(Math.random() * 999) + 100}`;
    
    // Generate 4 image urls per product using curated pool
    const pool = unsplashIds[categoryName];
    const image_urls = [];
    for (let j = 0; j < 4; j++) {
      const photoId = pool[Math.floor(Math.random() * pool.length)];
      image_urls.push(`https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=80`);
    }

    products.push({
      title,
      description: `Experience the pinnacle of design with our ${title}. This premium product from the ${categoryName} category is engineered for both style and performance. ${itemData.tags.join(', ')}. Perfect for gifts or personal collection.`,
      price: Math.floor(Math.random() * 500) + 19.99,
      compare_at_price: Math.random() > 0.4 ? Math.floor(Math.random() * 700) + 600.99 : null,
      category_id: categoryId,
      stock_quantity: Math.floor(Math.random() * 50) + 5,
      is_featured: Math.random() > 0.9,
      image_urls,
      specifications: itemData.specs()
    });
  }

  console.log(`Seeding 200 premium products...`);
  // Chunking insert to avoid payloads being too large
  const chunkSize = 50;
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    const { error: prodError } = await supabase
      .from('products')
      .insert(chunk);

    if (prodError) {
      console.error(`Error seeding chunk ${i / chunkSize + 1}:`, prodError);
      break;
    }
    console.log(`Seeded chunk ${i / chunkSize + 1}/4`);
  }

  console.log("Successfully seeded 200 high-quality products!");
}

seed();
