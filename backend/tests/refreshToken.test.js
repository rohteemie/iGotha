const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const { User } = require('../models/associations.model');
const {
  generateJWT,
  generateRefreshToken,
  verifyRefreshToken,
  hashData,
  compareHash,
} = require('../helper/auth.util');
const jwt = require('jsonwebtoken');

describe('Refresh Token Security', () => {
  beforeAll(async () => {
    await storage.sync({ force: true });
    
    // Set up environment variables for testing
    process.env.JWT_SECRET = 'test-secret-key-for-jwt-tokens';
    process.env.EXPIRE_IN = '1h';
    process.env.REFRESH_EXPIRE_IN = '7d';
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await Auth.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await storage.close();
  });

  describe('generateRefreshToken', () => {
    test('should generate a valid JWT refresh token', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const username = 'testuser';
      
      const refreshToken = generateRefreshToken(userId, username);
      
      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe('string');
      expect(refreshToken.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('should include user information and type in the token', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const username = 'testuser';
      
      const refreshToken = generateRefreshToken(userId, username);
      const decoded = jwt.decode(refreshToken);
      
      expect(decoded.sub).toBe(userId);
      expect(decoded.username).toBe(username);
      expect(decoded.type).toBe('refresh');
    });

    test('should have longer expiration than access token', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const username = 'testuser';
      
      const accessToken = generateJWT(userId, username);
      const refreshToken = generateRefreshToken(userId, username);
      
      const decodedAccess = jwt.decode(accessToken);
      const decodedRefresh = jwt.decode(refreshToken);
      
      // Refresh token should expire later than access token
      expect(decodedRefresh.exp).toBeGreaterThan(decodedAccess.exp);
    });
  });

  describe('verifyRefreshToken', () => {
    test('should verify a valid refresh token', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const username = 'testuser';
      
      const refreshToken = generateRefreshToken(userId, username);
      const decoded = verifyRefreshToken(refreshToken);
      
      expect(decoded.sub).toBe(userId);
      expect(decoded.username).toBe(username);
    });

    test('should reject an access token as refresh token', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const username = 'testuser';
      
      const accessToken = generateJWT(userId, username);
      
      expect(() => {
        verifyRefreshToken(accessToken);
      }).toThrow('Invalid token type');
    });

    test('should reject an invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        verifyRefreshToken(invalidToken);
      }).toThrow('Invalid refresh token');
    });

    test('should reject an expired token', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const username = 'testuser';
      
      // Create a token that expires immediately
      const expiredToken = jwt.sign(
        { sub: userId, username, type: 'refresh' },
        process.env.JWT_SECRET,
        { expiresIn: '0s', algorithm: 'HS256' }
      );
      
      // Wait a moment to ensure expiration
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(() => {
            verifyRefreshToken(expiredToken);
          }).toThrow('Refresh token expired');
          resolve();
        }, 100);
      });
    });

    test('should reject a token with missing type', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const username = 'testuser';
      
      // Create a token without the type field
      const tokenWithoutType = jwt.sign(
        { sub: userId, username },
        process.env.JWT_SECRET,
        { expiresIn: '7d', algorithm: 'HS256' }
      );
      
      expect(() => {
        verifyRefreshToken(tokenWithoutType);
      }).toThrow('Invalid token type');
    });
  });

  describe('Refresh Token Storage', () => {
    test('should store hashed refresh token in database', async () => {
      const email = 'test@example.com';
      const password = await hashData('TestPassword123!');
      const refreshToken = generateRefreshToken('user-id-123', 'testuser');
      const hashedRefreshToken = await hashData(refreshToken);
      
      await Auth.create({
        email,
        password,
        refresh_token: hashedRefreshToken,
      });
      
      const authRecord = await Auth.findOne({ where: { email } });
      
      expect(authRecord.refresh_token).toBeDefined();
      expect(authRecord.refresh_token).not.toBe(refreshToken); // Should be hashed
      expect(authRecord.refresh_token.length).toBeGreaterThan(50); // Bcrypt hash is long
    });

    test('should verify hashed refresh token matches original', async () => {
      const refreshToken = generateRefreshToken('user-id-123', 'testuser');
      const hashedRefreshToken = await hashData(refreshToken);
      
      const isMatch = await compareHash(refreshToken, hashedRefreshToken);
      
      expect(isMatch).toBe(true);
    });

    test('should reject mismatched refresh token', async () => {
      const refreshToken1 = generateRefreshToken('user-id-123', 'testuser1');
      const refreshToken2 = generateRefreshToken('user-id-456', 'testuser2');
      const hashedRefreshToken = await hashData(refreshToken1);
      
      const isMatch = await compareHash(refreshToken2, hashedRefreshToken);
      
      expect(isMatch).toBe(false);
    });
  });

  describe('Security Vulnerability Check', () => {
    test('should NOT accept plain UUID as refresh token', async () => {
      const { v4: uuidv4 } = require('uuid');
      const plainUuid = uuidv4();
      
      // This should throw an error as UUID is not a valid JWT
      expect(() => {
        verifyRefreshToken(plainUuid);
      }).toThrow('Invalid refresh token');
    });

    test('should require cryptographic verification', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const username = 'testuser';
      
      const refreshToken = generateRefreshToken(userId, username);
      
      // Token should be verifiable with the secret
      const decoded = verifyRefreshToken(refreshToken);
      expect(decoded).toBeDefined();
      
      // Token should NOT be just a UUID lookup
      expect(refreshToken).toContain('.'); // JWTs contain dots
      expect(refreshToken.length).toBeGreaterThan(50); // JWTs are longer than UUIDs
    });
  });
});
