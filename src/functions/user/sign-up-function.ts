import { rateLimitMiddleware } from '#/middleware/rate-limit-middleware'
import { jwtProvider } from '#/providers'
import { userRepository } from '#/repositories'
import { createUserSchema, selectUserSchema } from '#/schemas'
import type { UserResponse } from '#/schemas'
import type { ActionResult } from '#/types/action-result'
import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'

export const signUpFn = createServerFn({ method: 'POST' })
  .middleware([
    rateLimitMiddleware({ key: 'signUpUserFn', max: 1, timeWindow: 300000 }),
  ])
  .validator((data: unknown) => createUserSchema.parse(data))
  .handler(
    async ({ data: { email, name } }): Promise<ActionResult<UserResponse>> => {
      const userAlreadyExist = await userRepository.exists(email)

      if (userAlreadyExist) {
        return {
          success: false,
          error: 'E-mail já cadastrado no sistema.',
          field: 'email',
        }
      }

      const newUser = await userRepository.create({
        email,
        name,
      })

      const token = await jwtProvider.sign({ publicId: newUser.publicId })

      setCookie('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 1,
      })

      return {
        success: true,
        data: selectUserSchema.parse(newUser),
      }
    },
  )
