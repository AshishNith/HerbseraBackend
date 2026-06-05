require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function fixSlugs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({});
    console.log(`🔍 Checking ${products.length} products for slugs...`);

    for (const product of products) {
      if (!product.slug || product.slug === 'undefined') {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        await product.save();
        console.log(`🔧 Fixed slug for: ${product.name} -> ${product.slug}`);
      } else {
        console.log(`✅ Slug verified for: ${product.name} (${product.slug})`);
      }
    }

    console.log('🎉 All slugs are now correct!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing slugs:', error);
    process.exit(1);
  }
}

fixSlugs();
