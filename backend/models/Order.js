import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  items: [{
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled', 'refunded'], default: 'pending' },
  orderDate: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);