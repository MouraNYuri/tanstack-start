import { cn } from "cn"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Adicione o resolver
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError, // Adicionado para exibir mensagens do form.setError
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createUserFn } from "#/services/users";
import { createUserSchema, type CreateUserInput } from "#/schemas/users";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  // 1. Passe o schema do Zod no useForm para validação no client side
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: CreateUserInput) {
    const result = await createUserFn({ data: values });

    if (!result.success) {
      if (result.field) {
        // Mapeia o erro devolvido pelo servidor diretamente no campo (ex: email)
        form.setError(result.field as keyof CreateUserInput, { message: result.error });
      } else {
        toast.error(result.error);
      }
      return;
    }

    toast.success(`Usuário ${result.data.name} criado com sucesso!`);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 2. O onSubmit entra AQUI envolvido por form.handleSubmit */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              
              {/* Campo: Name */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...form.register("name")} // 3. Registra o input
                />
                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
                )}
              </Field>

              {/* Campo: Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...form.register("email")} // 3. Registra o input
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>

              {/* Campo: Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")} // 3. Registra o input
                />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
                {form.formState.errors.password && (
                  <FieldError>{form.formState.errors.password.message}</FieldError>
                )}
              </Field>

              <Field>
                {/* 4. O botão dispara o submit e desabilita enquanto processa */}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Creating..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}