import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/db';

export async function decksRoutes(fastify: FastifyInstance) {
  // Get all decks
  fastify.get('/', async () => {
    const decks = await prisma.deck.findMany({
      include: {
        cards: true,
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    return decks;
  });

  // Create a new deck
  fastify.post('/', async (request, reply) => {
    const { title, ownerId, isPublic } = request.body as any;
    const deck = await prisma.deck.create({
      data: {
        title,
        ownerId,
        isPublic: !!isPublic
      }
    });
    reply.code(201);
    return deck;
  });

  // Get deck by ID
  fastify.get('/:id', async (request) => {
    const { id } = request.params as any;
    const deck = await prisma.deck.findUnique({
      where: { id },
      include: {
        cards: true,
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    return deck;
  });

  // Update deck
  fastify.put('/:id', async (request) => {
    const { id } = request.params as any;
    const data = request.body as any;
    const deck = await prisma.deck.update({
      where: { id },
      data
    });
    return deck;
  });

  // Delete deck
  fastify.delete('/:id', async (request) => {
    const { id } = request.params as any;
    await prisma.deck.delete({
      where: { id }
    });
    return { success: true };
  });
}