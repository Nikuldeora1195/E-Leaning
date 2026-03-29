const StatCard = ({ title, value, icon, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${textColor} opacity-80 text-sm font-medium mb-2`}>
            {title}
          </p>
          <p className={`${textColor} text-4xl font-bold`}>
            {value}
          </p>
        </div>
        <div className="text-5xl opacity-90">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;