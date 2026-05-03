const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://muikhamedovam_db_user:KkcEE85KKeI6CH1K@cluster0.yp1uvgx.mongodb.net/?appName=Cluster0';

const testSchema = new mongoose.Schema({
  title: String,
  questions: Array,
  timeLimit: Number
});

const Test = mongoose.model('Test', testSchema);

async function checkDetails() {
  try {
    await mongoose.connect(MONGO_URI);
    const verbsTest = await Test.findOne({ title: 'verbs' });
    if (verbsTest) {
      console.log('Verbs Test Details:');
      console.log(JSON.stringify(verbsTest.questions.slice(0, 2), null, 2));
    } else {
      console.log('Verbs test not found');
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkDetails();
