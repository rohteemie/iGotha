/**
 * Represents a user in the system.
 *
 * @typedef {Object} User
 * @property {string} id - The unique identifier of the user.
 * @property {string} username - The username of the user. Cannot be null or empty.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {string} email - The email address of the user. Must be unique if provided.
 * @property {string} status - The status of the user, either "online" or "offline". Defaults to "offline".
 * @property {Date} last_seen - The date and time when the user was last seen. Defaults to the current date and time.
 * @property {boolean} is_guest - Indicates whether the user is a guest or not. Defaults to false.
 */

module.exports = (storage, DataTypes) => {
    const User = storage.define(
      'User',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: 'Username cannot be empty' },
          },
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
          validate: {
            isEmail: { msg: 'Must be a valid email address' },
          },
        },
        status: {
          type: DataTypes.ENUM('online', 'offline'),
          defaultValue: 'offline',
        },
        last_seen: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        is_guest: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
        tableName: 'users',
        hooks: {
          beforeCreate: (user) => {
            console.log(`Creating user: ${user.username}`);
          },
        },
        indexes: [
          {
            unique: true,
            fields: ['email'], // Ensures email uniqueness in the database
          },
          {
            fields: ['status'], // Optimize queries filtering by status
          },
        ],
      }
    );

    // Define associations for the User model
    User.associate = (models) => {
      // Many-to-Many relationship with Chat
      User.belongsToMany(models.Chat, { through: models.UserChat, foreignKey: 'userId' });

      // One-to-Many relationship with Message
      User.hasMany(models.Message, { foreignKey: 'userId', onDelete: 'CASCADE' });

      // Many-to-Many relationship with Group
      User.belongsToMany(models.Group, {
        through: models.UserGroup,
        foreignKey: 'userId',
        otherKey: 'groupId',
      });
    };

    return User;
  };
