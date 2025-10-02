import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/db';

export async function cardsRoutes(fastify: FastifyInstance) {
  // Get cards (optionally filtered by deckId)
  fastify.get('/', async (request) => {
    const { deckId } = request.query as any;
    const where = {
      deckId: deckId || undefined,
      hidden: false
    } as any;

    const cards = await prisma.card.findMany({
      where,
      orderBy: { dueAt: 'asc' },
      take: 100,
      include: {
        deck: {
          select: { id: true, title: true }
        }
      }
    });
    return cards;
  });

  // Create a new card
  fastify.post('/', async (request, reply) => {
    const { deckId, front, back } = request.body as any;
    const card = await prisma.card.create({
      data: {
        deckId,
        front,
        back
      }
    });
    reply.code(201);
    return card;
  });

  // Update card
  fastify.patch('/:id', async (request) => {
    const { id } = request.params as any;
    const data = request.body as any;
    const card = await prisma.card.update({
      where: { id },
      data
    });
    return card;
  });

  // Hide/unhide card
  fastify.post('/:id/hide', async (request) => {
    const { id } = request.params as any;
    const { hidden } = request.body as any;
    const card = await prisma.card.update({
      where: { id },
      data: { hidden }
    });
    return card;
  });

  // Delete card
  fastify.delete('/:id', async (request) => {
    const { id } = request.params as any;
    await prisma.card.delete({
      where: { id }
    });
    return { success: true };
  });
}