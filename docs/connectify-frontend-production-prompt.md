# Connectify Frontend Production Build Prompt

You are an expert frontend product engineer and UI designer. Build the production-grade frontend foundation for Connectify, a real social media platform. This is not a prototype, mockup, landing page, or throwaway demo. Treat this as the actual product UI that will grow over time.

Connectify is currently focused on authentication, user profiles, and social graph features such as follow, unfollow, followers, following, mutual followers, and user search. The frontend must be architected so future modules can be added cleanly: posts, feed, comments, likes, bookmarks, notifications, messages, reels, settings, moderation, privacy controls, and admin tools.

The result must be a real, navigable, production-ready React application with clean routing, reusable components, API integration boundaries, polished UI states, and scalable file organization.

## Product Identity

App name: Connectify

Product feeling:
- Minimal
- Professional
- Calm
- Subtle
- Trustworthy
- Social, but not noisy
- Premium, but not decorative
- Built for daily use

Do not create a marketing website. Do not create a fake dashboard. Do not create a single giant component. Build the actual social product surface.

## Core Product Goal

Create the foundation of a real social media app where a user can:
- register
- log in
- recover password
- verify email if needed
- view their own profile
- edit profile details
- search users
- open other users' profiles
- follow users
- unfollow users
- see follower lists
- see following lists
- see mutual followers
- navigate through profile and people pages naturally

The UI must feel ready to support future feed, post, notification, and messaging modules without redesigning the whole app.

## Technology Requirements

Use:
- React
- TypeScript
- Tailwind CSS
- React Router
- lucide-react icons
- Feature-based folder structure
- API client/service layer
- Reusable components
- Mobile-first responsive design

Do not:
- build everything in one page
- hardcode everything in one component
- use fake navigation
- use inline ad hoc styles everywhere
- use random colors outside the design system
- create UI that only works at one screen size

## Design System

### Visual Style

Use a refined neutral interface. The UI should feel like a mature SaaS/social product hybrid: clean enough for repeated use, warm enough to feel social.

Avoid:
- neon colors
- heavy gradients
- glassmorphism
- excessive shadows
- oversized marketing hero sections
- giant decorative illustrations
- dark gamer UI
- purple-heavy startup UI
- cluttered nested cards
- unnecessary animations

### Color Tokens

Use these as the main palette:

```ts
colors = {
  background: "#F8F7F4",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F0EC",
  surfaceHover: "#F6F5F2",
  border: "#E6E3DD",
  borderStrong: "#D8D4CC",
  textPrimary: "#111111",
  textSecondary: "#707070",
  textMuted: "#9A9A9A",
  accent: "#D96B5F",
  accentHover: "#C95B50",
  accentSoft: "#F8E4E0",
  success: "#2F7D50",
  successSoft: "#E7F3EC",
  danger: "#B9433D",
  dangerSoft: "#F8E1DF",
  warning: "#9B6A24",
  warningSoft: "#F8ECD8",
}
```

Use black/near-black for primary actions. Use the coral accent sparingly for social state, notification markers, active relationships, and small highlights.

### Typography

Use:
- `Inter` for all UI text
- `DM Serif Display` only for the Connectify wordmark or rare brand moments

Typography scale:
- Page title: `24px`, `font-semibold`, line-height `32px`
- Section title: `18px`, `font-semibold`, line-height `28px`
- Card title: `16px`, `font-medium`, line-height `24px`
- Body: `14px`, `font-normal`, line-height `22px`
- Label: `13px`, `font-medium`, line-height `18px`
- Caption/meta: `12px`, `font-normal`, line-height `16px`

Rules:
- Sentence case for normal UI
- No all-caps except tiny brand eyebrow text, and even then use sparingly
- No negative letter spacing
- Keep text readable on mobile
- Truncate usernames and long names gracefully

### Spacing

Use an 8px spacing system:
- `4px` only for tiny icon/text gaps
- `8px` for compact gaps
- `12px` for row spacing
- `16px` for standard component spacing
- `20px` for section padding on mobile
- `24px` for major section gaps
- `32px` for desktop section rhythm

### Radius

Use restrained radii:
- Inputs: `8px`
- Buttons: `8px`
- Cards/sections: `8px`
- Avatars: circle
- Pills/chips: `999px`
- Modals: `12px`

Do not use overly rounded card-heavy UI. Cards should look crisp and professional.

### Shadows

Use borders first. Use shadows only for overlays, dropdowns, or sticky nav:
- small overlay shadow: `0 8px 24px rgba(17,17,17,0.08)`
- floating nav shadow: `0 -1px 24px rgba(17,17,17,0.07)`

Do not use large dramatic shadows on normal content sections.

### Motion

Use subtle micro-interactions:
- Buttons: `transition-colors duration-150`
- Press: `active:scale-[0.98]`
- Cards/rows hover: background change only
- Dropdown/modal: fade + tiny translate, `150ms`

Do not use heavy page animations or animated backgrounds.

## Layout System

The app must have:
- Auth layout
- Main app layout
- Profile layout
- People list layout
- Future-ready feed/content layout

### Main App Shell

Desktop/tablet:
- Top bar height: `64px`
- Centered content max width: `1120px`
- Page padding: `24px`
- Main grid can support left sidebar later, but for now keep clean top navigation

Mobile:
- Top bar height: `56px`
- Content padding: `16px`
- Bottom navigation may be introduced later; keep layout compatible
- Search should not break the header

Top bar contents:
- Left: Connectify wordmark
- Center: search bar
- Right: user avatar, profile link, logout/settings access

Search bar:
- Height: `40px`
- Border radius: `8px`
- Background: `#F8F7F4`
- Border: `1px solid #E6E3DD`
- Icon left: `Search`, 18px
- Placeholder: `Search users`
- On submit: route to search results or profile lookup

## Folder Structure

Use this structure or an equivalent scalable feature-based structure:

```txt
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  features/
    auth/
      api/
      components/
      pages/
      types.ts
    profile/
      api/
      components/
      pages/
      types.ts
    social-graph/
      api/
      components/
      pages/
      types.ts
    search/
      api/
      components/
      pages/
      types.ts
  shared/
    api/
      httpClient.ts
      errors.ts
    components/
      Avatar.tsx
      Button.tsx
      IconButton.tsx
      Input.tsx
      SearchBar.tsx
      EmptyState.tsx
      Alert.tsx
      PageHeader.tsx
      SectionHeader.tsx
      Tabs.tsx
      Skeleton.tsx
    layout/
      AuthLayout.tsx
      AppLayout.tsx
    utils/
      formatters.ts
      classNames.ts
```

Do not create a single `Dashboard.tsx` that owns the whole app.

## Routing

Create real routes:

```txt
/login
/signup
/forgot-password
/verify-email
/me
/me/edit
/me/followers
/me/following
/u/:username
/u/:username/followers
/u/:username/following
/u/:username/mutual/:otherUsername
/search
/settings
```

Prepare the route structure for future routes:

```txt
/feed
/posts/:postId
/notifications
/messages
/messages/:conversationId
/explore
/bookmarks
```

It is fine if future routes have placeholders, but the structure should make them easy to add later.

## API Layer

Create an API layer that can scale.

Use a central HTTP client:
- base URL from environment variable
- JSON parsing
- error normalization
- auth token injection
- typed responses

Example API domains:
- `authApi`
- `profileApi`
- `socialGraphApi`
- `searchApi`

Do not call `fetch` randomly inside every component unless wrapped by feature-specific API functions.

### Current Backend Capabilities To Support

The current backend has, or is expected to have, endpoints like:

```txt
POST /api/auth/v1/register
POST /api/auth/v1/login
POST /api/auth/v1/verify-email
POST /api/auth/v1/forgot-password
POST /api/auth/v1/reset-password

GET /api/users/v1/me
PATCH /api/users/v1/me
GET /api/users/v1/profiles/:username

POST /api/users/v1/follow
DELETE /api/users/v1/follow
GET /api/users/v1/:userId/followers
GET /api/users/v1/:userId/following
GET /api/users/v1/:userId/followers/count
GET /api/users/v1/:userId/following/count
GET /api/users/v1/:userId/follow-status
GET /api/users/v1/:userId/mutual-followers/:otherUserId
```

Do not hard-code the UI to only these endpoints. Design API modules so later endpoints can be added naturally.

## Core Components

### Button

Variants:
- primary
- secondary
- ghost
- danger

Sizes:
- sm: `32px` height, `12px` horizontal padding
- md: `40px` height, `16px` horizontal padding
- lg: `48px` height, `20px` horizontal padding

States:
- default
- hover
- active
- focus-visible
- disabled
- loading

Primary button:
- background `#111111`
- text white
- hover `#2A2A2A`
- radius `8px`

Secondary button:
- background `#F1F0EC`
- text `#111111`
- hover `#E8E6E0`

Ghost button:
- transparent
- text `#111111`
- hover background `#F1F0EC`

Danger:
- background `#B9433D`
- text white

### IconButton

Use for settings, more menu, notification, search actions.
- Size: `36px`
- Icon: `18px` or `20px`
- Radius: `8px`
- Hover background: `#F1F0EC`
- Tooltip optional for non-obvious icons

### Input

Height: `42px`
Radius: `8px`
Border: `1px solid #E6E3DD`
Background: `#FFFFFF`
Focus border: `#111111`
Error border: danger
Label above input, `13px medium`
Error text below, `12px`

### Avatar

Sizes:
- xs: `24px`
- sm: `32px`
- md: `40px`
- lg: `64px`
- xl: `96px`

Support:
- image URL
- fallback initials
- optional status ring
- optional story/follow ring

### ProfileCard / ProfileHeader

For own and public profile.

Mobile layout:
- avatar top-left or centered depending page density
- name + username
- bio
- location/website row
- stats row
- action buttons

Desktop layout:
- avatar left
- profile information center
- actions right

Stats:
- Followers
- Following
- Posts placeholder if posts not implemented yet

Follow button:
- Shows `Follow` if not following
- Shows `Following` or `Unfollow` state if already following
- Has loading state when action is in progress

### PeopleList

Used by:
- followers
- following
- mutual followers
- search results
- future likes list

Row layout:
- avatar left
- display name
- username
- optional metadata
- optional action button right

Row height:
- `64px` minimum
- padding `12px 16px`
- border-bottom `1px solid #E6E3DD`
- hover background `#F8F7F4`

Rows must be clickable and navigate to `/u/:username`.

### EmptyState

Reusable empty state:
- icon
- title
- short description
- optional action button

Examples:
- No followers yet
- Not following anyone yet
- No mutual followers found
- No users found

### Alert

Variants:
- info
- success
- warning
- error

Use subtle backgrounds and borders, not loud filled banners.

### Tabs

Used on profile:
- Overview
- Followers
- Following
- Posts later
- Reels later

Style:
- full-width on mobile
- compact segmented control
- active tab white on muted background
- radius `8px`

## Pages

### Login Page

Purpose: let existing users access Connectify.

Layout:
- centered auth card
- width `100%`, max `420px`
- padding `24px` mobile, `32px` desktop
- background white or dark neutral only if current auth system uses it consistently

Fields:
- Email or username
- Password

Actions:
- Login button
- Forgot password link
- Link to sign up

States:
- loading spinner inside button
- field validation
- API error alert

Copy:
- Title: `Welcome back`
- Subtitle: `Sign in to continue to Connectify.`

### Sign Up Page

Fields:
- First name
- Last name
- Username
- Email
- Password

Actions:
- Create account
- Link to login

Validation:
- required fields
- valid email
- password minimum message

Copy:
- Title: `Create your account`
- Subtitle: `Start building your network on Connectify.`

### My Profile Page

Route: `/me`

Must show:
- avatar
- display name
- username
- bio
- location
- website
- followers count
- following count
- edit profile button
- followers/following preview sections

Page composition:
- `PageHeader`
- `ProfileHeader`
- `StatsRow`
- `ProfileTabs`
- two preview lists:
  - recent followers
  - recent following

If no followers:
- show `No followers yet`

If no following:
- show `You are not following anyone yet`

### Edit Profile Page

Route: `/me/edit`

Fields:
- first name
- last name
- bio
- profile image URL
- location
- website

Actions:
- Save changes
- Cancel

States:
- loading
- validation
- success alert
- error alert

### Public Profile Page

Route: `/u/:username`

Must show:
- public profile header
- follow/unfollow button
- followers count
- following count
- mutual followers entry
- followers preview
- following preview

If viewing own username:
- do not show follow button
- show edit profile action or route to `/me`

Follow action:
- call API
- optimistic UI update is allowed but must rollback on error
- button loading state

### Followers Page

Routes:
- `/me/followers`
- `/u/:username/followers`

Must show:
- page header
- back to profile link
- people list
- empty state
- loading skeleton

### Following Page

Routes:
- `/me/following`
- `/u/:username/following`

Same layout as followers page.

### Mutual Followers Page

Route:
- `/u/:username/mutual/:otherUsername`

Purpose:
Show people who follow both users.

Must show:
- comparison header: `@userA and @userB`
- people list
- empty state
- back links to both profiles

Future compatible:
- allow this page to evolve into richer social overlap later.

### Search Page

Route: `/search`

Current behavior:
- search users by username
- show profile result
- allow navigation to user profile

Future behavior:
- tabs for People, Posts, Tags, Places

Design now:
- search input at top
- filter tabs/chips
- result list
- empty state

## Future-Ready Placeholder Pages

Create simple but polished placeholder routes for:
- `/feed`
- `/notifications`
- `/messages`
- `/settings`

These should not look like unfinished blank pages. They should use the real app layout and say clearly that the module is coming soon.

Example:
- Title: `Messages`
- Description: `Direct messages will appear here once messaging is enabled.`

## Data Handling

Every API-backed page must handle:
- loading
- success
- empty
- error

Use skeletons for loading lists:
- 5 rows
- avatar circle placeholder
- two text line placeholders

Do not show broken blank screens.

## Responsive Requirements

Mobile:
- 360px minimum supported width
- no horizontal overflow
- search must fit
- buttons must wrap gracefully
- profile stats remain readable

Tablet:
- center content
- use two-column previews where appropriate

Desktop:
- max content width around `1120px`
- use whitespace well
- do not stretch people lists too wide without structure

## Accessibility

Must include:
- semantic buttons and links
- labels for inputs
- `aria-label` for icon-only buttons
- focus-visible states
- keyboard navigable routes and actions
- sufficient contrast

## Images

For now:
- use avatar image URLs if backend provides them
- otherwise use initials fallback

Do not add random stock photos to profile UI unless representing future posts/feed placeholders.

For future placeholder feed screens:
- use neutral image placeholders or `picsum.photos`
- keep them realistic and not overly decorative

## Icons

Use lucide-react.

Recommended icons:
- Search
- User
- Users
- UserPlus
- UserCheck
- Settings
- Bell
- LogOut
- Edit3
- MapPin
- Link
- ChevronRight
- ArrowLeft
- MessageCircle
- Heart
- Bookmark
- Image
- Home

Icon size:
- normal: `18px`
- actions: `20px`
- nav: `20px`

Stroke width:
- `1.75` or `2`

## Quality Bar

The final output must:
- compile without TypeScript errors
- have no unused giant files
- avoid repeated copy-pasted UI blocks
- use clean components
- be easy to extend
- look polished on mobile and desktop
- feel like Connectify, not a generic template

## Final Deliverable

Deliver a production-ready Connectify frontend foundation with:
- route-based social app
- auth screens aligned with Connectify
- profile pages
- follow/unfollow UI
- followers page
- following page
- mutual followers page
- user search
- reusable component system
- central API layer
- loading/error/empty states
- future-ready structure for posts, feed, messages, notifications, settings, and moderation

Build it like the first real version of the product, because that is what it is.
