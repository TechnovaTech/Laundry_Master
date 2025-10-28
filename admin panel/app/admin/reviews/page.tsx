'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

interface Review {
  _id: string
  orderId: { orderId: string }
  customerId: { name: string; email: string }
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setReviews(data)
      } else {
        console.error('API returned non-array data:', data)
        setReviews([])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      })
      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const filteredReviews = Array.isArray(reviews) ? reviews : []

  return (
    <ResponsiveLayout activePage="Reviews" title="Reviews Management" searchPlaceholder="Search by Order ID / Customer">
      <div style={{ padding: '1.5rem' }}>


        {/* Reviews Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr 1fr 2fr 1fr 1fr 1.5fr',
            gap: '1rem',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            <div>ORDER ID</div>
            <div>CUSTOMER</div>
            <div>RATING</div>
            <div>COMMENT</div>
            <div>DATE</div>
            <div>ACTIONS</div>
          </div>

          {/* Table Rows */}
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              Loading reviews...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              No reviews found
            </div>
          ) : filteredReviews.map((review, index) => (
            <div
              key={review._id}
              style={{
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr 1fr 2fr 1fr 1.5fr',
                gap: '1rem',
                borderBottom: index < filteredReviews.length - 1 ? '1px solid #f3f4f6' : 'none',
                fontSize: '0.9rem',
                alignItems: 'center'
              }}
            >
              <div style={{ fontWeight: '500' }}>{review.orderId?.orderId || 'N/A'}</div>
              <div>
                <div style={{ fontWeight: '500' }}>{review.customerId?.name || 'Unknown'}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{review.customerId?.email}</div>
              </div>
              <div>
                <div style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{renderStars(review.rating)}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{review.rating}/5</div>
              </div>
              <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {review.comment}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
              <div>
                <button
                  onClick={() => deleteReview(review._id)}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ResponsiveLayout>
  )
}