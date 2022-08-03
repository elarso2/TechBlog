const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homepageRoutes');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);

module.exports = router;
