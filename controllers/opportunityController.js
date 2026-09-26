const Opportunity = require('../Models/Opportunity');
const Application = require('../Models/Application');
const HoursLog = require('../Models/HoursLog')

// Post an Opportunity
const createOpportunity = async (req, res) => {
  try {
    const opportunity = new Opportunity(req.body);
    await opportunity.save();
    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Browse all Opportunities (with NGO info populated)
const getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find().populate('ngo_id', 'name organization_mission');
    res.status(200).json({ success: true, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Volunteer Applies for Opportunity
const applyToOpportunity = async (req, res) => {
  try {
    const { opportunity_id, volunteer_id } = req.body;
    const application = new Application({ opportunity_id, volunteer_id });
    await application.save();
    res.status(201).json({ success: true, message: "Application submitted successfully", data: application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// NGO Admin reviews application (Approve/Reject)
const reviewApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, assigned_role } = req.body; // status must be 'approved' or 'rejected'

    const updatedApp = await Application.findByIdAndUpdate(
      applicationId,
      { status, assigned_role },
      { new: true }
    );
    res.status(200).json({ success: true, message: `Application status updated to ${status}`, data: updatedApp });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// NGO Impact Dashboard Summary Metrics
const getNgoDashboardStats = async (req, res) => {
  try {
    const { ngoId } = req.params;

    // 1. Count how many total opportunities this NGO has published
    const totalPrograms = await Opportunity.countDocuments({ ngo_id: ngoId });

    // 2. Fetch all opportunities belonging to this NGO to trace their hours/applications
    const ngoOpportunities = await Opportunity.find({ ngo_id: ngoId }).select('_id');
    const opportunityIds = ngoOpportunities.map(op => op._id);

    // 3. Count total approved volunteer applications for this NGO's events
    const totalVolunteers = await Application.countDocuments({
      opportunity_id: { $in: opportunityIds },
      status: 'approved'
    });

    // 4. Calculate total verified hours logged across all this NGO's events
    const hourLogs = await HoursLog.find({
      opportunity_id: { $in: opportunityIds },
      status: 'approved'
    });
    
    const totalHoursLogged = hourLogs.reduce((sum, log) => sum + log.hours_logged, 0);

    // dashboard payload
    res.status(200).json({
      success: true,
      metrics: {
        total_programs: totalPrograms,
        total_active_volunteers: totalVolunteers,
        total_verified_hours: totalHoursLogged
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// add getNgoDashboardStats to module.exports 
module.exports = { 
  createOpportunity, 
  getAllOpportunities, 
  applyToOpportunity, 
  reviewApplication, 
  getNgoDashboardStats 
};