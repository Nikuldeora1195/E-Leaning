import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import {
  createLesson,
  createSection,
  deleteLesson,
  deleteSection,
  getCourseContent,
  updateLesson,
  updateSection,
  uploadMedia,
} from "../../api/contentApi";
import { completeLesson, getMyEnrollments, getQuizByCourse } from "../../api/courseApi";
import QuizSection from "../student/QuizSection";

const blankLesson = { title: "", content: "", imageUrl: "", videoUrl: "" };

const getEmbedUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (parsed.pathname.includes("/embed/")) return url;
    }
  } catch {}
  return "";
};

const MediaPreview = ({ item }) => {
  const embedUrl = getEmbedUrl(item.videoUrl);

  return (
    <div className="space-y-4">
      {item.videoUrl && (
        <div className="overflow-hidden rounded-[24px] border border-[#ece8f7] bg-white">
          {embedUrl ? (
            <iframe
              className="h-72 w-full"
              src={embedUrl}
              title="Lesson Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video controls className="h-72 w-full bg-black object-contain">
              <source src={item.videoUrl} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title || "Lesson media"}
          className="max-h-[420px] w-full rounded-[24px] border border-[#ece8f7] object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      )}
    </div>
  );
};

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  const [sections, setSections] = useState([]);
  const [expanded, setExpanded] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [draftLessons, setDraftLessons] = useState({});
  const [editSectionId, setEditSectionId] = useState("");
  const [editSectionTitle, setEditSectionTitle] = useState("");
  const [editLessonId, setEditLessonId] = useState("");
  const [editLesson, setEditLesson] = useState(blankLesson);
  const [busyId, setBusyId] = useState("");

  const totalLessons = sections.reduce((sum, section) => sum + section.lessons.length, 0);

  const syncDrafts = (contentSections) => {
    setDraftLessons((current) => {
      const next = {};
      contentSections.forEach((section) => {
        next[section._id] = current[section._id] || { ...blankLesson };
      });
      return next;
    });
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      const [contentRes, quizRes, enrollRes] = await Promise.all([
        getCourseContent(courseId),
        getQuizByCourse(courseId).catch(() => ({ data: null })),
        isStudent ? getMyEnrollments().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
      ]);

      const courseSections = contentRes.data || [];
      setSections(courseSections);
      setExpanded(new Set(courseSections.map((section) => section._id)));
      syncDrafts(courseSections);
      setQuiz(quizRes.data || null);

      if (isStudent) {
        const currentEnrollment = enrollRes.data.find((item) => item.course?._id === courseId);
        setCompletedLessons(
          (currentEnrollment?.completedLessons || []).map((lessonId) => lessonId.toString())
        );
        setProgress(currentEnrollment?.progress || 0);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Your session expired. Please log in again.");
      } else if (!error.response) {
        toast.error("Backend is not reachable. Make sure the local server is running.");
      } else {
        toast.error(error.response?.data?.message || "Failed to load course content");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [courseId, isStudent]);

  const toggleSection = (id) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const setDraftField = (sectionId, field, value) => {
    setDraftLessons((prev) => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || blankLesson), [field]: value },
    }));
  };

  const uploadDraftFile = async (sectionId, field, file) => {
    if (!file) return;

    const toastId = toast.loading(
      field === "imageUrl" ? "Uploading image..." : "Uploading video..."
    );

    try {
      const res = await uploadMedia(file);
      setDraftField(sectionId, field, res.data.url);
      toast.success(field === "imageUrl" ? "Image uploaded" : "Video uploaded", {
        id: toastId,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload file", {
        id: toastId,
      });
    }
  };

  const uploadEditFile = async (field, file) => {
    if (!file) return;

    const toastId = toast.loading(
      field === "imageUrl" ? "Uploading image..." : "Uploading video..."
    );

    try {
      const res = await uploadMedia(file);
      setEditLesson((prev) => ({ ...prev, [field]: res.data.url }));
      toast.success(field === "imageUrl" ? "Image uploaded" : "Video uploaded", {
        id: toastId,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload file", {
        id: toastId,
      });
    }
  };

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return toast.error("Please enter a section title");
    const toastId = toast.loading("Adding section...");
    setBusyId("add-section");
    try {
      await createSection({ title: newSectionTitle.trim(), courseId });
      setNewSectionTitle("");
      toast.success("Section added", { id: toastId });
      await loadContent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add section", { id: toastId });
    } finally {
      setBusyId("");
    }
  };

  const handleUpdateSection = async (sectionId) => {
    if (!editSectionTitle.trim()) return toast.error("Section title cannot be empty");
    const toastId = toast.loading("Saving section...");
    setBusyId(sectionId);
    try {
      await updateSection(sectionId, { title: editSectionTitle.trim() });
      setEditSectionId("");
      setEditSectionTitle("");
      toast.success("Section updated", { id: toastId });
      await loadContent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update section", { id: toastId });
    } finally {
      setBusyId("");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Delete this section and all of its lessons?")) return;
    const toastId = toast.loading("Deleting section...");
    setBusyId(sectionId);
    try {
      await deleteSection(sectionId);
      toast.success("Section deleted", { id: toastId });
      await loadContent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete section", { id: toastId });
    } finally {
      setBusyId("");
    }
  };

  const handleAddLesson = async (sectionId) => {
    const lesson = draftLessons[sectionId] || blankLesson;
    if (!lesson.title.trim() || !lesson.content.trim()) {
      return toast.error("Please fill lesson title and content");
    }
    const toastId = toast.loading("Adding lesson...");
    setBusyId(sectionId);
    try {
      await createLesson({
        title: lesson.title.trim(),
        content: lesson.content.trim(),
        imageUrl: lesson.imageUrl,
        videoUrl: lesson.videoUrl,
        sectionId,
      });
      setDraftLessons((prev) => ({ ...prev, [sectionId]: { ...blankLesson } }));
      toast.success("Lesson added", { id: toastId });
      await loadContent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lesson", { id: toastId });
    } finally {
      setBusyId("");
    }
  };

  const startEditLesson = (lesson) => {
    setEditLessonId(lesson._id);
    setEditLesson({
      title: lesson.title || "",
      content: lesson.content || "",
      imageUrl: lesson.imageUrl || "",
      videoUrl: lesson.videoUrl || "",
    });
  };

  const handleUpdateLesson = async () => {
    if (!editLesson.title.trim() || !editLesson.content.trim()) {
      return toast.error("Lesson title and content are required");
    }
    const toastId = toast.loading("Saving lesson...");
    setBusyId(editLessonId);
    try {
      await updateLesson(editLessonId, {
        title: editLesson.title.trim(),
        content: editLesson.content.trim(),
        imageUrl: editLesson.imageUrl,
        videoUrl: editLesson.videoUrl,
      });
      setEditLessonId("");
      setEditLesson(blankLesson);
      toast.success("Lesson updated", { id: toastId });
      await loadContent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update lesson", { id: toastId });
    } finally {
      setBusyId("");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    const toastId = toast.loading("Deleting lesson...");
    setBusyId(lessonId);
    try {
      await deleteLesson(lessonId);
      if (editLessonId === lessonId) {
        setEditLessonId("");
        setEditLesson(blankLesson);
      }
      toast.success("Lesson deleted", { id: toastId });
      await loadContent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lesson", { id: toastId });
    } finally {
      setBusyId("");
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    const toastId = toast.loading("Marking lesson complete...");
    try {
      const res = await completeLesson(lessonId);
      setCompletedLessons((res.data.completedLessons || []).map((item) => item.toString()));
      setProgress(res.data.progress || 0);
      toast.success("Lesson completed", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark lesson as complete", {
        id: toastId,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7fb]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] border border-[#ece8f7] bg-[linear-gradient(135deg,#f7f3ff_0%,#ffffff_55%,#f4f0ff_100%)] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#6d28d9]">
                {isTeacher ? "Course Builder" : "Learning Workspace"}
              </span>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-[#1f1637] sm:text-4xl">
                {isTeacher
                  ? "Manage sections, lessons, and media in one place"
                  : "Learn with clean lesson notes, images, and video support"}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#665f7b]">
                {isTeacher
                  ? "Edit, delete, and organize course content without leaving this page."
                  : "Move section by section, mark lessons complete, and come back anytime."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full border border-[#d9cff6] bg-white px-5 py-3 text-sm font-semibold text-[#6d28d9] transition hover:bg-[#f7f3ff]"
              >
                Back
              </button>
              {quiz && isStudent && (
                <button
                  onClick={() => navigate(`/courses/${courseId}/quiz`)}
                  className="rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                >
                  Take Quiz
                </button>
              )}
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-white/90 p-5">
              <p className="text-sm text-[#7a7392]">Sections</p>
              <p className="mt-2 text-3xl font-semibold text-[#1f1637]">{sections.length}</p>
            </div>
            <div className="rounded-[24px] bg-white/90 p-5">
              <p className="text-sm text-[#7a7392]">Lessons</p>
              <p className="mt-2 text-3xl font-semibold text-[#1f1637]">{totalLessons}</p>
            </div>
            <div className="rounded-[24px] bg-white/90 p-5">
              <p className="text-sm text-[#7a7392]">{isStudent ? "Progress" : "Status"}</p>
              <p className="mt-2 text-3xl font-semibold text-[#1f1637]">
                {isStudent ? `${progress}%` : "Ready"}
              </p>
            </div>
          </div>
        </section>

        {isStudent && totalLessons > 0 && (
          <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-[#6b6680]">
                {completedLessons.length} of {totalLessons} lessons completed
              </span>
              <span className="font-semibold text-[#1f1637]">{progress}% complete</span>
            </div>
            <div className="mt-4 h-3 rounded-full bg-[#ece8f7]">
              <div className="h-3 rounded-full bg-[#6d28d9]" style={{ width: `${progress}%` }}></div>
            </div>
          </section>
        )}

        {isTeacher && (
          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
            <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#1f1637]">Add Section</h2>
              <p className="mt-2 text-sm leading-6 text-[#6b6680]">
                Create simple, clear sections before adding detailed lessons.
              </p>
              <div className="mt-5 space-y-4">
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Example: Introduction"
                  className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                />
                <button
                  onClick={handleAddSection}
                  disabled={busyId === "add-section"}
                  className="w-full rounded-full bg-[#6d28d9] py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:opacity-70"
                >
                  {busyId === "add-section" ? "Adding..." : "Add Section"}
                </button>
              </div>
            </div>
            <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#1f1637]">Content Style</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[22px] bg-[#faf8ff] p-4 text-sm leading-6 text-[#6b6680]">
                  <p className="font-semibold text-[#1f1637]">Readable notes</p>
                  Keep lessons short and natural.
                </div>
                <div className="rounded-[22px] bg-[#faf8ff] p-4 text-sm leading-6 text-[#6b6680]">
                  <p className="font-semibold text-[#1f1637]">Useful visuals</p>
                  Add images or videos when they help learning.
                </div>
                <div className="rounded-[22px] bg-[#faf8ff] p-4 text-sm leading-6 text-[#6b6680]">
                  <p className="font-semibold text-[#1f1637]">Quick edits</p>
                  Manage everything from this page.
                </div>
              </div>
            </div>
          </section>
        )}

        {sections.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-[#ddd6f3] bg-white px-6 py-20 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1f1637]">No content yet</h2>
            <p className="mt-2 text-sm text-[#6b6680]">
              {isTeacher ? "Add a section and start building lessons." : "This course has no content yet."}
            </p>
          </section>
        ) : (
          <section className="space-y-6">
            {sections.map((section, sectionIndex) => {
              const isOpen = expanded.has(section._id);
              const sectionProgress =
                section.lessons.length > 0
                  ? Math.round(
                      (section.lessons.filter((lesson) => completedLessons.includes(lesson._id)).length /
                        section.lessons.length) *
                        100
                    )
                  : 0;
              const draft = draftLessons[section._id] || blankLesson;

              return (
                <article
                  key={section._id}
                  className="overflow-hidden rounded-[30px] border border-[#ece8f7] bg-white shadow-sm"
                >
                  <div className="border-b border-[#f1edfb] bg-[#fcfbff] px-6 py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <button
                        type="button"
                        onClick={() => toggleSection(section._id)}
                        className="flex min-w-0 flex-1 items-center gap-4 text-left"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#6d28d9] text-white">
                          {sectionIndex + 1}
                        </div>
                        <div className="min-w-0">
                          <h2 className="truncate text-xl font-semibold text-[#1f1637]">{section.title}</h2>
                          <p className="mt-1 text-sm text-[#6b6680]">
                            {section.lessons.length} lessons
                            {isStudent && section.lessons.length > 0 && <> . {sectionProgress}% done</>}
                          </p>
                        </div>
                      </button>
                      <div className="flex flex-wrap items-center gap-3">
                        {isTeacher && (
                          <>
                            <button
                              onClick={() => {
                                setEditSectionId(section._id);
                                setEditSectionTitle(section.title);
                              }}
                              className="rounded-full border border-[#ddd6f3] px-4 py-2 text-sm font-semibold text-[#4f4864] transition hover:bg-white"
                            >
                              Edit Section
                            </button>
                            <button
                              onClick={() => handleDeleteSection(section._id)}
                              disabled={busyId === section._id}
                              className="rounded-full border border-[#f2c5c5] px-4 py-2 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff5f5] disabled:opacity-70"
                            >
                              Delete Section
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => toggleSection(section._id)}
                          className="rounded-full border border-[#ddd6f3] px-4 py-2 text-sm font-semibold text-[#6d28d9] transition hover:bg-white"
                        >
                          {isOpen ? "Hide" : "Open"}
                        </button>
                      </div>
                    </div>
                    {editSectionId === section._id && isTeacher && (
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <input
                          type="text"
                          value={editSectionTitle}
                          onChange={(e) => setEditSectionTitle(e.target.value)}
                          className="flex-1 rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                        />
                        <button
                          onClick={() => handleUpdateSection(section._id)}
                          className="rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditSectionId("");
                            setEditSectionTitle("");
                          }}
                          className="rounded-full border border-[#ddd6f3] px-5 py-3 text-sm font-semibold text-[#4f4864] transition hover:bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {isOpen && (
                    <div className="space-y-6 p-6">
                      {section.lessons.map((lesson) => {
                        const done = completedLessons.includes(lesson._id);
                        const editing = editLessonId === lesson._id;

                        return (
                          <div key={lesson._id} className="rounded-[28px] border border-[#ece8f7] bg-[#fcfbff]">
                            <div className="flex flex-col gap-4 border-b border-[#ece8f7] bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <h3 className="text-xl font-semibold text-[#1f1637]">{lesson.title}</h3>
                                  {isStudent && (
                                    <span
                                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        done ? "bg-[#e8fbef] text-[#18794e]" : "bg-[#f4f0ff] text-[#6d28d9]"
                                      }`}
                                    >
                                      {done ? "Completed" : "Pending"}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {isTeacher && (
                                  <>
                                    <button
                                      onClick={() => startEditLesson(lesson)}
                                      className="rounded-full border border-[#ddd6f3] px-4 py-2 text-sm font-semibold text-[#4f4864] transition hover:bg-white"
                                    >
                                      Edit Lesson
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLesson(lesson._id)}
                                      disabled={busyId === lesson._id}
                                      className="rounded-full border border-[#f2c5c5] px-4 py-2 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff5f5] disabled:opacity-70"
                                    >
                                      Delete Lesson
                                    </button>
                                  </>
                                )}
                                {isStudent && (
                                  <button
                                    onClick={() => handleCompleteLesson(lesson._id)}
                                    disabled={done}
                                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                                      done ? "cursor-default bg-[#e8fbef] text-[#18794e]" : "bg-[#6d28d9] text-white hover:bg-[#5b21b6]"
                                    }`}
                                  >
                                    {done ? "Completed" : "Mark Complete"}
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="space-y-5 p-5 sm:p-6">
                              {editing ? (
                                <>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <input
                                      type="text"
                                      value={editLesson.title}
                                      onChange={(e) => setEditLesson((prev) => ({ ...prev, title: e.target.value }))}
                                      placeholder="Lesson title"
                                      className="rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                                    />
                                    <input
                                      type="text"
                                      value={editLesson.videoUrl}
                                      onChange={(e) => setEditLesson((prev) => ({ ...prev, videoUrl: e.target.value }))}
                                      placeholder="YouTube or direct video URL"
                                      className="rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                                    />
                                  </div>
                                  <textarea
                                    rows={8}
                                    value={editLesson.content}
                                    onChange={(e) => setEditLesson((prev) => ({ ...prev, content: e.target.value }))}
                                    className="w-full resize-none rounded-3xl border border-[#ddd6f3] px-5 py-4 font-serif text-[16px] leading-8 text-[#433b5d] outline-none transition focus:border-[#6d28d9]"
                                  />
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <input
                                      type="text"
                                      value={editLesson.imageUrl}
                                      onChange={(e) => setEditLesson((prev) => ({ ...prev, imageUrl: e.target.value }))}
                                      placeholder="Direct image URL"
                                      className="rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                                    />
                                    <div className="grid gap-3 sm:grid-cols-2">
                                      <label className="cursor-pointer rounded-2xl border border-dashed border-[#d7caf8] bg-white px-4 py-3 text-center text-sm font-medium text-[#6d28d9] transition hover:bg-[#f7f3ff]">
                                        Upload Image
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadEditFile("imageUrl", e.target.files?.[0])} />
                                      </label>
                                      <label className="cursor-pointer rounded-2xl border border-dashed border-[#d7caf8] bg-white px-4 py-3 text-center text-sm font-medium text-[#6d28d9] transition hover:bg-[#f7f3ff]">
                                        Upload Video
                                        <input type="file" accept="video/*" className="hidden" onChange={(e) => uploadEditFile("videoUrl", e.target.files?.[0])} />
                                      </label>
                                    </div>
                                  </div>
                                  {(editLesson.imageUrl || editLesson.videoUrl) && <MediaPreview item={editLesson} />}
                                  <div className="flex flex-wrap gap-3">
                                    <button
                                      onClick={handleUpdateLesson}
                                      disabled={busyId === editLessonId}
                                      className="rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:opacity-70"
                                    >
                                      Save Lesson
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditLessonId("");
                                        setEditLesson(blankLesson);
                                      }}
                                      className="rounded-full border border-[#ddd6f3] px-5 py-3 text-sm font-semibold text-[#4f4864] transition hover:bg-white"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="rounded-[24px] bg-white p-5">
                                    <p className="font-serif text-[17px] leading-8 text-[#433b5d]">{lesson.content}</p>
                                  </div>
                                  <MediaPreview item={lesson} />
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {section.lessons.length === 0 && (
                        <div className="rounded-[24px] bg-[#fcfbff] px-5 py-8 text-center text-sm text-[#6b6680]">
                          No lessons in this section yet.
                        </div>
                      )}

                      {isTeacher && (
                        <div className="rounded-[28px] border border-dashed border-[#d7caf8] bg-[#faf8ff] p-6">
                          <h3 className="text-xl font-semibold text-[#1f1637]">Add Lesson</h3>
                          <div className="mt-5 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <input
                                type="text"
                                value={draft.title}
                                onChange={(e) => setDraftField(section._id, "title", e.target.value)}
                                placeholder="Lesson title"
                                className="rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                              />
                              <input
                                type="text"
                                value={draft.videoUrl}
                                onChange={(e) => setDraftField(section._id, "videoUrl", e.target.value)}
                                placeholder="YouTube or direct video URL"
                                className="rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                              />
                            </div>
                            <textarea
                              rows={7}
                              value={draft.content}
                              onChange={(e) => setDraftField(section._id, "content", e.target.value)}
                              placeholder="Write simple lesson notes"
                              className="w-full resize-none rounded-3xl border border-[#ddd6f3] px-5 py-4 font-serif text-[16px] leading-8 text-[#433b5d] outline-none transition focus:border-[#6d28d9]"
                            />
                            <div className="grid gap-4 md:grid-cols-2">
                              <input
                                type="text"
                                value={draft.imageUrl}
                                onChange={(e) => setDraftField(section._id, "imageUrl", e.target.value)}
                                placeholder="Direct image URL"
                                className="rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                              />
                              <div className="grid gap-3 sm:grid-cols-2">
                                <label className="cursor-pointer rounded-2xl border border-dashed border-[#d7caf8] bg-white px-4 py-3 text-center text-sm font-medium text-[#6d28d9] transition hover:bg-[#f7f3ff]">
                                  Upload Image
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadDraftFile(section._id, "imageUrl", e.target.files?.[0])} />
                                </label>
                                <label className="cursor-pointer rounded-2xl border border-dashed border-[#d7caf8] bg-white px-4 py-3 text-center text-sm font-medium text-[#6d28d9] transition hover:bg-[#f7f3ff]">
                                  Upload Video
                                  <input type="file" accept="video/*" className="hidden" onChange={(e) => uploadDraftFile(section._id, "videoUrl", e.target.files?.[0])} />
                                </label>
                              </div>
                            </div>
                            {(draft.imageUrl || draft.videoUrl) && <MediaPreview item={draft} />}
                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => handleAddLesson(section._id)}
                                disabled={busyId === section._id}
                                className="rounded-full bg-[#6d28d9] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:opacity-70"
                              >
                                {busyId === section._id ? "Saving..." : "Add Lesson"}
                              </button>
                              <button
                                onClick={() => setDraftLessons((prev) => ({ ...prev, [section._id]: { ...blankLesson } }))}
                                className="rounded-full border border-[#ddd6f3] px-6 py-3 text-sm font-semibold text-[#4f4864] transition hover:bg-white"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}

        {quiz && isTeacher && (
          <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1f1637]">Quiz Preview</h2>
            <div className="mt-6">
              <QuizSection quiz={quiz} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CourseContent;
