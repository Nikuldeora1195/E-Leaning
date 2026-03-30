import { useEffect, useState } from "react";
import * as teacherCourseApi from "../../api/teacherCourseApi";
import toast from "react-hot-toast";
import TeacherLayout from "../../components/app/TeacherLayout";

const Students = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseRes = await teacherCourseApi.getMyCourses();
        setCourses(courseRes.data);

        let allStudents = [];

        for (const course of courseRes.data) {
          try {
            const studentRes = await teacherCourseApi.getCourseStudents(course._id);

            const formattedStudents = studentRes.data.map((enrollment) => ({
              _id: enrollment._id,
              name: enrollment.student?.name,
              email: enrollment.student?.email,
              courseId: course._id,
              courseName: course.title,
              progress: enrollment.progress || 0,
              isCompleted: enrollment.isCompleted,
            }));

            allStudents = [...allStudents, ...formattedStudents];
          } catch {
            console.log("No students for course:", course.title);
          }
        }

        setStudents(allStudents);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesCourse =
      selectedCourse === "all" || student.courseId === selectedCourse;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.courseName?.toLowerCase().includes(query);

    return matchesCourse && matchesSearch;
  });

  const totalStudents = students.length;
  const completedStudents = students.filter((student) => student.isCompleted).length;
  const activeStudents = students.filter((student) => !student.isCompleted).length;
  const averageProgress =
    students.length > 0
      ? Math.round(
          students.reduce((sum, student) => sum + student.progress, 0) /
            students.length
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7fb] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
      </div>
    );
  }

  return (
    <TeacherLayout title="">
      <div className="space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
              Students
            </span>
            <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
              View your enrolled students
            </h1>
            <p className="max-w-2xl text-base text-[#6b6680]">
              Track student progress across your courses and review learning activity.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Total Students</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {totalStudents}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Completed</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {completedStudents}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">In Progress</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {activeStudents}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Avg Progress</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {averageProgress}%
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-[#4f4864]">
                Filter by course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Search students"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9] md:w-72"
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-[#ece8f7] bg-white shadow-sm overflow-hidden">
          {filteredStudents.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-2xl font-semibold text-[#1f1637]">
                No students found
              </h3>
              <p className="mt-2 text-sm text-[#6b6680]">
                Try another course filter or search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="border-b border-[#ece8f7] bg-[#faf8ff]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f1637]">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f1637]">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f1637]">
                      Progress
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f1637]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="border-b border-[#f2eefb]">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[#1f1637]">
                            {student.name || "Unknown"}
                          </p>
                          <p className="mt-1 text-sm text-[#6b6680]">
                            {student.email || "No email"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4f4864]">
                        {student.courseName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#7a7392]">Progress</span>
                            <span className="font-medium text-[#1f1637]">
                              {student.progress}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[#ece8f7]">
                            <div
                              className="h-2 rounded-full bg-[#6d28d9]"
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            student.isCompleted
                              ? "bg-[#e8fbef] text-[#18794e]"
                              : "bg-[#f4f0ff] text-[#6d28d9]"
                          }`}
                        >
                          {student.isCompleted ? "Completed" : "In Progress"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </TeacherLayout>
  );
};

export default Students;
