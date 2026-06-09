require('dotenv').config();
const mongoose = require('mongoose');
const Filter = require('./models/Filter');
const connectDB = require('./config/database');

const seedFilters = async () => {
  try {
    await connectDB();

    // Clear existing filters
    await Filter.deleteMany();
    console.log('Cleared existing filters');

    const initialFilters = [
      {
        name: 'Botanical Green',
        searchQuery: 'neem',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Midnight Black',
        searchQuery: 'charcoal',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Celestial White',
        searchQuery: 'lavender',
        isActive: true,
        sortOrder: 3,
      },
    ];

    await Filter.insertMany(initialFilters);
    console.log('Seeded initial filters successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding filters:', err.message);
    process.exit(1);
  }
};

seedFilters();
