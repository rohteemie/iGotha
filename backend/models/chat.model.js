/**
 * Represents a Chat model.
 *
 * @typedef {Object} Chat
 * @property {string} id - The unique identifier for the chat, generated as a UUID.
 * @property {boolean} isGroup - Indicates whether the chat is a group chat. Defaults to false.
 * @property {string} [groupId] - Optional foreign key referencing the group (if it's a group chat).
 */
module.exports = (storage, DataTypes) => {
  const Chat = storage.define(
    'Chat',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: 'chats',
    }
  );

  Chat.associate = (models) => {
    // A chat belongs to a group (optional, for group chats)
    Chat.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group',
      onDelete: 'CASCADE',
    });

    // A chat can have many messages
    Chat.hasMany(models.Message, {
      foreignKey: 'chatId',
      as: 'messages',
      onDelete: 'CASCADE',
    });

    // A chat can involve multiple users (for direct or group chats)
    Chat.belongsToMany(models.User, {
      through: models.UserChat,
      as: 'participants',
      foreignKey: 'chatId',
      otherKey: 'userId',
    });
  };

  return Chat;
};
