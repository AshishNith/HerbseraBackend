require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Review = require('./models/Review');
const User = require('./models/User');

const emails = [
  'ranjan.ashish9992@gmail.com',
  '23bme025@nith.ac.in',
  '23bme026@nith.ac.in',
  '23bme061@nith.ac.in',
  '23bme060@nith.ac.in',
  '23bme033@nith.ac.in',
  'atharv.golait@gmail.com',
  // Additional generated emails for variety
  'priya.sharma2024@gmail.com',
  'amit.kumar.dev@gmail.com',
  'sneha.verma89@gmail.com',
  'rahul.singh.tech@gmail.com',
  'anjali.patel456@gmail.com',
  'vikram.malhotra@gmail.com',
  'neha.gupta.official@gmail.com',
  'karan.mehta.2k24@gmail.com',
  'divya.reddy.cosm@gmail.com',
  'rohan.joshi777@gmail.com',
  'pooja.agarwal92@gmail.com',
  'arjun.nair.tech@gmail.com',
  'kavya.krishnan@gmail.com',
  'siddharth.rao45@gmail.com',
  'meera.iyer123@gmail.com',
  'aditya.saxena@gmail.com',
  'ritu.bansal.beauty@gmail.com',
  'varun.kapoor88@gmail.com',
  'ishita.desai.skin@gmail.com',
  'manish.tiwari99@gmail.com',
  'simran.kaur.organic@gmail.com'
];

const reviewTemplates = {
  5: {
    titles: [
      'Absolutely love it!',
      'Best product ever!',
      'Exceeded my expectations',
      'Highly recommended!',
      'Amazing quality',
      'Perfect for my skin',
      'Will buy again!',
      'Outstanding product',
      'Love the results!',
      'Fantastic!'
    ],
    comments: [
      'This is hands down the best herbal soap I have ever used. My skin feels so smooth and clean!',
      'I am completely satisfied with this product. It has exceeded all my expectations and my skin looks amazing.',
      'The quality is outstanding! I can see visible results within just a few days of using it.',
      'Absolutely love this product! It has become an essential part of my daily skincare routine.',
      'This soap is incredible! My skin has never felt better. Highly recommend to everyone.',
      'Amazing product with natural ingredients. My skin feels refreshed and healthy.',
      'I\'ve tried many herbal soaps but this one is by far the best. Will definitely repurchase!',
      'The fragrance is divine and it works wonders on my skin. Worth every penny!',
      'This product has transformed my skin completely. I can\'t recommend it enough!',
      'Best purchase I\'ve made in a long time. My skin feels so soft and nourished.',
      'Excellent quality and very effective. Noticed visible improvements in my skin texture.',
      'Love everything about this soap - the smell, the texture, and most importantly the results!',
      'This is now my go-to soap. Natural ingredients and wonderful results.',
      'My skin has never looked this good! Thank you for such an amazing product.',
      'Perfect for sensitive skin. No irritation at all and leaves skin feeling great.'
    ]
  },
  4: {
    titles: [
      'Great product!',
      'Very satisfied',
      'Good quality',
      'Works well',
      'Nice soap',
      'Happy with purchase',
      'Effective product',
      'Worth buying',
      'Quite good',
      'Pleased with results'
    ],
    comments: [
      'Really good soap with natural ingredients. Works well on my skin type.',
      'Very pleased with this purchase. The quality is good and it does what it claims.',
      'Good product overall. My skin feels cleaner and softer after using it.',
      'Nice herbal soap that works effectively. Would recommend to others.',
      'The soap is gentle on skin and has a pleasant fragrance. Good value for money.',
      'Effective and made with natural ingredients. Happy with the results so far.',
      'Works well for daily use. Skin feels fresh and clean after every wash.',
      'Good quality soap that delivers on its promises. Satisfied with my purchase.',
      'Pleasant to use and shows good results. Will consider buying again.',
      'Decent product with natural ingredients. Does the job well.',
      'My skin feels better after using this. Good herbal formulation.',
      'Quality is good and it works as described. Happy with the product.',
      'Nice addition to my skincare routine. Skin feels healthier.',
      'Good soap for regular use. Natural ingredients are a plus.',
      'Works effectively and gentle on skin. Quite satisfied overall.'
    ]
  },
  3: {
    titles: [
      'It\'s okay',
      'Average product',
      'Does the job',
      'Decent soap',
      'Not bad',
      'Acceptable',
      'Moderate results',
      'Fair quality',
      'Average experience',
      'Okay for the price'
    ],
    comments: [
      'The soap is okay. Nothing extraordinary but does its job.',
      'Average product. It works but I expected slightly better results.',
      'Decent soap but not exceptional. Does basic cleansing well.',
      'It\'s an okay product. Works for daily use but nothing special.',
      'Fair quality for the price. Gets the job done but could be better.',
      'The soap is alright. Cleans well but I didn\'t notice dramatic changes.',
      'Moderate results so far. It\'s a decent product for regular use.',
      'Not bad but not great either. Average herbal soap.',
      'Does what it claims but results are moderate. Acceptable product.',
      'It\'s okay for the price point. Works as a basic cleansing soap.',
      'Decent formulation but I was expecting more noticeable results.',
      'Average experience overall. The soap works but nothing stands out.',
      'Fair product. Cleans skin well but benefits are moderate.',
      'It does the job but there are better options available.',
      'Okay soap for daily use. Results are average but acceptable.'
    ]
  },
  2: {
    titles: [
      'Not impressed',
      'Below expectations',
      'Could be better',
      'Disappointing',
      'Not for me',
      'Underwhelming',
      'Limited results',
      'Expected more',
      'Not satisfied',
      'Needs improvement'
    ],
    comments: [
      'Unfortunately, this didn\'t work well for my skin type. Expected better results.',
      'Below my expectations. The product doesn\'t deliver what it promises.',
      'Not very impressed. Didn\'t see much improvement in my skin.',
      'The soap is okay but I didn\'t notice the benefits mentioned.',
      'Disappointing product. My skin didn\'t respond well to it.',
      'Expected much better results. This didn\'t work for me.',
      'Not suitable for my skin. Didn\'t see the promised benefits.',
      'The product is underwhelming. Results are minimal.',
      'Could be much better. Didn\'t meet my expectations.',
      'Not satisfied with the purchase. Limited improvements noticed.',
      'The soap didn\'t work as expected. Below average experience.',
      'I was hoping for better results. Quite disappointing.',
      'Not recommended based on my experience. Didn\'t work well.',
      'The product needs improvement. Results were not satisfactory.',
      'Unfortunately not for me. Didn\'t see the advertised benefits.'
    ]
  },
  1: {
    titles: [
      'Very disappointed',
      'Did not work',
      'Waste of money',
      'Poor quality',
      'Not recommended',
      'Terrible experience',
      'Completely dissatisfied',
      'Failed expectations',
      'Very poor',
      'Don\'t buy'
    ],
    comments: [
      'Very disappointed with this product. It caused irritation to my skin.',
      'Did not work at all. Complete waste of money in my opinion.',
      'Poor quality product. Made my skin worse instead of better.',
      'Terrible experience. The soap caused breakouts on my skin.',
      'Would not recommend this to anyone. Completely dissatisfied.',
      'This product failed to deliver any results. Very disappointing.',
      'My skin reacted badly to this soap. Not suitable at all.',
      'Extremely disappointed. The product did not work as advertised.',
      'Poor formulation. Caused more harm than good to my skin.',
      'Don\'t waste your money on this. It didn\'t work for me at all.',
      'Very poor quality. I regret purchasing this product.',
      'The soap made my skin condition worse. Highly disappointed.',
      'Not worth the price. Completely failed my expectations.',
      'Had a terrible reaction to this product. Would not buy again.',
      'Disappointing product that didn\'t deliver any of the promised benefits.'
    ]
  }
};

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomRating() {
  // Weighted distribution: more 4s and 5s, fewer 1s and 2s
  const weights = [2, 5, 15, 35, 43]; // 2% for 1-star, 5% for 2-star, etc.
  const random = Math.random() * 100;
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random <= sum) {
      return i + 1;
    }
  }
  return 5;
}

function getRandomDate(startDays, endDays) {
  const now = new Date();
  const start = new Date(now.getTime() - startDays * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() - endDays * 24 * 60 * 60 * 1000);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing reviews');

    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);

    // Get or create users for each email
    const users = [];
    for (const email of emails) {
      let user = await User.findOne({ email });
      if (!user) {
        // Create a simple user entry
        const displayName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\d+/g, '').trim() || 'User';
        user = await User.create({
          email,
          displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          firebaseUid: `seed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'user',
          isActive: true
        });
        console.log(`   Created user: ${user.displayName} (${email})`);
      }
      users.push(user);
    }

    let totalReviews = 0;

    // Create reviews for each product
    for (const product of products) {
      const numReviews = Math.floor(Math.random() * 6) + 15; // 15-20 reviews
      console.log(`\n📝 Creating ${numReviews} reviews for: ${product.name}`);

      const productReviews = [];

      for (let i = 0; i < numReviews; i++) {
        const user = getRandomElement(users);
        const rating = getRandomRating();
        const template = reviewTemplates[rating];
        const title = getRandomElement(template.titles);
        const comment = getRandomElement(template.comments);
        const createdAt = getRandomDate(60, 1); // Reviews from last 60 days to 1 day ago

        // Check if this user already reviewed this product
        const existingReview = productReviews.find(r => r.user.toString() === user._id.toString());
        if (existingReview) {
          // Skip if user already reviewed this product
          continue;
        }

        const review = {
          product: product._id,
          user: user._id,
          rating,
          title,
          comment,
          isVerifiedPurchase: Math.random() > 0.3, // 70% verified purchases
          isApproved: true,
          createdAt,
          updatedAt: createdAt
        };

        productReviews.push(review);
      }

      // Insert reviews for this product
      if (productReviews.length > 0) {
        await Review.insertMany(productReviews);
        totalReviews += productReviews.length;
        console.log(`   ✅ Added ${productReviews.length} reviews`);
      }
    }

    console.log(`\n🎉 Successfully seeded ${totalReviews} reviews across ${products.length} products`);

    // Update product ratings
    console.log('\n📊 Updating product ratings...');
    for (const product of products) {
      const stats = await Review.aggregate([
        { $match: { product: product._id } },
        {
          $group: {
            _id: '$product',
            averageRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 }
          }
        }
      ]);

      if (stats.length > 0) {
        await Product.findByIdAndUpdate(product._id, {
          'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
          'ratings.count': stats[0].reviewCount
        });
        console.log(`   Updated ${product.name}: ${stats[0].reviewCount} reviews, avg ${Math.round(stats[0].averageRating * 10) / 10}⭐`);
      }
    }

    console.log('\n✅ All done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();
