import { userQueryOptions } from '#/queries/user'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.query(userQueryOptions)
  },
  component: IndexPage,
})

function IndexPage() {
  const { data: profile } = useSuspenseQuery(userQueryOptions)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Painel do Usuário</h1>
      {profile.success && profile.data ? (
        <div className="mt-4 rounded-lg border p-4">
          <p><strong>Nome:</strong> {profile.data.name}</p>
          <p><strong>E-mail:</strong> {profile.data.email}</p>
        </div>
      ) : (
        <p>Não foi possível carregar o perfil. <Link className='underline' to='/auth/sign-up'>Ir para o cadastro</Link></p>
      )}
    </div>
  )
}
