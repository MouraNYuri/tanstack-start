import { checkRateLimit } from '#/providers/rate-limit'
import { createMiddleware } from '@tanstack/react-start'

type RateLimitOptions = {
  key: string
  max?: number
  timeWindow?: number
}

export function rateLimitMiddleware({ key, max, timeWindow }: RateLimitOptions) {
  return createMiddleware().server(async ({ next, request }) => {
    const ip =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      '127.0.0.1'

    const rateLimitResult = checkRateLimit({
      key,
      ip,
      max,
      timeWindow,
    })

    return next({
      context: {
        rateLimit: rateLimitResult,
      },
    })
  })
}
