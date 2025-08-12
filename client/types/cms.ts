export type Homepage = {
  headline?: string
  subheading?: string
  heroImage?: { asset?: { _ref?: string; _type?: string; url?: string } }
  heroUrl?: string // we’ll project this
}

export type Post = {
  title?: string
  slug?: string
  excerpt?: string
  coverUrl?: string
  publishedAt?: string
}
