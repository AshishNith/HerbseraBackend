require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: 'Neem & Tulsi Soap',
    description: 'A powerful blend of neem and tulsi that fights acne and purifies your skin. Neem is known for its antibacterial properties while tulsi helps in reducing inflammation and promoting clear, healthy skin.',
    benefit: 'Acne Care & Clarifying',
    price: 249,
    comparePrice: 299,
    images: [{
      url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
      alt: 'Neem & Tulsi Soap',
    }],
    category: 'soap',
    ingredients: [
      { name: 'Neem Extract', percentage: 15 },
      { name: 'Tulsi Oil', percentage: 10 },
      { name: 'Coconut Oil', percentage: 25 },
      { name: 'Olive Oil', percentage: 20 },
    ],
    weight: { value: 100, unit: 'g' },
    stock: 50,
    sku: 'SOAP-NEEM-001',
    featured: true,
    tags: ['acne', 'antibacterial', 'natural', 'herbal'],
    seoTitle: 'Neem & Tulsi Soap - Natural Acne Care',
    seoDescription: 'Fight acne naturally with our handcrafted Neem & Tulsi soap',
  },
  {
    name: 'Lavender Bliss Soap',
    description: 'Indulge in the calming aroma of lavender. This gentle soap soothes your senses while moisturizing and nourishing your skin. Perfect for relaxation and stress relief.',
    benefit: 'Calming & Relaxing',
    price: 279,
    comparePrice: 329,
    images: [{
      url: 'https://images.unsplash.com/photo-1600857544200-b636c3664fb2?w=500',
      alt: 'Lavender Bliss Soap',
    }],
    category: 'soap',
    ingredients: [
      { name: 'Lavender Essential Oil', percentage: 12 },
      { name: 'Shea Butter', percentage: 18 },
      { name: 'Coconut Oil', percentage: 25 },
    ],
    weight: { value: 100, unit: 'g' },
    stock: 45,
    sku: 'SOAP-LAV-002',
    featured: true,
    tags: ['lavender', 'relaxing', 'aromatherapy', 'natural'],
    seoTitle: 'Lavender Bliss Soap - Calming & Moisturizing',
    seoDescription: 'Relax with our handcrafted lavender soap',
  },
  {
    name: 'Turmeric Glow Soap',
    description: 'Harness the power of turmeric for radiant, glowing skin. This brightening soap reduces dark spots, evens skin tone, and gives you a natural luminous glow.',
    benefit: 'Brightening & Radiance',
    price: 269,
    comparePrice: 319,
    images: [{
      url: 'https://images.unsplash.com/photo-1600857544200-b636c3664fb2?w=500',
      alt: 'Turmeric Glow Soap',
    }],
    category: 'soap',
    ingredients: [
      { name: 'Turmeric Powder', percentage: 10 },
      { name: 'Honey', percentage: 8 },
      { name: 'Sandalwood Oil', percentage: 5 },
    ],
    weight: { value: 100, unit: 'g' },
    stock: 40,
    sku: 'SOAP-TUR-003',
    featured: true,
    tags: ['turmeric', 'brightening', 'glowing skin', 'natural'],
    seoTitle: 'Turmeric Glow Soap - Natural Skin Brightening',
    seoDescription: 'Achieve radiant skin with our turmeric soap',
  },
  {
    name: 'Charcoal Detox Soap',
    description: 'Deep cleanse and purify with activated charcoal. This detoxifying soap draws out impurities, unclogs pores, and leaves your skin feeling fresh and rejuvenated.',
    benefit: 'Deep Cleansing & Purifying',
    price: 289,
    comparePrice: 339,
    images: [{
      url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
      alt: 'Charcoal Detox Soap',
    }],
    category: 'soap',
    ingredients: [
      { name: 'Activated Charcoal', percentage: 8 },
      { name: 'Tea Tree Oil', percentage: 6 },
      { name: 'Peppermint Oil', percentage: 4 },
    ],
    weight: { value: 100, unit: 'g' },
    stock: 35,
    sku: 'SOAP-CHAR-004',
    featured: true,
    tags: ['charcoal', 'detox', 'deep cleanse', 'purifying'],
    seoTitle: 'Charcoal Detox Soap - Deep Cleansing',
    seoDescription: 'Purify your skin with activated charcoal soap',
  },
  {
    name: 'Aloe Vera Fresh Soap',
    description: 'Experience the cooling and hydrating benefits of aloe vera. This gentle soap soothes irritated skin, provides deep hydration, and maintains your skin\'s natural moisture balance.',
    benefit: 'Hydrating & Soothing',
    price: 259,
    comparePrice: 309,
    images: [{
      url: 'https://images.unsplash.com/photo-1600857544200-b636c3664fb2?w=500',
      alt: 'Aloe Vera Fresh Soap',
    }],
    category: 'soap',
    ingredients: [
      { name: 'Aloe Vera Gel', percentage: 20 },
      { name: 'Cucumber Extract', percentage: 10 },
      { name: 'Glycerin', percentage: 15 },
    ],
    weight: { value: 100, unit: 'g' },
    stock: 50,
    sku: 'SOAP-ALOE-005',
    featured: false,
    tags: ['aloe vera', 'hydrating', 'soothing', 'natural'],
    seoTitle: 'Aloe Vera Fresh Soap - Hydrating & Soothing',
    seoDescription: 'Hydrate and soothe your skin with aloe vera',
  },
  {
    name: 'Rose Petal Glow Soap',
    description: 'Luxurious rose petals combined with moisturizing oils for youthful, radiant skin. This anti-aging soap reduces fine lines and leaves your skin soft and supple.',
    benefit: 'Moisturizing & Anti-aging',
    price: 299,
    comparePrice: 349,
    images: [{
      url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
      alt: 'Rose Petal Glow Soap',
    }],
    category: 'soap',
    ingredients: [
      { name: 'Rose Petals', percentage: 12 },
      { name: 'Rose Hip Oil', percentage: 10 },
      { name: 'Argan Oil', percentage: 8 },
    ],
    weight: { value: 100, unit: 'g' },
    stock: 30,
    sku: 'SOAP-ROSE-006',
    featured: false,
    tags: ['rose', 'anti-aging', 'moisturizing', 'luxury'],
    seoTitle: 'Rose Petal Glow Soap - Anti-aging & Moisturizing',
    seoDescription: 'Luxurious rose petal soap for youthful skin',
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Drop the slug index to avoid conflicts
    try {
      await Product.collection.dropIndex('slug_1');
      console.log('Dropped slug index');
    } catch (err) {
      // Index might not exist, that's okay
    }

    // Insert products one by one to ensure slug generation
    const insertedProducts = [];
    for (const productData of products) {
      const product = await Product.create(productData);
      insertedProducts.push(product);
    }

    console.log(`✅ Successfully inserted ${insertedProducts.length} products`);

    // Display inserted products
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.sku}) - Slug: ${product.slug}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
