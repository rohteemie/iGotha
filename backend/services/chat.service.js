const { Chat, User, Group } = require('../models/associations.model');

// Create a new chat (group or direct)
async function createChat(req, res) {
  const { isGroup, groupId, userIds } = req.body;

  try {
    // Validate that at least two users are provided
    if (!userIds || userIds.length < 2) {
      return res.status(400).json({ message: 'At least two users are required to create a chat.' });
    }

    // Validate users exist
    const users = await User.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).json({ message: 'One or more users not found.' });
    }

    if (isGroup) {
      // Validate the group exists
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
      }

      // Create group chat
      const chat = await Chat.create({ isGroup: true, groupId });
      await chat.setParticipants(userIds);

      return res.status(201).json({ message: 'Group chat created successfully', chat });
    } else {
      // Create direct chat
      const chat = await Chat.create({ isGroup: false });
      await chat.setParticipants(userIds);

      return res.status(201).json({ message: 'Direct chat created successfully', chat });
    }
  } catch (error) {
    console.error('Error creating chat:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Fetch chat details by chat ID
async function getChatDetails(req, res) {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findByPk(chatId, {
      include: [
        { model: User, as: 'participants', attributes: ['id', 'username'] },
        { model: Group, as: 'group' },
      ],
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Fetch all chats
async function getAllChats(req, res) {
  try {
    const chats = await Chat.findAll({
      include: [
        { model: User, as: 'participants', attributes: ['id', 'username'] },
        { model: Group, as: 'group' },
      ],
    });

    return res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching all chats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createChat,
  getChatDetails,
  getAllChats,
};
