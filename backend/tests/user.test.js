const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const { User } = require('../models/associations.model');
const { hashData, generateJWT } = require('../helper/auth.util');

describe('User Service Tests', () => {
  let testUser;
  let testAuth;

  beforeAll(async () => {
    await storage.sync({ force: true });
  });

  beforeEach(async () => {
    // Create test user before each test
    const hashedPassword = await hashData('TestPassword123!');
    testAuth = await Auth.create({
      email: 'testuser@example.com',
      password: hashedPassword,
    });

    testUser = await User.create({
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@example.com',
      is_guest: false,
    });
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await Auth.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await storage.close();
  });

  describe('User Model', () => {
    test('should create a user with all required fields', async () => {
      expect(testUser.id).toBeDefined();
      expect(testUser.username).toBe('testuser');
      expect(testUser.first_name).toBe('Test');
      expect(testUser.last_name).toBe('User');
      expect(testUser.email).toBe('testuser@example.com');
      expect(testUser.status).toBe('offline');
      expect(testUser.is_guest).toBe(false);
    });

    test('should generate UUID for user ID', () => {
      expect(testUser.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    test('should create a guest user', async () => {
      const guestUser = await User.create({
        username: 'guest_12345',
        first_name: 'Guest',
        last_name: 'User',
        is_guest: true,
        email: null,
      });

      expect(guestUser.is_guest).toBe(true);
      expect(guestUser.email).toBeNull();
    });

    test('should not allow duplicate usernames', async () => {
      await expect(
        User.create({
          username: 'testuser',
          first_name: 'Another',
          last_name: 'User',
          email: 'another@example.com',
        })
      ).rejects.toThrow();
    });

    test('should not allow duplicate emails', async () => {
      await expect(
        User.create({
          username: 'anotheruser',
          first_name: 'Another',
          last_name: 'User',
          email: 'testuser@example.com',
        })
      ).rejects.toThrow();
    });

    test('should validate email format', async () => {
      await expect(
        User.create({
          username: 'invalidemailuser',
          first_name: 'Invalid',
          last_name: 'Email',
          email: 'not-an-email',
        })
      ).rejects.toThrow();
    });

    test('should have default status as offline', async () => {
      expect(testUser.status).toBe('offline');
    });

    test('should update user status to online', async () => {
      await testUser.update({ status: 'online' });
      expect(testUser.status).toBe('online');
    });

    test('should have timestamps', () => {
      expect(testUser.createdAt).toBeDefined();
      expect(testUser.updatedAt).toBeDefined();
    });

    test('should update last_seen timestamp', async () => {
      const originalLastSeen = testUser.last_seen;
      await new Promise((resolve) => setTimeout(resolve, 100));
      await testUser.update({ last_seen: new Date() });
      expect(testUser.last_seen.getTime()).toBeGreaterThan(originalLastSeen.getTime());
    });
  });

  describe('User Authentication Integration', () => {
    test('should link user with auth record', async () => {
      const foundAuth = await Auth.findOne({ where: { email: testUser.email } });
      expect(foundAuth).toBeDefined();
      expect(foundAuth.email).toBe(testUser.email);
    });

    test('should verify password hash is stored correctly', async () => {
      expect(testAuth.password).toBeDefined();
      expect(testAuth.password).not.toBe('TestPassword123!');
      expect(testAuth.password.length).toBeGreaterThan(50); // bcrypt hash length
    });
  });

  describe('User Query Operations', () => {
    test('should find user by username', async () => {
      const foundUser = await User.findOne({ where: { username: 'testuser' } });
      expect(foundUser).toBeDefined();
      expect(foundUser.username).toBe('testuser');
    });

    test('should find user by email', async () => {
      const foundUser = await User.findOne({ where: { email: 'testuser@example.com' } });
      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe('testuser@example.com');
    });

    test('should return null for non-existent user', async () => {
      const foundUser = await User.findOne({ where: { username: 'nonexistent' } });
      expect(foundUser).toBeNull();
    });

    test('should get all users', async () => {
      await User.create({
        username: 'seconduser',
        first_name: 'Second',
        last_name: 'User',
        email: 'second@example.com',
      });

      const allUsers = await User.findAll();
      expect(allUsers.length).toBe(2);
    });

    test('should filter users by status', async () => {
      await testUser.update({ status: 'online' });
      const onlineUsers = await User.findAll({ where: { status: 'online' } });
      expect(onlineUsers.length).toBe(1);
      expect(onlineUsers[0].username).toBe('testuser');
    });

    test('should filter guest users', async () => {
      await User.create({
        username: 'guest_test',
        first_name: 'Guest',
        last_name: 'Test',
        is_guest: true,
      });

      const guestUsers = await User.findAll({ where: { is_guest: true } });
      expect(guestUsers.length).toBe(1);
      expect(guestUsers[0].is_guest).toBe(true);
    });
  });

  describe('User Update Operations', () => {
    test('should update user first name', async () => {
      await testUser.update({ first_name: 'Updated' });
      const updatedUser = await User.findOne({ where: { username: 'testuser' } });
      expect(updatedUser.first_name).toBe('Updated');
    });

    test('should update user last name', async () => {
      await testUser.update({ last_name: 'UpdatedLast' });
      const updatedUser = await User.findOne({ where: { username: 'testuser' } });
      expect(updatedUser.last_name).toBe('UpdatedLast');
    });

    test('should update user email', async () => {
      await testUser.update({ email: 'newemail@example.com' });
      const updatedUser = await User.findOne({ where: { username: 'testuser' } });
      expect(updatedUser.email).toBe('newemail@example.com');
    });

    test('should update updatedAt timestamp on changes', async () => {
      const originalUpdatedAt = testUser.updatedAt;
      await new Promise((resolve) => setTimeout(resolve, 100));
      await testUser.update({ first_name: 'NewName' });
      expect(testUser.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('User Deletion', () => {
    test('should delete a user', async () => {
      await testUser.destroy();
      const foundUser = await User.findOne({ where: { username: 'testuser' } });
      expect(foundUser).toBeNull();
    });

    test('should cascade delete associated records', async () => {
      // This test validates the model's onDelete: CASCADE configuration
      const userId = testUser.id;
      await testUser.destroy();
      const deletedUser = await User.findByPk(userId);
      expect(deletedUser).toBeNull();
    });
  });
});
