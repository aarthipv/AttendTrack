import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use the MongoDB URI from environment variables
// Make sure the URI starts with mongodb:// or mongodb+srv://
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_tracker';

// Check if the URI doesn't start with mongodb:// or mongodb+srv://
if (MONGODB_URI && 
    !MONGODB_URI.startsWith('mongodb://') && 
    !MONGODB_URI.startsWith('mongodb+srv://')) {
  // Use a default URI for development
  MONGODB_URI = 'mongodb://127.0.0.1:27017/attendance_tracker';
  console.warn('Invalid MongoDB URI format. Using local MongoDB instance instead.');
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default mongoose;