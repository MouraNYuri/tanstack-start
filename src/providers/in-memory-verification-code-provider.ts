class VerificationCodeProvider {
  private cleanupInterval: NodeJS.Timeout | null = null
  private verificationCodes = new Map()

  async set(key: string, value: string, expires: Date): Promise<void> {
    this.verificationCodes.set(key, { value, expires })
  }

  async get(key: string): Promise<{ value: string; expires: Date }> {
    return this.verificationCodes.get(key)
  }

  async delete(key: string): Promise<void> {
    this.verificationCodes.delete(key)
  }

  public startCleanup(): void {
    if (this.cleanupInterval) {
      return
    }

    this.cleanupInterval = setInterval(() => {
      const now = new Date()
      for (const [key, { expires }] of this.verificationCodes.entries()) {
        if (expires < now) {
          this.verificationCodes.delete(key)
          console.log(`Expired code for ${key} deleted.`)
        }
      }
    }, 60000)
  }

  public stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

export const verificationCodeProvider = new VerificationCodeProvider()
