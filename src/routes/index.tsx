import { Header } from '#/components/shared/header'
import { profileQueryOptions } from '#/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.query(profileQueryOptions)
  },
  component: IndexPage,
})

function IndexPage() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions)

  return (
    <div className="bg-muted min-h-svh">
      <Header {...profile} />
    </div>
  )
}
