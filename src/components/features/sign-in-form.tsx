import React from 'react'
import { cn } from 'cn'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { signInUserFn, verifyEmailFn } from '#/services/users'
import { signInUserSchema } from '#/schemas/users'
import type { SignUserInput } from '#/schemas/users'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { userQueryOptions } from '#/queries/user'

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isSendingOtp, setIsSendingOtp] = React.useState(false)

  const form = useForm<SignUserInput>({
    resolver: zodResolver(signInUserSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  })

  // Dispara o envio do código de verificação
  async function handleVerifyEmail() {
    const isValidEmail = await form.trigger('email')
    if (!isValidEmail) return

    const email = form.getValues('email')
    setIsSendingOtp(true)

    try {
      const result = await verifyEmailFn({ data: email })

      if (!result.success) {
        if (result.field) {
          form.setError(result.field as keyof SignUserInput, {
            message: result.error,
          })
        } else {
          toast.error(result.error)
        }
        return
      }

      toast.success(result.data || 'Código de acesso enviado para seu e-mail!')
    } catch (err) {
      toast.error('Erro inesperado ao enviar o e-mail de acesso.')
    } finally {
      setIsSendingOtp(false)
    }
  }

  // Submit final do formulário
  async function onSubmit(values: SignUserInput) {
    try {
      const result = await signInUserFn({ data: values })

      if (!result.success) {
        if (result.field) {
          form.setError(result.field as keyof SignUserInput, {
            message: result.error,
          })
        } else {
          toast.error(result.error)
        }
        return
      }

      queryClient.setQueryData(userQueryOptions.queryKey, result)

      toast.success('Login realizado com sucesso!')
      navigate({ to: '/', replace: true })
    } catch {
      toast.error('Erro ao processar o login.')
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Acessar sua conta</CardTitle>
          <CardDescription>
            Digite seu e-mail para receber um código de acesso instantâneo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Campo: Email + Botão de Envio de Código */}
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    {...form.register('email')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyEmail}
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp ? 'Enviando...' : 'Enviar código'}
                  </Button>
                </div>
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>

              {/* Campo: Código de verificação OTP */}
              <Field>
                <FieldLabel htmlFor="otp">Código de verificação</FieldLabel>
                <Controller
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {form.formState.errors.otp ? (
                  <FieldError>{form.formState.errors.otp.message}</FieldError>
                ) : (
                  <FieldDescription>
                    Insira o código de 6 dígitos enviado para seu e-mail.
                  </FieldDescription>
                )}
              </Field>

              {/* Ações Finais */}
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? 'Validando código...'
                    : 'Entrar na plataforma'}
                </Button>
              </Field>
              <FieldDescription className="text-center mt-2">
                Não tem uma conta? <Link to="/auth/sign-up">Criar conta</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{' '}
        e <a href="#">Política de Privacidade</a>.
      </FieldDescription>
    </div>
  )
}
