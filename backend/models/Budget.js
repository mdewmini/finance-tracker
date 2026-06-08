const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  period: { type: String, default: 'monthly' },
  month: { type: Number, required: true }, // 1–12
  year: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);