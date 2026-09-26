const mongoose = require('mongoose');

const HoursLogSchema = new mongoose.Schema({
  opportunity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  volunteer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hours_logged: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verified_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('HoursLog', HoursLogSchema);