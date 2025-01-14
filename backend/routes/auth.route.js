#!/usr/bin/env node
/**
 * @file /home/fin/backend/routes/auth.route.js
 * @description This file contains the routes for user-authentication-related operations.
 */

const router = require('express').Router();
const auth_service = require('../services/auth.service');

router.post('/login', auth_service.login);
router.post('/refresh-token', auth_service.refreshAccessToken);
// router.get('/', auth_service.getAllAuthInfo);

module.exports = router;
