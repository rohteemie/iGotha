const { storage, DataTypes } = require('../config/database');

// Import model factory functions
const UserFactory = require('./user.model');
const ChatFactory = require('./chat.model');
const MessageFactory = require('./message.model');
const GroupFactory = require('./group.model');
const UserChatFactory = require('./userChat.model'); // Import UserChat factory
const UserGroupFactory = require('./userGroup.model'); // Import UserChat factory

// Initialize models
const User = UserFactory(storage, DataTypes);
const Chat = ChatFactory(storage, DataTypes);
const Message = MessageFactory(storage, DataTypes);
const Group = GroupFactory(storage, DataTypes);
const UserChat = UserChatFactory(storage, DataTypes); // Initialize UserChat model
const UserGroup = UserGroupFactory(storage, DataTypes); // Initialize UserGroup model

// Add models to an object for easier access
const models = { User, Chat, Message, Group, UserChat, UserGroup };

// Call associate method for each model, if it exists
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

// Export all models
module.exports = models;
