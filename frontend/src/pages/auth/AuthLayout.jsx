const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-bgMain flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy">{title}</h1>
          <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
        </div>

        <div className="bg-surface rounded-2xl shadow-xl p-8">
          {children}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by <span className="text-navy font-medium">Civora Nexus</span>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;