import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { decksRoutes } from './routes/decks';
import { cardsRoutes } from './routes/cards';
import { studyRoutes } from './routes/study';
import { analyticsRoutes } from './routes/analytics';
import { aiRoutes } from './routes/ai';
import { stripeRoutes } from './routes/stripe';
import { contentRoutes } from './routes/content';

const fastify = Fastify({ logger: true });

// Register plugins
fastify.register(cors, {
  origin: true, // Allow all origins for development
});

// Register multipart for file uploads
fastify.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for PowerPoint files
  }
});

// Register routes
fastify.register(decksRoutes, { prefix: '/api/decks' });
fastify.register(cardsRoutes, { prefix: '/api/cards' });
fastify.register(studyRoutes, { prefix: '/api/study' });
fastify.register(analyticsRoutes, { prefix: '/api/analytics' });
fastify.register(aiRoutes, { prefix: '/api/ai' });
fastify.register(stripeRoutes, { prefix: '/api/stripe' });
fastify.register(contentRoutes); // Content routes include their own /api prefix

// Health check
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();