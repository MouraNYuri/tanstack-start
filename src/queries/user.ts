import { getProfileFn } from '#/services/users'
import { queryOptions } from '@tanstack/react-query'

export const userQueryOptions = queryOptions({
  queryKey: ['auth', 'user'],
  queryFn: () => getProfileFn(),
  staleTime: 5 * 60 * 1000,
})
