// Register module aliases for path resolution
import 'module-alias/register';
import path from 'path';

// Register aliases
require('module-alias').addAliases({
  '@': path.join(__dirname),
});

// For TypeGraphQL
import "reflect-metadata";

// Configuration
import { config } from '@/config';

// Infrastructure
import cors from 'cors';
import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';

// Types
import { Context } from '@/infrastructure/graphql';

// Schema
import { buildSchema } from '@/infrastructure/graphql/schemas';

/**
 * Main application setup and server initialization
 */
async function startServer() {
  const app = express();

  // Middleware with configured CORS
  app.use(cors({
    origin: config.server.corsOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  const server = new ApolloServer<Context>({
    schema: await buildSchema(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // Root endpoint
  app.get('/', (req, res) => {
    res.status(200).send('Weather Activity Planner API');
  });

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: config.server.corsOrigin,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({ services: {} }),
    }),
  );

  // Start server
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.server.port, host: config.server.host }, resolve),
  );

  console.log(`🚀 Server environment: ${config.server.environment}`);
  console.log(`🚀 Graphql Server ready at http://${config.server.host}:${config.server.port}/graphql`);
}

startServer()
  .catch((error) => {
    console.error('Failed to start server:', error);
  });