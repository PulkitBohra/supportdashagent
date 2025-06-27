import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'other'], required: true },
  transactionId: { type: String },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);