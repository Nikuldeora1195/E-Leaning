import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import usePageTitle from "../../utils/usePageTitle";

const Certificate = () => {
  usePageTitle("Course Certificate | EduVillage");

  const { user } = useContext(AuthContext);
  const { courseTitle } = useParams();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f7fb] px-4 py-10">
      <div className="w-full max-w-4xl rounded-[32px] border border-[#ddd6f3] bg-white p-8 shadow-sm sm:p-12">
        <div className="rounded-[28px] border-2 border-[#6d28d9] px-6 py-10 text-center">
          <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
            Certificate of Completion
          </span>

          <h1 className="mt-6 text-4xl font-semibold text-[#1f1637]">
            EduVillage Certificate
          </h1>

          <p className="mt-8 text-lg text-[#6b6680]">This certifies that</p>

          <h2 className="mt-4 text-3xl font-semibold text-[#1f1637]">
            {user?.name || "Student"}
          </h2>

          <p className="mt-8 text-lg text-[#6b6680]">
            has successfully completed the course
          </p>

          <h3 className="mt-4 text-2xl font-semibold text-[#6d28d9]">
            {decodeURIComponent(courseTitle || "Course")}
          </h3>

          <div className="mt-12 grid gap-6 text-sm text-[#6b6680] sm:grid-cols-2">
            <div className="rounded-2xl bg-[#faf8ff] p-4 text-left">
              <p className="text-xs uppercase tracking-wide text-[#8c84a3]">
                Issued By
              </p>
              <p className="mt-2 font-medium text-[#1f1637]">EduVillage</p>
            </div>
            <div className="rounded-2xl bg-[#faf8ff] p-4 text-left">
              <p className="text-xs uppercase tracking-wide text-[#8c84a3]">
                Date Issued
              </p>
              <p className="mt-2 font-medium text-[#1f1637]">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="mt-10 rounded-full bg-[#6d28d9] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
          >
            Print or Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
