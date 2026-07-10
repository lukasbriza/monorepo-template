import createFetchClient from 'openapi-fetch'
import createQueryClient from 'openapi-react-query'

import type { paths } from './api'

// Low-level typed fetch client. Set the real baseUrl here (placeholder today).
export const fetchClient = createFetchClient<paths>({ baseUrl: 'https://my-api.cz/' })

// Typed TanStack Query hooks bound to the OpenAPI schema.
// Usage: `$api.useQuery('get', '/breeds', { params: { query: { limit: 5 } } })`
// Prefetch (RSC): `queryClient.prefetchQuery($api.queryOptions('get', '/breeds', init))`
export const $api = createQueryClient(fetchClient)

export default fetchClient
