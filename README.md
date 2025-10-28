# Laundry Management System

## Project Overview
A full-stack laundry management system with three separate applications: Customer App, Partner App, and Admin Panel. The system handles laundry pickup, delivery, order tracking, partner management, and administrative operations.

## Architecture

### 1. **Customer App** (`/customer`)
- **Tech Stack**: React 18 + Vite + TypeScript + Capacitor
- **UI Framework**: Tailwind CSS + shadcn/ui (Radix UI components)
- **Port**: 3001
- **Platform**: Web + Android mobile app
- **Purpose**: Customer-facing application for booking laundry services

**Key Features**:
- Order booking and tracking
- Address management
- Payment methods
- Wallet and points system
- Referral program
- Order rating and reviews
- Real-time order status updates
- Invoice download

**Key Files**:
- `src/pages/BookingConfirmation.tsx` - Order confirmation page
- `src/pages/OrderDetails.tsx` - Order details and invoice
- `src/pages/RateOrder.tsx` - Rating and review submission
- `src/pages/AddAddress.tsx` - Address management
- `src/pages/Profile.tsx` - User profile and payment methods
- `src/pages/Wallet.tsx` - Wallet and points redemption
- `src/pages/ReferEarn.tsx` - Referral program

**Build Commands**:
- `npm run dev` - Development server (port 3001)
- `npm run build:mobile` - Build for Android
- `npm run cap:open:android` - Open in Android Studio

### 2. **Partner App** (`/partner`)
- **Tech Stack**: Next.js 15 + React 19 + TypeScript + Capacitor
- **UI Framework**: Tailwind CSS v4
- **Port**: 3002
- **Platform**: Web + Android mobile app
- **Purpose**: Partner/delivery agent application for managing pickups and deliveries

**Key Features**:
- Service availability check by pincode
- Partner registration and KYC
- Pickup management (start, track, confirm)
- Delivery management
- Hub drop-off
- Profile management
- Bottom navigation with dashboard, pickups, deliveries, hub, profile

**Key Files**:
- `src/app/check-availability/page.tsx` - Check service availability
- `src/app/login/page.tsx` - Partner login
- `src/app/verify/page.tsx` - OTP verification
- `src/app/profile/create/page.tsx` - Profile creation
- `src/app/profile/kyc/page.tsx` - KYC submission
- `src/app/pickups/page.tsx` - Pickup list
- `src/app/pickups/start/[id]/page.tsx` - Start pickup
- `src/app/pickups/confirm/[id]/page.tsx` - Confirm pickup
- `src/app/hub/drop/page.tsx` - Hub drop-off
- `src/app/delivery/pick/page.tsx` - Delivery selection
- `src/app/delivery/[id]/page.tsx` - Delivery execution
- `src/components/BottomNav.tsx` - Bottom navigation component

**Build Commands**:
- `npm run dev` - Development server (port 3002)
- `npm run build` - Production build
- `npm run cap:sync` - Sync with Capacitor

### 3. **Admin Panel** (`/admin panel`)
- **Tech Stack**: Next.js 15 + React 18 + TypeScript + MongoDB
- **Database**: MongoDB (local or remote)
- **Port**: 3000
- **Platform**: Web only
- **Purpose**: Administrative dashboard for managing the entire system

**Key Features**:
- Partner management (CRUD operations)
- Order management
- Customer management
- Analytics and reporting
- KYC approval
- Service area management
- Authentication with JWT

**Key Files**:
- `app/api/mobile/partners/[id]/route.ts` - Partner API endpoints
- `models/` - MongoDB models
- `lib/` - Database connection and utilities
- `middleware.ts` - Authentication middleware
- `.env.local` - Environment configuration

**Environment Variables** (`.env.local`):
```
MONGODB_URI=mongodb://localhost:27017/laundry
JWT_SECRET=your-secret-key-here
NODE_ENV=development
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

**Build Commands**:
- `npm run dev` - Development server (port 3000)
- `npm run build` - Production build
- `npm run seed:admin` - Seed admin user

## Design System

### Color Scheme
- **Primary Gradient**: `linear-gradient(to right, #452D9B, #07C8D0)` (Purple to Cyan)
  - Purple: `#452D9B`
  - Cyan: `#07C8D0`
- **Disabled State**: `#9ca3af` (Gray)

### Button Styling Pattern
All primary action buttons use the gradient background:
```tsx
style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
```

Disabled buttons use gray:
```tsx
style={{ background: '#9ca3af' }}
```

## Database Schema
- **MongoDB** database named `laundry`
- Collections: partners, customers, orders, addresses, payments, etc.
- Authentication: JWT-based with bcrypt password hashing

## Development Workflow

### Running All Apps Simultaneously
1. **Admin Panel**: `cd "admin panel" && npm run dev` (port 3000)
2. **Customer App**: `cd customer && npm run dev` (port 3001)
3. **Partner App**: `cd partner && npm run dev` (port 3002)

### Mobile Development
Both customer and partner apps use **Capacitor** for Android builds:
- Build web assets first
- Sync with Capacitor: `npm run cap:sync`
- Open in Android Studio: `npm run cap:open:android`

## Recent Changes

### UI Updates
- Applied gradient colors to all primary buttons across customer and partner apps
- Updated button styling from solid colors to purple-cyan gradient
- Maintained consistent disabled state styling

### Bug Fixes
- **Partner App Bottom Navigation**: Fixed visibility issue by adding z-index and removing KYC approval check
- **Next.js 15 API Routes**: Fixed dynamic params by awaiting params object (now returns Promise)

### Git Configuration
- Repository: `https://github.com/TechnovaTech/Laundry-main.git` (origin)
- Fork: `https://github.com/yash9424/laundry-main.git` (yash)
- Author: yash9424

## Key Technical Notes

### Next.js 15 Breaking Changes
- Dynamic route params are now `Promise` objects and must be awaited:
```typescript
// Old (Next.js 14)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
}

// New (Next.js 15)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

### Capacitor Configuration
- Customer app: `capacitor.config.ts` with appId and webDir
- Partner app: `capacitor.config.ts` with appId and webDir
- Both apps support Android platform

### State Management
- Customer app: React Query (@tanstack/react-query)
- Partner app: React hooks and Next.js server components
- Admin panel: Server-side with MongoDB

## API Structure

### Admin Panel APIs
- `/api/mobile/partners/[id]` - Partner CRUD operations
- Authentication required via JWT middleware
- RESTful endpoints for all resources

## Common Issues & Solutions

1. **Bottom Navigation Not Visible**: Ensure z-index is set and KYC checks don't block rendering
2. **Next.js 15 Params Error**: Always await params in dynamic routes
3. **MongoDB Connection**: Check MONGODB_URI in .env.local
4. **Port Conflicts**: Ensure ports 3000, 3001, 3002 are available

## Project Structure Summary
```
laundry-main/
├── customer/          # React + Vite customer app (port 3001)
├── partner/           # Next.js partner app (port 3002)
├── admin panel/       # Next.js admin panel (port 3000)
└── README.md          # This file
```

## For AI Assistants (ChatGPT, etc.)

When working with this codebase:
1. **Customer app** uses React Router, Vite, and Capacitor
2. **Partner app** uses Next.js 15 App Router with Capacitor
3. **Admin panel** uses Next.js 15 with MongoDB backend
4. All buttons should use the gradient style: `linear-gradient(to right, #452D9B, #07C8D0)`
5. Always await params in Next.js 15 dynamic routes
6. Check file paths carefully - "admin panel" has a space in the folder name
7. Mobile apps use Capacitor for Android builds
8. Database operations go through the admin panel API
