/**
 * Represents Group models.
 * @typedef {Object} Group
 * @property {string} id - Group identifier.
 * @property {string} name - Group name.
 * @property {string} [description] - Group description (nullable).
 */

module.exports = (storage, DataTypes) => {
  const Group = storage.define(
    'Group',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Group name cannot be empty' },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'system',
      },
      updatedBy: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'system',
      },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
      paranoid: true, // Enables soft delete, adds deletedAt field
      tableName: 'groups',
    }
  );

  // Define associations for the Group model
  Group.associate = (models) => {
    // One-to-One relationship with Chat
    Group.hasOne(models.Chat, {
      foreignKey: 'groupId',
      as: 'chat',
      onDelete: 'CASCADE',
    });

    // Many-to-Many relationship with Users
    Group.belongsToMany(models.User, {
      through: models.UserGroup,
      foreignKey: 'groupId',
      otherKey: 'userId',
    });
  };

  return Group;
};
