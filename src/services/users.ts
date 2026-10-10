import { createServerFn } from '@tanstack/react-start'
import { setCookie, getCookie } from '@tanstack/react-start/server'
import { createUser, findUserBy, userExists } from '#/repositories/users'
import {
  createUserSchema,
  emailSchema,
  selectUserSchema,
  signInUserSchema,
} from '#/schemas/users'
import type { UserResponse } from '#/schemas/users'
import type { ActionResult } from '#/types/action-result'
import { EmailProvider } from '#/providers/email'
import { createHtml } from '#/helpers/create-html'
import { CacheProvider } from '#/providers/cache'
import { JwtProvider } from '#/providers/jwt'

export const createUserFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => createUserSchema.parse(data))
  .handler(
    async ({ data: { email, name } }): Promise<ActionResult<UserResponse>> => {
      const userAlreadyExist = await userExists(email)

      if (userAlreadyExist) {
        return {
          success: false,
          error: 'E-mail já cadastrado no sistema.',
          field: 'email',
        }
      }

      const newUser = await createUser({
        email,
        name,
      })

      const jwtProvider = new JwtProvider()

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

export const verifyEmailFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => emailSchema.parse(data))
  .handler(async ({ data: email }): Promise<ActionResult<string>> => {
    const user = userExists(email)

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

    const cacheProvider = new CacheProvider()

    await cacheProvider.set(email, verificationCode, verificationCodeExpires)

    const emailProvider = new EmailProvider()

    await emailProvider.send(
      email,
      'Confirme seu e-mail',
      createHtml(verificationCode),
    )

    return {
      success: true,
      data: 'Código enviado com sucesso!',
    }
  })

export const signInUserFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => signInUserSchema.parse(data))
  .handler(
    async ({ data: { email, otp } }): Promise<ActionResult<UserResponse>> => {
      const cacheProvider = new CacheProvider()

      const thereAVerificationCode = await cacheProvider.get(email)

      if (!thereAVerificationCode) {
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

      await cacheProvider.delete(email)

      const user = await findUserBy('email', email)

      if (!user) {
        return {
          success: false,
          error: 'E-mail não cadastrado no sistema.',
          field: 'email',
        }
      }

      const jwtProvider = new JwtProvider()

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

export const getProfileFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ActionResult<UserResponse>> => {
    const session = getCookie('session_token')

    if (!session) {
      return { success: false, error: 'Credenciais inválidas' }
    }

    const jwtProvider = new JwtProvider()

    const payload = await jwtProvider.verify(session)

    if (!payload || !payload.publicId) {
      return { success: false, error: 'Credenciais inválidas' }
    }

    const user = await findUserBy('publicId', payload.publicId as string)

    if (!user) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    return {
      success: true,
      data: selectUserSchema.parse(user),
    }
  },
)
