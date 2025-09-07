export const config = {
  // Application settings
  app: {
    name: 'Webinar Wrapper System',
    version: '1.0.0',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    useMockEverWebinar: process.env.NEXT_PUBLIC_USE_MOCK_EVERWEBINAR === 'true',
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  },

  // Default webinar settings
  webinar: {
    defaultDuration: 90, // minutes
    transitionDelay: 2000, // milliseconds
    maxAttendees: 1000,
    refreshInterval: 30000, // milliseconds
  },

  // Zoom settings
  zoom: {
    sdkUrl: 'https://source.zoom.us/5.2.42037.1112/lib',
    avPath: '/av',
    role: {
      attendee: 0,
      host: 1,
    },
  },

  // Firebase settings
  firebase: {
    collections: {
      admin: 'admin',
      logs: 'logs',
      slots: 'slots',
    },
  },

  // UI settings
  ui: {
    transitionDuration: 500, // milliseconds
    animationDuration: 2000, // milliseconds
    maxLogsDisplay: 100,
  },

  // Security settings
  security: {
    adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123',
    allowedOrigins: [
      'localhost:3000',
      'everwebinar.com',
      'webinarjam.com',
      'zoom.us',
    ],
  },

  // Error messages
  messages: {
    errors: {
      zoomInitFailed: 'Failed to initialize Zoom session',
      everwebinarLoadFailed: 'Failed to load EverWebinar session',
      networkError: 'Network connection error',
      invalidSlot: 'Invalid webinar slot',
      unauthorized: 'Unauthorized access',
    },
    success: {
      zoomConnected: 'Successfully connected to Zoom',
      everwebinarLoaded: 'EverWebinar session loaded',
      modeSwitched: 'Successfully switched modes',
    },
  },
} as const;

export type Config = typeof config;