import { SignInForm } from '#/components/features/sign-in-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authLayout/auth/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  return <SignInForm />
}
