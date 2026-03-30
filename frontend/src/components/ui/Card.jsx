const Card = ({ title, children }) => {
  return (
    <div className="bg-surface rounded-xl shadow-sm p-6 mb-6">
      {title && (
        <h3 className="text-lg font-semibold text-navy mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
