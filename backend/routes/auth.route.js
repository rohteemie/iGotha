#!/usr/bin/env node
/**
 * @file /home/fin/backend/routes/auth.route.js
 * @description This file contains the routes for user-authentication-related operations.
 */

const router = require('express').Router();
const auth = require('../services/auth.service');

router.post('/login', auth.login);
// router.get('/', auth.getAllAuthInfo);

module.exports = router;
