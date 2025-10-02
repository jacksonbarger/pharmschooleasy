import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/db';
import { review, Rating } from '../lib/spacedRepetition';

export async function studyRoutes(fastify: FastifyInstance) {
  // Grade a card (spaced repetition)
  fastify.post('/grade', async (request) => {
    const { cardId, rating, timeSpent, userId } = request.body as any;

    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      throw new Error('Card not found');
    }

    // Apply spaced repetition algorithm
    const updated = review(
      { ease: card.ease, interval: card.interval, repetitions: card.repetitions },
      rating as Rating
    );

    // Update card with new spaced repetition values
    const saved = await prisma.card.update({
      where: { id: cardId },
      data: {
        ease: updated.ease,
        interval: updated.interval,
        repetitions: updated.repetitions,
        dueAt: updated.dueAt
      }
    });

    // Log the study session
    await prisma.studyLog.create({
      data: {
        userId,
        cardId,
        rating,
        timeSpent
      }
    });

    return saved;
  });

  // Get due cards for a user
  fastify.get('/due/:userId', async (request) => {
    const { userId } = request.params as any;
    const { limit = 20 } = request.query as any;

    const cards = await prisma.card.findMany({
      where: {
        deck: {
          ownerId: userId
        },
        hidden: false,
        dueAt: {
          lte: new Date()
        }
      },
      include: {
        deck: {
          select: { id: true, title: true }
        }
      },
      orderBy: { dueAt: 'asc' },
      take: parseInt(limit)
    });

    return cards;
  });

  // Get study statistics for a user
  fastify.get('/stats/:userId', async (request) => {
    const { userId } = request.params as any;

    const totalCards = await prisma.card.count({
      where: {
        deck: { ownerId: userId },
        hidden: false
      }
    });

    const dueCards = await prisma.card.count({
      where: {
        deck: { ownerId: userId },
        hidden: false,
        dueAt: { lte: new Date() }
      }
    });

    const totalReviews = await prisma.studyLog.count({
      where: { userId }
    });

    const averageRating = await prisma.studyLog.aggregate({
      where: { userId },
      _avg: { rating: true }
    });

    return {
      totalCards,
      dueCards,
      totalReviews,
      averageRating: averageRating._avg.rating || 0
    };
  });
}