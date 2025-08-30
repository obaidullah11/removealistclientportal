function ToggleOption({
  icon,
  title,
  subtitle,
  value,
  onChange,
  bgColor = "blue",
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    pink: "bg-pink-100 text-pink-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="p-6 border-2 rounded-xl hover:border-blue-200 transition-colors bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 ${colorClasses[bgColor]} rounded-2xl flex items-center justify-center`}
          >
            {icon}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{title}</div>
            <div className="text-sm text-gray-600">{subtitle}</div>
          </div>
        </div>
        <button
          onClick={onChange}
          className={`w-12 h-6 rounded-full border-2 transition-colors ${
            value
              ? "bg-blue-600 border-blue-600"
              : "bg-gray-200 border-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
              value ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default ToggleOption;
