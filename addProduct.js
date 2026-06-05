require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const gemstoneProducts = [
    {
        name: "Black Diamond Gemstone Soap",
        description: "Experience the ultimate detox. Handcrafted with activated bamboo charcoal and gemstone vibrations for a deep, purifying cellular ritual. This ultra-premium charcoal bar removes toxins while leaving your skin silky smooth.",
        benefit: "Deeply detoxifies, purifies pores, and balances energy.",
        price: 299,
        comparePrice: 499,
        images: [
            { url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1775311238/Flat_lay_of_202603272308_x9wfgs.jpg", alt: "Black Diamond Flat Lay" },
            { url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1775311255/A_beautiful_young_202603272259_vivits.jpg", alt: "Model with Black Diamond Soap" },
            { url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1775311245/A_woman_holding_202603272308_ian6td.jpg", alt: "Holding Black Diamond Soap" },
            { url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1775311257/Ultra_premium_black_202603272308_d3c22x.jpg", alt: "Premium Black Diamond Close-up" },
            { url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1775311240/A_smiling_woman_202603272305_spnjhj.jpg", alt: "Glow with Black Diamond Soap" },
            { url: "https://res.cloudinary.com/dvwpxb2oa/image/upload/v1775311247/3_vxujn0.jpg", alt: "Black Diamond Product Shot" }
        ],
        category: "soap",
        ingredients: [
            { name: "Activated Bamboo Charcoal", percentage: 40 },
            { name: "Essential Minerals", percentage: 30 },
            { name: "Organic Coconut Oil", percentage: 30 }
        ],
        weight: { value: 125, unit: "g" },
        stock: 50,
        sku: "HERBSERA-GS-01",
        featured: true,
        isActive: true,
        ratings: { average: 5.0, count: 12 },
        tags: ["gemstone", "black diamond", "charcoal", "detox", "luxury"],
        seoTitle: "Black Diamond Gemstone Soap | Luxury Detox – Herbsera",
        seoDescription: "Pure luxury in a bar. Black Diamond Gemstone Soap with activated charcoal for deep ritualistic cleansing."
    },
    {
        name: "Peridot Frost Gemstone Soap",
        description: "A breath of glacial air for your skin. Infused with neem and peppermint extracts to refresh, cool, and rejuvenate your spirit. Inspired by the clarity of Peridot gemstones.",
        benefit: "Cools, refreshes, and rejuvenates tired skin.",
        price: 299,
        comparePrice: 449,
        images: [{ 
            url: "/assets/Slide2.png", 
            alt: "Peridot Frost Gemstone Soap" 
        }],
        category: "soap",
        ingredients: [
            { name: "Neem Extract", percentage: 35 },
            { name: "Peppermint Oil", percentage: 25 },
            { name: "Aloe Vera Base", percentage: 40 }
        ],
        weight: { value: 125, unit: "g" },
        stock: 45,
        sku: "HERBSERA-GS-02",
        featured: true,
        isActive: true,
        ratings: { average: 4.9, count: 8 },
        tags: ["gemstone", "peridot", "neem", "cooling", "refreshing"],
        seoTitle: "Peridot Frost Gemstone Soap | Cooling Neem – Herbsera",
        seoDescription: "Refresh your senses with Peridot Frost. A cooling neem and peppermint soap inspired by gemstones."
    },
    {
        name: "Lavender Glacier Gemstone Soap",
        description: "Surrender to serene hydration. A calming blend of French lavender and essential minerals that transforms every wash into a moment of mountain peace.",
        benefit: "Calms the mind and hydrates the skin deeply.",
        price: 299,
        comparePrice: 449,
        images: [{ 
            url: "/assets/Slide3.png", 
            alt: "Lavender Glacier Gemstone Soap" 
        }],
        category: "soap",
        ingredients: [
            { name: "French Lavender oil", percentage: 40 },
            { name: "Mineral Salts", percentage: 20 },
            { name: "Shea Butter Base", percentage: 40 }
        ],
        weight: { value: 125, unit: "g" },
        stock: 40,
        sku: "HERBSERA-GS-03",
        featured: true,
        isActive: true,
        ratings: { average: 4.9, count: 15 },
        tags: ["gemstone", "lavender", "glacier", "calming", "hydration"],
        seoTitle: "Lavender Glacier Gemstone Soap | Calming Hydration – Herbsera",
        seoDescription: "Find peace with Lavender Glacier. A deeply hydrating and calming lavender soap."
    }
];

async function addGemstoneSoaps() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        for (const productData of gemstoneProducts) {
            let product = await Product.findOne({ sku: productData.sku });
            if (product) {
                // Update existing product
                Object.assign(product, productData);
                await product.save();
                console.log(`✨ Updated: ${product.name} (SKU: ${product.sku}) - Slug: ${product.slug}`);
            } else {
                // Create new product
                product = await Product.create(productData);
                console.log(`✨ Created: ${product.name} (SKU: ${product.sku}) - Slug: ${product.slug}`);
            }
        }

        console.log('🚀 Gemstone collection added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding gemstone products:', error);
        process.exit(1);
    }
}

addGemstoneSoaps();
