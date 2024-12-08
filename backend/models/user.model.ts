import { storage, DataTypes, Model, Optional } from '../config/database';
// import { Model, Sequelize, Optional } from 'sequelize';
import { Chat } from './chat.model'; // Assuming chat.model.ts exists
import { Message } from './message.model'; // Assuming message.model.ts exists
import { Group } from './group.model'; // Assuming group.model.ts exists
import { UserChat } from './userChat.model'; // Assuming userChat.model.ts exists
import { UserGroup } from './userGroup.model'; // Assuming userGroup.model.ts exists

// User attributes interface
interface UserAttributes {
  id: string;
  username: string;
  first_name: string;
  last_name?: string;
  email?: string;
  status: 'online' | 'offline';
  last_seen?: Date;
  is_guest: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for user creation (id, createdAt, and updatedAt are optional during creation)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'last_seen' | 'createdAt' | 'updatedAt'> {}

// Define User model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public first_name!: string;
  public last_name?: string;
  public email?: string;
  public status!: 'online' | 'offline';
  public last_seen?: Date;
  public is_guest!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations for the User model
  static associate(models: any) {
    User.belongsToMany(models.Chat, { through: models.UserChat, foreignKey: 'userId' });
    User.hasMany(models.Message, { foreignKey: 'userId', onDelete: 'CASCADE' });
    User.belongsToMany(models.Group, {
      through: models.UserGroup,
      foreignKey: 'userId',
      otherKey: 'groupId',
    });
  }
}

// Initialize the User model
export const initUserModel = (sequelize_storage: storage) => {
  User.init(
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
      sequelize_storage,
      modelName: 'User',
      tableName: 'users',
      timestamps: true, // Automatically adds createdAt and updatedAt fields
      hooks: {
        beforeCreate: (user: User) => {
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

  return User;
};
