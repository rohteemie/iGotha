/**
 * This module defines relationship between all entities/models
 */

const { User } = require('./user.model')
const { Message  } = require('./message.model')
const { Chat } = require('./chat.model')
const { Group } = require('./group.model')


// A User can participate in multiple Chats
User.belongsToMany(Chat, { through: 'UserChat' });
Chat.belongsToMany(User, { through: 'UserChat' });

// A User can be part of multiple Groups
User.belongsToMany(Group, { through: 'UserGroup' });
Group.belongsToMany(User, { through: 'UserGroup' });

// A User can have multiple Messages
User.hasMany(Message);
Message.belongsTo(User);

// A Message is part of one Chat
Message.belongsTo(Chat);
Chat.hasMany(Message);

// A Message can optionally be part of a Group
Message.belongsTo(Group);
Group.hasMany(Message);

module.exports = {
  User,
  Message,
  Chat,
  Group
};
