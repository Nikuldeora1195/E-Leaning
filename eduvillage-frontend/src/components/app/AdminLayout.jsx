import Navbar from "../common/Navbar";

const AdminLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-[#f8f7fb] md:flex">
      <Navbar />

      <main className="min-w-0 flex-1 px-4 pb-8 pt-20 sm:px-6 md:px-8 md:pt-8 lg:px-10">
        {title && (
          <h1 className="mb-6 text-3xl font-semibold text-[#1f1637]">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
