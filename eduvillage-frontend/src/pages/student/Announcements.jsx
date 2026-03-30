import { useEffect, useMemo, useState } from "react";
import { getAnnouncements } from "../../api/announcementApi";
import usePageTitle from "../../utils/usePageTitle";
import StudentLayout from "../../components/app/StudentLayout";

const Announcements = () => {
  usePageTitle("Announcements | LearnMax");

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAnnouncements()
      .then((res) => {
        setAnnouncements(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const sevenDaysAgo = useMemo(
    () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    []
  );

  const filteredAnnouncements = useMemo(() => {
    if (filter === "recent") {
      return announcements.filter((item) => new Date(item.createdAt) >= sevenDaysAgo);
    }

    if (filter === "older") {
      return announcements.filter((item) => new Date(item.createdAt) < sevenDaysAgo);
    }

    return announcements;
  }, [announcements, filter, sevenDaysAgo]);

  const recentCount = useMemo(
    () =>
      announcements.filter((item) => new Date(item.createdAt) >= sevenDaysAgo)
        .length,
    [announcements, sevenDaysAgo]
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <StudentLayout title="">
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
              Announcements
            </span>
            <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
              Stay updated
            </h1>
            <p className="max-w-2xl text-base text-[#6b6680]">
              Read announcements from instructors and keep track of new course
              updates.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Total</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {announcements.length}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">This Week</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {recentCount}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Latest</p>
            <p className="mt-3 text-lg font-semibold text-[#1f1637]">
              {announcements[0] ? formatDate(announcements[0].createdAt) : "N/A"}
            </p>
          </div>
        </section>

        <section className="flex flex-wrap gap-3">
          {[
            { key: "all", label: `All (${announcements.length})` },
            { key: "recent", label: "Recent" },
            { key: "older", label: "Older" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                filter === item.key
                  ? "bg-[#6d28d9] text-white"
                  : "border border-[#ddd6f3] bg-white text-[#4f4864] hover:bg-[#f7f3ff]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </section>

        {filteredAnnouncements.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-[#ddd6f3] bg-white px-6 py-16 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-[#1f1637]">
              No announcements found
            </h3>
            <p className="mt-2 text-sm text-[#6b6680]">
              Try another filter or check again later.
            </p>
          </section>
        ) : (
          <section className="space-y-5">
            {filteredAnnouncements.map((announcement) => (
              <article
                key={announcement._id}
                className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-[#1f1637]">
                      {announcement.title}
                    </h2>
                    <p className="text-sm text-[#6b6680]">
                      Posted by {announcement.createdBy?.name || "Instructor"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4f0ff] px-3 py-1 text-xs font-semibold text-[#6d28d9]">
                    {formatDate(announcement.createdAt)}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#5e5872]">
                  {announcement.message}
                </p>

                {announcement.course && (
                  <div className="mt-4 inline-flex rounded-full bg-[#faf8ff] px-4 py-2 text-sm font-medium text-[#4f4864]">
                    Course: {announcement.course.title}
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </StudentLayout>
  );
};

export default Announcements;
