import useSWR from 'swr'
import type { z } from 'zod'
import { clientAuthenticatedReadFetch } from '../utils/fetch/client/client-auth-fetch'

type UseAuthSWRProps<Output> = {
  path: string
  validateOutput: z.Schema<Output>
  params?: Record<string, string>
  isFetch?: boolean
}

export function useAuthSWR<Output>({
  path,
  validateOutput,
  params,
  isFetch = true,
}: UseAuthSWRProps<Output>) {
  const { data, error, isLoading } = useSWR(
    isFetch ? [path, JSON.stringify(params)] : null, // SWRキー
    () => clientAuthenticatedReadFetch({ path, validateOutput, params }),
  )

  return {
    data,
    error,
    isLoading,
  }
}
