import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Tag, Calendar } from 'lucide-react'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  categories: string[]
  tags: string[]
  image?: string
  createdAt: string
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    fetchPosts()
    fetchMetadata()
  }, [selectedCategory, page, searchTerm])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '9')
      if (selectedCategory) params.append('category', selectedCategory)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`${BACKEND_URL}/api/blog/posts?${params}`)
      const data = await response.json()
      setPosts(data.posts)

      const newParams = new URLSearchParams()
      if (selectedCategory) newParams.set('category', selectedCategory)
      if (searchTerm) newParams.set('search', searchTerm)
      if (page > 1) newParams.set('page', page.toString())
      setSearchParams(newParams)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMetadata = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/blog/categories`),
        fetch(`${BACKEND_URL}/api/blog/tags`),
      ])
      const cats = await catRes.json()
      const tgs = await tagRes.json()
      setCategories(cats || [])
      setTags(tgs || [])
    } catch (error) {
      console.error('Failed to fetch metadata:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Blog & Insights</h1>
          <p className="text-xl text-slate-300">Thoughts on web development, design, and technology</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                setSelectedCategory('')
                setPage(1)
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No articles found. Try a different search.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className="group bg-slate-900 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-blue-500/20 transition-all"
                >
                  {post.image && (
                    <div className="h-48 bg-slate-800 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-400 mb-4 line-clamp-2">{post.excerpt}</p>

                    {/* Meta */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={16} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                              <Tag size={12} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:bg-slate-700 disabled:text-slate-500 hover:bg-blue-700 transition-colors"
              >
                ← Previous
              </button>
              <span className="px-4 py-2 text-slate-400">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Blog
