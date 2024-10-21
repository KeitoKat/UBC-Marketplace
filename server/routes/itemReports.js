// routes/itemReports.js
const express = require('express');
const router = express.Router();
const ItemReport = require('../models/itemReport');
const Item = require('../models/item');
const User = require('../models/user');

/**
 * POST /itemReports
 * Request body: {reason, reportedBy, reportedItem}
 * Response: {message}
 * Description: Report an item
 */
router.post('/', async (req, res) => {
  const { reason, reportedBy, reportedItem } = req.body;
  try {
    const newReport = new ItemReport({
      reason,
      reportedBy,
      reportedItem,
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /itemReports
 * Response: reports
 * Description: Get all item reports
 */
router.get('/', async (req, res) => {
  try {
    const reports = await ItemReport.find()
      .populate('reportedItem')
      .populate('reportedBy');
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * PUT /itemReports/:id/resolve
 * Response: updated report
 * Description: Resolve an item report
 * Only admin can resolve a report
 * A resolved report cannot be resolved again
 * A resolved report cannot be unresolved
 * A resolved report cannot be deleted
 * A resolved report cannot be updated
 * A resolved report is marked as resolved
 * A resolved report cannot be marked as pending
 */
router.put('/:id/resolve', async (req, res) => {
  try {
    const report = await ItemReport.findById(req.params.id);
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
