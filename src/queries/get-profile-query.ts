import { getProfileFn } from '#/functions'
import { queryOptions } from '@tanstack/react-query'

export const profileQueryOptions = queryOptions({
  queryKey: ['profile'],
  queryFn: () => getProfileFn(),
  staleTime: 5 * 60 * 1000,
})
