function PropertySelector({
  label,
  value,
  options,
  onChange,
  compact = false,
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className={`grid grid-cols-2 gap-3 ${compact ? "" : "p-4"}`}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
              value === option.value
                ? "border-teal-500 bg-teal-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
            onClick={() => onChange(option.value)}
          >
            <div className={`${compact ? "text-xl mb-1" : "text-2xl mb-2"}`}>
              {option.emoji}
            </div>
            <div
              className={`font-semibold text-gray-900 ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              {option.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PropertySelector;
