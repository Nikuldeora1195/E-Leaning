import Navbar from "../common/Navbar";

const DashboardLayout = ({ title, children }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#D4DBE9] px-6 py-8">
        <h1 className="text-3xl font-semibold text-[#142C52] mb-6">
          {title}
        </h1>
        {children}
      </div>
    </>
  );
};

export default DashboardLayout;
