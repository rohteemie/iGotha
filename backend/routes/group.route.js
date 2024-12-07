#!/usr/bin/env node


const express = require('express');
const router = express.Router();
const group_service = require('../services/group.service');


// router.get('/', group_service.getGroupDetails);
router.post('/create', group_service.createGroup);
router.get('/:groupId', group_service.getGroupDetails);
router.post('/:groupId', group_service.sendMessageInGroup);


module.exports = router;
