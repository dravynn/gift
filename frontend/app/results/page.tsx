'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Gift } from '@/types/gift'
import { suggestGifts, getImageUrl } from '@/lib/api'

function ResultsContent() {
  const searchParams = useSearchParams()
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGifts = async () => {
      const params = {
        sex: searchParams.get('sex') || '',
        age: searchParams.get('age') || '',
        national: searchParams.get('national') || '',
        job: searchParams.get('job') || '',
      }

      try {
        const data = await suggestGifts({
          sex: params.sex,
          age: parseInt(params.age),
          national: params.national,
          job: params.job,
        })
        setGifts(data.gifts || [])
      } catch (error) {
        console.error('Error fetching gifts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGifts()
  }, [searchParams])

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
          <p className="text-xl font-semibold text-gray-700">Finding perfect gifts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/50">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 font-medium mb-6 transition-colors duration-200 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
              <span>Back to search</span>
            </Link>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                Gift Suggestions
              </span>
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              We found <span className="font-bold text-pink-600">{gifts.length}</span> {gifts.length === 1 ? 'perfect gift' : 'perfect gifts'} for you!
            </p>
          </div>

          {gifts.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-pink-500/10 border border-pink-100/50 p-12 sm:p-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 mb-6">
                <span className="text-5xl">🎁</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                No gifts available yet
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                The store owner hasn't added any gifts yet. Check back soon!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Try Again
              </Link>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 lg:gap-6 space-y-4 lg:space-y-6">
              {gifts.map((gift) => (
                <div
                  key={gift.id}
                  className="break-inside-avoid group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Image Section - Pinterest Style */}
                  {gift.image ? (
                    <div className="relative overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(gift.image)}
                        alt={gift.name}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Hover Overlay with Quick Actions - Pinterest Style */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button className="bg-white text-pink-600 px-4 py-2 rounded-full font-semibold shadow-lg hover:bg-pink-50 transform hover:scale-110 transition-all duration-200">
                          💝 Save
                        </button>
                        <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative bg-gradient-to-br from-pink-400 via-rose-500 to-red-500 aspect-[4/5] flex items-center justify-center group-hover:from-pink-500 group-hover:via-rose-600 group-hover:to-red-600 transition-all duration-300">
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-300">🎁</span>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button className="bg-white text-pink-600 px-4 py-2 rounded-full font-semibold shadow-lg hover:bg-pink-50 transform hover:scale-110 transition-all duration-200">
                          💝 Save
                        </button>
                        <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Content Section - Compact Pinterest Style */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1.5 line-clamp-1 group-hover:text-pink-600 transition-colors duration-200">
                      {gift.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-snug">
                      {gift.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold">
                          <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                            ${gift.price.toFixed(2)}
                          </span>
                        </p>
                      </div>
                      {/* AI Match Badge - Pinterest Style */}
                      <div className="flex items-center gap-1.5 bg-pink-50 text-pink-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <span>✨</span>
                        <span>AI Match</span>
                      </div>
                    </div>
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

export default function ResultsPage() {
  return (
    <Suspense fallback={
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
    }>
      <ResultsContent />
    </Suspense>
  )
}

