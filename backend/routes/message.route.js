const express = require('express');
const router = express.Router();
const messageService = require('../services/message.service');

// Route to send a message (handles chat creation if needed)
router.post('/send', messageService.sendMessage);

// Route to get all messages in a chat
router.get('/:chatId/messages', messageService.getMessages);

module.exports = router;
