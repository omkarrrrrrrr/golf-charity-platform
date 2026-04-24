import Stripe from 'stripe'

export async function POST(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET)

    const body = await req.json()
    const { user_id, email } = body

    if (!user_id || !email) {
      return Response.json({ error: 'Missing user data' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: 'price_1TPTf6GcjOjWQqHhUtTLktyk', // 🔥 PUT YOUR REAL PRICE ID HERE
          quantity: 1,
        },
      ],
      success_url: process.env.NEXT_PUBLIC_BASE_URL + '/dashboard',
      cancel_url: process.env.NEXT_PUBLIC_BASE_URL,
      metadata: {
        user_id,
        email,
      },
    })

    return Response.json({ url: session.url })

  } catch (err) {
    console.error("STRIPE ERROR:", err)

    return Response.json(
      { error: err.message },
      { status: 500 }
    )
  }
}