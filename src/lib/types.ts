export interface Site {
  slug: string
  name: string
  category: string
  categoryLabel: string
  url: string
  thumb: string
  sort: number
}

export interface Category {
  slug: string
  name: string
}

export interface BlogBlock {
  type: 'p' | 'h2'
  text: string
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  cover: string
  blocks: BlogBlock[]
}

export interface Profile {
  id: string
  email: string | null
  is_pro: boolean
}
