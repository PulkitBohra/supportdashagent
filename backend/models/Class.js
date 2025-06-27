import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor: { type: String, required: true },
  schedule: {
    days: [{ type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
    startTime: { type: String }, 
    endTime: { type: String }
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxCapacity: { type: Number, required: true },
  currentEnrollment: { type: Number, default: 0 },
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' },
  room: { type: String }
}, { timestamps: true });

export default mongoose.model('Class', ClassSchema);