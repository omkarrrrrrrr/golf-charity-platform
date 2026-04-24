import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { user_id } = session.metadata

    // ✅ ACTIVATE SUBSCRIPTION (30 days)
    await supabase.from('users_meta').upsert({
      user_id,
      subscription_active: true,
      subscription_expiry: new Date(Date.now() + 30*24*60*60*1000)
    })
  }

  return new Response('ok')
}