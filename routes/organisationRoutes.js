const express = require('express');
const { getOrganisations, createOrganisation } = require('../controllers/organisationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.get('/', getOrganisations);
router.post('/', createOrganisation);

module.exports = router;
