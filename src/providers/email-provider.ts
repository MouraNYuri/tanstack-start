import type { ActionResult } from '#/types/action-result'
import { Resend } from 'resend'

class EmailProvider {
  private readonly provider

  constructor() {
    this.provider = new Resend(Bun.env.EMAIL_PROVIDER_API_KEY)
  }

  async send(
    to: string,
    subject: string,
    html: string,
  ): Promise<ActionResult<string>> {
    const msg = {
      from: Bun.env.EMAIL_PROVIDER_FROM!,
      to,
      subject,
      html,
    }

    const { error } = await this.provider.emails.send(msg)

    if (error) {
      return {
        success: false,
        error: error.message || 'Falha ao enviar o email',
      }
    }

    return {
      success: true,
      data: 'E-mail enviado com sucesso',
    }
  }
}

export const emailProvider = new EmailProvider()
