import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  birthday: { type: Date },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  enrollmentDate: { type: Date, default: Date.now },
  notes: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, { timestamps: true });

export default mongoose.model('Client', ClientSchema);