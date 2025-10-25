const { storage } = require('../config/database');
const { Message, Chat, User, Group } = require('../models/associations.model');

describe('Message Service Tests', () => {
  let testUser1, testUser2;
  let testChat, testGroupChat, testGroup;

  beforeAll(async () => {
    await storage.sync({ force: true });
  });

  beforeEach(async () => {
    // Create test users
    testUser1 = await User.create({
      username: 'msguser1',
      first_name: 'Message',
      last_name: 'User1',
      email: 'msguser1@example.com',
    });

    testUser2 = await User.create({
      username: 'msguser2',
      first_name: 'Message',
      last_name: 'User2',
      email: 'msguser2@example.com',
    });

    // Create a direct chat
    testChat = await Chat.create({ isGroup: false });
    await testChat.setParticipants([testUser1.id, testUser2.id]);

    // Create a group and group chat
    testGroup = await Group.create({
      name: 'Test Message Group',
      createdBy: testUser1.id,
    });

    testGroupChat = await Chat.create({
      isGroup: true,
      groupId: testGroup.id,
    });
  });

  afterEach(async () => {
    await Message.destroy({ where: {}, truncate: true, cascade: true });
    await Chat.destroy({ where: {}, truncate: true, cascade: true });
    await Group.destroy({ where: {}, truncate: true, cascade: true, force: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await storage.close();
  });

  describe('Message Model', () => {
    test('should create a message with required fields', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Hello, this is a test message!',
      });

      expect(message.id).toBeDefined();
      expect(message.chatId).toBe(testChat.id);
      expect(message.senderId).toBe(testUser1.id);
      expect(message.content).toBe('Hello, this is a test message!');
      expect(message.readReceipt).toBe(false);
    });

    test('should generate UUID for message ID', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'UUID test message',
      });

      expect(message.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    test('should have timestamps', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Timestamp test',
      });

      expect(message.createdAt).toBeDefined();
      expect(message.updatedAt).toBeDefined();
    });

    test('should default readReceipt to false', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Read receipt test',
      });

      expect(message.readReceipt).toBe(false);
    });

    test('should not create message without content', async () => {
      await expect(
        Message.create({
          chatId: testChat.id,
          senderId: testUser1.id,
        })
      ).rejects.toThrow();
    });

    test('should support long text content', async () => {
      const longContent = 'A'.repeat(5000);
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: longContent,
      });

      expect(message.content).toBe(longContent);
      expect(message.content.length).toBe(5000);
    });
  });

  describe('Message-Chat Association', () => {
    test('should link message to a chat', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Chat association test',
      });

      const chat = await message.getChat();
      expect(chat).toBeDefined();
      expect(chat.id).toBe(testChat.id);
    });

    test('should cascade delete messages when chat is deleted', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Cascade delete test',
      });

      const messageId = message.id;
      await testChat.destroy();

      const foundMessage = await Message.findByPk(messageId);
      expect(foundMessage).toBeNull();
    });
  });

  describe('Message-User Association', () => {
    test('should link message to sender', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Sender association test',
      });

      const sender = await message.getSender();
      expect(sender).toBeDefined();
      expect(sender.id).toBe(testUser1.id);
      expect(sender.username).toBe('msguser1');
    });

    test('should include sender details in query', async () => {
      await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Include sender test',
      });

      const messages = await Message.findAll({
        where: { chatId: testChat.id },
        include: [{ model: User, as: 'sender' }],
      });

      expect(messages[0].sender).toBeDefined();
      expect(messages[0].sender.username).toBe('msguser1');
    });
  });

  describe('Message Query Operations', () => {
    test('should find message by ID', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Find by ID test',
      });

      const foundMessage = await Message.findByPk(message.id);
      expect(foundMessage).toBeDefined();
      expect(foundMessage.content).toBe('Find by ID test');
    });

    test('should get all messages in a chat', async () => {
      await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Message 1',
      });

      await Message.create({
        chatId: testChat.id,
        senderId: testUser2.id,
        content: 'Message 2',
      });

      const messages = await Message.findAll({ where: { chatId: testChat.id } });
      expect(messages.length).toBe(2);
    });

    test('should filter messages by sender', async () => {
      await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'From user 1',
      });

      await Message.create({
        chatId: testChat.id,
        senderId: testUser2.id,
        content: 'From user 2',
      });

      const user1Messages = await Message.findAll({
        where: { senderId: testUser1.id },
      });

      expect(user1Messages.length).toBe(1);
      expect(user1Messages[0].content).toBe('From user 1');
    });

    test('should order messages by creation time', async () => {
      const msg1 = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'First message',
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      const msg2 = await Message.create({
        chatId: testChat.id,
        senderId: testUser2.id,
        content: 'Second message',
      });

      const messages = await Message.findAll({
        where: { chatId: testChat.id },
        order: [['createdAt', 'ASC']],
      });

      expect(messages[0].id).toBe(msg1.id);
      expect(messages[1].id).toBe(msg2.id);
    });

    test('should filter unread messages', async () => {
      await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Unread message',
        readReceipt: false,
      });

      await Message.create({
        chatId: testChat.id,
        senderId: testUser2.id,
        content: 'Read message',
        readReceipt: true,
      });

      const unreadMessages = await Message.findAll({
        where: { readReceipt: false },
      });

      expect(unreadMessages.length).toBe(1);
      expect(unreadMessages[0].content).toBe('Unread message');
    });
  });

  describe('Message Update Operations', () => {
    test('should update message content', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Original content',
      });

      await message.update({ content: 'Updated content' });

      const updatedMessage = await Message.findByPk(message.id);
      expect(updatedMessage.content).toBe('Updated content');
    });

    test('should mark message as read', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Mark as read test',
      });

      expect(message.readReceipt).toBe(false);

      await message.update({ readReceipt: true });

      expect(message.readReceipt).toBe(true);
    });

    test('should update updatedAt timestamp on changes', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Timestamp update test',
      });

      const originalUpdatedAt = message.updatedAt;
      await new Promise((resolve) => setTimeout(resolve, 100));
      await message.update({ readReceipt: true });

      expect(message.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Message Deletion', () => {
    test('should delete a message', async () => {
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Delete test',
      });

      const messageId = message.id;
      await message.destroy();

      const foundMessage = await Message.findByPk(messageId);
      expect(foundMessage).toBeNull();
    });

    test('should delete all messages in a chat', async () => {
      await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: 'Message 1',
      });

      await Message.create({
        chatId: testChat.id,
        senderId: testUser2.id,
        content: 'Message 2',
      });

      await Message.destroy({ where: { chatId: testChat.id } });

      const messages = await Message.findAll({ where: { chatId: testChat.id } });
      expect(messages.length).toBe(0);
    });
  });

  describe('Group Chat Messages', () => {
    test('should create message in group chat', async () => {
      const message = await Message.create({
        chatId: testGroupChat.id,
        senderId: testUser1.id,
        content: 'Group chat message',
      });

      expect(message.chatId).toBe(testGroupChat.id);
      expect(message.content).toBe('Group chat message');
    });

    test('should retrieve group chat messages', async () => {
      await Message.create({
        chatId: testGroupChat.id,
        senderId: testUser1.id,
        content: 'Group message 1',
      });

      await Message.create({
        chatId: testGroupChat.id,
        senderId: testUser2.id,
        content: 'Group message 2',
      });

      const messages = await Message.findAll({
        where: { chatId: testGroupChat.id },
      });

      expect(messages.length).toBe(2);
    });
  });

  describe('Message Validation', () => {
    test('should support special characters in content', async () => {
      const specialContent = 'Hello! @user #hashtag $money & more...';
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: specialContent,
      });

      expect(message.content).toBe(specialContent);
    });

    test('should support emoji in content', async () => {
      const emojiContent = 'Hello 👋 World 🌍!';
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: emojiContent,
      });

      expect(message.content).toBe(emojiContent);
    });

    test('should support multiline content', async () => {
      const multilineContent = 'Line 1\nLine 2\nLine 3';
      const message = await Message.create({
        chatId: testChat.id,
        senderId: testUser1.id,
        content: multilineContent,
      });

      expect(message.content).toBe(multilineContent);
    });
  });
});
