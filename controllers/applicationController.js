const Application = require('../Models/Application');
const Opportunity = require('../Models/Opportunity');

// 1. Volunteer applies for an opportunity
const applyToOpportunity = async (req, res) => {
  try {
    const { opportunityId, volunteerId, assigned_role } = req.body;

    if (!opportunityId || !volunteerId) {
      return res.status(400).json({ success: false, message: 'opportunityId and volunteerId are required' });
    }

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    // Check if volunteer has already applied
    const existingApp = await Application.findOne({ 
      opportunity_id: opportunityId, 
      volunteer_id: volunteerId 
    });

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied to this opportunity' });
    }

    const application = new Application({
      opportunity_id: opportunityId,
      volunteer_id: volunteerId,
      assigned_role: assigned_role || 'Volunteer'
    });

    await application.save();
    res.status(201).json({ success: true, message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. NGO fetches applications for review
const getNgoApplications = async (req, res) => {
  try {
    const { ngoId } = req.params;

    // Find all opportunities created by this NGO first
    const ngoOpportunities = await Opportunity.find({ 
      $or: [{ ngo_id: ngoId }, { postedBy: ngoId }, { user: ngoId }] 
    }).select('_id');

    const opportunityIds = ngoOpportunities.map(opp => opp._id);

    // Fetch applications matching those opportunities
    const applications = await Application.find({ opportunity_id: { $in: opportunityIds } })
      .populate('volunteer_id', 'name email volunteer_skills')
      .populate('opportunity_id', 'title location');

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. NGO approves or rejects an application
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be "approved" or "rejected"' });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, message: `Application ${status}`, application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  applyToOpportunity,
  getNgoApplications,
  updateApplicationStatus
};