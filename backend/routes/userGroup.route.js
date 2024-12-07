const express = require('express');
const router = express.Router();
const userGroupService = require('../services/userGroup.service');

// Route to add user to a group
router.post('/add', userGroupService.addUserToGroup);

module.exports = router;
