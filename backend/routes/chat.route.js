const express = require('express');
const router = express.Router();
const chatService = require('../services/chat.service');

// Route to get all chats
router.get('/', chatService.getAllChats);

// Route to create a new chat (either group or individual)
router.post('/create', chatService.createChat);

// Route to get details of a single chat
router.get('/:chatId', chatService.getChatDetails);

module.exports = router;
