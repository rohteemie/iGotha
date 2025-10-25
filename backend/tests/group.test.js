const { storage } = require('../config/database');
const { Group, User, Chat, UserGroup } = require('../models/associations.model');

describe('Group Service Tests', () => {
  let testUser1, testUser2, testUser3;

  beforeAll(async () => {
    await storage.sync({ force: true });
  });

  beforeEach(async () => {
    // Create test users
    testUser1 = await User.create({
      username: 'groupuser1',
      first_name: 'Group',
      last_name: 'User1',
      email: 'groupuser1@example.com',
    });

    testUser2 = await User.create({
      username: 'groupuser2',
      first_name: 'Group',
      last_name: 'User2',
      email: 'groupuser2@example.com',
    });

    testUser3 = await User.create({
      username: 'groupuser3',
      first_name: 'Group',
      last_name: 'User3',
      email: 'groupuser3@example.com',
    });
  });

  afterEach(async () => {
    await UserGroup.destroy({ where: {}, truncate: true, cascade: true });
    await Chat.destroy({ where: {}, truncate: true, cascade: true });
    await Group.destroy({ where: {}, truncate: true, cascade: true, force: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await storage.close();
  });

  describe('Group Model', () => {
    test('should create a group with required fields', async () => {
      const group = await Group.create({
        name: 'Test Group',
        description: 'A test group for testing',
        createdBy: testUser1.id,
      });

      expect(group.id).toBeDefined();
      expect(group.name).toBe('Test Group');
      expect(group.description).toBe('A test group for testing');
      expect(group.createdBy).toBe(testUser1.id);
    });

    test('should create a group without description', async () => {
      const group = await Group.create({
        name: 'Minimal Group',
        createdBy: testUser1.id,
      });

      expect(group.id).toBeDefined();
      expect(group.name).toBe('Minimal Group');
      expect(group.description).toBeFalsy(); // Can be null or undefined
    });

    test('should generate UUID for group ID', async () => {
      const group = await Group.create({
        name: 'UUID Test Group',
        createdBy: testUser1.id,
      });

      expect(group.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    test('should have timestamps', async () => {
      const group = await Group.create({
        name: 'Timestamp Group',
        createdBy: testUser1.id,
      });

      expect(group.createdAt).toBeDefined();
      expect(group.updatedAt).toBeDefined();
    });

    test('should have paranoid delete (soft delete)', async () => {
      const group = await Group.create({
        name: 'Soft Delete Group',
        createdBy: testUser1.id,
      });

      await group.destroy();
      
      // Should not be found in normal query
      const foundGroup = await Group.findByPk(group.id);
      expect(foundGroup).toBeNull();

      // Should be found when including deleted
      const deletedGroup = await Group.findByPk(group.id, { paranoid: false });
      expect(deletedGroup).toBeDefined();
      expect(deletedGroup.deletedAt).toBeDefined();
    });

    test('should not create group without name', async () => {
      await expect(
        Group.create({
          description: 'No name group',
          createdBy: testUser1.id,
        })
      ).rejects.toThrow();
    });

    test('should not create group with empty name', async () => {
      await expect(
        Group.create({
          name: '',
          createdBy: testUser1.id,
        })
      ).rejects.toThrow();
    });

    test('should have default createdBy as system', async () => {
      const group = await Group.create({
        name: 'System Group',
      });

      expect(group.createdBy).toBe('system');
    });

    test('should have default updatedBy as system', async () => {
      const group = await Group.create({
        name: 'System Updated Group',
        createdBy: testUser1.id,
      });

      expect(group.updatedBy).toBe('system');
    });
  });

  describe('Group Members', () => {
    test('should add users to a group', async () => {
      const group = await Group.create({
        name: 'Members Group',
        createdBy: testUser1.id,
      });

      await group.setUsers([testUser1.id, testUser2.id]);

      const members = await group.getUsers();
      expect(members.length).toBe(2);
      expect(members.map((m) => m.id)).toContain(testUser1.id);
      expect(members.map((m) => m.id)).toContain(testUser2.id);
    });

    test('should add a single user to a group', async () => {
      const group = await Group.create({
        name: 'Single Member Group',
        createdBy: testUser1.id,
      });

      await group.addUser(testUser1.id);

      const members = await group.getUsers();
      expect(members.length).toBe(1);
      expect(members[0].id).toBe(testUser1.id);
    });

    test('should remove users from a group', async () => {
      const group = await Group.create({
        name: 'Remove Member Group',
        createdBy: testUser1.id,
      });

      await group.setUsers([testUser1.id, testUser2.id]);
      await group.removeUser(testUser1.id);

      const members = await group.getUsers();
      expect(members.length).toBe(1);
      expect(members[0].id).toBe(testUser2.id);
    });

    test('should replace all group members', async () => {
      const group = await Group.create({
        name: 'Replace Members Group',
        createdBy: testUser1.id,
      });

      await group.setUsers([testUser1.id, testUser2.id]);
      await group.setUsers([testUser3.id]);

      const members = await group.getUsers();
      expect(members.length).toBe(1);
      expect(members[0].id).toBe(testUser3.id);
    });
  });

  describe('Group Query Operations', () => {
    test('should find group by ID', async () => {
      const group = await Group.create({
        name: 'Find By ID Group',
        createdBy: testUser1.id,
      });

      const foundGroup = await Group.findByPk(group.id);
      expect(foundGroup).toBeDefined();
      expect(foundGroup.id).toBe(group.id);
    });

    test('should find group by name', async () => {
      await Group.create({
        name: 'Find By Name Group',
        createdBy: testUser1.id,
      });

      const foundGroup = await Group.findOne({ where: { name: 'Find By Name Group' } });
      expect(foundGroup).toBeDefined();
      expect(foundGroup.name).toBe('Find By Name Group');
    });

    test('should get all groups', async () => {
      await Group.create({
        name: 'Group 1',
        createdBy: testUser1.id,
      });

      await Group.create({
        name: 'Group 2',
        createdBy: testUser2.id,
      });

      const allGroups = await Group.findAll();
      expect(allGroups.length).toBe(2);
    });

    test('should include users in query', async () => {
      const group = await Group.create({
        name: 'Include Users Group',
        createdBy: testUser1.id,
      });

      await group.setUsers([testUser1.id, testUser2.id]);

      const groupWithUsers = await Group.findByPk(group.id, {
        include: [{ model: User }],
      });

      expect(groupWithUsers.Users).toBeDefined();
      expect(groupWithUsers.Users.length).toBe(2);
    });

    test('should include chat in query', async () => {
      const group = await Group.create({
        name: 'Include Chat Group',
        createdBy: testUser1.id,
      });

      const chat = await Chat.create({
        isGroup: true,
        groupId: group.id,
      });

      const groupWithChat = await Group.findByPk(group.id, {
        include: [{ model: Chat, as: 'chat' }],
      });

      expect(groupWithChat.chat).toBeDefined();
      expect(groupWithChat.chat.id).toBe(chat.id);
    });

    test('should filter groups by creator', async () => {
      await Group.create({
        name: 'Creator 1 Group',
        createdBy: testUser1.id,
      });

      await Group.create({
        name: 'Creator 2 Group',
        createdBy: testUser2.id,
      });

      const user1Groups = await Group.findAll({ where: { createdBy: testUser1.id } });
      expect(user1Groups.length).toBe(1);
      expect(user1Groups[0].createdBy).toBe(testUser1.id);
    });
  });

  describe('Group Update Operations', () => {
    test('should update group name', async () => {
      const group = await Group.create({
        name: 'Original Name',
        createdBy: testUser1.id,
      });

      await group.update({ name: 'Updated Name' });

      const updatedGroup = await Group.findByPk(group.id);
      expect(updatedGroup.name).toBe('Updated Name');
    });

    test('should update group description', async () => {
      const group = await Group.create({
        name: 'Update Description Group',
        description: 'Original description',
        createdBy: testUser1.id,
      });

      await group.update({ description: 'Updated description' });

      const updatedGroup = await Group.findByPk(group.id);
      expect(updatedGroup.description).toBe('Updated description');
    });

    test('should update updatedBy field', async () => {
      const group = await Group.create({
        name: 'Updated By Group',
        createdBy: testUser1.id,
      });

      await group.update({ updatedBy: testUser2.id });

      expect(group.updatedBy).toBe(testUser2.id);
    });

    test('should update updatedAt timestamp on changes', async () => {
      const group = await Group.create({
        name: 'Timestamp Update Group',
        createdBy: testUser1.id,
      });

      const originalUpdatedAt = group.updatedAt;
      await new Promise((resolve) => setTimeout(resolve, 100));
      await group.update({ description: 'New description' });

      expect(group.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Group Deletion', () => {
    test('should soft delete a group', async () => {
      const group = await Group.create({
        name: 'Soft Delete Test Group',
        createdBy: testUser1.id,
      });

      const groupId = group.id;
      await group.destroy();

      const foundGroup = await Group.findByPk(groupId);
      expect(foundGroup).toBeNull();
    });

    test('should restore soft deleted group', async () => {
      const group = await Group.create({
        name: 'Restore Group',
        createdBy: testUser1.id,
      });

      await group.destroy();
      await group.restore();

      const restoredGroup = await Group.findByPk(group.id);
      expect(restoredGroup).toBeDefined();
      expect(restoredGroup.name).toBe('Restore Group');
    });

    test('should cascade delete associated chat when group is deleted', async () => {
      const group = await Group.create({
        name: 'Cascade Delete Group',
        createdBy: testUser1.id,
      });

      const chat = await Chat.create({
        isGroup: true,
        groupId: group.id,
      });

      const chatId = chat.id;
      await group.destroy({ force: true }); // Force delete to trigger cascade

      const foundChat = await Chat.findByPk(chatId);
      expect(foundChat).toBeNull();
    });
  });
});
