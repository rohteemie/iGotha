# React Native Component Specifications

This document provides detailed specifications for all reusable components in the iGotha chat application.

## Table of Contents
- [Design System](#design-system)
- [Base Components](#base-components)
- [Authentication Components](#authentication-components)
- [User Components](#user-components)
- [Chat Components](#chat-components)
- [Message Components](#message-components)
- [Group Components](#group-components)
- [Navigation Components](#navigation-components)

---

## Design System

### Color Palette
```typescript
export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA3FF',
  
  // Secondary colors
  secondary: '#5856D6',
  secondaryDark: '#3F3DB3',
  secondaryLight: '#8180E6',
  
  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  gray1: '#1C1C1E',
  gray2: '#2C2C2E',
  gray3: '#3A3A3C',
  gray4: '#48484A',
  gray5: '#636366',
  gray6: '#8E8E93',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  backgroundTertiary: '#E5E5EA',
  
  // Dark mode
  dark: {
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
  },
  
  // Chat specific
  sentMessageBg: '#007AFF',
  receivedMessageBg: '#E5E5EA',
  onlineIndicator: '#34C759',
  offlineIndicator: '#8E8E93',
};
```

### Typography
```typescript
export const typography = {
  h1: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  small: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 13,
  },
};
```

### Spacing
```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

---

## Base Components

### Button Component

```typescript
// components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : colors.primary} />
      ) : (
        <>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  outlineText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  textText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  icon: {
    marginRight: spacing.xs,
  },
});
```

**Usage:**
```typescript
<Button title="Login" onPress={handleLogin} />
<Button title="Cancel" variant="outline" onPress={handleCancel} />
<Button title="Loading..." loading={true} />
```

---

### TextInput Component

```typescript
// components/TextInput.tsx
import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';

interface TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  disabled,
  multiline,
  numberOfLines,
  autoCapitalize = 'none',
  keyboardType = 'default',
  leftIcon,
  rightIcon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.error,
          disabled && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <RNTextInput
          style={[styles.input, multiline && styles.multiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray6}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray1,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: spacing.md,
  },
  focused: {
    borderColor: colors.primary,
  },
  error: {
    borderColor: colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: colors.gray1,
    paddingVertical: spacing.sm,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
```

**Usage:**
```typescript
<TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  keyboardType="email-address"
/>
```

---

### Avatar Component

```typescript
// components/Avatar.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface AvatarProps {
  source?: string;
  name: string;
  size?: 'small' | 'medium' | 'large' | number;
  online?: boolean;
  showOnlineIndicator?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  online = false,
  showOnlineIndicator = false,
}) => {
  const getSize = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 80;
      default:
        return 48;
    }
  };

  const avatarSize = getSize();
  const fontSize = avatarSize / 2.5;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={[styles.container, { width: avatarSize, height: avatarSize }]}>
      {source ? (
        <Image source={{ uri: source }} style={styles.image} />
      ) : (
        <View style={[styles.placeholder, { width: avatarSize, height: avatarSize }]}>
          <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
        </View>
      )}
      {showOnlineIndicator && (
        <View
          style={[
            styles.onlineIndicator,
            {
              backgroundColor: online ? colors.onlineIndicator : colors.offlineIndicator,
              width: avatarSize / 5,
              height: avatarSize / 5,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  placeholder: {
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.white,
  },
});
```

**Usage:**
```typescript
<Avatar name="John Doe" size="large" online showOnlineIndicator />
<Avatar source="https://example.com/avatar.jpg" name="Jane Doe" />
```

---

### Loading Component

```typescript
// components/Loading.tsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  text,
  fullScreen = false,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  fullScreen: {
    flex: 1,
  },
  text: {
    marginTop: spacing.md,
    fontSize: 17,
    color: colors.gray5,
  },
});
```

---

### ErrorMessage Component

```typescript
// components/ErrorMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button title="Retry" variant="outline" onPress={onRetry} size="small" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  message: {
    fontSize: 17,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
```

---

## Chat Components

### ChatListItem Component

```typescript
// components/chats/ChatListItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from '../Avatar';

interface ChatListItemProps {
  chat: {
    id: number;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    avatar?: string;
    online?: boolean;
    isGroup: boolean;
  };
  onPress: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Avatar
        source={chat.avatar}
        name={chat.name}
        size="medium"
        online={chat.online}
        showOnlineIndicator={!chat.isGroup}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={styles.timestamp}>{chat.timestamp}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat.lastMessage}
          </Text>
          {chat.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundTertiary,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: colors.gray1,
  },
  timestamp: {
    fontSize: 13,
    color: colors.gray6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 15,
    color: colors.gray5,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
```

---

### MessageBubble Component

```typescript
// components/messages/MessageBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageBubbleProps {
  message: {
    id: number;
    content: string;
    timestamp: string;
    isSent: boolean;
    senderName?: string;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
  };
  showSenderName?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showSenderName = false,
}) => {
  const { content, timestamp, isSent, senderName, status } = message;

  return (
    <View style={[styles.container, isSent ? styles.sent : styles.received]}>
      {showSenderName && !isSent && senderName && (
        <Text style={styles.senderName}>{senderName}</Text>
      )}
      <View style={[styles.bubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
        <Text style={[styles.content, isSent ? styles.sentContent : styles.receivedContent]}>
          {content}
        </Text>
        <View style={styles.footer}>
          <Text
            style={[styles.timestamp, isSent ? styles.sentTimestamp : styles.receivedTimestamp]}
          >
            {timestamp}
          </Text>
          {isSent && status && (
            <Text style={styles.status}>
              {status === 'sending' ? '...' : status === 'sent' ? '✓' : '✓✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  sent: {
    alignItems: 'flex-end',
  },
  received: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 13,
    color: colors.gray6,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sentBubble: {
    backgroundColor: colors.sentMessageBg,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: colors.receivedMessageBg,
    borderBottomLeftRadius: 4,
  },
  content: {
    fontSize: 17,
    lineHeight: 22,
  },
  sentContent: {
    color: colors.white,
  },
  receivedContent: {
    color: colors.gray1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  timestamp: {
    fontSize: 11,
  },
  sentTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  receivedTimestamp: {
    color: colors.gray6,
  },
  status: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginLeft: spacing.xs,
  },
});
```

---

### MessageInput Component

```typescript
// components/messages/MessageInput.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = 'Type a message...',
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder={placeholder}
        placeholderTextColor={colors.gray6}
        multiline
        maxLength={1000}
      />
      <TouchableOpacity
        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <Icon name="send" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundTertiary,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 17,
    color: colors.gray1,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
```

---

## Summary

This document provides the foundation for building a consistent, reusable component library for the iGotha chat application. Each component:

1. **Follows React Native best practices**
2. **Uses TypeScript for type safety**
3. **Implements consistent styling**
4. **Provides clear prop interfaces**
5. **Includes usage examples**

Additional components should follow these same patterns and conventions to maintain consistency across the application.
