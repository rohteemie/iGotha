const router = require('express').Router();
const auth = require('../services/auth.service');

router.post('/login', auth.login);
// router.get('/', auth.getAllAuthInfo);

module.exports = router;
