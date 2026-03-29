const StatCard = ({ title, value, icon, color = "blue", trend }) => {
  const colorClasses = {
    blue: "from-[#CCE7EC] to-[#4C97A8]",
    green: "from-[#22C55E]/20 to-[#178740]/20",
    purple: "from-[#1B9AAA]/20 to-[#16808D]/20",
    orange: "from-[#4C97A8]/20 to-[#02394A]/20",
  };

  const borderColors = {
    blue: "border-[#1B9AAA]",
    green: "border-[#22C55E]",
    purple: "border-[#16808D]",
    orange: "border-[#4C97A8]",
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 border border-[#CCE7EC] hover:${borderColors[color]} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-linear-to-br ${colorClasses[color]} p-3 rounded-full`}>
          <span className="text-3xl">{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${trend > 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
            {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-[#071426] opacity-70 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-[#142C52]">{value}</p>
    </div>
  );
};

export default StatCard;