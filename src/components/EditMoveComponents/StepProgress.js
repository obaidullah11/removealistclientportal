function StepProgress({ currentStep, steps, progress }) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Edit Your Move</h1>
          <div className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </div>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="absolute top-0 left-0 w-full flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white transition-colors ${
                  index + 1 <= currentStep
                    ? "border-blue-500 text-blue-600"
                    : "border-gray-300 text-gray-400"
                }`}
                style={{ transform: "translateY(-50%)" }}
              >
                {index + 1 < currentStep ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepProgress;
