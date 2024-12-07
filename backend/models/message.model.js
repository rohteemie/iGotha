/**
 * Represents the Message model.
 *
 * @typedef {Object} Message
 * @property {string} id - The unique identifier for a message (UUID).
 * @property {string} content - The content of the message.
 * @property {boolean} readReceipt - Indicates whether the message has been read by the recipient (default: false).
 * @property {Date} createdAt - Timestamp for when the message was created.
 * @property {Date} updatedAt - Timestamp for when the message was last updated.
 */

module.exports = (storage, DataTypes) => {
  const Message = storage.define(
    'Message',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      readReceipt: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'messages',
    }
  );

  Message.associate = (models) => {
    // A message belongs to one chat
    Message.belongsTo(models.Chat, {
      foreignKey: 'chatId',
      as: 'chat',
      onDelete: 'CASCADE',
    });

    // A message is sent by a user
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender',
      onDelete: 'CASCADE',
    });
  };

  return Message;
};
