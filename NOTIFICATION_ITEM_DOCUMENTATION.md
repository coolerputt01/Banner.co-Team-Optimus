# NotificationItem Component Documentation

## Overview
`NotificationItem` is a reusable React component that displays individual notifications in the inbox. It provides a rich, interactive notification UI with support for various notification types, user avatars, action buttons, and visual feedback.

---

## What It Does

The component renders a single notification entry with the following capabilities:
- **Visual representation** of different notification types (earnings, followers, comments, likes, etc.)
- **Dynamic icon rendering** based on notification type with color-coded categorization
- **Time formatting** (displays "just now", "5m ago", "2h ago", etc.)
- **Read/Unread state** visual distinction (opacity changes)
- **Interactive actions** with optional action buttons
- **Thumbnail display** for related content (ads, comments, profiles)
- **Play icon overlay** for video ads
- **Hover effects** for better UX

---

## Component Props

```typescript
interface NotificationItemProps {
  notification: Notification;  // The notification data object
  onPress?: () => void;        // Callback when notification is clicked
  onAction?: () => void;       // Callback when action button is clicked
}
```

### Notification Data Structure

```typescript
interface Notification {
  id: string;                                    // Unique identifier
  type: NotificationType;                        // Type of notification
  title: string;                                 // Notification title
  message: string;                               // Notification message
  timestamp: string;                             // ISO timestamp
  isRead: boolean;                               // Read/unread state
  actor?: {                                      // User who triggered notification
    id: string;
    name: string;
    avatar: string;
  };
  target?: {                                     // Related content
    id: string;
    type: "ad" | "comment" | "profile";
    thumbnail?: string;
    title?: string;
  };
  amount?: number;                               // For earnings/withdrawal
  currency?: string;                             // Currency code
  actionRequired?: boolean;                      // Whether action button shows
  actionLabel?: string;                          // Text for action button
}
```

### Notification Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `earnings` | 💰 Wallet | Tertiary | Money earned |
| `withdrawal` | 📈 TrendingUp | Tertiary | Withdrawal processed |
| `brand_activity` | 📢 Megaphone | Secondary | Brand/advertiser activity |
| `like` | ❤️ Heart | Primary | Content liked |
| `follow` | 👤 UserPlus | Primary | New follower |
| `comment` | 💬 MessageCircle | Primary | New comment on content |
| `reply` | 💬 MessageCircle | Primary | Reply to comment |
| `mention` | @ AtSign | Primary | User mentioned |
| (default) | 💬 MessageCircle | Surface Variant | Unknown type |

---

## How It Works

### 1. **Icon & Color Mapping** (`getIcon` function)
```
Input: notification.type
↓
Switch/Case Logic
↓
Returns: { icon: IconComponent, color: "text-color", bg: "bg-color" }
```
- Maps notification types to appropriate Lucide React icons
- Assigns theme colors (primary, secondary, tertiary)
- Provides background color for icon containers

### 2. **Time Formatting** (`formatTimeAgo` function)
```
Input: ISO timestamp string
↓
Calculate difference from current time
↓
Logic:
  - < 1 minute → "just now"
  - < 60 minutes → "5m ago"
  - < 24 hours → "2h ago"
  - < 7 days → "3d ago"
  - >= 7 days → "05/14/2026"
↓
Returns: Formatted string
```

### 3. **Rendering Flow**

```
NotificationItem
├── Left Section: Avatar or Icon
│   ├── IF actor exists: Show actor avatar
│   └── ELSE: Show colored icon badge
├── Middle Section: Content
│   ├── Title + Time (row)
│   ├── Message text
│   └── IF actionRequired: Show action button
└── Right Section: Optional thumbnail
    ├── IF target.thumbnail exists: Show image
    └── IF target.type === "ad": Show play icon overlay
```

### 4. **Interactivity**
- **Click on notification**: Triggers `onPress()` callback
- **Click action button**: 
  - Stops propagation (prevents triggering `onPress`)
  - Calls `onAction()` callback
- **Hover state**: Opacity reduces from 100% to 80%

### 5. **Visual States**
- **Unread** (`isRead = false`): Full opacity (100%)
- **Read** (`isRead = true`): Reduced opacity (70%) - visual distinction

---

## UI Components & Styling

### Layout Structure
```
┌─────────────────────────────────────────┐
│ [Avatar/Icon] | Title        | Time    │
│               | Message             │
│               | [Action Button] [Thumbnail] │
└─────────────────────────────────────────┘
```

### Key Classes Used
- `flex items-start gap-4`: Main container alignment
- `cursor-pointer transition-opacity`: Interactive state
- `hover:opacity-80`: Hover feedback
- `w-12 h-12 rounded-full`: Avatar dimensions
- `bg-primary text-white`: Action button styling
- `rounded-lg bg-surface-container`: Thumbnail container

### Colors Used
- **Primary**: Main CTAs and engagement notifications (likes, follows, comments)
- **Secondary**: Brand activity notifications
- **Tertiary**: Financial notifications (earnings, withdrawals)
- **Surface Variant**: Default fallback

---

## User Interactions & Flows

### Scenario 1: User Clicks Notification
```
User clicks notification
  ↓
onPress() triggered
  ↓
Typical UX: Navigate to related content or open detail view
```

### Scenario 2: User Clicks Action Button
```
User clicks action button
  ↓
Event propagation stopped
  ↓
onAction() triggered (e.g., approve withdrawal, accept follow)
  ↓
Notification remains visible but updates state
```

### Scenario 3: Viewing Unread Notification
```
Unread notification displays
  ↓
Full opacity (100%) catches user attention
  ↓
User reads it
  ↓
Parent component marks as read
  ↓
Component re-renders with reduced opacity (70%)
```

---

## Example Usage

```tsx
<NotificationItem
  notification={{
    id: "notif_123",
    type: "like",
    title: "John Doe liked your video",
    message: "Your trending video got a new like",
    timestamp: "2026-05-14T10:30:00Z",
    isRead: false,
    actor: {
      id: "user_456",
      name: "John Doe",
      avatar: "https://example.com/john.jpg"
    },
    target: {
      id: "video_789",
      type: "ad",
      thumbnail: "https://example.com/thumbnail.jpg"
    }
  }}
  onPress={() => navigateToVideo()}
  onAction={undefined}
/>
```

---

## Key Features Summary

✅ **Type-aware rendering**: Different icons/colors per notification type  
✅ **Relative time display**: Human-readable time formatting  
✅ **Read state indication**: Visual distinction for read/unread  
✅ **Action buttons**: Optional interactive CTAs  
✅ **Rich media support**: Thumbnails with video indicators  
✅ **Accessible avatars**: Shows user who triggered notification  
✅ **Hover feedback**: Visual feedback on interaction  
✅ **Event handling**: Separate callbacks for notification and action clicks  
✅ **Theme-aware**: Uses design system colors (primary, secondary, tertiary)  

---

## Technical Considerations

- **Performance**: Lightweight component, re-renders only when props change
- **Type Safety**: Full TypeScript support with interfaces
- **Accessibility**: Uses semantic HTML and alt text for images
- **Responsiveness**: Flex-based layout adapts to container size
- **Icons**: Uses Lucide React for consistent, scalable icons
- **Styling**: Tailwind CSS for rapid UI development

---

## Future Enhancement Ideas

1. **Swipe actions**: Add left/right swipe for delete/archive on mobile
2. **Grouped notifications**: Combine similar notifications (e.g., "5 people liked your video")
3. **Animation**: Add entrance/exit animations
4. **Drag & drop**: Allow reordering notifications
5. **Notification sounds**: Optional audio feedback
6. **Rich media preview**: Expand thumbnails on hover
7. **Quick actions**: Additional icon buttons for common actions
8. **Translation support**: i18n for "just now", "m ago", etc.

