const verificationCodes = new Map()

export class CacheProvider {
  private cleanupInterval: NodeJS.Timeout | null = null

  async set(key: string, value: string, expires: Date): Promise<void> {
    verificationCodes.set(key, { value, expires })
  }

  async get(key: string): Promise<{ value: string; expires: Date }> {
    return verificationCodes.get(key)
  }

  async delete(key: string): Promise<void> {
    verificationCodes.delete(key)
  }

  public startCleanup(): void {
    if (this.cleanupInterval) {
      return
    }

    this.cleanupInterval = setInterval(() => {
      const now = new Date()
      for (const [key, { expires }] of verificationCodes.entries()) {
        if (expires < now) {
          verificationCodes.delete(key)
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
