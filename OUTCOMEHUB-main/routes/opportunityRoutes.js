const express = require('express');
const router = express.Router();
const { createOpportunity, getAllOpportunities, applyToOpportunity, reviewApplication, getNgoDashboardStats} = require('../controllers/opportunityController');

router.post('/', createOpportunity);
router.get('/', getAllOpportunities);
router.post('/apply', applyToOpportunity);
router.patch('/review/:applicationId', reviewApplication);

// Fetch dashboard metrics for a specific NGO Admin
router.get('/dashboard/:ngoId', getNgoDashboardStats);

module.exports = router;