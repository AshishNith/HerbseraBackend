require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const accessory = {
  name: "Handcrafted Bamboo Soap Tray",
  description: "Keep your handcrafted gemstone soaps dry and lasting longer with this sustainable, self-draining organic bamboo tray.",
  benefit: "Extends soap life, natural self-draining design",
  price: 99,
  comparePrice: 199,
  images: [{
    url: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=400&q=80",
    alt: "Handcrafted Bamboo Soap Tray"
  }],
  category: "other", // must match allowed categories enum: ['soap', 'oil', 'cream', 'powder', 'other']
  ingredients: [],
  weight: { value: 50, unit: "g" },
  stock: 200,
  sku: "HERBSERA-AC-001",
  featured: false,
  isActive: true,
  ratings: { average: 5.0, count: 5 },
  tags: ["accessory", "bamboo", "tray", "sustainable"],
  seoTitle: "Handcrafted Bamboo Soap Tray | Eco-Friendly – Herbsera",
  seoDescription: "Extend the life of your natural gemstone soaps with this self-draining organic bamboo soap tray."
};

async function seedAccessory() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in env variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingProduct = await Product.findOne({ sku: accessory.sku });
    if (existingProduct) {
      console.log('🔄 Product already exists, updating it...');
      Object.assign(existingProduct, accessory);
      await existingProduct.save();
      console.log(`✅ Successfully updated product: ${existingProduct.name} (${existingProduct._id})`);
    } else {
      console.log('🌱 Product not found, creating new...');
      const createdProduct = await Product.create(accessory);
      console.log(`✅ Successfully created product: ${createdProduct.name} (${createdProduct._id})`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding accessory:', error);
    process.exit(1);
  }
}

seedAccessory();
