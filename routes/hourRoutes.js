const express = require('express');
const router = express.Router();
const { logHours, verifyHours } = require('../controllers/hourController');

router.post('/log', logHours);
router.patch('/verify/:logId', verifyHours);

module.exports = router;