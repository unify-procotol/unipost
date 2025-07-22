# Ghost Newsletter Subscription Setup

This document explains how to set up and use the Ghost newsletter subscription feature in UniPost.

## Overview

The subscription feature allows users to subscribe to newsletters for each project using Ghost's Admin API. Users can subscribe via a modal popup that appears when they click the "Subscribe" button.

## Features

- **Multi-language Support**: Subscription modal supports multiple languages (English, Chinese, Spanish, etc.)
- **Project-specific Subscriptions**: Each project can have its own subscription settings
- **Ghost Admin API Integration**: Uses Ghost's Admin API to manage subscribers
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Proper error messages for various scenarios

## Setup Requirements

### 1. Ghost Admin API Key

Each project needs a Ghost Admin API key to enable subscription functionality:

1. Go to your Ghost Admin panel
2. Navigate to Settings → Integrations
3. Create a new custom integration or use an existing one
4. Copy the Admin API Key (not the Content API Key)
5. Add this key to your project's `ghost_admin_key` field

### 2. Database Schema

Make sure your projects table includes the `ghost_admin_key` field:

```sql
ALTER TABLE projects ADD COLUMN ghost_admin_key VARCHAR(255);
```

### 3. Project Configuration

When creating or updating a project, include the `ghost_admin_key`:

```json
{
  "name": "My Blog",
  "prefix": "myblog",
  "ghost_domain": "https://myblog.ghost.io",
  "ghost_api_key": "content_api_key_here",
  "ghost_admin_key": "admin_api_key_here",
  "locales": ["en", "zh", "es"]
}
```

## Usage

### Subscribe Button Locations

The subscribe button appears in several locations:

1. **Project Posts Page**: In the header next to the project name
2. **Post Detail Page**: At the bottom of each post in a call-to-action section
3. **Project Selector**: On each project card (if admin key is configured)

### Subscription Flow

1. User clicks "Subscribe" button
2. Modal opens with email and optional name fields
3. User enters their information and submits
4. System calls Ghost Admin API to create/update member
5. Success or error message is displayed
6. Modal closes on successful subscription

### API Endpoints

- `POST /api/subscribe` - Subscribe a user to a project's newsletter
- `DELETE /api/subscribe?email=...&prefix=...` - Unsubscribe a user
- `GET /api/subscribe/check?email=...&prefix=...` - Check subscription status

## Components

### SubscribeButton
A reusable button component that opens the subscription modal.

**Props:**
- `project`: ProjectEntity - The project to subscribe to
- `locale`: string - Current language locale
- `variant`: 'primary' | 'secondary' | 'outline' - Button style
- `size`: 'sm' | 'md' | 'lg' - Button size

### SubscriptionModal
The modal dialog for collecting subscription information.

**Props:**
- `isOpen`: boolean - Whether modal is visible
- `onClose`: () => void - Close handler
- `project`: ProjectEntity - The project to subscribe to
- `locale`: string - Current language locale

### useSubscription Hook
A custom hook for managing subscription state and API calls.

**Returns:**
- `loading`: boolean - Whether a request is in progress
- `error`: string | null - Error message if any
- `success`: boolean - Whether last operation was successful
- `subscribe`: (data) => Promise - Subscribe function
- `unsubscribe`: (email, prefix) => Promise - Unsubscribe function
- `checkSubscription`: (email, prefix) => Promise - Check status function
- `reset`: () => void - Reset state function

## Customization

### Adding New Languages

To add support for new languages, update the `translations` object in:
- `src/components/subscription-modal.tsx`
- `src/components/subscribe-button.tsx`

### Styling

The components use Tailwind CSS classes and can be customized by modifying the className props or creating custom variants.

### Labels and Segmentation

Subscribers are automatically tagged with:
- Project name
- Current locale
- Any additional labels passed to the subscription function

## Error Handling

The system handles various error scenarios:
- Invalid email addresses
- Already subscribed emails
- Network errors
- Ghost API errors
- Missing admin API keys

## Security Considerations

- Ghost Admin API keys should be stored securely
- Email validation is performed on both client and server
- Rate limiting should be implemented for subscription endpoints
- CORS policies should be configured appropriately

## Testing

To test the subscription functionality:

1. Ensure a project has a valid `ghost_admin_key`
2. Navigate to the project's posts page
3. Click the "Subscribe" button
4. Fill in the form and submit
5. Check your Ghost admin panel for the new member
6. Verify the member has the correct labels/tags

## Troubleshooting

**Subscription button not showing:**
- Check if the project has a `ghost_admin_key` configured
- Verify the key is valid and has the correct permissions

**Subscription fails:**
- Check Ghost Admin API key permissions
- Verify Ghost domain is accessible
- Check network connectivity
- Review server logs for detailed error messages

**Modal not opening:**
- Check browser console for JavaScript errors
- Ensure all required components are properly imported
- Verify React state management is working correctly
