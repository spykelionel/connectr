// App Configuration Constants
export const APP_CONFIG = {
  // App Identity
  APP_NAME: "CircusPrime",
  APP_TAGLINE: "Where every day is a performance!",
  APP_DESCRIPTION: "Connect with your cosmic peers",

  // URLs
  APP_URL: "https://circusprime.com",

  // Social Media
  TWITTER_HANDLE: "@CircusPrime",

  // Copyright
  COPYRIGHT_YEAR: new Date().getFullYear(),
  COPYRIGHT_TEXT: `© ${new Date().getFullYear()} CircusPrime. All rights reserved.`,
} as const;

// Export individual constants for convenience
export const APP_NAME = APP_CONFIG.APP_NAME;
export const APP_TAGLINE = APP_CONFIG.APP_TAGLINE;
export const APP_DESCRIPTION = APP_CONFIG.APP_DESCRIPTION;
export const APP_URL = APP_CONFIG.APP_URL;
export const COPYRIGHT_TEXT = APP_CONFIG.COPYRIGHT_TEXT;
