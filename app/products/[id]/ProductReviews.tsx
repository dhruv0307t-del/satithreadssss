"use client";

import { useState } from "react";

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock reviews - in real app fetch via productId
    const reviews = [
        {
            id: 1,
            name: "Priya S.",
            date: "2 days ago",
            rating: 5,
            text: "Absolutely love this outfit! The fabric quality is amazing and the fit is perfect. Highly recommend!",
            helpful: 12
        },
        {
            id: 2,
            name: "Anjali M.",
            date: "1 week ago",
            rating: 4,
            text: "Beautiful design and color. Sizing runs slightly small, so I'd recommend ordering one size up.",
            helpful: 8
        },
        {
            id: 3,
            name: "Neha K.",
            date: "2 weeks ago",
            rating: 5,
            text: "Received so many compliments! The quality exceeded my expectations. Will definitely buy again.",
            helpful: 15
        }
    ];

    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = '';
    };

    return (
        <>
            <div className="product-container">
                <div className="reviews-section" style={{ gridColumn: "1 / -1" }}>
                    <div className="reviews-header">
                        <div>
                            <div className="reviews-title">Customer Reviews</div>
                            <div className="review-summary">
                                <span className="review-rating">4.7</span>
                                <span>out of 5 ({reviews.length} reviews)</span>
                            </div>
                        </div>
                        <button className="write-review-btn" onClick={openModal}>Write a Review</button>
                    </div>

                    <div className="reviews-preview">
                        {reviews.slice(0, 3).map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header-info">
                                    <div>
                                        <div className="reviewer-name">{review.name}</div>
                                        <div className="review-date">{review.date}</div>
                                    </div>
                                </div>
                                <div className="review-text">
                                    {review.text}
                                </div>
                                <div className="review-helpful">
                                    👍 Helpful ({review.helpful})
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="view-all-reviews">
                        <a className="view-all-link" onClick={openModal}>View All Reviews →</a>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            <div className={`modal ${isModalOpen ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">All Reviews</h2>
                        <button className="modal-close" onClick={closeModal}>×</button>
                    </div>

                    <div className="all-reviews">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header-info">
                                    <div>
                                        <div className="reviewer-name">{review.name}</div>
                                        <div className="review-date">{review.date}</div>
                                    </div>
                                </div>
                                <div className="review-text">
                                    {review.text}
                                </div>
                                <div className="review-helpful">
                                    👍 Helpful ({review.helpful})
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
