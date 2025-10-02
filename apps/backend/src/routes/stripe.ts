import { FastifyInstance } from 'fastify';
import Stripe from 'stripe';
import { prisma } from '../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any
});

export async function stripeRoutes(fastify: FastifyInstance) {
  // Create checkout session
  fastify.post('/checkout', async (request) => {
    const { userId } = request.body as any;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID_PREMIUM!,
        quantity: 1
      }],
      success_url: `${process.env.FRONTEND_URL}/premium/success`,
      cancel_url: `${process.env.FRONTEND_URL}/premium/cancel`,
      metadata: { userId }
    });

    return { url: session.url };
  });

  // Handle Stripe webhooks
  fastify.post('/webhook', async (request, reply) => {
    const sig = request.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(request.body as any, sig, endpointSecret);
    } catch (err: any) {
      reply.code(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
          // Update user to premium
          await prisma.user.update({
            where: { id: userId },
            data: { isPremium: true }
          });

          // Create subscription record
          await prisma.subscription.create({
            data: {
              userId,
              stripeId: session.subscription as string,
              status: 'active'
            }
          });
        }
        break;

      case 'invoice.payment_succeeded':
        // Handle successful payment
        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    reply.send({ received: true });
  });

  // Get user subscription status
  fastify.get('/subscription/:userId', async (request) => {
    const { userId } = request.params as any;

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return subscription;
  });
}