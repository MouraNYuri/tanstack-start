import { rateLimitMiddleware } from '#/middleware/rate-limit-middleware'
import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'

export const signOutFn = createServerFn({ method: 'POST' })
  .middleware([
    rateLimitMiddleware({ key: 'signOutFn', max: 1, timeWindow: 300000 }),
  ])
  .handler(async () => {
    // Remove ou expira o cookie de autenticação
    setCookie('session_token', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    return {
      success: true,
      data: 'Desconectado com sucesso.',
    }
  })
