import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import StudentLayout from "../../components/app/StudentLayout";
import TeacherLayout from "../../components/app/TeacherLayout";
import toast from "react-hot-toast";
import { getCourseById } from "../../api/courseDetailApi";
import { enrollInCourse, getMyEnrollments } from "../../api/enrollmentApi";
import { getCourseStudents } from "../../api/courseStudentsApi";
import { getCourseReviews, saveCourseReview } from "../../api/reviewApi";
import CourseReviewsSection from "./CourseReviewsSection";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [savingReview, setSavingReview] = useState(false);
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    totalReviews: 0,
    averageRating: 0,
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseRes, reviewsRes] = await Promise.all([
          getCourseById(id),
          getCourseReviews(id),
        ]);

        setCourse(courseRes.data);
        setReviewsData(reviewsRes.data);

        if (user?.role === "student") {
          const enrollRes = await getMyEnrollments();
          const currentEnrollment = enrollRes.data.find(
            (item) => item.course?._id === id
          );
          setEnrolled(Boolean(currentEnrollment));
          setCanReview(Boolean(currentEnrollment?.isCompleted));

          const myReview = reviewsRes.data.reviews.find(
            (review) => review.student?._id === user?._id
          );

          if (myReview) {
            setReviewForm({
              rating: myReview.rating,
              comment: myReview.comment || "",
            });
          }
        }

        if (user?.role === "teacher") {
          const studentRes = await getCourseStudents(id);
          setStudents(studentRes.data);
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, user]);

  const handleEnroll = async () => {
    setEnrolling(true);
    const toastId = toast.loading("Enrolling...");

    try {
      await enrollInCourse(id);
      setEnrolled(true);
      toast.success("Enrolled successfully", { id: toastId });
    } catch {
      toast.error("Enrollment failed or you are already enrolled", {
        id: toastId,
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSavingReview(true);
    const toastId = toast.loading("Saving review...");

    try {
      const res = await saveCourseReview(id, reviewForm);
      const nextReviews = [
        res.data.review,
        ...reviewsData.reviews.filter((review) => review._id !== res.data.review._id),
      ];
      const totalReviews = nextReviews.length;
      const averageRating =
        totalReviews > 0
          ? Number(
              (
                nextReviews.reduce((sum, review) => sum + review.rating, 0) /
                totalReviews
              ).toFixed(1)
            )
          : 0;

      setReviewsData({
        reviews: nextReviews,
        totalReviews,
        averageRating,
      });

      toast.success("Review saved successfully", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save review", {
        id: toastId,
      });
    } finally {
      setSavingReview(false);
    }
  };

  const Layout = user?.role === "teacher" ? TeacherLayout : StudentLayout;

  return (
    <Layout title="">
      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
        </div>
      )}

      {!loading && course && (
        <div className="max-w-5xl space-y-8">
          <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Course Details
              </span>
              <h1 className="text-3xl font-semibold text-[#1f1637]">
                {course.title}
              </h1>
              <p className="text-base leading-7 text-[#6b6680]">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-[#7a7392]">
                <span>Instructor: {course.createdBy?.email || "Instructor"}</span>
                <span>•</span>
                <span>
                  {reviewsData.averageRating} / 5 rating from {reviewsData.totalReviews} review
                  {reviewsData.totalReviews === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </section>

          {user?.role === "student" && (
            <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#1f1637]">
                Your Learning
              </h2>

              {!enrolled ? (
                <div className="mt-5 space-y-4">
                  <p className="text-sm text-[#6b6680]">
                    You are not enrolled in this course yet.
                  </p>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className={`rounded-full px-5 py-3 text-sm font-semibold text-white transition ${
                      enrolling
                        ? "cursor-not-allowed bg-[#b9b2cb]"
                        : "bg-[#6d28d9] hover:bg-[#5b21b6]"
                    }`}
                  >
                    {enrolling ? "Enrolling..." : "Enroll in Course"}
                  </button>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-[#d8f0df] bg-[#f4fcf6] px-4 py-3 text-sm font-medium text-[#18794e]">
                    You are enrolled in this course.
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate("/my-courses")}
                      className="rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                    >
                      Continue Learning
                    </button>
                    {!canReview && (
                      <span className="inline-flex items-center rounded-full bg-[#faf8ff] px-4 py-3 text-sm text-[#6b6680]">
                        Finish the course to unlock reviews.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {user?.role === "teacher" && (
            <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#1f1637]">
                Enrolled Students
              </h2>

              {students.length === 0 ? (
                <p className="mt-4 text-sm text-[#6b6680]">
                  No students enrolled yet.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {students.map((student) => (
                    <div
                      key={student._id}
                      className="rounded-2xl bg-[#faf8ff] p-4"
                    >
                      <p className="font-medium text-[#1f1637]">
                        {student.student?.name || "Student"}
                      </p>
                      <p className="mt-1 text-sm text-[#6b6680]">
                        {student.student?.email}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <CourseReviewsSection
            user={user}
            reviewsData={reviewsData}
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            canReview={canReview}
            savingReview={savingReview}
            onSubmitReview={handleReviewSubmit}
          />
        </div>
      )}
    </Layout>
  );
};

export default CourseDetail;
