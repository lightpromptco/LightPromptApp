import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID as string,
  dataset: process.env.SANITY_DATASET as string,
  apiVersion: '2025-08-11', // today's date
  useCdn: true,
  token: process.env.SANITY_API_TOKEN
})
