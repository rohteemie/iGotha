# Backend Issues and Unimplemented Features

This document tracks features that are yet to be implemented in the iGotha backend application.

## Last Updated
2025-10-25

---

## Table of Contents
- [High Priority Features](#high-priority-features)
- [Medium Priority Features](#medium-priority-features)
- [Low Priority Features](#low-priority-features)
- [Technical Debt](#technical-debt)
- [Security Enhancements](#security-enhancements)

---

## High Priority Features

### 1. User Profile Management
- [ ] User profile picture upload and storage
- [ ] User bio/about section
- [ ] User settings and preferences
- [ ] Privacy settings (who can see profile, status, etc.)

### 2. Real-time Notifications
- [ ] Push notifications for new messages
- [ ] Email notifications for important events
- [ ] In-app notification system
- [ ] Notification preferences management

### 3. File and Media Sharing
- [ ] Image upload and sharing in chats
- [ ] Video upload and sharing
- [ ] Document upload and sharing
- [ ] File size limits and validation
- [ ] Media compression and optimization

### 4. Message Features
- [ ] Message editing functionality
- [ ] Message deletion (for sender and for everyone)
- [ ] Message reactions/emojis
- [ ] Message threading/replies
- [ ] Message search functionality
- [ ] Message forwarding

### 5. Group Management
- [ ] Group admin roles and permissions
- [ ] Group member management (add/remove)
- [ ] Group settings (name, description, picture)
- [ ] Group join via invite link
- [ ] Group member limits

---

## Medium Priority Features

### 6. Chat Features
- [ ] Typing indicators
- [ ] Online/offline status indicators
- [ ] Last seen timestamp
- [ ] Message delivery status (sent, delivered, read)
- [ ] Chat archiving
- [ ] Chat pinning
- [ ] Chat muting

### 7. Authentication Enhancements
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook, etc.)
- [ ] Password reset via email
- [ ] Account recovery options
- [ ] Session management across devices

### 8. User Blocking and Reporting
- [ ] Block user functionality
- [ ] Report user/message functionality
- [ ] Spam detection
- [ ] User moderation tools

### 9. Search and Discovery
- [ ] Global user search
- [ ] Message search within chats
- [ ] Group discovery and search
- [ ] Advanced filtering options

### 10. Analytics and Monitoring
- [ ] User activity analytics
- [ ] Message delivery analytics
- [ ] Error tracking and logging
- [ ] Performance monitoring
- [ ] Usage statistics

---

## Low Priority Features

### 11. Voice and Video Calls
- [ ] One-to-one voice calls
- [ ] One-to-one video calls
- [ ] Group voice calls
- [ ] Group video calls
- [ ] Screen sharing

### 12. Bot Integration
- [ ] Bot API framework
- [ ] Webhook support
- [ ] Custom bot creation
- [ ] Bot permissions and security

### 13. Message Scheduling
- [ ] Schedule messages to be sent later
- [ ] Recurring messages
- [ ] Reminder functionality

### 14. Dark Mode and Themes
- [ ] Dark mode support
- [ ] Custom themes
- [ ] User theme preferences

### 15. Localization
- [ ] Multi-language support
- [ ] Language preferences per user
- [ ] Translation API integration

---

## Technical Debt

### Code Quality
- [ ] Migrate to TypeScript for better type safety (Decision pending after assessment)
- [ ] Improve error handling across all services
- [ ] Add JSDoc comments to all functions
- [ ] Standardize response formats
- [ ] Add request validation middleware for all routes

### Testing
- [x] Unit tests for models (Completed)
- [x] Integration tests for services (Completed)
- [ ] End-to-end tests for API routes
- [ ] WebSocket functionality tests
- [ ] Load testing and performance benchmarks
- [ ] Security testing and penetration testing

### Database
- [ ] Database indexing optimization
- [ ] Database query optimization
- [ ] Database migration strategy for production
- [ ] Database backup and recovery procedures
- [ ] Data archiving strategy

### API Documentation
- [ ] Complete Swagger/OpenAPI documentation for all endpoints
- [ ] API versioning strategy
- [ ] Rate limiting documentation
- [ ] Error code documentation
- [ ] Example requests and responses

---

## Security Enhancements

### Authentication & Authorization
- [x] JWT-based authentication (Implemented)
- [x] Refresh token mechanism (Implemented)
- [ ] API key authentication for third-party integrations
- [ ] OAuth 2.0 support
- [ ] Role-based access control (RBAC)

### Data Security
- [ ] End-to-end encryption for messages
- [ ] Data encryption at rest
- [ ] Secure file upload validation
- [ ] SQL injection prevention audit
- [ ] XSS prevention audit
- [ ] CSRF protection

### Infrastructure
- [ ] HTTPS enforcement
- [ ] CORS configuration review
- [ ] Rate limiting per endpoint
- [ ] DDoS protection
- [ ] Security headers implementation
- [ ] Regular security audits

---

## Infrastructure and DevOps

### Deployment
- [ ] CI/CD pipeline setup
- [ ] Automated testing in pipeline
- [ ] Staging environment setup
- [ ] Production environment setup
- [ ] Docker containerization
- [ ] Kubernetes orchestration

### Monitoring and Logging
- [ ] Centralized logging system
- [ ] Application performance monitoring (APM)
- [ ] Error tracking and alerting
- [ ] Health check endpoints
- [ ] Uptime monitoring

### Scalability
- [ ] Horizontal scaling strategy
- [ ] Load balancing setup
- [ ] Caching strategy (Redis optimization)
- [ ] Database connection pooling
- [ ] Message queue implementation

---

## Notes

### Decision Pending
- **TypeScript Migration**: Need to assess the effort and benefits of migrating the entire codebase to TypeScript. Current JavaScript implementation is working well, but TypeScript could provide better type safety and developer experience.

### Recently Implemented
- ✅ SQLite test database configuration
- ✅ ESLint configuration for consistent code style
- ✅ Comprehensive test suites for User, Chat, Group, and Message models
- ✅ Test coverage for authentication and refresh tokens
- ✅ .env.test configuration for test environment

---

## Contributing

When working on implementing any of these features:

1. Create a new branch from `main`
2. Update this document to mark the feature as "In Progress"
3. Implement the feature with appropriate tests
4. Update documentation
5. Submit a pull request
6. Mark the feature as completed once merged

---

## Priority Legend

- **High Priority**: Critical features needed for MVP or core functionality
- **Medium Priority**: Important features that enhance user experience
- **Low Priority**: Nice-to-have features that can be added later

---

For questions or suggestions about feature prioritization, please open an issue on GitHub.
