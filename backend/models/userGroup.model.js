module.exports = (storage, DataTypes) => {
	const UserGroup = storage.define(
	  'UserGroup',
	  {
		id: {
		  type: DataTypes.UUID,
		  defaultValue: DataTypes.UUIDV4,
		  primaryKey: true,
		},
		role: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  defaultValue: 'member', // e.g., 'admin', 'member'
		  validate: {
			isIn: [['admin', 'member']],
		  },
		},
		joinedAt: {
		  type: DataTypes.DATE,
		  defaultValue: DataTypes.NOW,
		},
	  },
	  {
		timestamps: false, // Disable automatic `createdAt` and `updatedAt`
		tableName: 'user_groups', // Explicitly name the table
	  }
	);

	return UserGroup;
  };
