function Step4({ formData, setFormData, step }) {
  const budgetOptions = [
    { label: "$1,000 - $2,500", value: "1000-2500" },
    { label: "$2,500 - $5,000", value: "2500-5000" },
    { label: "$5,000 - $10,000", value: "5000-10000" },
    { label: "$10,000+", value: "10000+" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 01118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-3">{step.title}</h2>
        <p className="text-gray-600 text-lg">{step.subtitle}</p>
      </div>
      <div className="max-w-lg mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {budgetOptions.map((budget) => (
            <button
              key={budget.value}
              className={`p-6 border-2 rounded-2xl text-center transition-all hover:scale-105 ${
                formData.budget === budget.value
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
              onClick={() => setFormData({ ...formData, budget: budget.value })}
            >
              <div className="font-semibold text-gray-900">{budget.label}</div>
            </button>
          ))}
        </div>

        <div className="text-center text-gray-600">
          <p className="mb-3">Or enter a custom amount:</p>
          <div className="relative max-w-xs mx-auto">
            <input
              type="number"
              placeholder="Enter custom budget"
              className="w-full pl-12 h-14 text-center text-lg font-semibold border border-gray-300 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step4;
