const express = require('express');
const { getOrganisations, createOrganisation } = require('../controllers/organisationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.get('/', getOrganisations);
router.post('/', createOrganisation);

module.exports = router;








const express = require('express');
const router = express.Router();
const organisationController = require('../controllers/organisationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, organisationController.getAllOrganisations);
router.get('/:orgId', authMiddleware, organisationController.getOrganisation);
router.post('/', authMiddleware, organisationController.createOrganisation);
router.post('/:orgId/users', authMiddleware, organisationController.addUserToOrganisation);

module.exports = router;
