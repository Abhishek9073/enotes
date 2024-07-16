const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5003;

// Middleware to set CORS headers
const corsOptions = {
  origin: 'https://enotes-mern.netlify.app', // Your frontend URL without trailing slash
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// File model
const File = require('./models/File');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello, MERN File Sharing!');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const file = new File({
    filename: req.file.filename,
    path: req.file.path,
  });

  try {
    const savedFile = await file.save();
    res.status(201).json(savedFile);
  } catch (err) {
    console.error('Error saving file:', err);
    res.status(500).json({ message: 'Error saving file' });
  }
});

app.get('/files', async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files' });
  }
});

app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Stream the file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

app.put('/update/:id', async (req, res) => {
  try {
    const updatedFile = await File.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedFile);
  } catch (err) {
    res.status(400).json({ message: 'Error updating file' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const deletedFile = await File.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedFile);
  } catch (err) {
    res.status(400).json({ message: 'Error deleting file' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
