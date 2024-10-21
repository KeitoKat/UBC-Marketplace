// routes/userReports.js
const express = require('express');
const router = express.Router();
const UserReport = require('../models/userReport');
const User = require('../models/user');

// Create a new user report
router.post('/', async (req, res) => {
  const { reason, reportedBy, reportedUser } = req.body;
  try {
    const newReport = new UserReport({
      reason,
      reportedBy,
      reportedUser,
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error creating user report:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch all user reports
router.get('/', async (req, res) => {
  try {
    const reports = await UserReport.find()
      .populate('reportedUser')
      .populate('reportedBy');
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});

// Resolve a user report
router.put('/:id/resolve', async (req, res) => {
  try {
    const report = await UserReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = 'resolved';
    await report.save();
    res.status(200).json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
