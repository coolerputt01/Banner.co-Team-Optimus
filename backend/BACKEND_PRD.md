# Banner-Co Backend - Product Requirements Document

## Overview

Banner-Co is a monetized video ad platform built with FastAPI, SQLAlchemy, and Auth0. The backend enables users to create, publish, and monetize advertisements while allowing engagement through likes, comments, and views. The system features a payment integration with Squadco for campaign funding and a reward system that compensates users for ad interactions.

---

## Table of Contents

1. [Core Functionality](#core-functionality)
2. [System Architecture](#system-architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [User Management](#user-management)
5. [Ad Management & Campaign System](#ad-management--campaign-system)
6. [Engagement Features](#engagement-features)
7. [Payment & Monetization](#payment--monetization)
8. [Data Models](#data-models)
9. [API Endpoints](#api-endpoints)
10. [Technology Stack](#technology-stack)

---

## Core Functionality

### 1. **User Authentication**
- OAuth 2.0 integration with Auth0 using Google as the identity provider
- Users log in via Google credentials through Auth0
- JWT tokens are issued upon successful authentication
- Automatic user creation on first login

### 2. **User Profiles**
- Users maintain profiles with business names, bios, and profile/banner images
- Profile pictures and banners are uploaded to Cloudinary for cloud storage
- Users can update their profile information including images

### 3. **Advertisement Creation & Publishing**
- Users must complete payment for a campaign before creating ads
- Ads can include title, description, media (image/video), and tags (up to 5)
- Each ad is linked to an active, paid campaign
- Media files are uploaded to Cloudinary

### 4. **Campaign & Payment System**
- Campaigns must be purchased before ad creation
- Campaign pricing: ₦499 per day
- Campaigns have a specified duration (in days) and corresponding end date
- Payment is processed through Squadco (Nigerian payment provider)
- Campaign activation occurs after successful payment verification

### 5. **Engagement & Rewards**
- Users earn rewards for:
  - **Views**: When viewing an ad (authenticated users only)
  - **Likes**: When liking an ad
  - **Comments**: When commenting on an ad
- Rewards are tracked in a user's wallet
- Engagement actions are recorded and attributed to specific users

### 6. **Ad Discovery & Feed**
- Users can browse a randomized feed of active ads
- Only paid, active campaigns have ads shown in the feed
- Feed supports pagination with configurable limits (max 50 ads)
- Feed includes engagement metrics (likes, comments, views)

### 7. **Comments & Interactions**
- Authenticated users can comment on ads
- Comments maintain metadata (created_at, updated_at)
- Ad owners and commenters can delete comments
- Comments trigger user rewards

---

## System Architecture

### Technology Stack
- **Framework**: FastAPI 0.111.0
- **Database ORM**: SQLAlchemy 2.0.30 with AsyncPG
- **Authentication**: Auth0 + python-jose (JWT)
- **Media Storage**: Cloudinary
- **Payment Gateway**: Squadco
- **Database**: PostgreSQL (async via AsyncPG)

### Application Flow

```
User Login (Auth0) → User Profile → Campaign Payment (Squadco)
         ↓
    Ad Creation & Publishing
         ↓
    Ad Appears in Feed (to other users)
         ↓
    Engagement (Likes, Comments, Views) → Rewards → Wallet
```

### Key Components

1. **index.py** - Main FastAPI application with all route handlers
2. **database.py** - AsyncSession management and database connection
3. **db_models.py** - SQLAlchemy ORM models for all database entities
4. **models.py** - Pydantic request/response validation schemas
5. **src/auth_route.py** - JWT token verification with Auth0 JWKS
6. **src/crud.py** - Database operation functions (Create, Read, Update, Delete)
7. **src/squadco_service.py** - Payment gateway integration
8. **src/cloudinary_upload.py** - Media upload service

---

## Authentication & Authorization

### OAuth 2.0 Flow with Auth0

```
1. User initiates login → /auth/login
2. Redirect to Auth0 authorization endpoint (with google-oauth2 connection)
3. User authenticates with Google credentials
4. Auth0 redirects back to /auth/callback with authorization code
5. Backend exchanges code for access token via Auth0 Token endpoint
6. Backend retrieves user info from Auth0 userinfo endpoint
7. User created/retrieved in database
8. Access token returned to frontend
```

### JWT Verification
- Each protected endpoint requires a valid JWT access token
- Token is verified against Auth0 JWKS (JSON Web Key Set)
- Token claims include: `sub` (user ID), `email`, and `aud` (audience)
- `get_current_user()` dependency validates tokens on protected routes

### Authorization Patterns
- **Ownership Check**: Users can only modify/delete their own resources
- **Campaign Validation**: Only ads linked to paid campaigns are publishable
- **View Restrictions**: Some endpoints require authentication, others allow anonymous access

---

## User Management

### User Entity
```
User {
  id: String (Auth0 subject claim)
  email: String (unique)
  business_name: String
  profile_picture: String (Cloudinary URL)
  banner_picture: String (Cloudinary URL)
  bio: Text (max 300 chars)
  number_of_ads_watched: Integer
  total_ads_watch_time: Float
  verified: Boolean (default: false)
}
```

### User Operations

| Operation | Endpoint | Method | Auth Required | Notes |
|-----------|----------|--------|---------------|-------|
| Get Profile | `/users/me` | GET | Yes | Returns current user info |
| Update Profile | `/users/me` | PUT | Yes | Supports profile/banner pics, bio, business_name |
| Create User | Auto on login | N/A | N/A | Triggered during Auth0 callback |

### Profile Picture Upload Flow
1. User selects image/file
2. File is read and sent to Cloudinary via `cloudinary_upload`
3. Cloudinary returns permanent URL
4. URL is stored in database (profile_picture or banner_picture field)
5. URL is returned in user profile responses

---

## Ad Management & Campaign System

### Campaign-First Model
**Requirement**: Users must purchase a campaign before creating ads

### Campaign Lifecycle

```
1. User initiates payment → POST /campaigns/initiate
2. System generates campaign record with status="pending"
3. System initializes Squadco payment with checkout URL
4. User completes payment on Squadco
5. Squadco sends webhook notification to backend
6. Campaign status updated to "active" after verification
7. User creates ad linked to active campaign
8. Ad becomes visible in feed to other users
9. Campaign remains active for specified duration_days
10. Campaign status changes to "completed" after expiration
```

### Campaign Entity
```
Campaign {
  id: String (UUID)
  user_id: String (Campaign creator)
  ad_id: String (Linked ad, nullable initially)
  duration_days: Integer (1-N days)
  amount_paid: Decimal (₦499 × duration_days)
  payment_ref: String (Unique payment reference)
  status: String (pending → active → completed)
  start_date: DateTime (Set when ad is created)
  end_date: DateTime (start_date + duration_days)
  created_at: DateTime
}
```

### Pricing Model
- **Base Rate**: ₦499 per day of campaign duration
- **Calculation**: `amount = 499.00 × duration_days`
- **Example**: 1-day campaign = ₦499, 7-day campaign = ₦3,493

---

## Engagement Features

### Likes System

| Operation | Endpoint | Method | Auth Required |
|-----------|----------|--------|---------------|
| Like Ad | `/ads/{ad_id}/like` | POST | Yes |
| Unlike Ad | `/ads/{ad_id}/like` | DELETE | Yes |
| Get Like Count | `/ads/{ad_id}/likes` | GET | No |
| Check If Liked | `/ads/{ad_id}/is-liked` | GET | Yes |

**Behavioral Notes**:
- Each like triggers a reward creation (reward_type="LIKE")
- Only one like per user per ad (unique constraint)
- Unlike action removes the like record and associated reward

### Comments System

| Operation | Endpoint | Method | Auth Required |
|-----------|----------|--------|---------------|
| Add Comment | `/ads/{ad_id}/comments` | POST | Yes |
| List Comments | `/ads/{ad_id}/comments` | GET | No |
| Delete Comment | `/comments/{comment_id}` | DELETE | Yes |

**Behavioral Notes**:
- Comments are text-based, stored with timestamps
- Each comment automatically triggers reward creation (reward_type="COMMENT")
- Comments can be deleted by the author or the ad owner
- Supports pagination (skip, limit parameters)

### Views System

| Operation | Endpoint | Method | Auth Required |
|-----------|----------|--------|---------------|
| Record View | `/ads/{ad_id}/view` | POST | Yes |
| Get View Count | `/ads/{ad_id}/views` | GET | Yes |

**Behavioral Notes**:
- Only authenticated users can record views
- Each unique user-ad pair counts as one view (enforced by unique constraint)
- Views trigger reward creation (reward_type="VIEW")
- System returns: new_view_recorded (boolean), total_views (count)

### Reward System
- **Reward Types**: VIEW, LIKE, COMMENT
- **Trigger**: Each engagement action creates a reward record with status="pending"
- **Credit Status**: Admin process credits pending rewards to user wallets
- **Amount**: Configurable per reward type (stored in database)

---

## Payment & Monetization

### Payment Flow Integration

```
1. User initiates campaign purchase
   POST /campaigns/initiate → { duration_days: 1 }

2. Backend calculates amount
   amount = 499.00 × duration_days

3. Backend creates Squadco payment session
   - Customer email: user's email
   - Amount: in kobo (amount × 100)
   - Currency: NGN (Nigerian Naira)
   - Metadata: user_id, ad_id, campaign_duration_days

4. Squadco returns checkout URL
   System returns: { checkout_url, payment_ref }

5. Frontend redirects user to checkout_url

6. User completes payment on Squadco platform

7. Squadco sends webhook to /webhook/squadco
   - Webhook includes transaction ref
   - Backend verifies signature

8. Backend verifies payment status with Squadco

9. On success:
   - Campaign status updated: pending → active
   - Campaign receives start_date and end_date
   - Ad becomes eligible for feed display
```

### Squadco Webhook Handling
- **Signature Verification**: HMAC-SHA512 validation
- **Event Type**: Checks for "charge_successful" event
- **Transaction Status**: Verifies "Success" status from Squadco API
- **Campaign Activation**: Only activates if all verifications pass

### Wallet System
```
Wallet {
  id: String (UUID)
  user_id: String (unique)
  balance: Decimal (total earned from rewards)
  updated_at: DateTime
}
```

**Operations**:
- Wallet is created when user is created
- Balance accumulates as rewards are credited
- Users can view balance via `/users/me` response

---

## Data Models

### Database Schema Overview

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │
│ profile_pic │
│ verified    │
└─────────────┘
      │
      ├──→ Campaign (1:N)
      ├──→ Ad (1:N)
      ├──→ Wallet (1:1)
      ├──→ UserReward (1:N)
      ├──→ Like (1:N)
      ├──→ Comment (1:N)
      └──→ AdView (1:N)
      
┌─────────────┐
│     Ad      │
├─────────────┤
│ id (PK)     │
│ user_id(FK) │
│ title       │
│ media_url   │
│ views_count │
└─────────────┘
      │
      ├──→ Campaign (1:1)
      ├──→ Like (1:N)
      ├──→ Comment (1:N)
      ├──→ AdView (1:N)
      └──→ UserReward (1:N)
```

### Key Constraints
- **Unique Constraints**:
  - User.email (only one account per email)
  - Campaign.payment_ref (unique payment reference)
  - Like (user_id, ad_id) - one like per user per ad
  - AdView (ad_id, user_id) - one view count per user per ad

- **Cascade Deletes**:
  - Deleting a user cascades to all their campaigns, ads, likes, comments, etc.
  - Deleting an ad cascades to all associated likes, comments, views, rewards

---

## API Endpoints

### Authentication
```
GET  /auth/login                    # Initiate Auth0 OAuth login
GET  /auth/callback                 # Auth0 redirect callback
GET  /auth/logout                   # Logout redirect
```

### User Management
```
GET  /users/me                      # Get current user profile
PUT  /users/me                      # Update profile (multipart form-data)
```

### Campaigns & Payments
```
POST /campaigns/initiate            # Start payment process for campaign
POST /webhook/squadco               # Squadco webhook for payment verification
```

### Ad Management
```
POST /ads                           # Create ad (requires paid campaign)
GET  /feed                          # Get random feed of active ads
DELETE /ads/{ad_id}                 # Delete ad (owner only)
```

### Likes
```
POST /ads/{ad_id}/like              # Like an ad
DELETE /ads/{ad_id}/like            # Unlike an ad
GET  /ads/{ad_id}/likes             # Get like count
GET  /ads/{ad_id}/is-liked          # Check if current user liked ad
```

### Comments
```
POST /ads/{ad_id}/comments          # Add comment
GET  /ads/{ad_id}/comments          # List comments (paginated)
DELETE /comments/{comment_id}       # Delete comment
```

### Views
```
POST /ads/{ad_id}/view              # Record ad view
GET  /ads/{ad_id}/views             # Get view count and check if user viewed
```

### Health
```
GET  /health                        # Service health check
```

---

## Request/Response Examples

### Payment Initiation
**Request**:
```json
POST /campaigns/initiate
Content-Type: application/json

{
  "duration_days": 1
}
```

**Response**:
```json
{
  "checkout_url": "https://squadco.com/pay/...",
  "payment_ref": "CAMP_auth0|google-oauth2|xxxxx_abc123def456..."
}
```

### Create Ad
**Request**:
```
POST /ads
Content-Type: multipart/form-data

title: "My Product Launch"
description: "Check out our new product!"
tags: ["product", "launch", "business"]
media: <file>
campaign_id: "campaign-uuid-here"
```

**Response**:
```json
{
  "id": "ad-uuid",
  "user_id": "user-id",
  "title": "My Product Launch",
  "description": "Check out our new product!",
  "media_url": "https://res.cloudinary.com/...",
  "tags": ["product", "launch", "business"]
}
```

### Get Feed
**Request**:
```
GET /feed?limit=10
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "ads": [
    {
      "id": "ad-uuid-1",
      "user_id": "user-id-1",
      "title": "Ad Title",
      "media_url": "https://...",
      "tags": ["tag1", "tag2"]
    }
  ],
  "total": 10
}
```

### Like Ad
**Request**:
```
POST /ads/ad-uuid/like
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "message": "Ad liked and reward recorded"
}
```

### Add Comment
**Request**:
```json
POST /ads/ad-uuid/comments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "Great ad! I'm interested."
}
```

**Response**:
```json
{
  "id": "comment-uuid",
  "ad_id": "ad-uuid",
  "user_id": "user-id",
  "content": "Great ad! I'm interested.",
  "created_at": "2026-05-15T10:30:00Z",
  "updated_at": null
}
```

---

## Technology Stack

### Backend Framework
- **FastAPI 0.111.0**: Async Python web framework with automatic OpenAPI docs
- **Uvicorn**: ASGI server for running FastAPI
- **Starlette**: Web framework foundation for FastAPI

### Database & ORM
- **SQLAlchemy 2.0.30**: Object-relational mapper with async support
- **AsyncPG 0.29.0**: Fast PostgreSQL driver for Python
- **PostgreSQL**: Primary relational database

### Authentication & Security
- **Auth0**: OAuth 2.0 identity provider
- **python-jose 3.3.0**: JWT token verification
- **cryptography 48.0.0**: Cryptographic operations

### Storage
- **Cloudinary 1.44.2**: Cloud-based media storage and CDN
- **python-multipart 0.0.28**: Handling multipart form data uploads

### Payment Processing
- **Squadco SDK**: Nigerian payment gateway integration
- **HMAC-SHA512**: Webhook signature verification

### Data Validation
- **Pydantic 2.13.4**: Data validation and serialization
- **email-validator 2.3.0**: Email validation
- **Pydantic-settings 2.2.1**: Environment configuration management

### Additional Tools
- **python-dotenv 1.0.1**: Environment variable management
- **httpx 0.27.0**: Async HTTP client for external API calls
- **Alembic 1.13.1**: Database migration management

---

## Configuration & Environment

### Required Environment Variables
```
AUTH0_DOMAIN=your-auth0-domain.au.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_AUDIENCE=your-api-audience
APP_BASE_URL=https://your-domain.com
SECRET_KEY=your-secret-key-for-jwt
DATABASE_URL=postgresql+asyncpg://user:password@localhost/banner-co
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
SQUAD_TEST_MODE=true (or false for production)
SQUAD_SECRET_KEY=your-squadco-secret-key
SQUAD_SECRET_HASH=your-squadco-webhook-secret
```

### Database Initialization
- On application startup, FastAPI lifespan creates all tables automatically
- For production, use Alembic migrations instead of auto table creation

---

## Error Handling

### Common HTTP Status Codes
- **200 OK**: Successful request
- **201 Created**: Resource successfully created
- **204 No Content**: Successful deletion or action
- **400 Bad Request**: Invalid input or validation error
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: User lacks permission for action
- **404 Not Found**: Resource does not exist
- **500 Internal Server Error**: Unexpected server error

### Error Response Format
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## Security Considerations

1. **Token Expiration**: Access tokens should have reasonable expiration times
2. **HTTPS Only**: All endpoints must use HTTPS in production
3. **CORS**: Configure CORS appropriately for frontend domain
4. **SQL Injection**: SQLAlchemy ORM prevents SQL injection
5. **Webhook Verification**: Squadco webhooks are verified with HMAC signatures
6. **Rate Limiting**: Consider implementing rate limiting on payment endpoints
7. **User Resource Access**: All user-specific endpoints verify ownership

---

## Performance Considerations

1. **Async Operations**: All database operations are async for scalability
2. **Database Indexes**: Consider indexing on frequently queried fields (user_id, ad_id, status)
3. **Feed Randomization**: `get_random_feed()` supports efficient pagination
4. **JWKS Caching**: Auth0 public keys are cached to reduce token verification latency
5. **Connection Pooling**: AsyncPG handles connection pooling automatically

---

## Future Enhancements

1. **Admin Dashboard**: Management interface for verifying users, managing rewards
2. **Reward Payout System**: Withdraw earned rewards via bank transfer or mobile money
3. **Analytics**: Detailed statistics on ad performance, reach, and ROI
4. **Content Moderation**: Approval workflow for ads before publishing
5. **Advanced Targeting**: Target ads by location, demographics, interests
6. **Video Optimization**: Automatic video transcoding and quality optimization
7. **A/B Testing**: Support for testing multiple ad variations
8. **Referral System**: Incentivize user invitations
9. **Subscription Plans**: Premium features for power users
10. **International Payments**: Support additional payment gateways

---

## Deployment Notes

### Vercel Deployment (Current)
- Backend is configured for Vercel deployment with `vercel.json`
- Ensure environment variables are set in Vercel dashboard
- Database must be accessible from Vercel (e.g., managed PostgreSQL)
- Cold start considerations for serverless functions

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
uvicorn index:app --reload --host 0.0.0.0 --port 8000
```

---

## Testing Checklist

- [ ] Auth0 OAuth login flow
- [ ] Campaign payment initiation and Squadco webhook
- [ ] Ad creation with paid campaign
- [ ] Feed returns only active campaign ads
- [ ] Like/Unlike operations and reward creation
- [ ] Comment creation and deletion
- [ ] View recording and reward creation
- [ ] Profile update with media uploads
- [ ] User ownership validation on resource modifications
- [ ] Error handling for invalid inputs

---

## Documentation References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Async Guide](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [Auth0 Documentation](https://auth0.com/docs)
- [Squadco API Documentation](https://docs.squadco.com/)
- [Cloudinary API Documentation](https://cloudinary.com/documentation)

---

**Document Version**: 1.0  
**Last Updated**: May 15, 2026  
**Backend Version**: FastAPI with AsyncPG + PostgreSQL
