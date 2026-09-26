const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, required: true, enum: ['ngo_admin', 'volunteer'] },
  
  // NGO-specific data (PRD F-01)
  organization_logo: { type: String },
  organization_mission: { type: String },
  
  // Volunteer-specific data (PRD F-02)
  volunteer_skills: [{ type: String }],
  volunteer_availability: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);