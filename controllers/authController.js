const User = require('../Models/User');
const bcrypt = require('bcryptjs');

// Register User (NGO Admin or Volunteer)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, organization_mission, volunteer_skills, volunteer_availability } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already registered" });

    // Secure the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password_hash: passwordHash,
      role,
      organization_mission,
      volunteer_skills,
      volunteer_availability
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User profile created successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { registerUser };