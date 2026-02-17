require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysAgo) {
  const now = new Date();
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentMethods = ['cod', 'razorpay', 'stripe'];

const addresses = [
  {
    name: 'Ranjan Ashish',
    phone: '+91 9876543210',
    addressLine1: '123 MG Road',
    addressLine2: 'Near City Mall',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    country: 'India',
  },
  {
    name: 'Priya Sharma',
    phone: '+91 9876543211',
    addressLine1: '456 Park Street',
    addressLine2: 'Apartment 5B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India',
  },
  {
    name: 'Amit Kumar',
    phone: '+91 9876543212',
    addressLine1: '789 Connaught Place',
    addressLine2: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    country: 'India',
  },
];

async function seedOrders() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing orders
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing orders');

    // Get all products and users
    const products = await Product.find({});
    const users = await User.find({});

    if (products.length === 0 || users.length === 0) {
      console.log('❌ No products or users found. Please seed products and users first.');
      process.exit(1);
    }

    console.log(`📦 Found ${products.length} products and ${users.length} users`);

    const orders = [];
    const numOrders = 50; // Create 50 sample orders

    for (let i = 0; i < numOrders; i++) {
      const user = getRandomElement(users);
      const numItems = getRandomInt(1, 3); // 1-3 items per order
      const items = [];

      // Select random products for this order
      const selectedProducts = [];
      for (let j = 0; j < numItems; j++) {
        let product;
        do {
          product = getRandomElement(products);
        } while (selectedProducts.includes(product._id));
        selectedProducts.push(product._id);

        const quantity = getRandomInt(1, 3);
        items.push({
          product: product._id,
          quantity,
          price: product.price,
          name: product.name,
          image: typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url,
        });
      }

      // Calculate pricing
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = Math.round(subtotal * 0.18); // 18% GST
      const shippingCost = subtotal > 500 ? 0 : 50;
      const discount = 0;
      const total = subtotal + tax + shippingCost - discount;

      // Random status based on order age
      const daysAgo = getRandomInt(1, 90);
      let status;
      if (daysAgo < 7) {
        status = getRandomElement(['pending', 'processing', 'shipped']);
      } else if (daysAgo < 30) {
        status = getRandomElement(['shipped', 'delivered']);
      } else {
        status = 'delivered';
      }

      const order = {
        orderNumber: `ORD-${Date.now()}-${i}`,
        user: user._id,
        items,
        pricing: {
          subtotal,
          tax,
          shippingCost,
          discount,
          total,
        },
        shippingAddress: getRandomElement(addresses),
        paymentMethod: getRandomElement(paymentMethods),
        status,
        trackingNumber: status === 'shipped' || status === 'delivered' ? `TRK${getRandomInt(100000, 999999)}` : undefined,
        createdAt: getRandomDate(daysAgo),
        updatedAt: getRandomDate(daysAgo - 1),
      };

      orders.push(order);
    }

    // Insert orders
    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ Successfully seeded ${createdOrders.length} orders`);

    // Show status distribution
    const statusCounts = {};
    createdOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    console.log('\n📊 Order Status Distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

    const totalRevenue = createdOrders.reduce((sum, order) => sum + order.pricing.total, 0);
    console.log(`\n💰 Total Revenue: ₹${totalRevenue.toFixed(2)}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    process.exit(1);
  }
}

seedOrders();
