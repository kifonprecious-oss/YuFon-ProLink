const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

// Serve uploaded files statically so they can be accessed via URL (e.g., http://localhost:5000/uploads/filename.jpg)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure an 'uploads' folder exists in your backend root directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yufon-prolink';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.log('Database connection error:', err));

// --- Schemas & Models ---

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'professional', 'admin'], required: true },
  location: String,
  phone: String,
  category: String,
  rate: String,
  verified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false }, // Account approval lock
  
  // Profile Setup Fields
  dob: { type: Date },
  profilePicture: { type: String },
  bio: { type: String },
  services: { type: [String] },
  idDocument: { type: String },
  isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

const requestSchema = new mongoose.Schema({
  professionalId: String,
  professionalName: String,
  projectTitle: String,
  description: String,
  budget: String,
  timeline: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: String, default: () => new Date().toLocaleDateString() }
});

const reviewSchema = new mongoose.Schema({
  professionalId: { type: String, required: true },
  clientName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toLocaleDateString() }
});

const messageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const proposalSchema = new mongoose.Schema({
  jobId: String,
  professionalId: String,
  professionalName: String,
  coverLetter: String,
  bidAmount: String,
  deliveryTime: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: String, default: () => new Date().toLocaleDateString() }
});

const contractSchema = new mongoose.Schema({
  clientId: String,
  clientName: String,
  professionalId: String,
  professionalName: String,
  projectTitle: String,
  agreedAmount: String,
  status: { type: String, default: 'Active' }, // Active, Completed, Cancelled
  createdAt: { type: String, default: () => new Date().toLocaleDateString() }
});

const User = mongoose.model('User', userSchema);
const ServiceRequest = mongoose.model('ServiceRequest', requestSchema);
const Review = mongoose.model('Review', reviewSchema);
const Message = mongoose.model('Message', messageSchema);
const Proposal = mongoose.model('Proposal', proposalSchema);
const Contract = mongoose.model('Contract', contractSchema);


// --- REST API Endpoints ---

// 1. Register User / Professional
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role, location, phone, category, rate } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = new User({ 
      name, 
      email, 
      password, 
      role, 
      location, 
      phone, 
      category: category || 'Technical & Engineering Services', 
      rate: rate || '15,000 XAF / hr',
      isApproved: false // Requires admin approval before login
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully. Pending admin approval.', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get All Professionals
app.get('/api/professionals', async (req, res) => {
  try {
    const professionals = await User.find({ role: 'professional', isApproved: true });
    res.json(professionals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Submit Service Request / Quote
app.post('/api/requests', async (req, res) => {
  try {
    const newRequest = new ServiceRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get Service Requests (Client Requests)
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await ServiceRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Alias for /api/client-requests to match frontend calls
app.get('/api/client-requests', async (req, res) => {
  try {
    const requests = await ServiceRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Proposals Endpoints
app.get('/api/proposals', async (req, res) => {
  try {
    const proposals = await Proposal.find();
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/proposals', async (req, res) => {
  try {
    const newProposal = new Proposal(req.body);
    await newProposal.save();
    res.status(201).json({ message: 'Proposal submitted successfully', proposal: newProposal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Contracts Endpoints
app.get('/api/contracts', async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contracts', async (req, res) => {
  try {
    const newContract = new Contract(req.body);
    await newContract.save();
    res.status(201).json({ message: 'Contract created successfully', contract: newContract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Add a Review for a Professional
app.post('/api/reviews', async (req, res) => {
  try {
    const { professionalId, clientName, rating, comment } = req.body;
    const newReview = new Review({ professionalId, clientName, rating, comment });
    await newReview.save();
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Get Reviews for a Specific Professional
app.get('/api/reviews/:professionalId', async (req, res) => {
  try {
    const reviews = await Review.find({ professionalId: req.params.professionalId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Login User / Professional (With Admin Approval Gate)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (!user.isApproved && user.role !== 'admin') {
      return res.status(403).json({ error: 'Your account is pending admin approval. Please wait for verification before logging in.' });
    }

    res.status(200).json({ 
      message: 'Login successful', 
      user: { 
        id: user._id, 
        _id: user._id,
        name: user.name, 
        email: user.email, 
        role: user.role, 
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        services: user.services,
        profilePicture: user.profilePicture,
        isApproved: user.isApproved, 
        isProfileComplete: user.isProfileComplete 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Profile Update Endpoint (Handles multipart/form-data from ProfileSetupPage)
app.post('/api/profile/update', upload.single('profilePicture'), async (req, res) => {
  try {
    const { userId, phone, bio, skills } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Update editable fields only (locking identity details like name/location for safety)
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) {
      const skillsArray = typeof skills === 'string'
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : skills;
      user.services = skillsArray;
    }

    // Handle profile picture update if uploaded
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    user.isProfileComplete = true;
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        services: user.services,
        profilePicture: user.profilePicture,
        isApproved: user.isApproved,
        isProfileComplete: user.isProfileComplete
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Alternative Profile Update Endpoint (Supports JSON & Dual File Uploads)
app.put('/api/users/profile/:id', upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'idDocument', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, dob, location, bio, services } = req.body;

    const servicesArray = typeof services === 'string'
      ? services.split(',').map(s => s.trim()).filter(Boolean)
      : services;

    const updateFields = {
      name: name || undefined,
      dob,
      location,
      bio,
      services: servicesArray,
      isProfileComplete: true
    };

    if (req.files && req.files['profilePicture']) {
      updateFields.profilePicture = `/uploads/${req.files['profilePicture'][0].filename}`;
    }

    if (req.files && req.files['idDocument']) {
      updateFields.idDocument = `/uploads/${req.files['idDocument'][0].filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 12. Fetch Chat Message History
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// 13. Admin: Get All Users
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 14. Admin: Approve or Reject User Account
app.put('/api/admin/users/:id/status', async (req, res) => {
  try {
    const { isApproved, verified } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved, verified: verified !== undefined ? verified : isApproved },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: `User account ${isApproved ? 'approved' : 'rejected'} successfully`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// --- WebSocket Real-Time Handlers ---

io.on('connection', (socket) => {
  console.log(`User connected via WebSocket: ${socket.id}`);

  socket.on('send_message', async (data) => {
    try {
      const newMessage = new Message(data);
      await newMessage.save();
      io.emit('receive_message', newMessage);
    } catch (err) {
      console.error('Error saving real-time message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`YuFon-ProLink server running on port ${PORT} with full REST & WebSocket support`);
});