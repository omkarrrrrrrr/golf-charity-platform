import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET)

export async function POST(req) {
  try {
    const { user_id, email } = await req.json()

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Monthly Subscription',
            },
            unit_amount: 50000, // ₹500
          },
          quantity: 1,
        },
      ],

      success_url: `${baseUrl}/dashboard`,
      cancel_url: `${baseUrl}/dashboard`,

      metadata: {
        user_id,
        email,
      },
    })

    return Response.json({ url: session.url })
  } catch (err) {
    return Response.json({ error: err.message })
  }
}