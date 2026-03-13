import fs from 'fs';

const categories = [
  { name: 'Smartphones', slug: 'smartphones' },
  { name: 'Laptops & Computing', slug: 'laptops' },
  { name: 'Audio & Speakers', slug: 'audio' },
  { name: 'Gaming', slug: 'gaming' },
  { name: 'Smartwatches', slug: 'smartwatches' },
  { name: 'Cameras & Photography', slug: 'cameras' },
  { name: 'Tablets', slug: 'tablets' },
  { name: 'Computer Accessories', slug: 'accessories' },
  { name: 'Home Automation', slug: 'home-auto' },
  { name: 'Monitors & Displays', slug: 'monitors' }
];

const brands = {
  Smartphones: ['Apple', 'Samsung', 'Google', 'Xiaomi', 'OnePlus', 'Motorola'],
  'Laptops & Computing': ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Razer'],
  'Audio & Speakers': ['Sony', 'Bose', 'Sennheiser', 'JBL', 'Sonos', 'Marshall'],
  Gaming: ['Sony', 'Microsoft', 'Nintendo', 'Logitech', 'Razer', 'SteelSeries'],
  Smartwatches: ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Amazfit', 'Google'],
  'Cameras & Photography': ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'GoPro', 'Panasonic'],
  Tablets: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Amazon', 'Huawei'],
  'Computer Accessories': ['Logitech', 'Razer', 'Keychron', 'SteelSeries', 'Apple', 'Microsoft'],
  'Home Automation': ['Philips', 'Google Nest', 'Amazon Ring', 'Ecobee', 'Arlo', 'Xiaomi'],
  'Monitors & Displays': ['Samsung', 'LG', 'Dell', 'ASUS', 'BenQ', 'AOC']
};

const imagePool = {
  Smartphones: ['1610945265417-af9efec36300', '1511707171634-5f897ff02aa9', '1523206489230-c012c64f2b48', '1567581935884-3349723552ca'],
  'Laptops & Computing': ['1496181133206-80ce9b88a853', '1588872626084-38a0bbe35d5a', '1499951360447-b19be8fe80f5', '1603302523004-aeb3e2803830'],
  'Audio & Speakers': ['1505740420928-5e560c06d30e', '1546435770-a3e426bf472b', '1524678606332-28c11e7216a9', '1583394838318-5cc665807953'],
  Gaming: ['1585624484053-9115fa032df6', '1612287230596-3732049e67d2', '1605898393910-441ae755e396', '1592155930335-ec22c4795b2b'],
  Smartwatches: ['1523275335684-37898b6baf30', '1508685096486-1d1024f1242e', '1434493149934-2ad5a7a57eb8', '1579586120202-cbc35339626a'],
  'Cameras & Photography': ['1516035069174-06c39e0eb6a0', '1502920917128-1aa500764cbd', '1452781831024-cb1aea458c5e', '1564466809618-a594243637db'],
  Tablets: ['1544244015-c4fc5ffad8d3', '1512941937669-90a167117ca7', '1542751371-adcdd84ad9e9', '1611186873850-d57c2f3a6a1c'],
  'Computer Accessories': ['1527866959252-aa47a053f5d5', '1541140552-0fb309f48731', '1615663248861-4fa9c2106708', '1587302485208-590d240d16be'],
  'Home Automation': ['1558002038-d621fe23cf36', '1585338927003-1d9c193edff0', '1581412344211-0f43b5f00bce', '1591963903176-a006c9850654'],
  'Monitors & Displays': ['1527443224403-f71ee0f6c204', '1540982893-bc45e2d973ff', '1498228415842-d368ce7a24b7', '1551645101-8538e9daaf21']
};

const commonSpecs = {
  Smartphones: () => ({ Screen: '6.7" OLED', Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Storage: '256GB', Battery: '5000mAh' }),
  'Laptops & Computing': () => ({ CPU: 'Intel Core i7 / M3 Pro', RAM: '16GB DDR5', Storage: '512GB NVMe SSD', Display: '15.6" 4K', Battery: 'Up to 12 hours' }),
  'Audio & Speakers': () => ({ Type: 'Wireless / Bluetooth 5.3', Drivers: '40mm Neodymium', NoiseCanceling: 'Active (ANC)', Battery: '40 Hours', Range: '30ft' }),
  Gaming: () => ({ Connection: 'Low-latency Wireless', Buttons: 'Programmable', DPI: 'Up to 25600', Compatibility: 'PS5 / Windows / Xbox', RGB: 'Customizable Chroma' }),
  Smartwatches: () => ({ Tracking: 'Heart Rate, SpO2, Sleep', Waterproof: '5ATM', GPS: 'Dual-band', Battery: '7 Days', Display: 'Always-on AMOLED' }),
  'Cameras & Photography': () => ({ Sensor: '24.2MP Full-frame', ISO: '100-51200', Autofocus: '759 points', Video: '4K 60fps', Card: 'Dual SD slots' }),
  Tablets: () => ({ Screen: '12.9" ProMotion', Chip: 'M2 / SD 8+ Gen 2', Storage: '128GB - 1TB', Accessories: 'Stylus Support', Weight: '466g' }),
  'Computer Accessories': () => ({ Switch: 'Mechanical / Optical', Layout: '65% / Full', Connection: 'USB-C / 2.4GHz', Material: 'PBT Keycaps', Backlight: 'RGB' }),
  'Home Automation': () => ({ Connectivity: 'WiFi / Zigbee', Control: 'App / Voice', Security: 'AES Encryption', Compatibility: 'Alexa / HomeKit', Energy: 'Energy Star Rated' }),
  'Monitors & Displays': () => ({ Resolution: '3840 x 2160', Refresh: '144Hz / 240Hz', Panel: 'IPS / OLED', Response: '1ms GTG', Ports: 'HDMI 2.1, DP 1.4' })
};

let sql = `
-- Purge existing data
DELETE FROM public.wishlists;
DELETE FROM public.products;
DELETE FROM public.categories;

-- Insert categories and get IDs
`;

categories.forEach(cat => {
  sql += `INSERT INTO public.categories (name, slug) VALUES ('${cat.name}', '${cat.slug}');\n`;
});

sql += `
-- Insert products
DO $$
DECLARE
  cat_id uuid;
BEGIN
`;

categories.forEach(cat => {
    sql += `  SELECT id INTO cat_id FROM public.categories WHERE name = '${cat.name}';\n`;
    const brandList = brands[cat.name];
    const imgList = imagePool[cat.name];
    const specsTemplate = commonSpecs[cat.name]();

    for (let i = 1; i <= 30; i++) {
        const brand = brandList[Math.floor(Math.random() * brandList.length)];
        const title = `${brand} ${cat.name.slice(0, -1)} Pro X${i + 100}`;
        const price = (Math.floor(Math.random() * 2000) + 99.99).toFixed(2);
        const desc = `The all-new ${title} defines the future of ${cat.name.toLowerCase()}. Engineered with cutting-edge technology and premium materials, it offers unmatched performance for professionals and enthusiasts alike.`;
        
        const specString = Object.entries(specsTemplate).map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').trim()}: ${v}`).join('\\n');
        const fullDesc = `${desc}\\n\\nTECHNICAL SPECIFICATIONS:\\n${specString}`;

        const images = [];
        for (let j = 0; j < 3; j++) {
            images.push(`https://images.unsplash.com/photo-${imgList[Math.floor(Math.random() * imgList.length)]}?auto=format&fit=crop&w=800&q=80`);
        }
        const imgArray = `ARRAY['${images.join("','")}']`;

        sql += `  INSERT INTO public.products (title, description, price, category_id, stock_quantity, is_featured, image_urls) 
  VALUES ('${title}', '${fullDesc}', ${price}, cat_id, ${Math.floor(Math.random() * 100) + 10}, ${Math.random() > 0.85}, ${imgArray});\n`;
    }
});

sql += `END $$;`;

fs.writeFileSync('scripts/seed_gadgets.sql', sql);
console.log("SQL seed file generated: scripts/seed_gadgets.sql");
