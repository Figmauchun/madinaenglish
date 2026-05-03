const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://muikhamedovam_db_user:KkcEE85KKeI6CH1K@cluster0.yp1uvgx.mongodb.net/?appName=Cluster0';

const testSchema = new mongoose.Schema({
  title: String,
  questions: Array,
  timeLimit: Number
});

const resultSchema = new mongoose.Schema({
  studentName: String,
  testName: String,
  score: Number,
  date: { type: Date, default: Date.now }
});

const Test = mongoose.model('Test', testSchema);
const Result = mongoose.model('Result', resultSchema);

async function checkDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    const tests = await Test.find({});
    console.log(`\nFound ${tests.length} tests:`);
    tests.forEach(t => {
      console.log(`- ${t.title} (${t.questions?.length || 0} questions)`);
    });

    const results = await Result.find({});
    console.log(`\nFound ${results.length} results:`);
    results.forEach(r => {
      console.log(`- ${r.studentName}: ${r.score}% on ${r.testName}`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (err) {
    console.error('Error:', err);
  }
}

checkDB();
