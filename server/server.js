const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const { seedDefaultFoods } = require('./controllers/foodController');
const { seedDefaultCombos } = require('./controllers/comboController');
const User = require('./models/User');
const Slot = require('./models/Slot');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/foods', require('./routes/food'));
app.use('/api/slots', require('./routes/slot'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/combos', require('./routes/combo'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  const connectedToAtlas = mongoose.connection.readyState === 1;
  res.json({
    status: connectedToAtlas ? 'OK' : 'ERROR',
    app: 'Smart Canteen Pre-Order System API',
    version: '1.0.0',
    mode: connectedToAtlas ? 'MongoDB Atlas' : 'Disconnected',
    database: connectedToAtlas ? 'MongoDB Atlas' : 'Disconnected',
    timestamp: new Date()
  });
});

const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.send('Smart Canteen Pre-Order System API Service is Running cleanly.');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5007;

const seedInitialData = async () => {
  try {
    const existingStudent = await User.findOne({ email: 'student@canteen.edu' });
    if (!existingStudent) {
      await User.create({
        name: 'Lenka Jayanthi (Student)',
        email: 'student@canteen.edu',
        password: 'password123',
        phone: '+91 98765 43210',
        role: 'Student'
      });
    } else {
      existingStudent.password = 'password123';
      await existingStudent.save();
    }

    const existingAdmin = await User.findOne({ email: 'admin@canteen.edu' });
    if (!existingAdmin) {
      await User.create({
        name: 'Canteen Manager (Admin)',
        email: 'admin@canteen.edu',
        password: 'admin123',
        phone: '+91 91234 56789',
        role: 'Admin'
      });
    } else {
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
    }

    const today = new Date().toISOString().split('T')[0];
    const initialSlots = [
      { category: 'Morning', date: today, startTime: '7:30 AM', endTime: '10:30 AM', capacity: 25, bookedCount: 0, isActive: true },
      { category: 'Afternoon', date: today, startTime: '12:00 PM', endTime: '4:00 PM', capacity: 30, bookedCount: 0, isActive: true },
      { category: 'Evening', date: today, startTime: '4:00 PM', endTime: '8:00 PM', capacity: 25, bookedCount: 0, isActive: true }
    ];

    const existingSlots = await Slot.find().lean();
    const slotMatches = existingSlots.length === initialSlots.length && existingSlots.every(slot => initialSlots.some(expected =>
      expected.category === slot.category &&
      expected.date === slot.date &&
      expected.startTime === slot.startTime &&
      expected.endTime === slot.endTime &&
      expected.capacity === slot.capacity
    ));

    if (!slotMatches) {
      await Slot.deleteMany({});
      await Slot.insertMany(initialSlots);
    }

    await seedDefaultFoods();
    await seedDefaultCombos();
  } catch (err) {
    console.error('[Seed Error]: Error during data seeding:', err.message);
  }
};

const startServer = async () => {
  await connectDB();
  await seedInitialData();

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Smart Canteen API Server active on Port ${PORT}`);
    console.log(`📍 Health Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`🔑 Demo Student: student@canteen.edu / password123`);
    console.log(`🔑 Demo Admin:   admin@canteen.edu / admin123`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Server Error]: Port ${PORT} is already in use by another running process.`);
      console.error(`[Fix]: Stop any running instance on Port ${PORT} or restart nodemon.`);
      process.exit(1);
    } else {
      console.error('[Server Error]:', err.message);
    }
  });
};

startServer().catch(error => {
  console.error(`[Startup Error]: ${error.message}`);
  process.exitCode = 1;
});
