# Webinar Wrapper System

A custom webinar wrapper system that seamlessly transitions between EverWebinar pre-recorded sessions and live Zoom meetings.

## Features

- **EverWebinar Integration**: Embed pre-recorded sessions with fake attendees, chat, and CTAs
- **Seamless Live Transition**: Switch to live Zoom sessions without URL changes
- **Admin Control**: Manual "Go Live" override with real-time state management
- **Scheduled Transitions**: Automatic switching at predefined times
- **Multi-Slot Management**: Support for multiple webinar slots
- **Real-time Monitoring**: Live attendee tracking and activity logs

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Real-time Sync**: Firebase Firestore
- **Video Integration**: Zoom Web SDK
- **Icons**: Lucide React

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Copy `env.example` to `.env.local` and configure:

```bash
cp env.example .env.local
```

Update the following variables:
- Firebase configuration for real-time sync
- Zoom SDK credentials
- Application URLs

### 3. Firebase Setup

1. Create a Firebase project
2. Enable Firestore Database
3. Add your web app to the project
4. Copy the configuration to your `.env.local`

### 4. Zoom Setup

1. Create a Zoom Marketplace app
2. Enable Web SDK
3. Get your SDK Key and Secret
4. Add them to your `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the participant view.

## Usage

### Participant View

Participants access webinars via URLs like:
- `http://localhost:3000?slot=slot_1` - Access specific slot
- `http://localhost:3000` - Default slot

### Admin Dashboard

Admins access the control panel via:
- `http://localhost:3000?admin=true`

Admin features:
- Toggle "Go Live" mode
- Monitor attendee counts
- View activity logs
- Manage multiple slots

### Webinar Flow

1. **Initial State**: EverWebinar session plays with simulated features
2. **Scheduled Transition**: At 9:15 PM (or configured time), automatically switch to Zoom
3. **Manual Override**: Admin can trigger "Go Live" at any time
4. **Seamless Experience**: Participants stay on same URL throughout

## Configuration

### Webinar Slots

Configure slots in `app/page.tsx`:

```typescript
const sampleSlots: WebinarSlot[] = [
  {
    id: 'slot_1',
    name: 'Morning Webinar - Sales Training',
    everwebinarUrl: 'https://demo.everwebinar.com/session/12345',
    zoomUrl: 'https://zoom.us/j/123456789',
    scheduledStartTime: new Date().toISOString(),
    scheduledSwitchTime: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
    isActive: true,
    currentMode: 'replay',
    attendeeCount: 0,
  },
  // ... more slots
];
```

### Zoom Configuration

Each slot needs Zoom meeting details:
- Meeting Number (extracted from URL)
- Meeting Password (if required)
- Host/Attendee roles

## Architecture

### Components

- **WebinarPlayer**: Main component handling transitions
- **EverWebinarWrapper**: Embeds EverWebinar iframe
- **ZoomWrapper**: Integrates Zoom Web SDK
- **AdminDashboard**: Control panel for administrators

### State Management

- **Zustand Store**: Client-side state management
- **Firebase Firestore**: Real-time synchronization
- **RealtimeManager**: Handles WebSocket-like updates

### Security Considerations

- Admin access controlled via URL parameter
- Firebase security rules should restrict admin access
- Zoom SDK credentials stored securely
- No sensitive data in client-side code

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Ensure all production environment variables are set:
- Firebase production configuration
- Zoom production SDK credentials
- Production URLs

### Scaling Considerations

- Use Firebase for real-time sync across multiple instances
- Consider CDN for static assets
- Implement proper error handling and fallbacks
- Monitor Zoom API rate limits

## Troubleshooting

### Common Issues

1. **Zoom SDK Loading**: Ensure SDK key is correct and domain is whitelisted
2. **Firebase Connection**: Check Firebase configuration and security rules
3. **EverWebinar Embed**: Verify iframe permissions and CORS settings
4. **Real-time Updates**: Check Firebase connection and network issues
5. **DNS Resolution Errors**: Demo URLs automatically fall back to mock mode
6. **Mock Mode**: Enable `NEXT_PUBLIC_USE_MOCK_EVERWEBINAR=true` for development

### Debug Mode

Enable debug logging by setting:
```typescript
const DEBUG = true; // In components
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Firebase and Zoom documentation
3. Create an issue with detailed information