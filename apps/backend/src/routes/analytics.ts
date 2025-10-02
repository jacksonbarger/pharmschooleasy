import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/db';

export async function analyticsRoutes(fastify: FastifyInstance) {
  // Get comprehensive analytics
  fastify.get('/', async () => {
    // Performance by deck
    const bySubject = await prisma.$queryRaw<any[]>`
      SELECT
        d.title as deck,
        AVG(sl.rating) as avgRating,
        COUNT(sl.id) as reviews
      FROM "StudyLog" sl
      JOIN "Card" c ON c.id = sl."cardId"
      JOIN "Deck" d ON d.id = c."deckId"
      GROUP BY d.title
      ORDER BY reviews DESC
      LIMIT 10;
    `;

    // Daily study streak
    const streak = await prisma.studyLog.groupBy({
      by: ['createdAt'],
      _count: { _all: true },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    // Overall statistics
    const totalUsers = await prisma.user.count();
    const totalCards = await prisma.card.count();
    const totalReviews = await prisma.studyLog.count();

    const averageRating = await prisma.studyLog.aggregate({
      _avg: { rating: true }
    });

    return {
      bySubject,
      streak,
      overall: {
        totalUsers,
        totalCards,
        totalReviews,
        averageRating: averageRating._avg.rating || 0
      }
    };
  });

  // Get user-specific analytics
  fastify.get('/user/:userId', async (request) => {
    const { userId } = request.params as any;

    const userStats = await prisma.studyLog.groupBy({
      by: ['createdAt'],
      where: { userId },
      _count: { _all: true },
      _avg: { rating: true },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    const deckPerformance = await prisma.$queryRaw<any[]>`
      SELECT
        d.title as deck,
        COUNT(sl.id) as reviews,
        AVG(sl.rating) as avgRating,
        MIN(sl.createdAt) as firstReview,
        MAX(sl.createdAt) as lastReview
      FROM "StudyLog" sl
      JOIN "Card" c ON c.id = sl."cardId"
      JOIN "Deck" d ON d.id = c."deckId"
      WHERE sl."userId" = ${userId}
      GROUP BY d.id, d.title
      ORDER BY reviews DESC;
    `;

    return {
      dailyActivity: userStats,
      deckPerformance
    };
  });
}