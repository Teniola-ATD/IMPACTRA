const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  ngo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date_time: { type: Date, required: true },
  volunteers_needed: { type: Number, required: true },
  roles_list: [{ type: String }] // Array of tasks e.g., ["Logistics", "Sanitation Team"]
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', OpportunitySchema);

