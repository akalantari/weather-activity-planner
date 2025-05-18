import dotenv from "dotenv";
dotenv.config();

/**
 * Configuration for the application
 *
 * Author: Ali Kalantari
 */
export const config = {
  server: {
    port: process.env.PORT || 4000,
    host: process.env.HOST || '0.0.0.0',
    environment: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || "*",
  },

  // Weather API settings
  weatherApi: {
    defaultDays: 8, // Default number of forecast days
    maxDays: 16, // Maximum number of forecast days
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
  },
};
