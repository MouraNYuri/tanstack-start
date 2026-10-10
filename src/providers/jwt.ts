import { SignJWT, jwtVerify } from 'jose'
import type { JWTPayload } from 'jose'

export class JwtProvider {
  private readonly secretKey: Uint8Array

  constructor() {
    this.secretKey = new TextEncoder().encode(Bun.env.JWT_SECRET)
  }

  async sign(
    payload: Record<string, unknown>,
    options?: {
      expiresIn?: string
      algorithm?: string
    },
  ): Promise<string> {
    const algorithm = options?.algorithm || 'HS256'
    const expiresIn = options?.expiresIn || '1d'

    return await new SignJWT(payload)
      .setProtectedHeader({ alg: algorithm })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(this.secretKey)
  }

  async verify<T extends JWTPayload = JWTPayload>(
    token: string,
  ): Promise<T | null> {
    try {
      const { payload } = await jwtVerify(token, this.secretKey)
      return payload as T
    } catch (error) {
      return null
    }
  }
}
