import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Attendance', AttendanceSchema);