import Stripe from 'stripe'

const stripeSecret = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2023-10-16' })
  : null

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!stripe) {
    console.error('Stripe secret key missing')
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body
  try {
    body = await req.json()
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const {
    priceId,
    quantity = 1,
    metadata = {},
    successUrl,
    cancelUrl,
    customerEmail,
  } = body

  if (!priceId) {
    return new Response(JSON.stringify({ error: 'priceId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const origin = req.headers.get('origin') ?? 'https://1on1consult.org'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity }],
      success_url: successUrl ?? `${origin}/portal/booking?status=success`,
      cancel_url: cancelUrl ?? `${origin}/portal/booking?status=cancelled`,
      client_reference_id: metadata?.clientId ?? metadata?.client_profile_id,
      metadata,
      customer_email: customerEmail,
    })

    return new Response(
      JSON.stringify({ id: session.id, url: session.url }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Stripe checkout error', error)
    return new Response(JSON.stringify({ error: 'Unable to start checkout' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
