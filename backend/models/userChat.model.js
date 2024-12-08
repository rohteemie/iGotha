/**
 * Represents the UserChat model (many-to-many relationship between Users and Chats).
 *
 * @typedef {Object} UserChat
 * @property {string} userId - Foreign key referencing the User.
 * @property {string} chatId - Foreign key referencing the Chat.
 */
module.exports = (storage, DataTypes) => {
    const UserChat = storage.define(
      'UserChat',
      {
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        chatId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        timestamps: false,
        tableName: 'user_chats',
      }
    );

    return UserChat;
  };
