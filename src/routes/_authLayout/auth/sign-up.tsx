import { SignUpForm } from '#/components/features/sign-up-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authLayout/auth/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  return <SignUpForm />
}
