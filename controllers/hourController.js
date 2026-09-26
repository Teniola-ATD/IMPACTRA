const HoursLog = require('../Models/HoursLog');

// Volunteer logs hours
const logHours = async (req, res) => {
  try {
    const hourEntry = new HoursLog(req.body);
    await hourEntry.save();
    res.status(201).json({ success: true, message: "Hours logged successfully for verification", data: hourEntry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// NGO Admin verifies hours
const verifyHours = async (req, res) => {
  try {
    const { logId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    const updatedLog = await HoursLog.findByIdAndUpdate(
      logId,
      { status, verified_at: status === 'approved' ? new Date() : null },
      { new: true }
    );
    res.status(200).json({ success: true, message: `Hours marked as ${status}`, data: updatedLog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { logHours, verifyHours };