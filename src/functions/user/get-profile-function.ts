import { rateLimitMiddleware } from '#/middleware/rate-limit-middleware'
import { jwtProvider } from '#/providers'
import { userRepository } from '#/repositories'
import { selectUserSchema  } from '#/schemas'
import type {UserResponse} from '#/schemas';
import type { ActionResult } from '#/types/action-result'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const getProfileFn = createServerFn({ method: 'GET' })
  .middleware([
    rateLimitMiddleware({ key: 'getProfileFn', max: 15, timeWindow: 100000 }),
  ])
  .handler(async (): Promise<ActionResult<UserResponse>> => {
    const session = getCookie('session_token')

    if (!session) {
      return { success: false, error: 'Credenciais inválidas' }
    }

    const payload = await jwtProvider.verify(session)

    if (!payload || !payload.publicId) {
      return { success: false, error: 'Credenciais inválidas' }
    }

    const user = await userRepository.findBy(
      'publicId',
      payload.publicId as string,
    )

    if (!user) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    return {
      success: true,
      data: selectUserSchema.parse(user),
    }
  })
