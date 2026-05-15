# Banner.co - Project Documentation & PRD

## Executive Summary

**Banner.co** is a modern, mobile-first web application that enables users to earn money by watching advertisements and engaging with brand content. Users build social profiles, manage earnings, and interact with personalized ad feeds while brands get targeted exposure through a gamified ad service.

**Target Users**: Content creators, digital natives, and users looking to monetize their time
**Platform**: Web app built with React + TypeScript
**Status**: Active Development

---

## 1. Project Vision & Goals

### Vision
Create an engaging, profitable alternative social platform where users are rewarded for their attention and engagement with brand content, while providing brands with a direct, engaged audience for advertising.

### Key Objectives
- ✅ Enable users to earn passive income by watching ads
- ✅ Provide transparent, real-time earnings tracking
- ✅ Build a social network around ad consumption
- ✅ Gamify the experience with notifications, stories, and social features
- ✅ Facilitate easy withdrawal of earnings
- ✅ Support multiple brands advertising on the platform

---

## 2. Core Features Overview

### 2.1 Authentication & Onboarding
- **Splash Screen**: Introduces platform with language selection and branding
- **Sign Up**: Create account with email, password, birthday, photo upload, and social login
- **Login**: Email/username + password authentication
- **Social Login**: Quick signup via OAuth (Google, Facebook, etc.)

### 2.2 Feed (Main Page)
The heart of the app - an infinite scrolling feed of advertisements

**Features:**
- Infinite scroll feed with pagination (TikTok/Instagram style)
- Two feed tabs: "For You" (personalized) and "Explore" (discovery)
- Video/image ads from brands
- Engagement stats: likes, comments, bookmarks, shares
- Brand information display (avatar, name, verified badge)
- Real-time earnings tracking as ads are viewed
- Ad category display
- Lazy loading and performance optimization
- Responsive design for mobile and desktop

**User Actions:**
- Like ads
- Comment on ads
- Bookmark ads for later
- Share ads on social media (Twitter, WhatsApp, Instagram, copy link)
- Track watch time and see live earnings accumulation

### 2.3 User Profile
Personalized dashboard showing user stats and activity

**Sub-sections:**

#### Profile Header
- Avatar, cover image, name, username
- Bio/description
- Verification badge
- Join date

#### Earnings Stats
**Key Metrics Displayed:**
- Total Earned (lifetime)
- Available Balance (ready to withdraw)
- Pending Balance (not yet cleared)
- Ads Watched (total count)
- Watch Time (total minutes)
- Currency (e.g., ₦ Nigerian Naira, or USD)

#### Wallet Card
- Quick view of available balance
- Withdrawal status
- Transaction history
- Quick action buttons

#### Profile Tabs (4 sections)
1. **Bookmarks Tab**: Grid of saved ads for later viewing
   - Brand name, headline, thumbnail
   - Category, earnings value, view count
   - Timestamp (bookmarkedAt)

2. **Shared Tab**: Social media shares history
   - Platform (Twitter, WhatsApp, Instagram, copy)
   - Timestamp
   - Thumbnail preview

3. **Earnings Tab**: Detailed earnings breakdown
   - Daily/monthly charts
   - Revenue by ad category
   - Top performing brands
   - Complete transaction history with status

4. **Activity Tab**: Timeline of user actions
   - Comments made
   - Likes given
   - Shares performed
   - Ad interactions timeline

### 2.4 Inbox & Notifications System
Real-time notifications and stories from other users

**Stories Section:**
- Display stories from followed users
- Current user's own story (with "Your Story" indicator)
- Story view tracking
- Active status indicator
- Avatar galleries

**Notification Tabs (4 categories):**
1. **All**: Every notification
2. **Replies**: Comments/replies to user's content
3. **Mentions**: Posts where user was mentioned
4. **Earnings**: Payment-related notifications

**Notification Types** (8 types with icons):
- 💰 **Earnings**: New money earned
- 📈 **Withdrawal**: Withdrawal processed/status
- 📢 **Brand Activity**: Brand updates, campaigns, announcements
- ❤️ **Like**: Someone liked user's content
- 👤 **Follow**: New follower
- 💬 **Comment**: New comment on content
- 💬 **Reply**: Reply to user's comment
- @ **Mention**: User was mentioned in content

**Notification Features:**
- Rich notification items with actor avatars
- Relative timestamps ("5m ago", "2h ago", "3d ago")
- Optional action buttons (e.g., "Approve Withdrawal", "Accept Follow")
- Thumbnail previews for related content
- Play icon overlay for video ads
- Read/unread state (opacity changes)
- Click to view full details

### 2.5 Settings & Preferences
User account and app customization

**Settings Sections:**
- **Account Management**: Edit profile, change password, email settings
- **Privacy**: Notification preferences, content visibility, blocked users
- **Appearance**: Theme selection (Light, Dark, System)
- **Payment Methods**: Add/edit withdrawal destinations
- **Help & Support**: FAQ, contact support, report issues
- **Logout**: Secure session termination

**Theme Options:**
- Light Mode
- Dark Mode
- System (follows device settings)

### 2.6 Navigation
Persistent navigation bar for main sections

**Navigation Options:**
- 🏠 Feed (Main feed of ads)
- 💳 Wallet (Earnings & transactions)
- 📬 Inbox (Notifications & stories)
- 👤 Profile (User profile & stats)

---

## 3. User Flows

### 3.1 New User Onboarding Flow
```
Splash Screen (Language Select)
    ↓
Sign Up / Social Login
    ↓
Complete Profile (Birthday, Photo, Bio)
    ↓
Feed Page (Start watching ads)
    ↓
Earn money from first ad watch
    ↓
Explore Profile → View Earnings
    ↓
Build followers → Get notifications
```

### 3.2 Returning User Flow
```
Splash Screen
    ↓
Login (Email/Username + Password)
    ↓
Feed Page (Personalized ads)
    ↓
Navigate between Feed/Inbox/Profile/Settings
    ↓
Manage earnings & withdraw funds
```

### 3.3 Monetization Flow (Watch → Earn → Withdraw)
```
1. User watches ad (30 sec - 2 min video)
   ↓
2. Earnings accrue in "Available Balance"
   ↓
3. Accumulate minimum threshold (e.g., ₦500)
   ↓
4. Initiate withdrawal
   ↓
5. Withdrawal enters "Pending" status
   ↓
6. Admin approves withdrawal
   ↓
7. Funds transfer to user's bank/wallet
   ↓
8. Status updates to "Completed"
```

### 3.4 Social Engagement Flow
```
User finds interesting ad
    ↓
Can Like, Comment, Share, or Bookmark
    ↓
Other users see engagement
    ↓
Creates notifications for interactions
    ↓
Builds follower base
    ↓
Gets featured/recommendation boost
```

---

## 4. Technical Architecture

### 4.1 Tech Stack

**Frontend:**
- **React** v19.2.4 - UI library
- **TypeScript** v5.9 - Type safety
- **Vite** v7 - Build tool & dev server (Fast HMR)
- **React Router** v7.13 - Client-side routing
- **Tailwind CSS** v4 - Utility-first CSS framework
- **Framer Motion** v12 - Animations & interactions
- **Lucide React** - Icon library
- **Axios** v1.13 - HTTP client
- **React Hook Form** v7.71 - Form management
- **Recharts** v3.8 - Data visualization (charts)
- **Date-fns** v4.1 - Date manipulation
- **React Share** v5.2 - Social media sharing
- **PostCSS** & **Autoprefixer** - CSS processing

**Development Tools:**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** strict mode

### 4.2 Project Structure
```
src/
├── pages/                    # Route pages
│   ├── Splash.tsx           # Onboarding/landing
│   ├── SignUp.tsx           # User registration
│   ├── Login.tsx            # User authentication
│   ├── Feed.tsx             # Main ad feed
│   ├── UserProfile.tsx      # Profile & earnings dashboard
│   ├── Inbox.tsx            # Notifications & stories
│   └── Settings.tsx         # User preferences
│
├── components/              # Reusable UI components
│   ├── auth/                # Authentication components
│   │   ├── AuthHeader.tsx
│   │   ├── AuthInput.tsx
│   │   ├── PasswordInput.tsx
│   │   ├── BirthdaySelector.tsx
│   │   ├── ProfilePhotoUpload.tsx
│   │   ├── SignUpForm.tsx
│   │   └── SocialLoginButtons.tsx
│   │
│   ├── feed/                # Feed components
│   │   ├── FeedHeader.tsx
│   │   ├── VideoCard.tsx    # Individual ad card
│   │   ├── ActionRail.tsx   # Like/comment/share buttons
│   │   ├── BrandInfo.tsx
│   │   ├── EarningBadge.tsx # Live earnings display
│   │   └── ProgressBar.tsx
│   │
│   ├── inbox/               # Inbox & notification components
│   │   ├── InboxHeader.tsx
│   │   ├── InboxTabs.tsx    # Tab navigation (All/Replies/Mentions/Earnings)
│   │   ├── NotificationItem.tsx  # Single notification card
│   │   ├── NotificationList.tsx  # List container
│   │   ├── StoriesSection.tsx    # User stories display
│   │   └── EmptyInbox.tsx
│   │
│   ├── userProfile/         # Profile page components
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileHero.tsx
│   │   ├── UserInfo.tsx
│   │   ├── EarningsStats.tsx  # Earnings dashboard
│   │   ├── WalletCard.tsx     # Balance card
│   │   ├── ProfileTabs.tsx    # Tab navigation
│   │   ├── BookmarksGrid.tsx  # Saved ads
│   │   └── ActivityList.tsx   # User activity timeline
│   │
│   ├── settings/            # Settings components
│   │   ├── SettingsHeader.tsx
│   │   ├── SettingsSection.tsx
│   │   ├── SettingsItems.tsx
│   │   ├── SettingsAppearance.tsx
│   │   ├── ToggleItem.tsx
│   │   ├── ThemeOption.tsx
│   │   └── SettingLogout.tsx
│   │
│   ├── navigation/          # Navigation components
│   │   └── Navigation.tsx   # Bottom/side nav bar
│   │
│   ├── common/              # Shared utilities
│   │   ├── Divider.tsx
│   │   └── TermsText.tsx
│   │
│   └── splash/              # Splash screen components
│       ├── SplashHeader.tsx
│       ├── SplashLogo.tsx
│       ├── SplashButtons.tsx
│       ├── LanguageSelector.tsx
│       └── index.tsx
│
├── contexts/                # React Context API
│   └── ThemeContext.tsx    # Theme (light/dark) management
│
├── hooks/                   # Custom React hooks
│   ├── useTheme.ts         # Access theme context
│   └── useInfiniteScroll.ts # Pagination logic
│
├── types/                   # TypeScript interfaces
│   ├── index.ts
│   ├── auth.ts             # Auth-related types
│   ├── feed.ts             # Feed & ad types
│   ├── inbox.ts            # Notification & story types
│   ├── user.ts             # User & earnings types
│   └── settingsType.ts
│
├── services/                # API integration
│   └── axios.config.ts     # Axios HTTP client setup
│
├── data/                    # Mock/static data
│   └── feed.json           # Sample ad data
│
├── styles/                  # Global styles
│   └── (Tailwind config in tailwind.config.ts)
│
├── App.tsx                 # Main app component with routing
├── main.tsx                # React render entry point
└── index.css               # Global CSS
```

### 4.3 Data Models

#### Ad (Feed Item)
```typescript
{
  id: string;                      // Unique identifier
  brand: {
    name: string;                  // Brand name
    username: string;              // Brand handle
    avatar: string;                // Brand logo URL
    verified: boolean;             // Verification status
  };
  content: {
    headline: string;              // Ad title
    category: string;              // Category (Fashion, Tech, etc.)
    isAd: boolean;                 // Flag if is advertisement
    thumbnail: string;             // Ad thumbnail image
    videoUrl?: string;             // Video URL for video ads
  };
  earnings: number;                // Amount user earns for viewing
  stats: {
    likes: number;                 // Total likes
    comments: number;              // Total comments
    bookmarks: number;             // Total bookmarks
    shares: number;                // Total social shares
  };
}
```

#### User Profile
```typescript
{
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  isVerified: boolean;
  joinDate: string;
}
```

#### Earnings
```typescript
{
  totalEarned: number;             // Lifetime earnings
  availableBalance: number;        // Ready to withdraw
  pendingBalance: number;          // Waiting for approval
  adsWatched: number;              // Total ads viewed
  watchTime: number;               // Total minutes watched
  currency: string;                // E.g., "₦" for Naira
}
```

#### Notification
```typescript
{
  id: string;
  type: "earnings" | "withdrawal" | "brand_activity" | "like" | 
        "follow" | "comment" | "reply" | "mention";
  title: string;                   // Notification title
  message: string;                 // Full message
  timestamp: string;               // ISO date string
  isRead: boolean;                 // Read status
  actor?: {                        // User who triggered it
    id: string;
    name: string;
    avatar: string;
  };
  target?: {                       // Related content
    id: string;
    type: "ad" | "comment" | "profile";
    thumbnail?: string;
    title?: string;
  };
  actionRequired?: boolean;        // Show action button
  actionLabel?: string;            // Button text (e.g., "Approve")
}
```

### 4.4 Route Structure
```
/                    → Splash (landing)
/signup              → Sign Up page
/login               → Login page
/feed                → Main feed (logged in)
/user-profile        → User profile dashboard
/settings            → Settings & preferences
/inbox               → Notifications & stories
```

---

## 5. Key Features Deep Dive

### 5.1 Infinite Scroll Feed
**How it works:**
- Loads ads in batches (e.g., 10-20 per page)
- Detects when user scrolls near bottom (within 200px)
- Automatically fetches next batch
- Unique IDs generated per ad with pagination suffix
- Smooth loading states with skeleton screens

**Benefits:**
- Keeps user engaged continuously
- Reduces initial load time
- Simulates TikTok/Instagram experience
- Performance optimized with ref-based scroll detection

### 5.2 Earnings Tracking
**Real-time features:**
- Earnings badge appears when ad is watched
- Live counter updates
- Automatic categorization by ad type
- Historical tracking in user profile
- Transaction logs with timestamps and status

**Earning States:**
- **Available**: Ready to withdraw immediately
- **Pending**: Waiting for admin approval or hold period
- **Completed**: Successfully withdrawn

### 5.3 Social Engagement System
**Types of interactions:**
- Like (❤️ icon, counter)
- Comment (💬 icon, nested replies)
- Bookmark (🔖 saved in profile)
- Share (🔗 to Twitter/WhatsApp/Instagram/clipboard)

**Engagement Benefits:**
- User grows follower base
- Creator reputation built
- Content discovery improved
- Social proof encourages engagement

### 5.4 Notification System
**Delivery methods:**
- In-app notifications (Inbox)
- Notification badges with counts
- Real-time updates
- Read/unread state management
- Timestamped notifications

**Actionable notifications:**
- Withdrawal approvals
- Follow requests
- Campaign invitations
- Payment confirmations

### 5.5 Theme System
**Implementation:**
- Light mode for daytime use
- Dark mode for eyestrain reduction
- System preference auto-detection
- Persisted user preference
- Dynamic color scheme switching

**Applies to:**
- Background colors
- Text colors
- Component styling
- All UI elements

---

## 6. User Experience Flows

### 6.1 First-Time User Experience (FTUE)
```
1. Land on Splash
   ↓
2. Select Language (multiple language support)
   ↓
3. Click "Sign Up"
   ↓
4. Fill Registration Form:
   - Email
   - Password
   - Name
   - Birthday
   - Upload Profile Photo
   ↓
5. Complete Profile
   ↓
6. Redirected to Feed
   ↓
7. See welcome toast, first ad displayed
   ↓
8. Watch ad, see earnings +₦5 in real-time
   ↓
9. Can bookmark or share ad
   ↓
10. Scroll down for next ad (infinite scroll)
```

### 6.2 Daily Active User (DAU) Flow
```
1. Open app → sees Splash
2. Login with saved credentials
3. Redirects to Feed
4. Scrolls through daily ads
5. Interacts (likes, comments, bookmarks, shares)
6. Checks Inbox for notifications
7. Views Profile to see earnings progress
8. Adjusts Settings as needed
9. Returns to Feed to continue earning
```

### 6.3 Withdrawal Flow
```
1. User accumulates ₦2,500 (minimum)
2. Views Wallet in Profile
3. Clicks "Withdraw" button
4. Selects withdrawal method:
   - Bank transfer
   - Mobile money
   - Digital wallet
5. Enters destination details
6. Confirms transaction
7. Receives notification: "Withdrawal Pending"
8. Status shows "Processing (2-3 business days)"
9. Receives notification: "Withdrawal Approved"
10. Money appears in bank/wallet
11. Status updates to "Completed"
```

---

## 7. Feature Comparison with Market

| Feature | Banner.co | TikTok | Instagram | YouTube |
|---------|-----------|--------|-----------|---------|
| Watch ads | ✅ Primary | ❌ | ❌ | Limited |
| Earn money | ✅ Direct | ✅ Limited (creators) | ✅ Limited (creators) | ✅ Creator fund |
| Social feed | ✅ | ✅ | ✅ | ❌ |
| Real-time earnings | ✅ | ❌ | ❌ | Delayed |
| Easy withdrawal | ✅ | ❌ | ❌ | Complex |
| Stories | ✅ | ✅ | ✅ | ❌ |
| Direct notifications | ✅ | ✅ | ✅ | ✅ |
| Mobile optimized | ✅ | ✅ | ✅ | ✅ |

---

## 8. Technical Decision Rationale

### Why React + TypeScript?
- ✅ Type safety prevents runtime errors
- ✅ Large ecosystem and community
- ✅ Component reusability
- ✅ Strong tooling (ESLint, Vite, etc.)
- ✅ Easy to scale and maintain

### Why Vite instead of Create React App?
- ✅ 10x faster startup time (ES modules)
- ✅ Near-instantaneous HMR (Hot Module Reload)
- ✅ Smaller build size (rollup optimized)
- ✅ Better dev experience
- ✅ Active maintenance

### Why Tailwind CSS?
- ✅ Rapid development (utility-first)
- ✅ Consistent design system
- ✅ Smaller bundle than component libraries
- ✅ Easy dark mode support
- ✅ Responsive design built-in

### Why React Router v7?
- ✅ Client-side routing for SPA
- ✅ Lazy loading routes
- ✅ Nested route support
- ✅ Zero-runtime overhead

### Why Context API + Hooks?
- ✅ Simple theme management
- ✅ Avoid prop drilling
- ✅ Built into React (no external dependency)
- ✅ Sufficient for current scale

---

## 9. Performance Considerations

### Current Optimizations
1. **Infinite scroll pagination**: Loads ads on demand
2. **Image lazy loading**: Defers image loading
3. **Component code splitting**: Route-based async imports
4. **Vite build optimization**: Fast production builds
5. **Tailwind CSS purging**: Only includes used styles

### Future Improvements
1. Service Workers for offline support
2. Image optimization (WebP, next-gen formats)
3. Cdn integration for static assets
4. GraphQL for efficient API calls
5. Virtual scrolling for massive lists

---

## 10. Security Considerations

### Current Implementation
- Password input masking
- Client-side form validation
- CORS protection (Axios config)
- Environment variables for secrets

### Recommended Additions
- JWT tokens for authentication
- Secure storage of refresh tokens
- Rate limiting on API calls
- HTTPS enforcement
- CSP (Content Security Policy) headers
- Input sanitization for user-generated content

---

## 11. Future Roadmap

### Phase 1 (Current)
- ✅ Core ad feed
- ✅ User profile & earnings
- ✅ Notifications system
- ✅ Authentication
- ✅ Settings

### Phase 2 (Q3 2026)
- 🔄 Direct brand messaging
- 🔄 User-created content (ads)
- 🔄 Gamification (badges, leaderboards)
- 🔄 Referral program
- 🔄 Enhanced analytics

### Phase 3 (Q4 2026)
- 🔄 Live streaming with ads
- 🔄 Marketplace for digital goods
- 🔄 Creator sponsorship system
- 🔄 AI-powered personalization
- 🔄 Multi-language support (backend)

### Phase 4 (2027+)
- 🔄 Mobile apps (iOS/Android) via React Native
- 🔄 Brand dashboard
- 🔄 Advanced targeting engine
- 🔄 Creator studio
- 🔄 Web3 integration (rewards as tokens)

---

## 12. Success Metrics (KPIs)

### User Engagement
- DAU (Daily Active Users)
- MAU (Monthly Active Users)
- Session duration (target: 15+ min)
- Ads watched per user (target: 10+ daily)

### Monetization
- Average earnings per user (target: ₦50-100/day)
- Withdrawal rate (target: 60%+ of earned)
- Ad completion rate (target: 85%+)
- Brand ROI on advertising

### Quality
- App stability (uptime: 99.9%)
- Load time (target: <2s on 4G)
- Bug report resolution time
- User satisfaction (NPS: 50+)

---

## 13. FAQ & Common Questions

**Q: How does Banner.co make money?**
A: 70/30 split - Users keep 70% of ad revenue, platform takes 30% commission.

**Q: Is it free to join?**
A: Yes, completely free. Sign up with email or social login.

**Q: How much can I earn?**
A: Depends on ads watched, location, engagement. Average ₦50-200/day.

**Q: When can I withdraw?**
A: After reaching minimum (₦500). Withdrawals process in 2-3 business days.

**Q: Is my data safe?**
A: Yes. We use encryption, secure servers, and follow data protection laws.

**Q: Can I delete my account?**
A: Yes, anytime from Settings. Data is deleted within 30 days.

**Q: Why am I seeing fewer ads?**
A: Ads are personalized based on interests, location, and engagement history.

**Q: How do I report a bug?**
A: Go to Settings → Help & Support → Report Issue

---

## 14. Conclusion

Banner.co represents a paradigm shift in digital advertising - from passive content consumption to active, rewarded participation. By combining social features, real-time earnings, and seamless withdrawals, the platform creates a win-win for both users and brands.

The technical architecture is built for scale, performance, and maintainability, with clear expansion pathways toward mobile platforms and advanced creator tools.

