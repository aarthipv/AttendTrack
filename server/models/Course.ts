import mongoose from 'mongoose';

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

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course;