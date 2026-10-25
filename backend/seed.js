require('dotenv').config();
const mongoose = require('mongoose');
const Mood = require('./models/mood');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodlamp';

const moods = [
  {
    name: '✨ Golden',
    singleColor: { r: 255, g: 215, b: 0 },
    multiColors: [
      { r: 255, g: 215, b: 0 },
      { r: 255, g: 240, b: 120 },
      { r: 255, g: 190, b: 0 },
      { r: 255, g: 223, b: 34 }
    ]
  },
  {
    name: '🌧️ Rainy',
    singleColor: { r: 100, g: 149, b: 237 },
    multiColors: [
      { r: 64, g: 164, b: 223 },
      { r: 100, g: 149, b: 237 },
      { r: 176, g: 196, b: 222 },
      { r: 119, g: 136, b: 153 }
    ]
  },
  {
    name: '🎯 Focus',
    singleColor: { r: 0, g: 120, b: 255 },
    multiColors: [
      { r: 0, g: 120, b: 255 },
      { r: 0, g: 180, b: 255 },
      { r: 50, g: 200, b: 255 }
    ]
  },
  {
    name: '🌙 Night Light',
    singleColor: { r: 255, g: 90, b: 0 },
    multiColors: [
      { r: 255, g: 90, b: 0 },
      { r: 255, g: 120, b: 40 },
      { r: 255, g: 70, b: 20 }
    ]
  },
  {
    name: '🌲 Forest',
    singleColor: { r: 34, g: 139, b: 34 },
    multiColors: [
      { r: 34, g: 139, b: 34 },
      { r: 50, g: 205, b: 50 },
      { r: 85, g: 107, b: 47 },
      { r: 154, g: 205, b: 50 }
    ]
  },
  {
    name: '🌊 Ocean',
    singleColor: { r: 0, g: 180, b: 255 },
    multiColors: [
      { r: 0, g: 119, b: 190 },
      { r: 0, g: 180, b: 255 },
      { r: 0, g: 255, b: 200 },
      { r: 64, g: 224, b: 208 }
    ]
  },
  {
    name: '🌌 Galaxy',
    singleColor: { r: 75, g: 0, b: 130 },
    multiColors: [
      { r: 75, g: 0, b: 130 },
      { r: 138, g: 43, b: 226 },
      { r: 0, g: 191, b: 255 },
      { r: 255, g: 0, b: 255 }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Upsert moods (create if not exists, update if exists)
    let addedCount = 0;
    for (const mood of moods) {
      const result = await Mood.findOneAndUpdate(
        { name: mood.name },
        mood,
        { upsert: true, new: true }
      );
      if (result.isNew || !result._id) addedCount++;
    }
    console.log(`✅ Successfully seeded ${moods.length} moods`);

    // Display all moods
    const allMoods = await Mood.find().sort({ name: 1 });
    console.log('\nAll moods in database:');
    allMoods.forEach(mood => {
      console.log(`- ${mood.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
