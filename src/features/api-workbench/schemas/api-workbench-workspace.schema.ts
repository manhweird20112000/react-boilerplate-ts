import { z } from 'zod'

const apiWorkbenchKeyValueSchema = z.object({
  id: z.string().min(1),
  key: z.string(),
  value: z.string(),
  enabled: z.boolean(),
  description: z.string().optional()
})

const apiWorkbenchAuthSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('none') }),
  z.object({ type: z.literal('bearer'), token: z.string() }),
  z.object({ type: z.literal('basic'), username: z.string(), password: z.string() }),
  z.object({
    type: z.literal('api-key'),
    key: z.string(),
    value: z.string(),
    target: z.union([z.literal('header'), z.literal('query')])
  })
])

const apiWorkbenchRequestBodySchema = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('none') }),
  z.object({
    mode: z.literal('raw'),
    raw: z.string(),
    language: z.union([
      z.literal('json'),
      z.literal('text'),
      z.literal('xml'),
      z.literal('html')
    ])
  }),
  z.object({
    mode: z.literal('form-data'),
    items: z.array(apiWorkbenchKeyValueSchema)
  }),
  z.object({
    mode: z.literal('urlencoded'),
    items: z.array(apiWorkbenchKeyValueSchema)
  })
])

const apiWorkbenchRequestSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  method: z.union([
    z.literal('GET'),
    z.literal('POST'),
    z.literal('PUT'),
    z.literal('PATCH'),
    z.literal('DELETE'),
    z.literal('HEAD'),
    z.literal('OPTIONS')
  ]),
  url: z.string(),
  params: z.array(apiWorkbenchKeyValueSchema),
  headers: z.array(apiWorkbenchKeyValueSchema),
  auth: apiWorkbenchAuthSchema,
  body: apiWorkbenchRequestBodySchema,
  timeoutMs: z.number().int().positive().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

type ApiWorkbenchFolderSchema = z.ZodObject<{
  id: z.ZodString
  name: z.ZodString
  folders: z.ZodArray<z.ZodLazy<ApiWorkbenchFolderSchema>>
  requests: z.ZodArray<typeof apiWorkbenchRequestSchema>
  createdAt: z.ZodString
  updatedAt: z.ZodString
}>

const apiWorkbenchFolderSchema: ApiWorkbenchFolderSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  folders: z.array(z.lazy(() => apiWorkbenchFolderSchema)),
  requests: z.array(apiWorkbenchRequestSchema),
  createdAt: z.string(),
  updatedAt: z.string()
})

const apiWorkbenchCollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  description: z.string().optional(),
  folders: z.array(apiWorkbenchFolderSchema),
  requests: z.array(apiWorkbenchRequestSchema),
  createdAt: z.string(),
  updatedAt: z.string()
})

const apiWorkbenchVariableSchema = z.object({
  id: z.string().min(1),
  key: z.string(),
  value: z.string(),
  enabled: z.boolean(),
  secret: z.boolean(),
  description: z.string().optional()
})

const apiWorkbenchEnvironmentSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  variables: z.array(apiWorkbenchVariableSchema),
  createdAt: z.string(),
  updatedAt: z.string()
})

const apiWorkbenchResponseHeaderSchema = z.object({
  key: z.string(),
  value: z.string()
})

const apiWorkbenchResponseSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('success'),
    url: z.string(),
    method: apiWorkbenchRequestSchema.shape.method,
    status: z.number().int(),
    statusText: z.string(),
    headers: z.array(apiWorkbenchResponseHeaderSchema),
    body: z.string(),
    bodySizeBytes: z.number().int().nonnegative().optional(),
    durationMs: z.number().nonnegative(),
    receivedAt: z.string()
  }),
  z.object({
    type: z.literal('failure'),
    url: z.string(),
    method: apiWorkbenchRequestSchema.shape.method,
    errorType: z.union([
      z.literal('network'),
      z.literal('timeout'),
      z.literal('cancelled'),
      z.literal('invalid-request'),
      z.literal('unknown')
    ]),
    message: z.string(),
    durationMs: z.number().nonnegative().optional(),
    receivedAt: z.string()
  })
])

const apiWorkbenchHistoryEntrySchema = z.object({
  id: z.string().min(1),
  request: apiWorkbenchRequestSchema,
  response: apiWorkbenchResponseSchema,
  sentAt: z.string()
})

export const apiWorkbenchWorkspaceSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  name: z.string(),
  activeEnvironmentId: z.string().optional(),
  collections: z.array(apiWorkbenchCollectionSchema),
  environments: z.array(apiWorkbenchEnvironmentSchema),
  history: z.array(apiWorkbenchHistoryEntrySchema),
  settings: z.object({
    historyLimit: z.number().int().positive(),
    defaultTimeoutMs: z.number().int().positive()
  }),
  createdAt: z.string(),
  updatedAt: z.string()
})

