import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';


const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Import routes
app.use('/api/users', require('../modules/Users/user.routes.mjs'));
app.use('/api/brands', require('../modules/Brands/brand.routes.mjs'));
app.use('/api/models', require('../modules/Models/model.routes.mjs'));
app.use('/api/defects', require('../modules/Defects/defect.routes.mjs'));
app.use('/api/activity', require('../modules/Activities/activity.routes.mjs'))

// Database connection helper for serverless environments
let isConnected = false;
async function connectToDB() {
  if (isConnected) return;
  try {
    await mongoose.connect("mongodb+srv://codadhyay_db_user:Blp3rTok12Lxtooz@3extentsales.73o4sme.mongodb.net/3extentsales", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,       // Increase connection timeout to 30 seconds
      serverSelectionTimeoutMS: 30000 // Wait up to 30 seconds for server selection
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Setup server
(async () => {
  try {
    await connectToDB();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    process.exit(1);
  }
})();

module.exports = app;
