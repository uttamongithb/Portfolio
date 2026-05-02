import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'

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

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${BACKEND_URL}/api/blog/posts/${slug}`)
      if (!response.ok) {
        throw new Error('Post not found')
      }
      const data = await response.json()
      setPost(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-slate-400 mb-8">{error}</p>
          <Link to="/blog" className="text-blue-400 hover:text-blue-300">
            ← Back to blog
          </Link>
        </div>
      </div>
    )
  }

  const publishDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <Helmet>
        <title>{post.title} | Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta name="article:published_time" content={post.createdAt} />
        {post.author && <meta name="article:author" content={post.author} />}
        {post.tags.map((tag) => (
          <meta key={tag} name="article:tag" content={tag} />
        ))}
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to blog
          </Link>

          {/* Header */}
          <article>
            <h1 className="text-5xl font-bold mb-6">{post.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-slate-700 text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <time dateTime={post.createdAt}>{publishDate}</time>
              </div>
              {post.author && (
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{post.author}</span>
                </div>
              )}
              {post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/blog?category=${cat}`}
                      className="inline-block px-3 py-1 bg-slate-800 rounded-full text-sm hover:bg-slate-700 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Image */}
            {post.image && (
              <div className="mb-8 rounded-lg overflow-hidden h-96 bg-slate-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Excerpt */}
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">{post.excerpt}</p>

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-8">
              <div
                className="text-slate-200 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-700">
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog?tag=${tag}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                    >
                      <Tag size={16} />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </>
  )
}

export default BlogDetail
