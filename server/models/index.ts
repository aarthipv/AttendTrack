import mongoose from 'mongoose';

// User Interface
export interface IUser {
  _id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const userSchema = new mongoose.Schema<IUser>({
  _id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  profileImageUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Course Interface
export interface ICourse {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  attendedClasses: number;
  missedClasses: number;
  totalClasses: number;
  createdAt: Date;
  updatedAt: Date;
}

// Course Schema
const courseSchema = new mongoose.Schema<ICourse>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  attendedClasses: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  missedClasses: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  totalClasses: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

// Add validation to ensure that attendedClasses + missedClasses <= totalClasses
courseSchema.pre('save', function(next) {
  if (this.attendedClasses + this.missedClasses > this.totalClasses) {
    const error = new Error('The sum of attended and missed classes cannot exceed the total number of classes');
    return next(error);
  }
  next();
});

// Create models
export const User = mongoose.model<IUser>('User', userSchema);
export const Course = mongoose.model<ICourse>('Course', courseSchema);