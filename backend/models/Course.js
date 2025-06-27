import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true }, // in weeks
  price: { type: Number, required: true },
  category: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  prerequisites: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Course', CourseSchema);