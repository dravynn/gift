'use client'

import { useState, useEffect, useRef } from 'react'
import { Gift } from '@/types/gift'
import Link from 'next/link'
import { fetchGifts, addGift, deleteGift, getImageUrl } from '@/lib/api'

export default function AdminPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    gender: '',
    ageMin: '',
    ageMax: '',
    nationalities: '',
    jobs: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadGifts()
  }, [])

  const loadGifts = async () => {
    try {
      const data = await fetchGifts()
      setGifts(data.gifts || [])
    } catch (error) {
      console.error('Error loading gifts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      } else if (formData.image) {
        formDataToSend.append('imageUrl', formData.image)
      }
      
      if (formData.gender) {
        formDataToSend.append('gender', formData.gender)
      }
      if (formData.ageMin) {
        formDataToSend.append('ageMin', formData.ageMin)
      }
      if (formData.ageMax) {
        formDataToSend.append('ageMax', formData.ageMax)
      }
      if (formData.nationalities) {
        formDataToSend.append('nationalities', formData.nationalities)
      }
      if (formData.jobs) {
        formDataToSend.append('jobs', formData.jobs)
      }

      await addGift(formDataToSend)
      
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        gender: '',
        ageMin: '',
        ageMax: '',
        nationalities: '',
        jobs: '',
      })
      setImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setShowForm(false)
      loadGifts()
    } catch (error) {
      console.error('Error adding gift:', error)
      alert('Failed to add gift')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gift?')) return

    try {
      await deleteGift(id)
      loadGifts()
    } catch (error) {
      console.error('Error deleting gift:', error)
      alert('Failed to delete gift')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">💝</span>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/50">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 font-medium mb-4 transition-colors duration-200 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
                <span>Back to home</span>
              </Link>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">
                <span className="inline-block bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                  Gift Management
                </span>
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Manage your store's gift inventory • <span className="font-bold text-pink-600">{gifts.length}</span> {gifts.length === 1 ? 'gift' : 'gifts'}
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
            >
              {showForm ? (
                <>
                  <span>✕</span>
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <span>+</span>
                  <span>Add New Gift</span>
                </>
              )}
            </button>
          </div>

          {showForm && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-pink-500/10 border border-pink-100/50 p-8 sm:p-10 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Add New Gift</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Gift Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium hover:border-gray-300"
                      placeholder="Enter gift name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Price <span className="text-rose-500">*</span> ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium hover:border-gray-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400 hover:border-gray-300 resize-none"
                    placeholder="Describe the gift..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Upload Image <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setImageFile(file)
                        setFormData({ ...formData, image: '' })
                      }
                    }}
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                  {imageFile && (
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Selected: {imageFile.name}</span>
                    </p>
                  )}
                  <div className="relative flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500 font-medium bg-white">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value })
                      setImageFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    placeholder="Enter image URL"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400 hover:border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Gender <span className="text-gray-500 font-normal">(comma-separated, optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      placeholder="e.g., male, female"
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400 hover:border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Age Min
                      </label>
                      <input
                        type="number"
                        value={formData.ageMin}
                        onChange={(e) => setFormData({ ...formData, ageMin: e.target.value })}
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium hover:border-gray-300"
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Age Max
                      </label>
                      <input
                        type="number"
                        value={formData.ageMax}
                        onChange={(e) => setFormData({ ...formData, ageMax: e.target.value })}
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium hover:border-gray-300"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Nationalities <span className="text-gray-500 font-normal">(comma-separated, optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nationalities}
                    onChange={(e) => setFormData({ ...formData, nationalities: e.target.value })}
                    placeholder="e.g., American, Japanese"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400 hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Jobs <span className="text-gray-500 font-normal">(comma-separated, optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobs}
                    onChange={(e) => setFormData({ ...formData, jobs: e.target.value })}
                    placeholder="e.g., Engineer, Teacher, Student"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400 hover:border-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Add Gift
                </button>
              </form>
            </div>
          )}

          {gifts.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-pink-500/10 border border-pink-100/50 p-12 sm:p-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 mb-6">
                <span className="text-5xl">📦</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                No gifts in store
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Start by adding your first gift to the store!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>+</span>
                <span>Add First Gift</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {gifts.map((gift) => (
                <div
                  key={gift.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-pink-500/5 overflow-hidden hover:shadow-2xl hover:shadow-pink-500/10 border border-pink-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  {gift.image ? (
                    <div className="h-56 relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <img
                        src={getImageUrl(gift.image)}
                        alt={gift.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-pink-400 via-rose-500 to-red-500 flex items-center justify-center group-hover:from-pink-500 group-hover:via-rose-600 group-hover:to-red-600 transition-all duration-300">
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-300">🎁</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-200">
                      {gift.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2 leading-relaxed">
                      {gift.description}
                    </p>
                    <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Price</span>
                        <p className="text-2xl font-bold">
                          <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                            ${gift.price.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(gift.id)}
                      className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-2.5 rounded-xl font-semibold shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

