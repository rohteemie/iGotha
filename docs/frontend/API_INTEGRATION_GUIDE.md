# API Integration Guide for Frontend

This document provides comprehensive information about integrating with the iGotha backend API in your React Native application.

## Table of Contents
- [Base Configuration](#base-configuration)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [WebSocket Integration](#websocket-integration)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Base Configuration

### API Base URL
```javascript
const API_BASE_URL = process.env.API_ENDPOINT || 'http://localhost:3000';
```

### Axios Setup
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token expired, logout user
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        // Navigate to login screen
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## Authentication

### 1. Login
**Endpoint:** `POST /auth/login`

**Request:**
```javascript
const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    
    const { user, accessToken, refreshToken } = response.data;
    
    // Store tokens
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
      ['user', JSON.stringify(user)],
    ]);
    
    return { success: true, user };
  } catch (error) {
    if (error.response?.status === 401) {
      return { success: false, message: 'Invalid email or password' };
    }
    if (error.response?.status === 403) {
      return { success: false, message: 'Account is locked. Please try again later.' };
    }
    return { success: false, message: 'An error occurred. Please try again.' };
  }
};
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "uuid-v4-token"
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid credentials
- `403`: Account locked (5 failed login attempts)

---

### 2. Refresh Access Token
**Endpoint:** `POST /auth/refresh-token`

**Request:**
```javascript
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await apiClient.post('/auth/refresh-token', {
      refreshToken,
    });
    
    const { accessToken } = response.data;
    await AsyncStorage.setItem('accessToken', accessToken);
    
    return { success: true, accessToken };
  } catch (error) {
    return { success: false };
  }
};
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## API Endpoints

### User Management

#### 1. Register User
**Endpoint:** `POST /user/create`

**Request:**
```javascript
const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/user/create', {
      first_name: userData.firstName,
      last_name: userData.lastName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });
    
    return { success: true, message: response.data.message };
  } catch (error) {
    if (error.response?.status === 403) {
      return { success: false, message: 'User already exists' };
    }
    return { success: false, message: 'Registration failed' };
  }
};
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Guest User (No credentials):**
```javascript
const createGuestUser = async () => {
  const response = await apiClient.post('/user/create', {});
  return response.data;
};
```

---

#### 2. Get All Users
**Endpoint:** `GET /user`

**Request:**
```javascript
const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/user');
    return { success: true, users: response.data };
  } catch (error) {
    return { success: false, message: 'Failed to fetch users' };
  }
};
```

**Response:**
```json
[
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "last_seen": "2025-10-09T23:00:00.000Z",
    "createdAt": "2025-10-01T10:00:00.000Z"
  }
]
```

---

#### 3. Get User by Username
**Endpoint:** `GET /user/:username`  
**Authentication Required:** Yes

**Request:**
```javascript
const getUserByUsername = async (username) => {
  try {
    const response = await apiClient.get(`/user/${username}`);
    return { success: true, user: response.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: 'User not found' };
    }
    return { success: false, message: 'Failed to fetch user' };
  }
};
```

**Response:**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "auth": {
    "email": "john@example.com",
    "failed_login_count": 0,
    "account_locked": false
  }
}
```

---

#### 4. Update User
**Endpoint:** `PUT /user/:username`  
**Authentication Required:** Yes

**Request:**
```javascript
const updateUser = async (username, updates) => {
  try {
    const response = await apiClient.put(`/user/${username}`, updates);
    return { success: true, message: response.data.message };
  } catch (error) {
    if (error.response?.status === 401) {
      return { success: false, message: 'Unauthorized' };
    }
    return { success: false, message: 'Update failed' };
  }
};
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "newemail@example.com",
  "username": "john_doe"
}
```

---

### Chat Management

#### 1. Get All Chats
**Endpoint:** `GET /chat/`

**Request:**
```javascript
const getAllChats = async () => {
  try {
    const response = await apiClient.get('/chat/');
    return { success: true, chats: response.data };
  } catch (error) {
    return { success: false, message: 'Failed to fetch chats' };
  }
};
```

**Response:**
```json
[
  {
    "id": 1,
    "isGroup": false,
    "groupId": null,
    "participants": [
      {
        "id": 1,
        "username": "john_doe"
      },
      {
        "id": 2,
        "username": "jane_doe"
      }
    ],
    "group": null
  }
]
```

---

#### 2. Create Chat
**Endpoint:** `POST /chat/create`

**Request:**
```javascript
const createChat = async (isGroup, userIds, groupId = null) => {
  try {
    const response = await apiClient.post('/chat/create', {
      isGroup,
      userIds,
      groupId,
    });
    
    return { success: true, chat: response.data };
  } catch (error) {
    if (error.response?.status === 400) {
      return { success: false, message: 'At least two users required' };
    }
    return { success: false, message: 'Failed to create chat' };
  }
};
```

**Request Body:**
```json
{
  "isGroup": false,
  "userIds": [1, 2],
  "groupId": null
}
```

---

#### 3. Get Chat Details
**Endpoint:** `GET /chat/:chatId`

**Request:**
```javascript
const getChatDetails = async (chatId) => {
  try {
    const response = await apiClient.get(`/chat/${chatId}`);
    return { success: true, chat: response.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: 'Chat not found' };
    }
    return { success: false, message: 'Failed to fetch chat details' };
  }
};
```

---

### Message Management

#### 1. Send Message
**Endpoint:** `POST /message/send`

**Request:**
```javascript
const sendMessage = async (recipientId, groupId, senderId, content) => {
  try {
    const response = await apiClient.post('/message/send', {
      recipientId,
      groupId,
      senderId,
      content,
    });
    
    return { success: true, message: response.data.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: 'Recipient or group not found' };
    }
    return { success: false, message: 'Failed to send message' };
  }
};
```

**Request Body (Direct Message):**
```json
{
  "recipientId": 2,
  "senderId": 1,
  "content": "Hello, how are you?"
}
```

**Request Body (Group Message):**
```json
{
  "groupId": 1,
  "senderId": 1,
  "content": "Hello everyone!"
}
```

---

#### 2. Get Messages
**Endpoint:** `GET /message/:chatId/messages`

**Request:**
```javascript
const getMessages = async (chatId) => {
  try {
    const response = await apiClient.get(`/message/${chatId}/messages`);
    return { success: true, messages: response.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: 'Chat not found' };
    }
    return { success: false, message: 'Failed to fetch messages' };
  }
};
```

**Response:**
```json
[
  {
    "id": 1,
    "chatId": 1,
    "senderId": 1,
    "content": "Hello!",
    "createdAt": "2025-10-09T23:00:00.000Z",
    "sender": {
      "id": 1,
      "username": "john_doe"
    }
  }
]
```

---

### Group Management

#### 1. Create Group
**Endpoint:** `POST /group/create`

**Request:**
```javascript
const createGroup = async (groupName, description, createdBy, members) => {
  try {
    const response = await apiClient.post('/group/create', {
      groupName,
      description,
      createdBy,
      members,
    });
    
    return { success: true, group: response.data };
  } catch (error) {
    return { success: false, message: 'Failed to create group' };
  }
};
```

**Request Body:**
```json
{
  "groupName": "Development Team",
  "description": "Team discussion group",
  "createdBy": 1,
  "members": [1, 2, 3]
}
```

---

#### 2. Get Group Details
**Endpoint:** `GET /group/:groupId`

**Request:**
```javascript
const getGroupDetails = async (groupId) => {
  try {
    const response = await apiClient.get(`/group/${groupId}`);
    return { success: true, group: response.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: 'Group not found' };
    }
    return { success: false, message: 'Failed to fetch group' };
  }
};
```

---

#### 3. Send Group Message
**Endpoint:** `POST /group/:groupId`

**Request:**
```javascript
const sendGroupMessage = async (groupId, senderId, content) => {
  try {
    const response = await apiClient.post(`/group/${groupId}`, {
      senderId,
      content,
    });
    
    return { success: true, message: response.data.data };
  } catch (error) {
    return { success: false, message: 'Failed to send message' };
  }
};
```

---

#### 4. Add User to Group
**Endpoint:** `POST /group/add`

**Request:**
```javascript
const addUserToGroup = async (groupId, userId) => {
  try {
    const response = await apiClient.post('/group/add', {
      groupId,
      userId,
    });
    
    return { success: true, message: response.data.message };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: 'Group or user not found' };
    }
    return { success: false, message: 'Failed to add user' };
  }
};
```

---

## WebSocket Integration

### Socket.IO Setup

```javascript
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket = null;

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  
  socket = io(API_BASE_URL, {
    auth: {
      token,
    },
    transports: ['websocket'],
  });
  
  socket.on('connect', () => {
    console.log('Connected to WebSocket');
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket');
  });
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
```

### WebSocket Events

#### Listen for Private Messages
```javascript
socket.on('privateMessage', (data) => {
  console.log('New private message:', data);
  // Update Redux store or local state
  // Show notification
  // Update chat list
});
```

#### Listen for Group Messages
```javascript
socket.on('groupMessage', (data) => {
  console.log('New group message:', data);
  // Update Redux store or local state
});
```

#### Send Private Message (WebSocket)
```javascript
socket.emit('privateMessage', {
  recipientId: 2,
  content: 'Hello via WebSocket!',
});
```

#### User Online/Offline Status
```javascript
socket.on('userOnline', (userId) => {
  console.log(`User ${userId} is online`);
  // Update user status in UI
});

socket.on('userOffline', (userId) => {
  console.log(`User ${userId} is offline`);
  // Update user status in UI
});
```

#### Typing Indicator
```javascript
// Emit typing event
socket.emit('typing', {
  chatId: 1,
  isTyping: true,
});

// Listen for typing events
socket.on('userTyping', (data) => {
  console.log(`User ${data.userId} is typing in chat ${data.chatId}`);
});
```

---

## Error Handling

### Common HTTP Status Codes

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 200 | Success | Process response data |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validate request data |
| 401 | Unauthorized | Refresh token or logout |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Show error message, retry |

### Error Handling Utility

```javascript
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { message: data.message || 'Invalid request' };
      case 401:
        return { message: 'Authentication required', requiresLogin: true };
      case 403:
        return { message: data.message || 'Access denied' };
      case 404:
        return { message: 'Resource not found' };
      case 500:
        return { message: 'Server error. Please try again later.' };
      default:
        return { message: 'An error occurred' };
    }
  } else if (error.request) {
    // Request made but no response
    return { message: 'No response from server. Check your connection.' };
  } else {
    // Error in request setup
    return { message: 'Request failed. Please try again.' };
  }
};
```

---

## Best Practices

### 1. Token Management
- Store tokens securely using AsyncStorage or SecureStore (for sensitive data)
- Implement automatic token refresh
- Clear tokens on logout
- Handle token expiration gracefully

### 2. Request Optimization
- Implement request caching for frequently accessed data
- Use pagination for large lists
- Debounce search requests
- Cancel pending requests when component unmounts

### 3. Error Handling
- Always handle errors in API calls
- Provide meaningful error messages to users
- Implement retry logic for failed requests
- Log errors for debugging

### 4. WebSocket Management
- Connect on login, disconnect on logout
- Implement reconnection logic
- Handle connection state in UI
- Clean up event listeners

### 5. Security
- Never log sensitive data (tokens, passwords)
- Validate all user input
- Use HTTPS in production
- Implement proper authentication checks

---

## Example: Complete API Service

```javascript
// services/api.service.js
import apiClient from './apiClient';

class ApiService {
  // Auth
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  }
  
  async refreshToken(refreshToken) {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data;
  }
  
  // Users
  async registerUser(userData) {
    const response = await apiClient.post('/user/create', userData);
    return response.data;
  }
  
  async getAllUsers() {
    const response = await apiClient.get('/user');
    return response.data;
  }
  
  async getUserByUsername(username) {
    const response = await apiClient.get(`/user/${username}`);
    return response.data;
  }
  
  async updateUser(username, updates) {
    const response = await apiClient.put(`/user/${username}`, updates);
    return response.data;
  }
  
  // Chats
  async getAllChats() {
    const response = await apiClient.get('/chat/');
    return response.data;
  }
  
  async createChat(isGroup, userIds, groupId) {
    const response = await apiClient.post('/chat/create', { isGroup, userIds, groupId });
    return response.data;
  }
  
  async getChatDetails(chatId) {
    const response = await apiClient.get(`/chat/${chatId}`);
    return response.data;
  }
  
  // Messages
  async sendMessage(recipientId, groupId, senderId, content) {
    const response = await apiClient.post('/message/send', {
      recipientId,
      groupId,
      senderId,
      content,
    });
    return response.data;
  }
  
  async getMessages(chatId) {
    const response = await apiClient.get(`/message/${chatId}/messages`);
    return response.data;
  }
  
  // Groups
  async createGroup(groupName, description, createdBy, members) {
    const response = await apiClient.post('/group/create', {
      groupName,
      description,
      createdBy,
      members,
    });
    return response.data;
  }
  
  async getGroupDetails(groupId) {
    const response = await apiClient.get(`/group/${groupId}`);
    return response.data;
  }
  
  async addUserToGroup(groupId, userId) {
    const response = await apiClient.post('/group/add', { groupId, userId });
    return response.data;
  }
}

export default new ApiService();
```

---

## Testing API Integration

### Using Postman or curl

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get all users (with auth token)
curl -X GET http://localhost:3000/user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Send message
curl -X POST http://localhost:3000/message/send \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"recipientId":2,"senderId":1,"content":"Hello!"}'
```

---

## Support

For issues or questions about API integration:
1. Check the backend README.md
2. Review the Swagger documentation at `http://localhost:3000/api-docs`
3. Check backend logs for error details
4. Refer to backend route files for endpoint details
