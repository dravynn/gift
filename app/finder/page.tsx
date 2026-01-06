'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FinderPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    sex: '',
    age: '',
    national: '',
    job: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const params = new URLSearchParams({
      sex: formData.sex,
      age: formData.age,
      national: formData.national,
      job: formData.job,
    })

    router.push(`/results?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/50">
      <div className="container mx-auto px-4 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/20 mb-4">
              <span className="text-4xl">💝</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent mb-2">
              Gift Finder
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-medium">
              Discover the perfect gift tailored to your friend's preferences
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-pink-500/10 border border-pink-100/50 p-8 sm:p-10 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="sex" className="block text-sm font-semibold text-gray-800 mb-3">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  id="sex"
                  required
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium hover:border-gray-300"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-800 mb-3">
                  Age <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  required
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label htmlFor="national" className="block text-sm font-semibold text-gray-800 mb-3">
                  Nationality <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="national"
                  required
                  value={formData.national}
                  onChange={(e) => setFormData({ ...formData, national: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="e.g., American, Japanese"
                />
              </div>

              <div>
                <label htmlFor="job" className="block text-sm font-semibold text-gray-800 mb-3">
                  Job/Profession <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="job"
                  required
                  value={formData.job}
                  onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="e.g., Engineer, Teacher, Student"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Finding Gifts...
                  </span>
                ) : (
                  'Find Perfect Gifts 💝'
                )}
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 font-medium transition-colors duration-200 group"
            >
              <span>Are you the store owner?</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">Manage gifts →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

