import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/english_platform';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const lessonSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  level: String,
  tags: [String],
  author: { type: String, default: 'AI Assistant' },
  createdAt: { type: Date, default: Date.now }
});

const testSchema = new mongoose.Schema({
  title: String,
  level: String,
  timeLimit: { type: Number, default: 15 }, // in minutes
  questions: [{
    question: String,
    options: [String], // Will be A, B, C, D
    correctAnswer: Number // Index 0-3
  }],
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
const Test = mongoose.model('Test', testSchema);

const resourceSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'verb', 'phrase', 'grammar'
  title: String,
  description: String,
  content: String,
  level: String,
  v1: String,
  v2: String,
  v3: String,
  phrase: String,
  meaning: String,
  example: String,
  translation: {
    uz: String,
    ru: String,
    en: String
  },
  createdAt: { type: Date, default: Date.now }
});

const Resource = mongoose.model('Resource', resourceSchema);

const certificateSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  courseName: { type: String, required: true },
  level: { type: String, default: 'A1' }, // A1, A2, B1, B2, C1, C2
  scores: {
    speaking: { type: Number, default: 0 },
    listening: { type: Number, default: 0 },
    writing: { type: Number, default: 0 },
    reading: { type: Number, default: 0 }
  },
  overallScore: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  certificateId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const resultSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  testName: String,
  score: Number,
  correct: Number,
  wrong: Number,
  total: Number,
  questions: [{
    q: String,
    options: [String],
    correct: Number,
    selected: Number
  }],
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Certificate = mongoose.model('Certificate', certificateSchema);
const Result = mongoose.model('Result', resultSchema);

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// AI Generation with Failover
const generateWithFailover = async (prompt) => {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro', 'gemini-pro-latest'];
  let lastError = null;

  console.log(`[AI] Starting generation for prompt: ${prompt.substring(0, 50)}...`);

  if (!process.env.GEMINI_API_KEY) {
    console.error('[AI] CRITICAL: GEMINI_API_KEY is missing in .env');
    throw new Error('API Key missing');
  }

  for (const modelName of models) {
    try {
      console.log(`[AI] Attempting with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      console.log(`[AI] Received response from ${modelName}`);

      // Extract JSON if model returned markdown blocks
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        text = text.substring(startIndex, endIndex + 1);
      }
      
      return JSON.parse(text);
    } catch (error) {
      console.error(`[AI] Error with ${modelName}:`, error.message);
      lastError = error;
      continue;
    }
  }
  throw lastError || new Error('All AI models failed');
};

// Routes
app.get('/api/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lessons', async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/lessons/:id', async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tests', async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tests', async (req, res) => {
  try {
    const testData = { ...req.body };
    if (testData.duration && !testData.timeLimit) {
      testData.timeLimit = testData.duration;
    }
    const test = new Test(testData);
    await test.save();
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tests/:id', async (req, res) => {
  try {
    const testData = { ...req.body };
    if (testData.duration && !testData.timeLimit) {
      testData.timeLimit = testData.duration;
    }
    const test = await Test.findByIdAndUpdate(req.params.id, testData, { new: true });
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tests/:id', async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/results', async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resource Routes
app.get('/api/resources', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resources', async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/resources/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Certificate Routes
app.get('/api/certificates', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const certId = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const cert = new Certificate({ ...req.body, certificateId: certId });
    await cert.save();
    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/certificates/:id', async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Generation Endpoints
app.post('/api/generate-lesson', async (req, res) => {
  const { topic, level } = req.body;
  const prompt = `Act as a Senior English Teacher. Create a professional, detailed English lesson for ${level} level about ${topic}.
    The content should be extremely high quality, engaging, and clear.
    Return ONLY JSON:
    {
      "title": "A professional title",
      "description": "Engaging summary",
      "content": "Deeply detailed Markdown content with examples, grammar rules, and cultural context",
      "tags": ["Grammar", "Vocabulary", "etc"]
    }`;

  try {
    const data = await generateWithFailover(prompt);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate-test', async (req, res) => {
  const { topic, level, count, timeLimit } = req.body;
  const qCount = count || 10;
    const prompt = `Act as an ESL Examiner. Create a challenging English test with ${qCount} questions for ${level} level about ${topic}.
    Each question must have exactly 4 options.
    Return ONLY a raw JSON object (no markdown, no backticks) with this structure:
    {
      "title": "${topic} Proficiency Test (${level})",
      "timeLimit": ${timeLimit || 15},
      "questions": [
        {
          "question": "Question text here",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0
        }
      ]
    }`;

  try {
    const data = await generateWithFailover(prompt);
    // Ensure we have the requested number of questions or at least some
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate-resource', async (req, res) => {
  const { type, input, level } = req.body;
  let prompt = '';

  if (type === 'verb') {
    prompt = `Act as an English Lexicographer. Given the verb "${input}", provide its irregular forms (V1, V2, V3), translations in Uzbek and Russian, and a concise meaning.
      Return ONLY JSON:
      {
        "v1": "${input}",
        "v2": "past simple form",
        "v3": "past participle form",
        "translation": { "uz": "uzbek translation", "ru": "russian translation", "en": "english equivalent" },
        "meaning": "concise english meaning"
      }`;
  } else if (type === 'phrase') {
    prompt = `Act as an English Teacher. Given the phrase/idiom "${input}", provide its meaning, an example sentence, and translations in Uzbek and Russian.
      Return ONLY JSON:
      {
        "phrase": "${input}",
        "meaning": "clear english meaning",
        "example": "an example sentence using the phrase",
        "translation": { "uz": "uzbek translation", "ru": "russian translation", "en": "english equivalent" }
      }`;
  } else if (type === 'grammar') {
    prompt = `Act as a Grammar Expert. Create a detailed grammar rule for ${level} level about "${input}".
      Include a title, a brief description, and extensive markdown content with examples.
      Return ONLY JSON:
      {
        "title": "Professional Grammar Title",
        "description": "Short overview",
        "content": "Detailed Markdown content with sections, examples, and common mistakes",
        "level": "${level}",
        "translation": { "uz": "uzbek title", "ru": "russian title", "en": "${input}" }
      }`;
  } else if (type === 'dictionary') {
    prompt = `Act as a multilingual Lexicographer. Given the word or short phrase: "${input}".
      Provide its phonetic transcription, word type (noun, verb, etc.), English definition, Uzbek translation, and Russian translation.
      Also provide a sample sentence in English with its Uzbek translation.
      Return ONLY JSON:
      {
        "word": "${input}",
        "phonetic": "/transcription/",
        "type": "adjective/noun/etc",
        "definition": "English definition",
        "uz": "O'zbekcha tarjimasi",
        "ru": "Русский перевод",
        "uzDefinition": "O'zbekcha batafsil ma'nosi",
        "example": {
          "en": "Sample sentence in English",
          "uz": "Gapning o'zbekcha tarjimasi"
        }
      }`;
  }

  try {
    const data = await generateWithFailover(prompt);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate-cert-ai', async (req, res) => {
  const { studentPerformance } = req.body;
  const prompt = `Act as an ESL Cambridge Examiner. Analyze the following student performance data or test results: "${studentPerformance}".
    Identify the student's name, determine their CEFR level (A1-C2), and provide scores out of 100 for Speaking, Listening, Writing, and Reading. 
    Calculate an Overall score as well. I'll provide a placeholder name if none is found.
    Return ONLY JSON:
    {
      "studentName": "Full Name",
      "level": "B2",
      "scores": { "speaking": 85, "listening": 78, "writing": 92, "reading": 88 },
      "overallScore": 86
    }`;

  try {
    const data = await generateWithFailover(prompt);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Grading Endpoint
app.post('/api/grade-test', async (req, res) => {
  const { testTitle, score } = req.body;
  const prompt = `Student took the test "${testTitle}" and got a score of ${score} out of 10.
    Provide constructive feedback, analysis of their performance, and 3 specific recommendations for improvement based on this level.
    Return ONLY JSON:
    {
      "feedback": "Detailed encouraging feedback and performance summary",
      "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
      "score": ${score}
    }`;

  try {
    const data = await generateWithFailover(prompt);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`[SERVER] English Platform Polyglot Engine active on port ${PORT}`);
});

