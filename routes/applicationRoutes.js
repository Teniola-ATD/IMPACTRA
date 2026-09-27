const express = require('express');
const router = express.Router();
const {
  applyToOpportunity,
  getNgoApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');

router.post('/apply', applyToOpportunity);
router.get('/ngo/:ngoId', getNgoApplications);
router.patch('/:applicationId/status', updateApplicationStatus);

module.exports = router;