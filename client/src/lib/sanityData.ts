import { client } from './sanity'

// Fetch homepage data
export async function getHomepage() {
  return await client.fetch(`*[_type == "homepage"][0]`)
}

// Fetch posts
export async function getPosts() {
  return await client.fetch(`*[_type == "post"] | order(_createdAt desc)`)
}
