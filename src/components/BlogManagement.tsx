import React, { useState, useEffect } from 'react'
import { Trash2, Edit, Plus, BookOpen } from 'lucide-react'

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
  published: boolean
  createdAt: string
}

interface BlogManagementProps {
  isAdmin: boolean
}

const BlogManagement: React.FC<BlogManagementProps> = ({ isAdmin }) => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    categories: '',
    tags: '',
    image: '',
    published: false,
  })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (isAdmin) {
      fetchPosts()
    }
  }, [isAdmin])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/blog/posts`, {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      alert('Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content || !formData.excerpt) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        categories: formData.categories.split(',').map((c) => c.trim()).filter(Boolean),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        image: formData.image || undefined,
        published: formData.published,
      }

      const method = editingId ? 'PUT' : 'POST'
      const url = editingId
        ? `${BACKEND_URL}/api/admin/blog/posts/${editingId}`
        : `${BACKEND_URL}/api/admin/blog/posts`

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save post')

      alert(editingId ? 'Post updated successfully' : 'Post created successfully')
      resetForm()
      fetchPosts()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post')
    }
  }

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      categories: post.categories.join(', '),
      tags: post.tags.join(', '),
      image: post.image || '',
      published: post.published,
    })
    setEditingId(post._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/blog/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to delete post')
      alert('Post deleted successfully')
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'Admin',
      categories: '',
      tags: '',
      image: '',
      published: false,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAdmin) {
    return <div className="text-center text-slate-400">Unauthorized access</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="text-blue-500" size={28} />
          <h2 className="text-2xl font-bold text-white">Blog Management</h2>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-lg space-y-4 border border-slate-700">
          <input
            type="text"
            placeholder="Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Excerpt *"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />

          <textarea
            placeholder="Content (HTML supported) *"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-mono text-sm"
          />

          <input
            type="text"
            placeholder="Author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Categories (comma-separated)"
            value={formData.categories}
            onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
            className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />

          <label className="flex items-center gap-2 text-white cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="rounded"
            />
            Publish this post
          </label>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            {editingId ? 'Update Post' : 'Create Post'}
          </button>
        </form>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
      />

      {/* Posts List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No posts yet. Create your first blog post!</div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post._id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{post.title}</h3>
                    {post.published ? (
                      <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">Published</span>
                    ) : (
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">Draft</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.categories.map((cat) => (
                      <span key={cat} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BlogManagement
