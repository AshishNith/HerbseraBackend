require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: "Neem Tulsi Detox Soap",
    description: "Herbsera Neem Tulsi Detox Soap is crafted with powerful neem and tulsi extracts that deeply cleanse, remove excess oil, and protect skin from bacteria. Ideal for acne-prone and oily skin.",
    benefit: "Detoxifies skin, controls acne, antibacterial protection",
    price: 149,
    comparePrice: 199,
    images: [{
      url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1771272860/e8cb1e54-7d9a-48d2-96f4-524bed4b966f.png",
      alt: "Neem Tulsi Detox Soap"
    }],
    category: "soap",
    ingredients: [
      { name: "Neem Extract", percentage: 40 },
      { name: "Tulsi Extract", percentage: 30 },
      { name: "Coconut Oil Base", percentage: 30 }
    ],
    weight: { value: 100, unit: "g" },
    stock: 120,
    sku: "HERBSERA-NT-001",
    featured: true,
    isActive: true,
    ratings: { average: 4.6, count: 32 },
    tags: ["neem", "tulsi", "detox", "acne care", "herbal soap"],
    seoTitle: "Neem Tulsi Detox Soap | Ayurvedic Acne Control – Herbsera",
    seoDescription: "Buy Herbsera Neem Tulsi Detox Soap for deep cleansing and acne control. Ayurvedic formula with neem and tulsi extracts."
  },
  {
    name: "Haldi Chandan Glow Soap",
    description: "Infused with turmeric and sandalwood, this ayurvedic bar helps brighten dull skin, reduce tan, and enhance natural glow using time-tested Indian skincare ingredients.",
    benefit: "Brightens skin, reduces tan, enhances glow",
    price: 169,
    comparePrice: 219,
    images: [{
      url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1771272893/8db98534-f152-4bab-ae00-aa884a4695ca.png",
      alt: "Haldi Chandan Glow Soap"
    }],
    category: "soap",
    ingredients: [
      { name: "Turmeric Extract", percentage: 45 },
      { name: "Sandalwood Extract", percentage: 30 },
      { name: "Natural Oil Base", percentage: 25 }
    ],
    weight: { value: 100, unit: "g" },
    stock: 100,
    sku: "HERBSERA-HC-002",
    featured: true,
    isActive: true,
    ratings: { average: 4.7, count: 28 },
    tags: ["haldi", "chandan", "glow", "brightening", "ayurvedic"],
    seoTitle: "Haldi Chandan Glow Soap | Skin Brightening – Herbsera",
    seoDescription: "Herbsera Haldi Chandan Soap with turmeric and sandalwood for radiant glowing skin. Ayurvedic skincare made natural."
  },
  {
    name: "Activated Charcoal Detox Soap",
    description: "A deep-cleansing charcoal soap that removes toxins, pollution residue, and excess oil while maintaining the skin's natural moisture barrier.",
    benefit: "Deep pore cleansing, removes toxins, oil control",
    price: 179,
    comparePrice: 229,
    images: [{
      url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1771272939/cec3dcc3-f063-4505-b24a-4f99b6f5f282.png",
      alt: "Activated Charcoal Detox Soap"
    }],
    category: "soap",
    ingredients: [
      { name: "Activated Charcoal", percentage: 50 },
      { name: "Tea Tree Oil", percentage: 20 },
      { name: "Natural Oil Base", percentage: 30 }
    ],
    weight: { value: 100, unit: "g" },
    stock: 90,
    sku: "HERBSERA-CH-003",
    featured: true,
    isActive: true,
    ratings: { average: 4.5, count: 21 },
    tags: ["charcoal", "detox", "deep clean", "oil control"],
    seoTitle: "Activated Charcoal Detox Soap | Deep Clean – Herbsera",
    seoDescription: "Deep cleansing charcoal soap by Herbsera to remove toxins and excess oil. Perfect for oily and polluted skin."
  },
  {
    name: "Rose Milk Moisturizing Soap",
    description: "A gentle moisturizing soap enriched with rose extracts and milk proteins to hydrate, soften, and nourish dry and sensitive skin.",
    benefit: "Deep moisturization, softens skin, improves texture",
    price: 159,
    comparePrice: 199,
    images: [{
      url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1771272979/8ff40e88-cd14-458b-a362-5ab15883dc47.png",
      alt: "Rose Milk Moisturizing Soap"
    }],
    category: "soap",
    ingredients: [
      { name: "Rose Extract", percentage: 35 },
      { name: "Milk Protein", percentage: 30 },
      { name: "Natural Oil Base", percentage: 35 }
    ],
    weight: { value: 100, unit: "g" },
    stock: 110,
    sku: "HERBSERA-RM-004",
    featured: true,
    isActive: true,
    ratings: { average: 4.8, count: 40 },
    tags: ["rose", "milk", "moisturizing", "soft skin"],
    seoTitle: "Rose Milk Moisturizing Soap | Soft & Hydrated Skin – Herbsera",
    seoDescription: "Hydrating rose milk soap by Herbsera that nourishes and softens skin naturally."
  },
  {
    name: "Coffee Exfoliating Soap",
    description: "A natural exfoliating soap infused with coffee granules to remove dead skin cells, improve circulation, and leave skin refreshed and smooth.",
    benefit: "Exfoliates dead skin, smooth texture, energizes skin",
    price: 169,
    comparePrice: 219,
    images: [{
      url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1771273046/2963d9e8-75d8-471d-88bd-067664cfbbd5.png",
      alt: "Coffee Exfoliating Soap"
    }],
    category: "soap",
    ingredients: [
      { name: "Coffee Granules", percentage: 40 },
      { name: "Cocoa Extract", percentage: 20 },
      { name: "Natural Oil Base", percentage: 40 }
    ],
    weight: { value: 100, unit: "g" },
    stock: 85,
    sku: "HERBSERA-CF-005",
    featured: true,
    isActive: true,
    ratings: { average: 4.6, count: 26 },
    tags: ["coffee", "exfoliating", "scrub", "smooth skin"],
    seoTitle: "Coffee Exfoliating Soap | Natural Skin Scrub – Herbsera",
    seoDescription: "Coffee scrub soap by Herbsera removes dead skin and improves texture naturally."
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Drop the slug index if it exists to avoid conflicts
    try {
      await Product.collection.dropIndex('slug_1');
      console.log('🔧 Dropped slug index');
    } catch (err) {
      // Index might not exist, that's okay
    }

    // Insert products one by one to ensure slug generation
    const createdProducts = [];
    for (const productData of products) {
      const product = await Product.create(productData);
      createdProducts.push(product);
    }

    console.log(`✅ Successfully seeded ${createdProducts.length} products`);

    // Display created products
    createdProducts.forEach(product => {
      console.log(`   - ${product.name} (SKU: ${product.sku}) - Slug: ${product.slug}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
