import { createHtml } from '#/helpers/create-html'
import { rateLimitMiddleware } from '#/middleware/rate-limit-middleware'
import { emailProvider, verificationCodeProvider } from '#/providers'
import { userRepository } from '#/repositories'
import { emailSchema } from '#/schemas'
import type { ActionResult } from '#/types/action-result'
import { createServerFn } from '@tanstack/react-start'

export const verifyEmailFn = createServerFn({ method: 'POST' })
  .middleware([
    rateLimitMiddleware({ key: 'verifyEmailFn', max: 1, timeWindow: 300000 }),
  ])
  .validator((data: unknown) => emailSchema.parse(data))
  .handler(async ({ data: email, context }): Promise<ActionResult<string>> => {
    if (!context.rateLimit.success) {
      return context.rateLimit
    }

    const user = await userRepository.exists(email)

    if (!user) {
      return {
        success: false,
        error: 'E-mail não cadastrado no sistema.',
        field: 'email',
      }
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString()

    const verificationCodeExpires = new Date(Date.now() + 5 * 60000)

    await verificationCodeProvider.set(
      email,
      verificationCode,
      verificationCodeExpires,
    )

    const result = await emailProvider.send(
      email,
      'Confirme seu e-mail',
      createHtml(verificationCode),
    )

    if (!result.success) {
      return {
        success: true,
        data: result.error,
      }
    }

    return {
      success: true,
      data: 'Código enviado com sucesso!',
    }
  })
