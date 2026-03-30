const StarRating = ({ value }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= value ? "text-[#f59e0b]" : "text-[#d4cde8]"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const CourseReviewsSection = ({
  user,
  reviewsData,
  reviewForm,
  setReviewForm,
  canReview,
  savingReview,
  onSubmitReview,
}) => {
  return (
    <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1f1637]">Reviews</h2>
          <p className="mt-1 text-sm text-[#6b6680]">
            {reviewsData.totalReviews} review{reviewsData.totalReviews === 1 ? "" : "s"} • {reviewsData.averageRating} / 5 average rating
          </p>
        </div>
        <div className="rounded-2xl bg-[#faf8ff] px-4 py-3 text-sm text-[#6b6680]">
          Student feedback helps the course feel more complete and real.
        </div>
      </div>

      {user?.role === "student" && (
        <div className="mt-6 rounded-3xl border border-[#ece8f7] bg-[#fcfbff] p-5">
          <h3 className="text-lg font-semibold text-[#1f1637]">Leave your review</h3>
          {canReview ? (
            <form onSubmit={onSubmitReview} className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4f4864]">
                  Rating
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4f4864]">
                  Comment
                </label>
                <textarea
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                  placeholder="Share what you liked and what helped you most."
                />
              </div>
              <button
                type="submit"
                disabled={savingReview}
                className="rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingReview ? "Saving..." : "Save Review"}
              </button>
            </form>
          ) : (
            <p className="mt-3 text-sm text-[#6b6680]">
              Complete the course first, then you can leave a review.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {reviewsData.reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#ddd6f3] bg-[#fcfbff] px-6 py-10 text-center text-sm text-[#6b6680]">
            No reviews yet. The first student review will appear here.
          </div>
        ) : (
          reviewsData.reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-3xl border border-[#ece8f7] bg-[#fcfbff] p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-[#1f1637]">
                    {review.student?.name || "Student"}
                  </p>
                  <p className="mt-1 text-sm text-[#6b6680]">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StarRating value={review.rating} />
              </div>
              <p className="mt-4 text-sm leading-6 text-[#4f4864]">
                {review.comment || "No written comment added."}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CourseReviewsSection;
