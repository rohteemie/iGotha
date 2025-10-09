# Authentication Security Documentation

## Overview

This document provides a detailed explanation of the authentication and authorization mechanisms implemented in the iGotha application, with a focus on the security improvements made to the refresh token system.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [JWT Token Architecture](#jwt-token-architecture)
3. [Refresh Token Security](#refresh-token-security)
4. [Security Vulnerability Fixed](#security-vulnerability-fixed)
5. [Implementation Details](#implementation-details)
6. [API Endpoints](#api-endpoints)
7. [Best Practices](#best-practices)

## Authentication Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Client    │                                    │   Server    │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. POST /auth/login                            │
       │     { email, password }                         │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │                                         2. Verify credentials
       │                                         3. Generate tokens
       │                                         4. Hash refresh token
       │                                         5. Store hash in DB
       │                                                  │
       │  6. Return tokens                               │
       │     { accessToken, refreshToken, user }         │
       │<─────────────────────────────────────────────────┤
       │                                                  │
       │  7. Use accessToken for API calls               │
       │     Authorization: Bearer {accessToken}         │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │  8. When accessToken expires                    │
       │     POST /auth/refresh-token                    │
       │     { refreshToken }                            │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │                                         9. Verify JWT signature
       │                                         10. Check expiration
       │                                         11. Verify hash in DB
       │                                         12. Generate new accessToken
       │                                                  │
       │  13. Return new accessToken                     │
       │      { accessToken }                            │
       │<─────────────────────────────────────────────────┤
       │                                                  │
```

## JWT Token Architecture

### Access Token

**Purpose**: Short-lived token for API authentication

**Structure**:
```json
{
  "sub": "user-uuid",
  "username": "username",
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Expiration**: 1 hour (configurable via `EXPIRE_IN` env variable)

**Use Case**: Sent with every API request in the Authorization header

### Refresh Token

**Purpose**: Long-lived token for obtaining new access tokens

**Structure**:
```json
{
  "sub": "user-uuid",
  "username": "username",
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1234972690
}
```

**Expiration**: 7 days (configurable via `REFRESH_EXPIRE_IN` env variable)

**Use Case**: Used only at the `/auth/refresh-token` endpoint to obtain new access tokens

**Key Differences**:
- Includes `type: "refresh"` claim to prevent misuse
- Significantly longer expiration time
- Hashed before storage in database
- Only accepted at specific refresh endpoint

## Refresh Token Security

### Security Measures Implemented

1. **JWT-Based Tokens**
   - Refresh tokens are now JWTs signed with the server's secret key
   - Cryptographic verification prevents token forgery
   - Expiration is enforced at the JWT level

2. **Hashed Storage**
   - Refresh tokens are hashed using bcrypt before database storage
   - Even if the database is compromised, tokens cannot be used directly
   - Token verification requires both JWT signature check and hash comparison

3. **Type Validation**
   - Tokens include a `type` claim
   - Access tokens cannot be used as refresh tokens
   - Prevents token confusion attacks

4. **Proper Error Handling**
   - Expired tokens return specific error messages
   - Invalid tokens are properly rejected
   - Clear distinction between authentication and authorization errors

### Security Properties

| Property | Implementation | Benefit |
|----------|---------------|---------|
| **Confidentiality** | JWT encryption, hashed storage | Tokens cannot be forged or stolen from DB |
| **Integrity** | HMAC-SHA256 signature | Tokens cannot be modified |
| **Authenticity** | Secret key verification | Only server can generate valid tokens |
| **Non-repudiation** | User claims in token | Token ownership is verifiable |
| **Expiration** | JWT exp claim | Tokens have limited lifetime |

## Security Vulnerability Fixed

### Previous Implementation (INSECURE) ❌

```javascript
// Login endpoint
const refreshToken = uuidv4(); // Plain UUID
await Auth.update(
    { refresh_token: refreshToken }, // Stored as-is
    { where: { email } }
);

// Refresh endpoint
const authRecord = await Auth.findOne({ 
    where: { refresh_token: refreshToken } // Simple DB lookup
});
```

**Vulnerability**: Anyone with a valid UUID could obtain access tokens. No cryptographic verification.

### New Implementation (SECURE) ✅

```javascript
// Login endpoint
const refreshToken = generateRefreshToken(userId, username); // JWT
const hashedRefreshToken = await hashData(refreshToken); // Hash it
await Auth.update(
    { refresh_token: hashedRefreshToken }, // Store hash
    { where: { email } }
);

// Refresh endpoint
const decoded = verifyRefreshToken(refreshToken); // Verify JWT
const userRecord = await User.findOne({ where: { id: decoded.sub } });
const authRecord = await Auth.findOne({ where: { email: userRecord.email } });
const isValidToken = await compareHash(refreshToken, authRecord.refresh_token); // Verify hash
```

**Security**: Requires valid JWT with correct signature + hash verification. Multiple layers of protection.

## Implementation Details

### Environment Variables

Required environment variables:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-key-here-min-32-chars
EXPIRE_IN=1h                    # Access token expiration
REFRESH_EXPIRE_IN=7d            # Refresh token expiration
```

### Helper Functions

#### `generateRefreshToken(sub, username)`
Generates a JWT refresh token with extended expiration.

**Parameters**:
- `sub` (string): User ID
- `username` (string): Username

**Returns**: JWT string

**Example**:
```javascript
const refreshToken = generateRefreshToken('user-123', 'johndoe');
// Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### `verifyRefreshToken(token)`
Verifies a refresh token's authenticity and validity.

**Parameters**:
- `token` (string): Refresh token to verify

**Returns**: Object with `{ sub, username }`

**Throws**:
- `'Refresh token expired'` if token is expired
- `'Invalid token type'` if not a refresh token
- `'Invalid refresh token'` for other errors

**Example**:
```javascript
try {
    const decoded = verifyRefreshToken(token);
    console.log(decoded); // { sub: 'user-123', username: 'johndoe' }
} catch (error) {
    console.error(error.message);
}
```

### Database Schema

The `auths` table stores hashed refresh tokens:

```sql
CREATE TABLE auths (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    refresh_token TEXT,              -- Stores bcrypt hash of JWT
    failed_login_count INT DEFAULT 0,
    account_locked BOOLEAN DEFAULT FALSE,
    account_locked_date DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);
```

## API Endpoints

### POST /auth/login

Authenticates user and returns access and refresh tokens.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK)**:
```json
{
  "user": {
    "id": "uuid",
    "first_name": "John",
    "username": "johndoe",
    "email": "user@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Responses**:
- `400`: Missing email or password
- `401`: Invalid credentials
- `403`: Account locked
- `500`: Server error

### POST /auth/refresh-token

Obtains a new access token using a valid refresh token.

**Request**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Responses**:
- `401`: Missing or expired refresh token
- `403`: Invalid refresh token
- `500`: Server error

## Best Practices

### For Developers

1. **Never log tokens**: Tokens are sensitive and should never be logged
2. **Use HTTPS**: Always transmit tokens over encrypted connections
3. **Rotate secrets**: Regularly update the JWT_SECRET in production
4. **Monitor token usage**: Track suspicious refresh token activity
5. **Implement token revocation**: Add blacklist for compromised tokens

### For Users

1. **Store tokens securely**: Use httpOnly cookies or secure storage
2. **Never share tokens**: Tokens grant access to your account
3. **Log out properly**: Clear tokens when logging out
4. **Report suspicious activity**: Contact support if tokens are compromised

### Token Storage Recommendations

| Storage Method | Security | Recommended |
|---------------|----------|-------------|
| localStorage | ❌ Vulnerable to XSS | No |
| sessionStorage | ⚠️ Some XSS protection | Acceptable |
| httpOnly Cookie | ✅ Best protection | **Yes** |
| Memory only | ✅ Secure but not persistent | For sensitive apps |

### Security Checklist

- [x] Refresh tokens are JWTs with signatures
- [x] Refresh tokens are hashed before storage
- [x] Tokens have expiration times
- [x] Token type is validated
- [x] Proper error messages (not leaking info)
- [x] Environment variables for secrets
- [x] Comprehensive test coverage
- [ ] Rate limiting on refresh endpoint (TODO)
- [ ] Token revocation mechanism (TODO)
- [ ] Refresh token rotation (TODO)

## Testing

### Running Tests

```bash
cd backend
npm test -- refreshToken.test.js
```

### Test Coverage

The test suite covers:
- ✅ Token generation
- ✅ Token verification
- ✅ Token expiration
- ✅ Type validation
- ✅ Hash storage and verification
- ✅ Security vulnerability prevention
- ✅ Error handling

### Example Test

```javascript
test('should NOT accept plain UUID as refresh token', () => {
  const plainUuid = uuidv4();
  
  expect(() => {
    verifyRefreshToken(plainUuid);
  }).toThrow('Invalid refresh token');
});
```

## Migration Guide

If you're upgrading from the old UUID-based refresh tokens:

1. **Database**: No schema changes needed (TEXT field supports both)
2. **Code**: Changes are backward compatible
3. **Tokens**: Old tokens will be invalidated (users need to re-login)
4. **Environment**: Add `REFRESH_EXPIRE_IN` variable (optional)

### Migration Steps

1. Deploy the new code
2. Users with old UUID tokens will get "Invalid refresh token" error
3. Users log in again to get new JWT-based tokens
4. (Optional) Clear old refresh_token values from database

## Troubleshooting

### "Invalid refresh token" Error

**Possible causes**:
- Token has expired
- Token signature is invalid
- Token is not a refresh token (access token used instead)
- Token doesn't match database hash

**Solution**: User should log in again

### "Refresh token expired" Error

**Cause**: Token has exceeded its expiration time (7 days by default)

**Solution**: User must log in again to get new tokens

### "Token not provided" Error

**Cause**: Request missing refreshToken in body

**Solution**: Include refreshToken in POST request body

## Security Considerations

### Threat Model

| Threat | Mitigation |
|--------|------------|
| Token theft | HTTPS, secure storage, hashing |
| Token forgery | JWT signatures, secret key |
| Token replay | Expiration, single-use (future) |
| Database breach | Hashed storage |
| Brute force | Account locking, rate limiting |
| XSS attacks | httpOnly cookies |
| CSRF attacks | CSRF tokens, SameSite cookies |

### Future Enhancements

1. **Refresh Token Rotation**: Issue new refresh token on each use
2. **Token Revocation**: Blacklist for compromised tokens
3. **Device Tracking**: Link tokens to specific devices
4. **Anomaly Detection**: Detect suspicious token usage patterns
5. **Multi-factor Authentication**: Additional layer for refresh tokens

## References

- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Current Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

**Last Updated**: 2024
**Author**: iGotha Development Team
**Version**: 2.0.0
