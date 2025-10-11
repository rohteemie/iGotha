# How to Create Frontend Issues from Documentation

This guide explains how to create GitHub issues for all the frontend development tasks documented in this repository.

## Option 1: Manual Creation (Recommended for Review)

### Step 1: Review the Issues Document
Read through `docs/frontend/FRONTEND_ISSUES.md` to understand all 37 issues.

### Step 2: Use the Issue Template
For each issue you want to create:

1. Go to GitHub Issues: `https://github.com/rohteemie/iGotha/issues/new/choose`
2. Select the **Frontend Feature Implementation** template
3. Fill in the details from the corresponding issue in `FRONTEND_ISSUES.md`

### Step 3: Organize with Labels
Add these labels to categorize issues:
- `frontend` - All frontend issues
- `react-native` - React Native specific
- `enhancement` - New feature
- Priority: `priority: high`, `priority: medium`, `priority: low`
- Category: `auth`, `chat`, `messaging`, `groups`, `websocket`, `ui`, etc.

---

## Quick Reference: Issue List by Priority

### High Priority Issues (15) - Start Here

1. **User Login Screen** (Issue #1)
   - Backend: `POST /auth/login`
   - Category: Authentication

2. **Token Refresh Mechanism** (Issue #2)
   - Backend: `POST /auth/refresh-token`
   - Category: Authentication

3. **User Registration Screen** (Issue #3)
   - Backend: `POST /user/create`
   - Category: Authentication

4. **Chat List Screen** (Issue #8)
   - Backend: `GET /chat/`
   - Category: Chat Features

5. **Create New Chat** (Issue #9)
   - Backend: `POST /chat/create`
   - Category: Chat Features

6. **Conversation Screen** (Issue #11)
   - Backend: `GET /message/:chatId/messages`
   - Category: Message Features

7. **Send Message Functionality** (Issue #12)
   - Backend: `POST /message/send`
   - Category: Message Features

8. **Create Group Screen** (Issue #14)
   - Backend: `POST /group/create`
   - Category: Group Features

9. **Send Group Message** (Issue #17)
   - Backend: `POST /group/:groupId`
   - Category: Group Features

10. **WebSocket Integration** (Issue #18)
    - Backend: Socket.IO
    - Category: Real-time Communication

11. **Navigation Structure** (Issue #22)
    - Category: UI/UX Components

12. **Redux Store Setup** (Issue #27)
    - Category: State Management

13. **API Client with Axios** (Issue #28)
    - Category: State Management

14. **Setup and Installation Guide** (Issue #35)
    - Category: Documentation

15. **API Integration Documentation** (Issue #36)
    - Category: Documentation

### Medium Priority Issues (17) - Second Phase

16. **Logout Functionality** (Issue #4)
17. **User Profile Screen** (Issue #5) - `GET /user/:username`
18. **Edit Profile Screen** (Issue #6) - `PUT /user/:username`
19. **User List/Search Screen** (Issue #7) - `GET /user`
20. **Chat Details Screen** (Issue #10) - `GET /chat/:chatId`
21. **Group Details Screen** (Issue #15) - `GET /group/:groupId`
22. **Add User to Group** (Issue #16) - `POST /group/add`
23. **Offline Message Handling** (Issue #19)
24. **Online Status Indicators** (Issue #21)
25. **Theme and Styling System** (Issue #23)
26. **Loading and Error States** (Issue #24)
27. **Avatar Component** (Issue #25)
28. **Input Components** (Issue #26)
29. **Date/Time Formatting** (Issue #29)
30. **Validation Utilities** (Issue #30)
31. **Notification System** (Issue #31)
32. **Unit Tests Setup** (Issue #33)
33. **Component Documentation** (Issue #37)

### Low Priority Issues (5) - Polish Phase

34. **Message Actions (Long Press)** (Issue #13)
35. **Typing Indicators** (Issue #20)
36. **Image Picker and Upload** (Issue #32)
37. **E2E Tests Setup** (Issue #34)

---

## Sample Issue Creation

Here's an example of how to create Issue #1 (User Login Screen):

### Title
```
[FRONTEND] User Login Screen
```

### Description
```markdown
## Feature Description
Create a login screen that allows users to authenticate using their email and password.

## Related Backend Endpoint
- **Endpoint:** POST /auth/login
- **Method:** POST
- **Description:** Authenticates user and returns access tokens

## Acceptance Criteria
- [ ] User can input email and password
- [ ] Form validation works correctly
- [ ] Error messages display for invalid credentials
- [ ] Account locked message shows after 5 failed attempts
- [ ] Tokens are stored securely in AsyncStorage/SecureStore
- [ ] Successful login navigates to main screen
- [ ] Loading indicator shows during authentication

## UI/UX Requirements
- Email input field with validation
- Password input field with secure text entry
- Login button
- Error handling for invalid credentials
- Account locked notification (after 5 failed attempts)
- Loading state indicator
- Navigate to main chat screen on successful login

## Technical Requirements
- [ ] Use React Navigation for screen navigation
- [ ] Integrate with Redux for state management
- [ ] Use Axios for API calls
- [ ] Implement form validation
- [ ] Store tokens securely

## API Integration Details
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "username": "john_doe",
    "email": "user@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "uuid-v4-token"
}
```

**Error Handling:**
- 400: Missing email or password
- 401: Invalid credentials
- 403: Account locked (5 failed login attempts)

## Testing Requirements
- [ ] Unit tests for form validation
- [ ] Integration tests for login API call
- [ ] E2E tests for complete login flow

## Additional Context
See `docs/frontend/API_INTEGRATION_GUIDE.md` for complete API documentation.
See `docs/frontend/IMPLEMENTATION_ROADMAP.md` Phase 2 for implementation guidance.

**Related Issues:**
- Depends on: #22 (Navigation Structure)
- Depends on: #27 (Redux Store Setup)
- Depends on: #28 (API Client)
- Related to: #2 (Token Refresh)
```

### Labels
- `frontend`
- `react-native`
- `enhancement`
- `priority: high`
- `auth`

---

## Bulk Issue Creation

If you want to create all issues at once, you can use the GitHub CLI:

### Prerequisites
```bash
# Install GitHub CLI
brew install gh  # macOS
# or
sudo apt install gh  # Linux

# Authenticate
gh auth login
```

### Create Issues Script
Save this as `create-frontend-issues.sh`:

```bash
#!/bin/bash

# Navigate to repository
cd /path/to/iGotha

# Issue #1: User Login Screen
gh issue create \
  --title "[FRONTEND] User Login Screen" \
  --body "See docs/frontend/FRONTEND_ISSUES.md - Issue #1" \
  --label "frontend,react-native,enhancement,priority: high,auth"

# Issue #2: Token Refresh Mechanism
gh issue create \
  --title "[FRONTEND] Token Refresh Mechanism" \
  --body "See docs/frontend/FRONTEND_ISSUES.md - Issue #2" \
  --label "frontend,react-native,enhancement,priority: high,auth"

# Add more issues following the same pattern...
```

### Run the Script
```bash
chmod +x create-frontend-issues.sh
./create-frontend-issues.sh
```

---

## Project Organization

### Create Milestones
Organize issues into milestones based on the implementation phases:

1. **Phase 1: Foundation** (1-2 weeks)
   - Issues: #22, #27, #28, #23, #24, #25, #26

2. **Phase 2: Authentication** (1-2 weeks)
   - Issues: #1, #2, #3, #4, #30

3. **Phase 3: Core Chat** (3-4 weeks)
   - Issues: #7, #5, #6, #8, #9, #10, #11, #12, #18, #29

4. **Phase 4: Advanced Features** (2-3 weeks)
   - Issues: #14, #15, #16, #17, #21, #20, #19, #13, #31

5. **Phase 5: Polish** (2-3 weeks)
   - Issues: #32, #33, #34, #35, #36, #37

### Create Project Board
Set up a project board with these columns:
- **Backlog** - All issues not yet started
- **Ready** - Issues ready to be worked on
- **In Progress** - Currently being developed
- **Review** - Awaiting code review
- **Testing** - In QA/testing phase
- **Done** - Completed

---

## Issue Dependencies

Some issues depend on others. Create them in this order:

### Foundation First (Required by Everything)
1. Navigation Structure (#22)
2. Redux Store Setup (#27)
3. API Client (#28)
4. Theme System (#23)
5. Base Components (#24, #25, #26)

### Then Authentication
6. Login Screen (#1)
7. Token Refresh (#2)
8. Registration (#3)
9. Logout (#4)
10. Validation Utilities (#30)

### Then Core Features
Build in any order after foundation and auth are complete.

---

## Tips for Success

1. **Start with high priority** issues
2. **Complete foundation phase** before moving to features
3. **Test as you go** - don't leave testing for the end
4. **Document components** as you build them
5. **Review the roadmap** regularly to stay on track
6. **Update issue status** to track progress
7. **Link related issues** in GitHub for better tracking

---

## Resources

- **Issues Document**: `docs/frontend/FRONTEND_ISSUES.md`
- **Implementation Roadmap**: `docs/frontend/IMPLEMENTATION_ROADMAP.md`
- **API Guide**: `docs/frontend/API_INTEGRATION_GUIDE.md`
- **Component Specs**: `docs/frontend/COMPONENT_SPECIFICATIONS.md`
- **Issue Template**: `.github/ISSUE_TEMPLATE/frontend-feature.md`

---

## Questions?

If you need clarification on any issue:
1. Check the detailed description in `FRONTEND_ISSUES.md`
2. Review the implementation roadmap for context
3. Check the API integration guide for endpoint details
4. Review component specifications for UI guidance
5. Ask in team discussions or create a discussion issue

---

## Next Steps

1. ✅ Review this guide
2. ✅ Read through `docs/frontend/FRONTEND_ISSUES.md`
3. ✅ Set up milestones in GitHub
4. ✅ Create project board
5. ✅ Start creating issues (high priority first)
6. ✅ Assign issues to team members
7. ✅ Begin Phase 1 development

Happy coding! 🚀
