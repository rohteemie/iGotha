const { UserGroup, User, Group } = require('../models/associations.model');

async function addUserToGroup(req, res) {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findByPk(groupId);
    const user = await User.findByPk(userId);

    if (!group || !user) {
      return res.status(404).json({ message: 'Group or User not found' });
    }

    await group.addUser(user);
    return res.status(200).json({ message: 'User added to group successfully' });
  } catch (error) {
    console.error('Error adding user to group:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addUserToGroup,
};
