const { Message, Chat, User, Group } = require('../models/associations.model');

// Send a message (handles both direct and group chats)
async function sendMessage(req, res) {
  const { recipientId, groupId, senderId, content } = req.body;

  try {
    // Validate sender exists
    const sender = await User.findByPk(senderId);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    let chat;

    if (groupId) {
      // Group chat logic
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }

      chat = await Chat.findOne({ where: { groupId, isGroup: true } });
      if (!chat) {
        chat = await Chat.create({ groupId, isGroup: true });
      }
    } else {
      // Direct chat logic
      if (!recipientId) {
        return res.status(400).json({ message: 'Recipient ID is required for direct messages.' });
      }

      const recipient = await User.findByPk(recipientId);
      if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
      }

      // Find an existing chat between the sender and recipient
      chat = await Chat.findOne({
        where: { isGroup: false },
        include: [
          {
            model: User,
            as: 'participants',
            where: { id: [senderId, recipientId] },
            through: { attributes: [] },
          },
        ],
      });

      // If no chat exists, create a new direct chat
      if (!chat) {
        chat = await Chat.create({ isGroup: false });
        await chat.addParticipants([senderId, recipientId]);
      }
    }

    // Create and save the message
    const message = await Message.create({ chatId: chat.id, senderId, content });

    return res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Fetch all messages for a chat
async function getMessages(req, res) {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const messages = await Message.findAll({
      where: { chatId },
      include: [{ model: User, as: 'sender', attributes: ['id', 'username'] }],
      order: [['createdAt', 'ASC']],
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  sendMessage,
  getMessages,
};
