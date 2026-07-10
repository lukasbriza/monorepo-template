import createFetchClient from 'openapi-fetch'
import createQueryClient from 'openapi-react-query'

import type { paths } from './api'

// Low-level typed fetch client. Set the real baseUrl here (placeholder today).
export const fetchClient = createFetchClient<paths>({ baseUrl: 'https://my-api.cz/' })

// Typed TanStack Query hooks bound to the OpenAPI schema.
export const $api = createQueryClient(fetchClient)

export default fetchClient
