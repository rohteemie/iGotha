# iGotha Backend

A robust Node.js backend application for the iGotha chat platform, built with Express, Sequelize, and Socket.IO.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Linting](#linting)
- [API Documentation](#api-documentation)
- [Database](#database)
- [WebSocket Events](#websocket-events)
- [Contributing](#contributing)

---

## Features

- ✅ User authentication with JWT and refresh tokens
- ✅ Real-time messaging using Socket.IO
- ✅ Direct and group chat support
- ✅ User management and profiles
- ✅ Message read receipts
- ✅ Redis caching for improved performance
- ✅ Rate limiting for API protection
- ✅ Swagger API documentation
- ✅ Comprehensive test coverage

---

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (Production), SQLite (Testing)
- **ORM**: Sequelize
- **Real-time**: Socket.IO
- **Authentication**: JWT (jsonwebtoken)
- **Caching**: Redis
- **Testing**: Jest
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Security**: bcrypt for password hashing, helmet for security headers
- **Validation**: Custom validation utilities

---

## Project Structure

```
backend/
├── app.js                 # Express application setup
├── server.js              # Server entry point
├── config/                # Configuration files
│   └── database.js        # Database configuration
├── helper/                # Utility functions
│   ├── auth.util.js       # Authentication utilities
│   ├── redis.util.js      # Redis utilities
│   ├── user.util.js       # User utilities
│   └── validate.js        # Validation utilities
├── middleware/            # Express middlewares
│   ├── auth.middleware.js        # JWT authentication middleware
│   └── auth.socket.middleware.js # Socket.IO authentication
├── migrations/            # Database migrations
├── models/                # Sequelize models
│   ├── associations.model.js  # Model associations
│   ├── auth.model.js         # Authentication model
│   ├── chat.model.js         # Chat model
│   ├── group.model.js        # Group model
│   ├── message.model.js      # Message model
│   ├── user.model.js         # User model
│   ├── userChat.model.js     # User-Chat junction
│   └── userGroup.model.js    # User-Group junction
├── routes/                # API routes
│   ├── auth.route.js      # Authentication routes
│   ├── chat.route.js      # Chat routes
│   ├── group.route.js     # Group routes
│   ├── message.route.js   # Message routes
│   └── user.route.js      # User routes
├── services/              # Business logic layer
│   ├── auth.service.js    # Authentication service
│   ├── chat.service.js    # Chat service
│   ├── group.service.js   # Group service
│   ├── message.service.js # Message service
│   └── user.service.js    # User service
├── tests/                 # Test files
│   ├── auth.test.js       # Auth tests
│   ├── chat.test.js       # Chat tests
│   ├── group.test.js      # Group tests
│   ├── message.test.js    # Message tests
│   ├── refreshToken.test.js # Token tests
│   └── user.test.js       # User tests
├── websocket/             # WebSocket handlers
│   └── socketHandler.js   # Socket.IO event handlers
├── .env.test              # Test environment variables
├── .eslintrc.js           # ESLint configuration
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Jest setup
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

---

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher) for production
- Redis (optional but recommended for production)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rohteemie/iGotha.git
   cd iGotha/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up MySQL** (for production):
   ```bash
   # Start MySQL
   sudo service mysql start
   
   # Login to MySQL
   mysql -u root -p
   
   # Create database
   CREATE DATABASE igotha_db;
   EXIT;
   ```

---

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB=igotha_db
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EXPIRE_IN=1h
REFRESH_EXPIRE_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Test Environment

For testing, a `.env.test` file is already configured with SQLite in-memory database.

---

## Running the Application

### Development Mode

```bash
# Run migrations
npm run migrate

# Start the server
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in `.env`).

---

## Testing

This project includes comprehensive test coverage for all models and services.

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test File

```bash
npm test -- tests/user.test.js
```

### Test Structure

- **auth.test.js**: Authentication model tests
- **refreshToken.test.js**: Refresh token security tests
- **user.test.js**: User model and operations tests (28 tests)
- **chat.test.js**: Chat model and functionality tests (21 tests)
- **group.test.js**: Group model and operations tests (26 tests)
- **message.test.js**: Message model and operations tests (37 tests)

**Total: 112 passing tests** ✅

---

## Linting

This project uses ESLint for code quality and consistency.

### Run Linter

```bash
npm run lint
```

### Auto-fix Linting Issues

```bash
npm run lint:fix
```

### ESLint Configuration

The project follows these rules (see `.eslintrc.js`):
- ES2021 standards
- Node.js environment
- Jest support
- No unused variables (warnings)
- Consistent indentation (2 spaces)
- Single quotes for strings
- Semicolons required

---

## API Documentation

### Swagger Documentation

Once the server is running, access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

### Main Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token

#### Users
- `GET /user` - Get all users
- `POST /user/create` - Create a new user
- `GET /user/:username` - Get user by username
- `PUT /user/:username` - Update user

#### Chats
- `GET /chat` - Get all chats
- `POST /chat/create` - Create a new chat
- `GET /chat/:chatId` - Get chat details

#### Groups
- `POST /group` - Create a new group
- `GET /group` - Get all groups
- `GET /group/:groupId` - Get group details
- `POST /group/:groupId` - Send message to group
- `PUT /group/add` - Add user to group

#### Messages
- `POST /message` - Send a message
- `GET /message/:chatId` - Get messages for a chat

---

## Database

### Migrations

Run database migrations to create tables:

```bash
npm run migrate
```

### Models

The application uses the following Sequelize models:

- **Auth**: User authentication credentials
- **User**: User profile information
- **Chat**: Chat conversations (direct and group)
- **Group**: Group information
- **Message**: Chat messages
- **UserChat**: User-Chat associations (many-to-many)
- **UserGroup**: User-Group associations (many-to-many)

### Database Relationships

```
User ←→ Chat (via UserChat)
User ←→ Group (via UserGroup)
User → Message (one-to-many)
Chat → Message (one-to-many)
Group → Chat (one-to-one)
```

---

## Code Style and Conventions

### Naming Conventions

- **Files**: `camelCase.type.js` (e.g., `user.model.js`, `auth.service.js`)
- **Variables/Functions**: `camelCase`
- **Classes/Models**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`

### Error Handling

All route handlers should:
1. Use try-catch blocks
2. Return appropriate HTTP status codes
3. Provide meaningful error messages
4. Log errors to console

### Response Format

Standard success response:
```json
{
  "message": "Success message",
  "data": { ... }
}
```

Standard error response:
```json
{
  "message": "Error description"
}
```

---

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Refresh token mechanism
- ✅ Rate limiting on API endpoints
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (via Sequelize ORM)

---

## Known Issues and Future Features

See [backend_issue.md](./backend_issue.md) for a complete list of:
- Features to be implemented
- Technical debt items
- Security enhancements needed
- Infrastructure improvements planned

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linter (`npm run lint:fix`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### Contribution Guidelines

- Write tests for new features
- Follow the existing code style
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep commits atomic and well-described

---

## License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.

---

## Authors

- Rotimi Owolabi
- Ajiboye Adeleye

---

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/rohteemie/iGotha/issues)
- Check existing documentation
- Review [backend_issue.md](./backend_issue.md) for known limitations

---

**Happy Coding! 🚀**
