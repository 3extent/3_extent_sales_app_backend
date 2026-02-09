import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';


import '../modules/UserRoles/UserRole.mjs';
// import '../modules/Users/User.mjs';
import '../modules/Partners/Partner.mjs';
// import '../modules/Activities/Activity.mjs';
// import '../modules/Brands/Brand.mjs';
// import '../modules/Defects/Defect.mjs';
// import '../modules/Models/Model.mjs';


// Import routes (ESM way)
import activityRoutes from '../modules/Activities/activity.routes.mjs';
import userRoutes from '../modules/Users/user.routes.mjs';
import brandRoutes from '../modules/Brands/brand.routes.mjs';
import modelRoutes from '../modules/Models/model.routes.mjs';
import defectRoutes from '../modules/Defects/defect.routes.mjs';



const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/defects', defectRoutes);
app.use('/api/activity', activityRoutes);

// Database connection helper (serverless-friendly)
let isConnected = false;

async function connectToDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(
      'mongodb+srv://codadhyay_db_user:Blp3rTok12Lxtooz@3extentsales.73o4sme.mongodb.net/3extentsales',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000,
        serverSelectionTimeoutMS: 30000
      }
    );

    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Start server
(async () => {
  try {
    await connectToDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    process.exit(1);
  }
})();

export default app;
