# Frontend Development Issues - React Native

This document outlines all the frontend issues that need to be created and implemented for the iGotha chat application using React Native.

## Table of Contents
- [Authentication Features](#authentication-features)
- [User Management Features](#user-management-features)
- [Chat Features](#chat-features)
- [Message Features](#message-features)
- [Group Features](#group-features)
- [Real-time Communication Features](#real-time-communication-features)
- [UI/UX Components](#uiux-components)
- [State Management](#state-management)
- [Utilities and Helpers](#utilities-and-helpers)

---

## Authentication Features

### Issue 1: User Login Screen
**Priority:** High  
**Backend Endpoint:** `POST /auth/login`

**Description:**
Create a login screen that allows users to authenticate using their email and password.

**Requirements:**
- Email input field with validation
- Password input field with secure text entry
- Login button
- Error handling for invalid credentials
- Account locked notification (after 5 failed attempts)
- Loading state indicator
- Navigate to main chat screen on successful login
- Store access token and refresh token securely

**API Integration:**
- **Request:** `{ email: string, password: string }`
- **Response:** `{ user: Object, accessToken: string, refreshToken: string }`

**Acceptance Criteria:**
- [ ] User can input email and password
- [ ] Form validation works correctly
- [ ] Error messages display for invalid credentials
- [ ] Account locked message shows after 5 failed attempts
- [ ] Tokens are stored securely in AsyncStorage/SecureStore
- [ ] Successful login navigates to main screen
- [ ] Loading indicator shows during authentication

---

### Issue 2: Token Refresh Mechanism
**Priority:** High  
**Backend Endpoint:** `POST /auth/refresh-token`

**Description:**
Implement automatic token refresh mechanism to maintain user sessions without requiring re-login.

**Requirements:**
- Intercept API calls to detect expired tokens
- Automatically refresh access token using refresh token
- Retry failed requests after token refresh
- Handle refresh token expiration (force re-login)
- Store new tokens securely

**API Integration:**
- **Request:** `{ refreshToken: string }`
- **Response:** `{ accessToken: string }`

**Acceptance Criteria:**
- [ ] Expired tokens trigger automatic refresh
- [ ] Failed requests are retried after token refresh
- [ ] Users are logged out when refresh token expires
- [ ] No visible interruption to user experience
- [ ] Refresh logic is centralized in API client

---

### Issue 3: User Registration Screen
**Priority:** High  
**Backend Endpoint:** `POST /user/create`

**Description:**
Create a registration screen for new users to create accounts.

**Requirements:**
- First name input field
- Last name input field
- Username input field with uniqueness validation
- Email input field with validation
- Password input field with strength indicator
- Confirm password field
- Terms and conditions checkbox
- Register button
- Navigate to login screen on successful registration
- Guest user option (no email/password required)

**API Integration:**
- **Request:** `{ first_name: string, last_name: string, username: string, email: string, password: string }`
- **Response:** `{ message: string }`

**Acceptance Criteria:**
- [ ] All form fields validate correctly
- [ ] Email validation follows proper format
- [ ] Password strength indicator works
- [ ] Username uniqueness is checked
- [ ] Error messages display for existing users
- [ ] Guest user creation works without credentials
- [ ] Success message shows on registration
- [ ] User is navigated to login screen

---

### Issue 4: Logout Functionality
**Priority:** Medium

**Description:**
Implement logout functionality to clear user session and tokens.

**Requirements:**
- Logout button in user profile/settings
- Clear all stored tokens
- Clear user data from state
- Disconnect WebSocket connection
- Navigate to login screen
- Confirmation dialog before logout

**Acceptance Criteria:**
- [ ] Logout button is accessible
- [ ] Confirmation dialog shows before logout
- [ ] All tokens and user data are cleared
- [ ] WebSocket disconnects properly
- [ ] User is navigated to login screen
- [ ] Cannot navigate back to authenticated screens

---

## User Management Features

### Issue 5: User Profile Screen
**Priority:** Medium  
**Backend Endpoint:** `GET /user/:username`

**Description:**
Create a user profile screen to view and display user information.

**Requirements:**
- Display user avatar/profile picture
- Show first name, last name, username
- Display email
- Show last seen timestamp
- View account creation date
- Authentication required

**API Integration:**
- **Request:** `GET /user/:username` (with auth token)
- **Response:** User object with auth details

**Acceptance Criteria:**
- [ ] Profile information displays correctly
- [ ] Avatar/placeholder image shows
- [ ] Last seen formatted properly
- [ ] Only authenticated users can view
- [ ] Loading state while fetching data
- [ ] Error handling for not found users

---

### Issue 6: Edit Profile Screen
**Priority:** Medium  
**Backend Endpoint:** `PUT /user/:username`

**Description:**
Create a screen for users to edit their profile information.

**Requirements:**
- Editable first name field
- Editable last name field
- Editable username field
- Editable email field
- Save button
- Cancel button
- Form validation
- Success/error notifications

**API Integration:**
- **Request:** `PUT /user/:username` with updated fields
- **Response:** `{ message: "User updated successfully" }`

**Acceptance Criteria:**
- [ ] All fields are editable
- [ ] Validation prevents empty required fields
- [ ] Username uniqueness is validated
- [ ] Success message shows on save
- [ ] Error messages display appropriately
- [ ] Changes reflect immediately
- [ ] Cancel discards changes

---

### Issue 7: User List/Search Screen
**Priority:** Medium  
**Backend Endpoint:** `GET /user`

**Description:**
Create a screen to display all users and search functionality to start new conversations.

**Requirements:**
- List all users
- Search bar to filter users
- User avatar/placeholder
- Username and name display
- Tap to view profile or start chat
- Pull-to-refresh functionality
- Pagination or infinite scroll

**API Integration:**
- **Request:** `GET /user`
- **Response:** Array of user objects

**Acceptance Criteria:**
- [ ] All users display in a list
- [ ] Search filters users by name/username
- [ ] Tapping user opens options (profile/chat)
- [ ] Pull-to-refresh updates user list
- [ ] Loading indicator while fetching
- [ ] Empty state for no users found

---

## Chat Features

### Issue 8: Chat List Screen (Main Screen)
**Priority:** High  
**Backend Endpoint:** `GET /chat/`

**Description:**
Create the main chat list screen showing all user conversations.

**Requirements:**
- List all chats (individual and group)
- Display chat preview (last message)
- Show timestamp of last message
- Unread message badge/indicator
- User/group avatar
- Pull-to-refresh
- Swipe actions (delete, archive)
- Search chats functionality
- New chat button

**API Integration:**
- **Request:** `GET /chat/`
- **Response:** Array of chat objects with participants and groups

**Acceptance Criteria:**
- [ ] All chats display with latest message
- [ ] Timestamps show correctly
- [ ] Unread indicators work
- [ ] Pull-to-refresh updates chats
- [ ] Search filters chats
- [ ] Tapping opens chat conversation
- [ ] New chat button navigates to user selection

---

### Issue 9: Create New Chat
**Priority:** High  
**Backend Endpoint:** `POST /chat/create`

**Description:**
Implement functionality to create a new individual or group chat.

**Requirements:**
- Select user(s) from user list
- Support multiple user selection for groups
- Group name input for group chats
- Create chat button
- Handle existing chat detection
- Navigate to chat screen after creation

**API Integration:**
- **Request:** `{ isGroup: boolean, groupId: number, userIds: array }`
- **Response:** Chat object

**Acceptance Criteria:**
- [ ] Users can be selected from list
- [ ] Multi-select works for group chats
- [ ] Group name can be specified
- [ ] Existing chats are detected and opened
- [ ] New chat navigates to conversation
- [ ] Error handling for invalid selections

---

### Issue 10: Chat Details Screen
**Priority:** Medium  
**Backend Endpoint:** `GET /chat/:chatId`

**Description:**
Create a chat details screen to view chat information and participants.

**Requirements:**
- Display chat type (individual/group)
- Show all participants
- Display group name (if group chat)
- Option to add participants (group only)
- Leave chat option
- Mute notifications toggle
- Clear chat history option

**API Integration:**
- **Request:** `GET /chat/:chatId`
- **Response:** Chat object with participants and group details

**Acceptance Criteria:**
- [ ] Chat type displays correctly
- [ ] All participants listed
- [ ] Group name shown for groups
- [ ] Add participants works (groups)
- [ ] Leave chat functionality
- [ ] Mute toggle persists
- [ ] Clear history confirms before action

---

## Message Features

### Issue 11: Conversation Screen
**Priority:** High  
**Backend Endpoint:** `GET /message/:chatId/messages`

**Description:**
Create the main conversation screen for viewing and sending messages.

**Requirements:**
- Display all messages in chronological order
- Show sender name/avatar
- Display message timestamp
- Message bubbles (different for sent/received)
- Scroll to bottom button
- Load older messages on scroll
- Message status indicators (sent, delivered, read)
- Support for text messages
- Auto-scroll to new messages

**API Integration:**
- **Request:** `GET /message/:chatId/messages`
- **Response:** Array of message objects

**Acceptance Criteria:**
- [ ] Messages display in order
- [ ] Sender info shows correctly
- [ ] Timestamps formatted properly
- [ ] Different styles for sent/received
- [ ] Scroll to load older messages
- [ ] New messages auto-scroll to bottom
- [ ] Message status shows correctly

---

### Issue 12: Send Message Functionality
**Priority:** High  
**Backend Endpoint:** `POST /message/send`

**Description:**
Implement functionality to send text messages in individual and group chats.

**Requirements:**
- Message input field
- Send button
- Character limit indicator
- Disable send for empty messages
- Optimistic UI update
- Handle send failures
- Show sending indicator
- Support for direct and group messages

**API Integration:**
- **Request:** `{ recipientId: number, groupId: number, senderId: number, content: string }`
- **Response:** `{ message: string, data: messageObject }`

**Acceptance Criteria:**
- [ ] Message input works correctly
- [ ] Send button disabled for empty input
- [ ] Message appears immediately (optimistic)
- [ ] Send failures handled gracefully
- [ ] Sending indicator shows
- [ ] Works for both direct and group chats
- [ ] Input clears after sending

---

### Issue 13: Message Actions (Long Press)
**Priority:** Low

**Description:**
Implement long-press actions on messages for additional functionality.

**Requirements:**
- Long press to show action menu
- Copy message text
- Delete message (own messages)
- Reply to message
- Forward message
- Message info (read receipts, timestamp)

**Acceptance Criteria:**
- [ ] Long press shows action menu
- [ ] Copy works correctly
- [ ] Delete removes message
- [ ] Reply quotes original message
- [ ] Forward navigates to chat selection
- [ ] Message info displays correctly

---

## Group Features

### Issue 14: Create Group Screen
**Priority:** High  
**Backend Endpoint:** `POST /group/create`

**Description:**
Create a screen for creating new group chats.

**Requirements:**
- Group name input field
- Group description (optional)
- Select members from user list
- Group avatar upload (optional)
- Create button
- Minimum 2 members validation
- Navigate to group chat on creation

**API Integration:**
- **Request:** `{ groupName: string, description: string, createdBy: number, members: array }`
- **Response:** Group object

**Acceptance Criteria:**
- [ ] Group name is required
- [ ] Description is optional
- [ ] At least 2 members required
- [ ] Members can be selected
- [ ] Group avatar can be uploaded
- [ ] Creates group successfully
- [ ] Navigates to group chat

---

### Issue 15: Group Details Screen
**Priority:** Medium  
**Backend Endpoint:** `GET /group/:groupId`

**Description:**
Create a screen to view and manage group details.

**Requirements:**
- Display group name and description
- Show group avatar
- List all members with roles
- Add member button
- Remove member functionality (admin)
- Edit group details (admin)
- Leave group option
- Mute notifications toggle

**API Integration:**
- **Request:** `GET /group/:groupId`
- **Response:** Group object with chat and messages

**Acceptance Criteria:**
- [ ] Group info displays correctly
- [ ] All members listed
- [ ] Add member works
- [ ] Remove member works (admin only)
- [ ] Edit details works (admin only)
- [ ] Leave group functional
- [ ] Mute toggle persists

---

### Issue 16: Add User to Group
**Priority:** Medium  
**Backend Endpoint:** `POST /group/add`

**Description:**
Implement functionality to add users to existing groups.

**Requirements:**
- User selection screen
- Search users functionality
- Multi-select support
- Add button
- Success notification
- Update group member list

**API Integration:**
- **Request:** `{ groupId: number, userId: number }`
- **Response:** `{ message: "User added to group successfully" }`

**Acceptance Criteria:**
- [ ] Users can be searched and selected
- [ ] Multiple users can be added
- [ ] Success message shows
- [ ] Group member list updates
- [ ] Prevents adding existing members

---

### Issue 17: Send Group Message
**Priority:** High  
**Backend Endpoint:** `POST /group/:groupId`

**Description:**
Implement group message sending functionality (alternative to general message endpoint).

**Requirements:**
- Send messages to group
- Display sender name in group
- Handle message delivery to all members
- Support WebSocket for real-time delivery

**API Integration:**
- **Request:** `POST /group/:groupId` with `{ senderId: number, content: string }`
- **Response:** `{ message: string, data: messageObject }`

**Acceptance Criteria:**
- [ ] Messages send to all group members
- [ ] Sender name displays
- [ ] Real-time delivery works
- [ ] Optimistic UI updates
- [ ] Error handling works

---

## Real-time Communication Features

### Issue 18: WebSocket Integration
**Priority:** High  
**Backend:** Socket.IO implementation

**Description:**
Implement WebSocket connection for real-time messaging.

**Requirements:**
- Connect to Socket.IO server on login
- Authenticate connection with token
- Handle connection/disconnection events
- Reconnection logic
- Event listeners for new messages
- Emit message events
- Handle online/offline status
- Disconnect on logout

**WebSocket Events:**
- `connect` - Connection established
- `disconnect` - Connection lost
- `privateMessage` - Receive private message
- `groupMessage` - Receive group message
- `userOnline` - User came online
- `userOffline` - User went offline

**Acceptance Criteria:**
- [ ] Connects on login with token
- [ ] Handles connection events
- [ ] Reconnects automatically
- [ ] Receives messages in real-time
- [ ] Sends messages via WebSocket
- [ ] Online status updates
- [ ] Disconnects on logout

---

### Issue 19: Offline Message Handling
**Priority:** Medium  
**Backend:** Offline message delivery mechanism

**Description:**
Implement offline message queue and delivery.

**Requirements:**
- Queue messages when offline
- Deliver queued messages when online
- Show offline indicator
- Sync messages on reconnection
- Handle message conflicts

**Acceptance Criteria:**
- [ ] Messages queue when offline
- [ ] Queued messages send on reconnection
- [ ] Offline indicator shows
- [ ] Messages sync properly
- [ ] No duplicate messages

---

### Issue 20: Typing Indicators
**Priority:** Low  
**Backend:** WebSocket events for typing status

**Description:**
Implement typing indicators to show when users are typing.

**Requirements:**
- Detect when user is typing
- Emit typing event via WebSocket
- Display "User is typing..." indicator
- Clear indicator after timeout
- Works for individual and group chats

**Acceptance Criteria:**
- [ ] Typing detection works
- [ ] Typing event emits
- [ ] Indicator displays correctly
- [ ] Timeout clears indicator
- [ ] Works in all chat types

---

### Issue 21: Online Status Indicators
**Priority:** Medium  
**Backend:** WebSocket events for user status

**Description:**
Show online/offline status for users.

**Requirements:**
- Display online indicator (green dot)
- Show last seen for offline users
- Update status in real-time
- Works in user list and chat screens

**Acceptance Criteria:**
- [ ] Online status shows correctly
- [ ] Last seen displays for offline users
- [ ] Updates in real-time
- [ ] Visible in multiple screens

---

## UI/UX Components

### Issue 22: Navigation Structure
**Priority:** High

**Description:**
Set up the main navigation structure for the app.

**Requirements:**
- Stack Navigator for authentication flow
- Tab Navigator for main app screens
- Stack Navigator for chat flow
- Deep linking support
- Back navigation handling

**Screens:**
- Auth Stack: Login, Register
- Main Tabs: Chats, Contacts, Settings
- Chat Stack: Conversation, Chat Details, Group Details

**Acceptance Criteria:**
- [ ] Navigation flows work correctly
- [ ] Proper screen transitions
- [ ] Deep linking functional
- [ ] Back button behavior correct
- [ ] Tab navigation smooth

---

### Issue 23: Theme and Styling System
**Priority:** Medium

**Description:**
Create a centralized theme and styling system.

**Requirements:**
- Define color palette
- Typography system
- Spacing/sizing constants
- Dark mode support
- Theme context provider
- Reusable style components

**Acceptance Criteria:**
- [ ] Theme constants defined
- [ ] Dark mode toggle works
- [ ] Consistent styling across app
- [ ] Easy to update theme values

---

### Issue 24: Loading and Error States
**Priority:** Medium

**Description:**
Create reusable components for loading and error states.

**Requirements:**
- Loading spinner component
- Skeleton loaders for lists
- Error message component
- Empty state component
- Retry functionality for errors

**Acceptance Criteria:**
- [ ] Loading indicators display correctly
- [ ] Skeleton loaders match content
- [ ] Error messages are clear
- [ ] Empty states are informative
- [ ] Retry buttons work

---

### Issue 25: Avatar Component
**Priority:** Medium

**Description:**
Create a reusable avatar component for users and groups.

**Requirements:**
- Display profile pictures
- Fallback to initials
- Different sizes (small, medium, large)
- Online status indicator
- Group avatar support
- Image upload/selection

**Acceptance Criteria:**
- [ ] Avatars display correctly
- [ ] Initials show when no image
- [ ] Sizes work as expected
- [ ] Online indicator shows
- [ ] Image selection works

---

### Issue 26: Input Components
**Priority:** Medium

**Description:**
Create reusable input components for forms.

**Requirements:**
- Text input component
- Password input with visibility toggle
- Email input with validation
- Search input with icon
- Textarea for long text
- Error state styling

**Acceptance Criteria:**
- [ ] All input types work
- [ ] Validation displays correctly
- [ ] Password toggle functional
- [ ] Consistent styling
- [ ] Accessible

---

## State Management

### Issue 27: Redux Store Setup
**Priority:** High

**Description:**
Set up Redux for global state management.

**Requirements:**
- Configure Redux store
- Create slices for:
  - Auth (user, tokens)
  - Chats (chat list, active chat)
  - Messages (messages by chat)
  - Users (user list, profiles)
  - Groups (group list, details)
- Redux Toolkit setup
- Redux Persist for persistence

**Acceptance Criteria:**
- [ ] Store configured correctly
- [ ] All slices created
- [ ] Actions and reducers work
- [ ] State persists correctly
- [ ] DevTools configured

---

### Issue 28: API Client with Axios
**Priority:** High

**Description:**
Create centralized API client for backend communication.

**Requirements:**
- Axios instance with base URL
- Request interceptor for auth token
- Response interceptor for errors
- Token refresh logic
- Request/response logging
- Error handling utilities

**Acceptance Criteria:**
- [ ] API client configured
- [ ] Auth token auto-added
- [ ] Token refresh works
- [ ] Errors handled properly
- [ ] Logging works in dev mode

---

## Utilities and Helpers

### Issue 29: Date/Time Formatting
**Priority:** Low

**Description:**
Create utilities for consistent date/time formatting.

**Requirements:**
- Format message timestamps
- Format last seen
- Relative time (e.g., "2 minutes ago")
- Date grouping for messages
- Locale support

**Acceptance Criteria:**
- [ ] Timestamps format correctly
- [ ] Relative time works
- [ ] Message grouping by date
- [ ] Handles different locales

---

### Issue 30: Validation Utilities
**Priority:** Medium

**Description:**
Create validation functions for forms.

**Requirements:**
- Email validation
- Password strength validation
- Username validation
- Required field validation
- Custom error messages

**Acceptance Criteria:**
- [ ] All validators work correctly
- [ ] Error messages are clear
- [ ] Reusable across forms

---

### Issue 31: Notification System
**Priority:** Medium

**Description:**
Implement push notifications for new messages.

**Requirements:**
- Request notification permissions
- Handle incoming notifications
- Display notification when app is backgrounded
- Notification tap navigation
- Badge count for unread messages
- Notification settings

**Acceptance Criteria:**
- [ ] Permissions requested properly
- [ ] Notifications show for new messages
- [ ] Tapping opens correct chat
- [ ] Badge count updates
- [ ] Settings control notifications

---

### Issue 32: Image Picker and Upload
**Priority:** Low

**Description:**
Implement image selection and upload for avatars and media.

**Requirements:**
- Select from gallery
- Take photo with camera
- Crop/resize images
- Upload to server
- Progress indicator
- Error handling

**Acceptance Criteria:**
- [ ] Gallery selection works
- [ ] Camera capture works
- [ ] Images can be cropped
- [ ] Upload successful
- [ ] Progress shows
- [ ] Errors handled

---

## Testing and Quality Assurance

### Issue 33: Unit Tests Setup
**Priority:** Medium

**Description:**
Set up unit testing infrastructure.

**Requirements:**
- Jest configuration
- React Native Testing Library
- Test utilities
- Mock data
- Component tests
- Redux tests
- Utility function tests

**Acceptance Criteria:**
- [ ] Testing framework configured
- [ ] Sample tests pass
- [ ] Test coverage reporting
- [ ] CI/CD integration

---

### Issue 34: E2E Tests Setup
**Priority:** Low

**Description:**
Set up end-to-end testing with Detox.

**Requirements:**
- Detox configuration
- Critical user flows
  - Login flow
  - Send message flow
  - Create chat flow
- Device/simulator setup
- CI/CD integration

**Acceptance Criteria:**
- [ ] Detox configured
- [ ] Critical flows covered
- [ ] Tests pass reliably
- [ ] Integrated in CI/CD

---

## Documentation

### Issue 35: Setup and Installation Guide
**Priority:** High

**Description:**
Create comprehensive setup guide for developers.

**Requirements:**
- Prerequisites
- Installation steps
- Environment configuration
- Running on iOS/Android
- Troubleshooting section
- Development workflow

**Acceptance Criteria:**
- [ ] All steps documented
- [ ] Clear and concise
- [ ] Covers both platforms
- [ ] Troubleshooting helpful

---

### Issue 36: API Integration Documentation
**Priority:** High

**Description:**
Document all API endpoints and integration patterns.

**Requirements:**
- List all endpoints
- Request/response formats
- Authentication flow
- Error codes and handling
- WebSocket events
- Code examples

**Acceptance Criteria:**
- [ ] All endpoints documented
- [ ] Examples provided
- [ ] Error handling covered
- [ ] WebSocket events listed

---

### Issue 37: Component Documentation
**Priority:** Medium

**Description:**
Document all reusable components.

**Requirements:**
- Component props
- Usage examples
- Storybook setup (optional)
- PropTypes/TypeScript types

**Acceptance Criteria:**
- [ ] All components documented
- [ ] Props explained
- [ ] Examples provided
- [ ] Types defined

---

## Summary

**Total Issues:** 37

**By Priority:**
- High: 15 issues
- Medium: 17 issues
- Low: 5 issues

**By Category:**
- Authentication: 4 issues
- User Management: 3 issues
- Chat Features: 3 issues
- Message Features: 3 issues
- Group Features: 4 issues
- Real-time Communication: 4 issues
- UI/UX Components: 5 issues
- State Management: 2 issues
- Utilities: 4 issues
- Testing: 2 issues
- Documentation: 3 issues

**Suggested Implementation Order:**
1. Start with infrastructure (Navigation, Redux, API Client)
2. Implement authentication flow
3. Build core chat functionality
4. Add group features
5. Implement real-time features
6. Polish UI/UX
7. Add utilities and helpers
8. Complete testing and documentation
