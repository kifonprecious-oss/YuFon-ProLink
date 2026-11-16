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

// Root Health-Check Route (Fixes UptimeRobot 404 error and keeps Render awake)
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'online', 
    service: 'YuFon-ProLink Backend API',
    timestamp: new Date().toISOString() 
  });
});

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
  title: { type: String, required: true },
  projectTitle: String, // Backwards compatibility alias
  location: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Software & Digital Development' },
  budget: { type: String, default: 'Discussed via Chat' },
  timeline: { type: String, default: 'Flexible' },
  imageName: String,
  clientId: String,
  clientName: { type: String, default: 'Client' },
  professionalId: String,
  professionalName: String,
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  contractId: { type: String, required: true, unique: true }, // Contract lock for verified reviews
  professionalId: { type: String, required: true },
  clientId: { type: String, required: true },
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
  clientId: { type: String, required: true },
  clientName: { type: String, required: true },
  professionalId: { type: String, required: true },
  professionalName: { type: String, required: true },
  projectTitle: { type: String, required: true },
  agreedAmount: { type: Number, required: true }, // Numeric value in XAF
  paymentMethod: { type: String, enum: ['MTN MoMo', 'Orange Money', 'Pending'], default: 'Pending' },
  paymentPhone: { type: String },
  transactionRef: { type: String },
  escrowStatus: { 
    type: String, 
    enum: ['Unfunded', 'Funded in Escrow', 'Released to Pro', 'Disputed', 'Refunded'], 
    default: 'Unfunded' 
  },
  disputeReason: { type: String },
  disputedBy: { type: String },
  adminNotes: { type: String },
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Recipient user ID
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const portfolioSchema = new mongoose.Schema({
  professionalId: { type: String, required: true },
  professionalName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  isBeforeAfter: { type: Boolean, default: false },
  beforeImage: { type: String },
  afterImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const ServiceRequest = mongoose.model('ServiceRequest', requestSchema);
const Review = mongoose.model('Review', reviewSchema);
const Message = mongoose.model('Message', messageSchema);
const Proposal = mongoose.model('Proposal', proposalSchema);
const Contract = mongoose.model('Contract', contractSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const PortfolioItem = mongoose.model('PortfolioItem', portfolioSchema);


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

// 3. Submit Service Request / Job Post
app.post('/api/requests', async (req, res) => {
  try {
    const { title, projectTitle, location, description, category, budget, timeline, imageName, clientId, clientName } = req.body;
    
    const newRequest = new ServiceRequest({
      title: title || projectTitle || 'Untitled Job',
      projectTitle: title || projectTitle || 'Untitled Job',
      location: location || 'Buea, Cameroon',
      description: description || '',
      category: category || 'Software & Digital Development',
      budget: budget || 'Discussed via Chat',
      timeline: timeline || 'Flexible',
      imageName,
      clientId,
      clientName: clientName || 'Client',
      status: 'Active'
    });

    await newRequest.save();
    res.status(201).json({ message: 'Job posted successfully', request: newRequest });
  } catch (error) {
    console.error('Error posting job request:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Get Service Requests (Client Requests)
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Alias for /api/client-requests to match frontend calls
app.get('/api/client-requests', async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ createdAt: -1 });
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

// 6. Contracts & Escrow Endpoints
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

// Fund Contract into Escrow via MTN MoMo / Orange Money
app.put('/api/contracts/:id/fund-escrow', async (req, res) => {
  try {
    const { paymentMethod, paymentPhone } = req.body;
    const transactionRef = `YUFON-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      {
        paymentMethod,
        paymentPhone,
        transactionRef,
        escrowStatus: 'Funded in Escrow'
      },
      { new: true }
    );

    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    // Notify Professional in Real-Time via Socket.io
    const notif = new Notification({
      userId: contract.professionalId,
      title: 'Escrow Funded!',
      message: `${contract.clientName} deposited ${contract.agreedAmount.toLocaleString()} XAF via ${paymentMethod} for "${contract.projectTitle}".`
    });
    await notif.save();
    io.emit(`notification_${contract.professionalId}`, notif);

    res.json({ message: 'Escrow funded successfully', contract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Client Approves Work & Releases Escrow Funds to Professional
app.put('/api/contracts/:id/release-escrow', async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      {
        escrowStatus: 'Released to Pro',
        status: 'Completed'
      },
      { new: true }
    );

    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    // Notify Professional of Payout
    const notif = new Notification({
      userId: contract.professionalId,
      title: 'Funds Released!',
      message: `${contract.agreedAmount.toLocaleString()} XAF has been released to your account for "${contract.projectTitle}".`
    });
    await notif.save();
    io.emit(`notification_${contract.professionalId}`, notif);

    res.json({ message: 'Funds released and contract marked completed', contract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Raise a Dispute on a Contract
app.put('/api/contracts/:id/dispute', async (req, res) => {
  try {
    const { reason, raisedBy } = req.body;
    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      {
        escrowStatus: 'Disputed',
        disputeReason: reason,
        disputedBy: raisedBy
      },
      { new: true }
    );

    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const targetUserId = contract.clientId === raisedBy ? contract.professionalId : contract.clientId;
    const notif = new Notification({
      userId: targetUserId,
      title: 'Contract Disputed',
      message: `A dispute has been raised for "${contract.projectTitle}". Admin mediation is underway.`
    });
    await notif.save();
    io.emit(`notification_${targetUserId}`, notif);

    res.json({ message: 'Dispute submitted successfully', contract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Resolves Dispute (Refund Client or Release to Pro)
app.put('/api/admin/contracts/:id/resolve', async (req, res) => {
  try {
    const { resolution, adminNotes } = req.body; // 'Refunded' or 'Released to Pro'

    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      {
        escrowStatus: resolution,
        status: resolution === 'Released to Pro' ? 'Completed' : 'Cancelled',
        adminNotes
      },
      { new: true }
    );

    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    // Notify both Client and Professional
    const clientNotif = new Notification({
      userId: contract.clientId,
      title: 'Dispute Resolved',
      message: `Admin resolved dispute for "${contract.projectTitle}": ${resolution}`
    });
    await clientNotif.save();
    io.emit(`notification_${contract.clientId}`, clientNotif);

    const proNotif = new Notification({
      userId: contract.professionalId,
      title: 'Dispute Resolved',
      message: `Admin resolved dispute for "${contract.projectTitle}": ${resolution}`
    });
    await proNotif.save();
    io.emit(`notification_${contract.professionalId}`, proNotif);

    res.json({ message: 'Dispute resolved successfully', contract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Notifications Endpoints
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Professional Portfolio Endpoints
app.get('/api/portfolio/:professionalId', async (req, res) => {
  try {
    const items = await PortfolioItem.find({ professionalId: req.params.professionalId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/portfolio', upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { professionalId, professionalName, title, description, category, isBeforeAfter } = req.body;

    const newItem = new PortfolioItem({
      professionalId,
      professionalName: professionalName || 'Professional',
      title,
      description,
      category: category || 'General',
      isBeforeAfter: isBeforeAfter === 'true' || isBeforeAfter === true,
      beforeImage: req.files && req.files['beforeImage'] ? `/uploads/${req.files['beforeImage'][0].filename}` : null,
      afterImage: req.files && req.files['afterImage'] ? `/uploads/${req.files['afterImage'][0].filename}` : (req.file ? `/uploads/${req.file.filename}` : '')
    });

    await newItem.save();
    res.status(201).json({ message: 'Portfolio item uploaded successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Contract-Locked Reviews Endpoints
app.post('/api/reviews', async (req, res) => {
  try {
    const { contractId, professionalId, clientId, clientName, rating, comment } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (contract.escrowStatus !== 'Released to Pro' && contract.status !== 'Completed') {
      return res.status(403).json({ error: 'Reviews can only be submitted after contract completion and escrow release.' });
    }

    const existingReview = await Review.findOne({ contractId });
    if (existingReview) {
      return res.status(400).json({ error: 'A review has already been submitted for this contract.' });
    }

    const newReview = new Review({
      contractId,
      professionalId,
      clientId,
      clientName: clientName || 'Client',
      rating,
      comment
    });

    await newReview.save();

    const notif = new Notification({
      userId: professionalId,
      title: 'New Star Rating!',
      message: `${clientName} left a ${rating}-star review for "${contract.projectTitle}".`
    });
    await notif.save();
    io.emit(`notification_${professionalId}`, notif);

    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reviews/:professionalId', async (req, res) => {
  try {
    const reviews = await Review.find({ professionalId: req.params.professionalId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Login User / Professional (With Admin Approval Gate)
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

// 11. Profile Update Endpoint (Handles multipart/form-data from ProfileSetupPage)
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

    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) {
      const skillsArray = typeof skills === 'string'
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : skills;
      user.services = skillsArray;
    }

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

// 12. Alternative Profile Update Endpoint (Supports JSON & Dual File Uploads)
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

// 13. Fetch Chat Message History
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// 14. Admin: Get All Users
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 15. Admin: Approve or Reject User Account
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

  socket.on('send_notification', async (data) => {
    try {
      const newNotif = new Notification(data);
      await newNotif.save();
      io.emit(`notification_${data.userId}`, newNotif);
    } catch (err) {
      console.error('Error saving real-time notification:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`YuFon-ProLink server running on port ${PORT} with full REST & WebSocket support`);
});