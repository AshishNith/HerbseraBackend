require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/herbsera');
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

const makeAdmin = async (email) => {
  try {
    const User = require('./models/User');
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.log('✗ User not found with email:', email);
      return false;
    }

    if (user.role === 'admin') {
      console.log('ℹ User is already an admin');
      return true;
    }

    user.role = 'admin';
    await user.save();
    
    console.log('✓ Successfully updated user to admin:');
    console.log('  - Name:', user.displayName);
    console.log('  - Email:', user.email);
    console.log('  - Role:', user.role);
    
    return true;
  } catch (error) {
    console.error('✗ Error updating user:', error.message);
    return false;
  }
};

const listUsers = async () => {
  try {
    const User = require('./models/User');
    const users = await User.find().select('displayName email role createdAt').sort({ createdAt: -1 });
    
    console.log('\n📋 All Users:');
    console.log('─'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.displayName || 'No Name'}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role === 'admin' ? '👑 Admin' : '👤 User'}`);
      console.log(`   Joined: ${user.createdAt.toLocaleDateString()}`);
      console.log('─'.repeat(80));
    });
    
    console.log(`\nTotal Users: ${users.length}\n`);
  } catch (error) {
    console.error('✗ Error listing users:', error.message);
  }
};

const promptUser = () => {
  console.log('\n🛡️  HerbsEra Admin User Manager');
  console.log('═'.repeat(50));
  console.log('1. List all users');
  console.log('2. Make user admin');
  console.log('3. Exit');
  console.log('═'.repeat(50));
  
  rl.question('\nSelect an option (1-3): ', async (option) => {
    switch (option.trim()) {
      case '1':
        await listUsers();
        promptUser();
        break;
        
      case '2':
        rl.question('\nEnter user email: ', async (email) => {
          await makeAdmin(email);
          promptUser();
        });
        break;
        
      case '3':
        console.log('\n👋 Goodbye!\n');
        rl.close();
        await mongoose.connection.close();
        process.exit(0);
        break;
        
      default:
        console.log('\n✗ Invalid option. Please select 1-3.\n');
        promptUser();
    }
  });
};

const main = async () => {
  await connectDB();
  promptUser();
};

main();
