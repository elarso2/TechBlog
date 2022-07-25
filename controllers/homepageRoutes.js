const router = require('express').Router();
const { User, Blog } = require('../models');
const hasAuth = require('../utils/auth');

router.get('/', (req, res) => {
  res.render('../view/layouts.main');
});
