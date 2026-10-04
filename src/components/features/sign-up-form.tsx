import { cn } from 'cn'

import { useForm } from 'react-hook-form'
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
import { createUserFn } from '#/services/users'
import { createUserSchema } from '#/schemas/users'
import type { CreateUserInput } from '#/schemas/users'
import { Link } from '@tanstack/react-router'

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  async function onSubmit(values: CreateUserInput) {
    const result = await createUserFn({ data: values })

    if (!result.success) {
      if (result.field) {
        form.setError(result.field as keyof CreateUserInput, {
          message: result.error,
        })
      } else {
        toast.error(result.error)
      }
      return
    }

    toast.success(`Conta criada com sucesso para ${result.data.name}!`)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crie sua conta</CardTitle>
          <CardDescription>
            Preencha seus dados abaixo para começar a usar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Campo: Nome Completo */}
              <Field>
                <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
                )}
              </Field>

              {/* Campo: E-mail */}
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>

              {/* Ação de Submissão */}
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? 'Criando conta...'
                    : 'Criar conta'}
                </Button>
                <FieldDescription className="text-center mt-2">
                  Já tem uma conta? <Link to="/sign-in">Fazer login</Link>
                </FieldDescription>
              </Field>
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
