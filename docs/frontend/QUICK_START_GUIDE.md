# Frontend Quick Start Guide

This guide will help you set up and start developing the iGotha React Native frontend application.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v16 or higher): [Download](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js
- **Git**: [Download](https://git-scm.com/)

### For iOS Development (Mac only)
- **Xcode** (latest version): [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **CocoaPods**: `sudo gem install cocoapods`

### For Android Development
- **Android Studio**: [Download](https://developer.android.com/studio)
- **Android SDK** (API level 29 or higher)
- **Java Development Kit (JDK)** 11 or higher

### Optional Tools
- **React Native Debugger**: [Download](https://github.com/jhen0409/react-native-debugger)
- **VS Code**: [Download](https://code.visualstudio.com/)
- **VS Code Extensions**:
  - React Native Tools
  - ESLint
  - Prettier
  - React-Native/React/Redux snippets

---

## Setup Options

Choose one of the following setup methods:

### Option 1: React Native CLI (Recommended for Production)

#### Step 1: Install React Native CLI
```bash
npm install -g react-native-cli
```

#### Step 2: Create New Project
```bash
# Navigate to your workspace
cd /path/to/your/workspace

# Create React Native app with TypeScript template
npx react-native init iGothaApp --template react-native-template-typescript

# Navigate to project directory
cd iGothaApp
```

#### Step 3: Install Dependencies
```bash
# Install core dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install @reduxjs/toolkit react-redux redux-persist
npm install axios socket.io-client
npm install react-native-vector-icons

# Install dev dependencies
npm install --save-dev @types/react-native-vector-icons
```

#### Step 4: iOS Setup (Mac only)
```bash
cd ios
pod install
cd ..
```

#### Step 5: Run the App
```bash
# For iOS
npx react-native run-ios

# For Android (start emulator first)
npx react-native run-android
```

---

### Option 2: Expo (Easier for Beginners)

#### Step 1: Install Expo CLI
```bash
npm install -g expo-cli
```

#### Step 2: Create New Project
```bash
# Create Expo app with TypeScript
npx create-expo-app iGothaApp --template

# Navigate to project
cd iGothaApp
```

#### Step 3: Install Dependencies
```bash
# Install navigation
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# Install state management
npm install @reduxjs/toolkit react-redux redux-persist

# Install networking
npm install axios socket.io-client

# Install async storage
npx expo install @react-native-async-storage/async-storage

# Install icons
npx expo install @expo/vector-icons
```

#### Step 4: Run the App
```bash
npx expo start

# Then:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on your phone
```

---

## Project Structure Setup

After creating your project, set up the following structure:

```bash
iGothaApp/
├── src/
│   ├── api/              # API client and services
│   │   ├── apiClient.ts
│   │   └── services/
│   │       ├── authService.ts
│   │       ├── userService.ts
│   │       ├── chatService.ts
│   │       ├── messageService.ts
│   │       └── groupService.ts
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable components
│   │   ├── Button.tsx
│   │   ├── TextInput.tsx
│   │   ├── Avatar.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorMessage.tsx
│   ├── navigation/       # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── ChatNavigator.tsx
│   ├── screens/          # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── chats/
│   │   ├── users/
│   │   ├── groups/
│   │   └── settings/
│   ├── store/            # Redux store and slices
│   │   ├── index.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── chatsSlice.ts
│   │       ├── messagesSlice.ts
│   │       ├── usersSlice.ts
│   │       └── groupsSlice.ts
│   ├── styles/           # Theme and global styles
│   │   ├── theme.ts
│   │   ├── colors.ts
│   │   └── typography.ts
│   ├── utils/            # Utility functions
│   │   ├── validation.ts
│   │   ├── dateUtils.ts
│   │   └── socketManager.ts
│   ├── constants/        # Constants and enums
│   │   └── index.ts
│   └── types/            # TypeScript type definitions
│       └── index.ts
├── App.tsx
├── package.json
└── tsconfig.json
```

### Create Directory Structure
```bash
mkdir -p src/{api/services,assets,components,navigation,screens/{auth,chats,users,groups,settings},store/slices,styles,utils,constants,types}
```

---

## Configuration Files

### 1. Environment Variables

Create `.env` file in project root:
```bash
# Backend API URL
API_ENDPOINT=http://localhost:3000

# For production
# API_ENDPOINT=https://api.igotha.com
```

Install environment variables package:
```bash
npm install react-native-config
# or for Expo
npx expo install expo-constants
```

### 2. TypeScript Configuration

Ensure `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2017", "esnext"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": "./src",
    "paths": {
      "@api/*": ["api/*"],
      "@components/*": ["components/*"],
      "@screens/*": ["screens/*"],
      "@navigation/*": ["navigation/*"],
      "@store/*": ["store/*"],
      "@utils/*": ["utils/*"],
      "@styles/*": ["styles/*"],
      "@constants/*": ["constants/*"],
      "@types/*": ["types/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

### 3. ESLint Configuration

Create `.eslintrc.js`:
```javascript
module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
```

### 4. Prettier Configuration

Create `.prettierrc.js`:
```javascript
module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  printWidth: 100,
  tabWidth: 2,
};
```

---

## Initial Setup Code

### 1. Create API Client

Create `src/api/apiClient.ts`:
```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.API_ENDPOINT || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
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
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
```

### 2. Create Redux Store

Create `src/store/index.ts`:
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// Import slices (create these files)
// import authReducer from './slices/authSlice';
// import chatsReducer from './slices/chatsSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  // auth: authReducer,
  // chats: chatsReducer,
  // Add other reducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3. Update App.tsx

```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from './src/store';
import { Loading } from './src/components/Loading';

// Import your navigator when ready
// import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading fullScreen />} persistor={persistor}>
        <NavigationContainer>
          {/* <AppNavigator /> */}
          {/* Temporary placeholder */}
          <Loading fullScreen text="Setting up navigation..." />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
```

---

## Running the Backend

The frontend requires the backend to be running:

```bash
# Navigate to backend directory
cd /path/to/iGotha/backend

# Install dependencies
npm install

# Set up environment variables (see backend README)
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx sequelize-cli db:migrate

# Start backend server
npm start

# Backend will run on http://localhost:3000
```

---

## Testing the Setup

### 1. Check Backend Connection
```typescript
// Create a test file: src/utils/testConnection.ts
import apiClient from '../api/apiClient';

export const testBackendConnection = async () => {
  try {
    const response = await apiClient.get('/');
    console.log('Backend connected:', response.data);
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};
```

### 2. Run Linter
```bash
npm run lint
```

### 3. Run Tests (when setup)
```bash
npm test
```

---

## Common Issues and Solutions

### Issue: Metro Bundler Cache Issues
```bash
# Clear cache
npx react-native start --reset-cache
```

### Issue: iOS Build Fails
```bash
# Clean build
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Issue: Android Build Fails
```bash
# Clean gradle
cd android
./gradlew clean
cd ..
```

### Issue: Module Not Found
```bash
# Clear watchman
watchman watch-del-all

# Reset metro
rm -rf $TMPDIR/react-*

# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## Development Workflow

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `npx react-native start`
3. **Run iOS**: `npx react-native run-ios`
4. **Run Android**: `npx react-native run-android`
5. **Open Debugger**: React Native Debugger or Chrome DevTools
6. **Make Changes**: Edit files and see live reload
7. **Test**: Write and run tests as you develop
8. **Commit**: Use Git for version control

---

## Next Steps

1. ✅ Complete this setup guide
2. ✅ Review `docs/frontend/IMPLEMENTATION_ROADMAP.md`
3. ✅ Create GitHub issues from `docs/frontend/HOW_TO_CREATE_ISSUES.md`
4. ✅ Start with **Phase 1: Foundation**
   - Navigation structure
   - Redux setup
   - Theme system
   - Base components
5. ✅ Move to **Phase 2: Authentication**
   - Login screen
   - Registration screen
   - Token management

---

## Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Project Docs
- Implementation Roadmap: `docs/frontend/IMPLEMENTATION_ROADMAP.md`
- API Integration Guide: `docs/frontend/API_INTEGRATION_GUIDE.md`
- Component Specs: `docs/frontend/COMPONENT_SPECIFICATIONS.md`
- Frontend Issues: `docs/frontend/FRONTEND_ISSUES.md`

### Get Help
- GitHub Issues: Report bugs or ask questions
- React Native Community: [Discord](https://discord.gg/react-native)
- Stack Overflow: Tag with `react-native`

---

**Ready to start coding! 🚀**
