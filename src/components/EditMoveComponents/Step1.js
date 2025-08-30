function Step1({ formData, setFormData, step }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
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
              d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-3">{step.title}</h2>
        <p className="text-gray-600 text-lg">{step.subtitle}</p>
      </div>
      <div className="max-w-md mx-auto">
        <input
          type="date"
          value={formData.moveDate}
          onChange={(e) =>
            setFormData({ ...formData, moveDate: e.target.value })
          }
          className="w-full text-center text-lg h-14 text-gray-700 font-semibold border border-gray-300 rounded-lg p-2"
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
    </div>
  );
}

export default Step1;
