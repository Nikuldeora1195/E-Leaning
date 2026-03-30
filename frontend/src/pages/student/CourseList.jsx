import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPublishedCourses, enrollCourse } from "../../api/courseApi";
import StudentLayout from "../../components/app/StudentLayout";
import usePageTitle from "../../utils/usePageTitle";

const CourseList = () => {
  usePageTitle("Browse Courses | LearnMax");

  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getPublishedCourses();
        setAllCourses(res.data);
        setCourses(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Your session expired. Please log in again.");
        } else if (!err.response) {
          setError("Backend is not reachable. Make sure the local server is running.");
        } else {
          setError(err.response?.data?.message || "Failed to load courses");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    const filtered = allCourses.filter((course) => {
      const query = search.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
      );
    });

    setCourses(filtered);
  }, [search, allCourses]);

  const handleEnroll = async (id) => {
    setEnrollingId(id);

    try {
      await enrollCourse(id);
      toast.success("Enrolled successfully");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("You are already enrolled in this course");
      } else {
        toast.error("Enrollment failed. Please try again.");
      }
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <StudentLayout title="Browse Courses">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="">
      <div className="space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
              Browse Courses
            </span>
            <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
              Explore your next course
            </h1>
            <p className="max-w-2xl text-base text-[#6b6680]">
              Discover published courses, search by topic, and enroll when you
              are ready to start learning.
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#1f1637]">
                Available Courses
              </h2>
              <p className="mt-1 text-sm text-[#6b6680]">
                {courses.length} {courses.length === 1 ? "course" : "courses"} found
              </p>
            </div>

            <input
              type="text"
              placeholder="Search courses"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9] md:w-80"
            />
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-[#f8caca] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#b42318]">
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-[#ddd6f3] bg-white px-6 py-16 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-[#1f1637]">
              No courses found
            </h3>
            <p className="mt-2 text-sm text-[#6b6680]">
              Try searching with a different keyword.
            </p>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course._id}
                className="overflow-hidden rounded-[28px] border border-[#ece8f7] bg-white shadow-sm transition hover:border-[#d3c4f8] hover:shadow-md"
              >
                <div className="border-b border-[#f1edfb] bg-[#faf8ff] p-6">
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6d28d9]">
                    Published Course
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-[#1f1637]">
                    {course.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6b6680]">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-5 p-6">
                  <div className="rounded-2xl bg-[#faf8ff] p-4">
                    <p className="text-xs uppercase tracking-wide text-[#8c84a3]">
                      Instructor
                    </p>
                    <p className="mt-1 font-medium text-[#1f1637]">
                      {course.createdBy?.name || "Instructor"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleEnroll(course._id)}
                    disabled={enrollingId === course._id}
                    className={`w-full rounded-full px-5 py-3 text-sm font-semibold text-white transition ${
                      enrollingId === course._id
                        ? "cursor-not-allowed bg-[#b9b2cb]"
                        : "bg-[#6d28d9] hover:bg-[#5b21b6]"
                    }`}
                  >
                    {enrollingId === course._id ? "Enrolling..." : "Enroll Now"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </StudentLayout>
  );
};

export default CourseList;
