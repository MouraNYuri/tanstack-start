import { rateLimitMiddleware } from '#/middleware/rate-limit-middleware'
import { jwtProvider, verificationCodeProvider } from '#/providers'
import { userRepository } from '#/repositories'
import {
  selectUserSchema,
  signInUserSchema
  
} from '#/schemas'
import type {UserResponse} from '#/schemas';
import type { ActionResult } from '#/types/action-result'
import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'

export const signInFn = createServerFn({ method: 'POST' })
  .middleware([
    rateLimitMiddleware({ key: 'signInUserFn', max: 3, timeWindow: 100000 }),
  ])
  .validator((data: unknown) => signInUserSchema.parse(data))
  .handler(
    async ({
      data: { email, otp },
      context,
    }): Promise<ActionResult<UserResponse>> => {
      if (!context.rateLimit.success) {
        return context.rateLimit
      }
      const thereAVerificationCode = await verificationCodeProvider.get(email)

      if (!thereAVerificationCode.value) {
        return {
          success: false,
          error: 'Não existe um código de verificação para esse e-mail',
          field: 'email',
        }
      }

      const verificationCodesAreEquals = thereAVerificationCode.value === otp

      if (
        !verificationCodesAreEquals ||
        thereAVerificationCode.expires < new Date()
      ) {
        return {
          success: false,
          error: 'Código de verificação incorreto ou expirado',
          field: 'email',
        }
      }

      await verificationCodeProvider.delete(email)

      const user = await userRepository.findBy('email', email)

      if (!user) {
        return {
          success: false,
          error: 'E-mail não cadastrado no sistema.',
          field: 'email',
        }
      }

      const token = await jwtProvider.sign({ publicId: user.publicId })

      setCookie('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 1,
      })

      return { success: true, data: selectUserSchema.parse(user) }
    },
  )
