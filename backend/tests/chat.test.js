const { storage } = require('../config/database');
const { Chat, User, Group, UserChat } = require('../models/associations.model');

describe('Chat Service Tests', () => {
  let user1, user2, user3;
  let testGroup;

  beforeAll(async () => {
    await storage.sync({ force: true });
  });

  beforeEach(async () => {
    // Create test users
    user1 = await User.create({
      username: 'chatuser1',
      first_name: 'Chat',
      last_name: 'User1',
      email: 'chatuser1@example.com',
    });

    user2 = await User.create({
      username: 'chatuser2',
      first_name: 'Chat',
      last_name: 'User2',
      email: 'chatuser2@example.com',
    });

    user3 = await User.create({
      username: 'chatuser3',
      first_name: 'Chat',
      last_name: 'User3',
      email: 'chatuser3@example.com',
    });

    // Create a test group
    testGroup = await Group.create({
      name: 'Test Group',
      description: 'A test group for chat tests',
    });
  });

  afterEach(async () => {
    await UserChat.destroy({ where: {}, truncate: true, cascade: true });
    await Chat.destroy({ where: {}, truncate: true, cascade: true });
    await Group.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await storage.close();
  });

  describe('Chat Model', () => {
    test('should create a direct chat', async () => {
      const chat = await Chat.create({
        isGroup: false,
      });

      expect(chat.id).toBeDefined();
      expect(chat.isGroup).toBe(false);
      expect(chat.groupId).toBeFalsy(); // Can be null or undefined
    });

    test('should create a group chat', async () => {
      const chat = await Chat.create({
        isGroup: true,
        groupId: testGroup.id,
      });

      expect(chat.id).toBeDefined();
      expect(chat.isGroup).toBe(true);
      expect(chat.groupId).toBe(testGroup.id);
    });

    test('should generate UUID for chat ID', async () => {
      const chat = await Chat.create({ isGroup: false });
      expect(chat.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    test('should have timestamps', async () => {
      const chat = await Chat.create({ isGroup: false });
      expect(chat.createdAt).toBeDefined();
      expect(chat.updatedAt).toBeDefined();
    });

    test('should default isGroup to false', async () => {
      const chat = await Chat.create({});
      expect(chat.isGroup).toBe(false);
    });
  });

  describe('Chat Participants', () => {
    test('should add participants to a chat', async () => {
      const chat = await Chat.create({ isGroup: false });
      await chat.setParticipants([user1.id, user2.id]);

      const participants = await chat.getParticipants();
      expect(participants.length).toBe(2);
      expect(participants.map((p) => p.id)).toContain(user1.id);
      expect(participants.map((p) => p.id)).toContain(user2.id);
    });

    test('should add multiple participants to a group chat', async () => {
      const chat = await Chat.create({
        isGroup: true,
        groupId: testGroup.id,
      });
      await chat.setParticipants([user1.id, user2.id, user3.id]);

      const participants = await chat.getParticipants();
      expect(participants.length).toBe(3);
    });

    test('should remove participants from a chat', async () => {
      const chat = await Chat.create({ isGroup: false });
      await chat.setParticipants([user1.id, user2.id]);

      await chat.removeParticipant(user1.id);
      const participants = await chat.getParticipants();
      expect(participants.length).toBe(1);
      expect(participants[0].id).toBe(user2.id);
    });

    test('should replace all participants', async () => {
      const chat = await Chat.create({ isGroup: false });
      await chat.setParticipants([user1.id, user2.id]);
      await chat.setParticipants([user3.id]);

      const participants = await chat.getParticipants();
      expect(participants.length).toBe(1);
      expect(participants[0].id).toBe(user3.id);
    });
  });

  describe('Chat Query Operations', () => {
    test('should find chat by ID', async () => {
      const chat = await Chat.create({ isGroup: false });
      const foundChat = await Chat.findByPk(chat.id);

      expect(foundChat).toBeDefined();
      expect(foundChat.id).toBe(chat.id);
    });

    test('should get all chats', async () => {
      await Chat.create({ isGroup: false });
      await Chat.create({ isGroup: false });
      await Chat.create({ isGroup: true, groupId: testGroup.id });

      const allChats = await Chat.findAll();
      expect(allChats.length).toBe(3);
    });

    test('should filter chats by isGroup', async () => {
      await Chat.create({ isGroup: false });
      await Chat.create({ isGroup: true, groupId: testGroup.id });

      const directChats = await Chat.findAll({ where: { isGroup: false } });
      const groupChats = await Chat.findAll({ where: { isGroup: true } });

      expect(directChats.length).toBe(1);
      expect(groupChats.length).toBe(1);
    });

    test('should include participants in query', async () => {
      const chat = await Chat.create({ isGroup: false });
      await chat.setParticipants([user1.id, user2.id]);

      const chatWithParticipants = await Chat.findByPk(chat.id, {
        include: [{ model: User, as: 'participants' }],
      });

      expect(chatWithParticipants.participants).toBeDefined();
      expect(chatWithParticipants.participants.length).toBe(2);
    });

    test('should include group in query for group chats', async () => {
      const chat = await Chat.create({
        isGroup: true,
        groupId: testGroup.id,
      });

      const chatWithGroup = await Chat.findByPk(chat.id, {
        include: [{ model: Group, as: 'group' }],
      });

      expect(chatWithGroup.group).toBeDefined();
      expect(chatWithGroup.group.id).toBe(testGroup.id);
      expect(chatWithGroup.group.name).toBe('Test Group');
    });
  });

  describe('Chat Deletion', () => {
    test('should delete a chat', async () => {
      const chat = await Chat.create({ isGroup: false });
      await chat.destroy();

      const foundChat = await Chat.findByPk(chat.id);
      expect(foundChat).toBeNull();
    });

    test('should cascade delete UserChat entries when chat is deleted', async () => {
      const chat = await Chat.create({ isGroup: false });
      await chat.setParticipants([user1.id, user2.id]);

      const chatId = chat.id;
      await chat.destroy();

      const userChats = await UserChat.findAll({ where: { chatId } });
      expect(userChats.length).toBe(0);
    });
  });

  describe('Chat-Group Association', () => {
    test('should link chat to a group', async () => {
      const chat = await Chat.create({
        isGroup: true,
        groupId: testGroup.id,
      });

      const group = await chat.getGroup();
      expect(group).toBeDefined();
      expect(group.id).toBe(testGroup.id);
    });

    test('should cascade delete chat when group is deleted', async () => {
      const chat = await Chat.create({
        isGroup: true,
        groupId: testGroup.id,
      });

      const chatId = chat.id;
      // Force delete to trigger cascade (paranoid mode soft delete doesn't cascade in SQLite)
      await testGroup.destroy({ force: true });

      const foundChat = await Chat.findByPk(chatId);
      expect(foundChat).toBeNull();
    });

    test('should allow null groupId for direct chats', async () => {
      const chat = await Chat.create({
        isGroup: false,
        groupId: null,
      });

      expect(chat.groupId).toBeNull();
    });
  });

  describe('Chat Update Operations', () => {
    test('should update chat type from direct to group', async () => {
      const chat = await Chat.create({ isGroup: false });
      await chat.update({
        isGroup: true,
        groupId: testGroup.id,
      });

      expect(chat.isGroup).toBe(true);
      expect(chat.groupId).toBe(testGroup.id);
    });

    test('should update updatedAt timestamp on changes', async () => {
      const chat = await Chat.create({ isGroup: false });
      const originalUpdatedAt = chat.updatedAt;

      await new Promise((resolve) => setTimeout(resolve, 100));
      await chat.update({ isGroup: true });

      expect(chat.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
