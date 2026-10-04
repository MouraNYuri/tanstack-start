import { Resend } from 'resend'

export class EmailProvider {
  private readonly provider
  constructor() {
    this.provider = new Resend(Bun.env.EMAIL_PROVIDER_API_KEY)
  }
  async send(to: string, subject: string, html: string): Promise<void> {
    const msg = {
      from: Bun.env.EMAIL_PROVIDER_FROM!,
      to,
      subject,
      html,
    }

    const { error } = await this.provider.emails.send(msg)

    if (error) {
      throw new Error(error.message || 'Falha ao enviar o email')
    }

    return
  }
}
