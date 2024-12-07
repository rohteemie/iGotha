const { Group, Chat, Message, User } = require('../models/associations.model');

// Create a group
async function createGroup(req, res) {
  const { name, description, createdBy } = req.body;

  try {
    // Check if the user creating the group exists
    const user = await User.findByPk(createdBy);
    if (!user) {
      return res.status(404).json({ message: 'User creating the group not found' });
    }

    const newGroup = await Group.create({ name, description, createdBy });
    return res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Fetch a group and its chat/messages
async function getGroupDetails(req, res) {
  const { groupId } = req.params;

  try {
    const group = await Group.findOne({
      where: { id: groupId },
      include: [
        {
          model: Chat,
          as: 'chat',
          include: [{ model: Message, as: 'messages' }],
        },
      ],
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Send a message in a group
async function sendMessageInGroup(req, res) {
  const { groupId } = req.params;
  const { senderId, content } = req.body;

  try {
    // Check if the sender exists
    const sender = await User.findByPk(senderId);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Check if the group exists
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Find or create a chat for the group
    let chat = await Chat.findOne({ where: { groupId } });
    if (!chat) {
      chat = await Chat.create({ groupId, isGroup: true });
    }

    // Create the message
    const message = await Message.create({ chatId: chat.id, senderId, content });
    return res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Error sending message in group:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createGroup,
  getGroupDetails,
  sendMessageInGroup,
};
