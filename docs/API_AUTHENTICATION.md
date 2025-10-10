# API Authentication Guide

## Overview

This guide explains how to authenticate with the iGotha API using JWT tokens and refresh tokens.

## Quick Start

### 1. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "YourPassword123!"
  }'
```

**Response**:
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "first_name": "John",
    "username": "johndoe",
    "email": "user@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJ1c2VybmFtZSI6ImpvaG5kb2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJ1c2VybmFtZSI6ImpvaG5kb2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2ODQzODIyfQ.4pcPyMD09olPSyXnrXCjTwXyr4BsezdI1AVTmud2fU4"
}
```

### 2. Use Access Token

```bash
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Refresh When Expired

```bash
curl -X POST http://localhost:3000/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.NEW_TOKEN_HERE..."
}
```

## Token Types

### Access Token

- **Purpose**: Authenticate API requests
- **Lifetime**: 1 hour
- **Usage**: Include in Authorization header
- **Format**: `Bearer {accessToken}`

### Refresh Token

- **Purpose**: Obtain new access tokens
- **Lifetime**: 7 days
- **Usage**: Send to `/auth/refresh-token` endpoint
- **Format**: JWT string (do not modify)

## Authentication Flow

```
┌─────────┐                           ┌─────────┐
│ Client  │                           │  Server │
└────┬────┘                           └────┬────┘
     │                                     │
     │ 1. POST /auth/login                 │
     │    {email, password}                │
     ├────────────────────────────────────>│
     │                                     │
     │ 2. {accessToken, refreshToken}      │
     │<────────────────────────────────────┤
     │                                     │
     │ 3. GET /api/resource                │
     │    Authorization: Bearer {access}   │
     ├────────────────────────────────────>│
     │                                     │
     │ 4. {data}                           │
     │<────────────────────────────────────┤
     │                                     │
     │ ... access token expires ...        │
     │                                     │
     │ 5. GET /api/resource                │
     │    Authorization: Bearer {expired}  │
     ├────────────────────────────────────>│
     │                                     │
     │ 6. 401 Token expired                │
     │<────────────────────────────────────┤
     │                                     │
     │ 7. POST /auth/refresh-token         │
     │    {refreshToken}                   │
     ├────────────────────────────────────>│
     │                                     │
     │ 8. {accessToken: new}               │
     │<────────────────────────────────────┤
     │                                     │
     │ 9. GET /api/resource                │
     │    Authorization: Bearer {new}      │
     ├────────────────────────────────────>│
     │                                     │
     │ 10. {data}                          │
     │<────────────────────────────────────┤
     │                                     │
```

## API Endpoints

### POST /auth/login

Authenticate user and receive tokens.

**Request**:
```http
POST /auth/login HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK)**:
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

**400 Bad Request** - Missing credentials:
```json
{
  "message": "Email and password are required!"
}
```

**401 Unauthorized** - Invalid credentials:
```json
{
  "message": "Invalid email or password!"
}
```

**403 Forbidden** - Account locked:
```json
{
  "message": "Account is locked. Please try again later."
}
```

### POST /auth/refresh-token

Obtain a new access token using a refresh token.

**Request**:
```http
POST /auth/refresh-token HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Responses**:

**401 Unauthorized** - Missing token:
```json
{
  "message": "Refresh token is required"
}
```

**401 Unauthorized** - Expired token:
```json
{
  "message": "Refresh token expired, please log in again"
}
```

**403 Forbidden** - Invalid token:
```json
{
  "message": "Invalid refresh token"
}
```

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

class AuthClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.accessToken = null;
    this.refreshToken = null;
  }

  async login(email, password) {
    const response = await axios.post(`${this.baseURL}/auth/login`, {
      email,
      password
    });
    
    this.accessToken = response.data.accessToken;
    this.refreshToken = response.data.refreshToken;
    
    return response.data;
  }

  async refreshAccessToken() {
    const response = await axios.post(`${this.baseURL}/auth/refresh-token`, {
      refreshToken: this.refreshToken
    });
    
    this.accessToken = response.data.accessToken;
    
    return response.data.accessToken;
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const response = await axios({
        url: `${this.baseURL}${endpoint}`,
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired, refresh and retry
        await this.refreshAccessToken();
        
        const response = await axios({
          url: `${this.baseURL}${endpoint}`,
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
        
        return response.data;
      }
      
      throw error;
    }
  }
}

// Usage
const client = new AuthClient('http://localhost:3000');
await client.login('user@example.com', 'password123');
const userData = await client.makeRequest('/user/profile');
```

### Python

```python
import requests
import json

class AuthClient:
    def __init__(self, base_url):
        self.base_url = base_url
        self.access_token = None
        self.refresh_token = None
    
    def login(self, email, password):
        response = requests.post(
            f'{self.base_url}/auth/login',
            json={'email': email, 'password': password}
        )
        response.raise_for_status()
        
        data = response.json()
        self.access_token = data['accessToken']
        self.refresh_token = data['refreshToken']
        
        return data
    
    def refresh_access_token(self):
        response = requests.post(
            f'{self.base_url}/auth/refresh-token',
            json={'refreshToken': self.refresh_token}
        )
        response.raise_for_status()
        
        data = response.json()
        self.access_token = data['accessToken']
        
        return self.access_token
    
    def make_request(self, endpoint, method='GET', **kwargs):
        headers = kwargs.get('headers', {})
        headers['Authorization'] = f'Bearer {self.access_token}'
        kwargs['headers'] = headers
        
        response = requests.request(method, f'{self.base_url}{endpoint}', **kwargs)
        
        if response.status_code == 401:
            # Token expired, refresh and retry
            self.refresh_access_token()
            headers['Authorization'] = f'Bearer {self.access_token}'
            response = requests.request(method, f'{self.base_url}{endpoint}', **kwargs)
        
        response.raise_for_status()
        return response.json()

# Usage
client = AuthClient('http://localhost:3000')
client.login('user@example.com', 'password123')
user_data = client.make_request('/user/profile')
```

### cURL

```bash
#!/bin/bash

# Login
response=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }')

# Extract tokens
accessToken=$(echo $response | jq -r '.accessToken')
refreshToken=$(echo $response | jq -r '.refreshToken')

# Make authenticated request
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer $accessToken"

# Refresh token when needed
newAccessToken=$(curl -s -X POST http://localhost:3000/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$refreshToken\"}" \
  | jq -r '.accessToken')
```

## Security Best Practices

### DO ✅

1. **Store tokens securely**
   - Use httpOnly cookies for web apps
   - Use secure storage on mobile (Keychain/Keystore)
   - Never store in localStorage (XSS vulnerable)

2. **Use HTTPS**
   - Always transmit tokens over encrypted connections
   - Prevents token interception

3. **Handle token expiration**
   - Implement automatic token refresh
   - Gracefully handle expired tokens
   - Re-authenticate when refresh token expires

4. **Clear tokens on logout**
   - Remove from storage
   - Clear from memory
   - Revoke on server (if implemented)

### DON'T ❌

1. **Don't log tokens**
   - Never log access or refresh tokens
   - Sanitize logs to remove sensitive data

2. **Don't share tokens**
   - Tokens are personal credentials
   - Never share via email, chat, etc.

3. **Don't put tokens in URLs**
   - URLs are logged and cached
   - Use headers or body instead

4. **Don't ignore security errors**
   - Always validate SSL certificates
   - Handle authentication errors properly

## Token Storage

### Recommended: httpOnly Cookies (Web)

```javascript
// Server-side (Express)
app.post('/auth/login', async (req, res) => {
  // ... authentication ...
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 604800000 // 7 days
  });
  
  res.json({ user });
});
```

### Alternative: Secure Storage (Mobile)

```javascript
// React Native with react-native-keychain
import * as Keychain from 'react-native-keychain';

async function saveTokens(accessToken, refreshToken) {
  await Keychain.setGenericPassword(
    'auth_tokens',
    JSON.stringify({ accessToken, refreshToken }),
    {
      service: 'com.yourapp.auth',
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED
    }
  );
}

async function getTokens() {
  const credentials = await Keychain.getGenericPassword({
    service: 'com.yourapp.auth'
  });
  
  if (credentials) {
    return JSON.parse(credentials.password);
  }
  
  return null;
}
```

## Troubleshooting

### "Token expired" errors

**Problem**: Access token has expired  
**Solution**: Use refresh token to get new access token

```javascript
if (error.response?.status === 401 && error.response?.data?.message?.includes('expired')) {
  const newAccessToken = await refreshAccessToken();
  // Retry request with new token
}
```

### "Invalid refresh token" errors

**Problem**: Refresh token is invalid or expired  
**Solution**: User must log in again

```javascript
if (error.response?.status === 403 && error.response?.data?.message === 'Invalid refresh token') {
  // Clear stored tokens
  clearTokens();
  // Redirect to login
  redirectToLogin();
}
```

### "Token not provided" errors

**Problem**: Authorization header missing  
**Solution**: Ensure token is included in request

```javascript
// Correct
axios.get('/api/resource', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// Incorrect - missing Authorization header
axios.get('/api/resource');
```

## Rate Limiting

The refresh token endpoint may have rate limiting to prevent abuse:

- **Limit**: 10 requests per minute per IP
- **Response**: 429 Too Many Requests

```json
{
  "message": "Too many requests, please try again later"
}
```

## Support

For issues or questions:
- Check the [Authentication Security Guide](./AUTHENTICATION_SECURITY.md)
- Review the [Security Incident Report](./SECURITY_INCIDENT_REPORT.md)
- Contact support: support@example.com

---

**Last Updated**: 2024  
**Version**: 2.0.0
