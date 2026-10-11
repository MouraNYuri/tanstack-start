import type { ActionResult } from '#/types/action-result'

interface RateLimitRecord {
  count: number
  expiresAt: number
}

const cacheStore = new Map<string, RateLimitRecord>()

interface CheckRateLimitOptions {
  ip: string
  key: string
  max?: number
  timeWindow?: number
}

export function checkRateLimit({
  ip,
  key,
  max = 5,
  timeWindow = 60 * 1000,
}: CheckRateLimitOptions): ActionResult<{ remaining: number }, string> {
  const now = Date.now()

  // Um contador independente para cada IP e endpoint.
  const cacheKey = `${ip}:${key}`
  const record = cacheStore.get(cacheKey)

  if (!record || now >= record.expiresAt) {
    cacheStore.set(cacheKey, {
      count: 1,
      expiresAt: now + timeWindow,
    })

    return {
      success: true,
      data: { remaining: max - 1 },
    }
  }

  if (record.count >= max) {
    const retryAfterSeconds = Math.ceil(
      (record.expiresAt - now) / 1000,
    )

    return {
      success: false,
      error: `Muitas tentativas. Tente novamente em ${retryAfterSeconds}s.`,
    }
  }

  record.count += 1

  return {
    success: true,
    data: { remaining: max - record.count },
  }
}