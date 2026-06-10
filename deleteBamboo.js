require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Review = require('./models/Review');

async function deleteAccessory() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in env variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the product
    const product = await Product.findOne({ sku: "HERBSERA-AC-001" });
    if (product) {
      console.log(`🌱 Found product: ${product.name} (${product._id})`);
      
      // Delete reviews
      const reviewDeleteResult = await Review.deleteMany({ product: product._id });
      console.log(`🗑️ Deleted ${reviewDeleteResult.deletedCount} reviews associated with this product`);
      
      // Delete product
      const productDeleteResult = await Product.deleteOne({ _id: product._id });
      console.log(`🗑️ Deleted product: ${product.name}`);
    } else {
      console.log('❌ Product not found in database.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting accessory:', error);
    process.exit(1);
  }
}

deleteAccessory();
