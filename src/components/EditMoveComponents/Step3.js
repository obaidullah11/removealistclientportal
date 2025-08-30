import ToggleOption from "../../components/EditMoveComponents/ToggleOption";

function Step3({ formData, setFormData, step }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-3">{step.title}</h2>
        <p className="text-gray-600 text-lg">{step.subtitle}</p>
      </div>
      <div className="max-w-lg mx-auto space-y-6">
        <ToggleOption
          icon={
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Moving with Children"
          subtitle="Special considerations for kids"
          value={formData.hasChildren}
          onChange={() =>
            setFormData({
              ...formData,
              hasChildren: !formData.hasChildren,
            })
          }
          bgColor="blue"
        />

        <ToggleOption
          icon={
            <svg
              className="h-6 w-6 text-pink-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          }
          title="Moving with Pets"
          subtitle="Pet-friendly moving services"
          value={formData.hasPets}
          onChange={() =>
            setFormData({ ...formData, hasPets: !formData.hasPets })
          }
          bgColor="pink"
        />

        <ToggleOption
          icon={
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h11v10H3V7zM14 10h4l3 3v4h-7v-7zM5 21a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
          }
          title="Moving with Movers"
          subtitle="Professional moving services"
          value={formData.hasMovers}
          onChange={() =>
            setFormData({
              ...formData,
              hasMovers: !formData.hasMovers,
            })
          }
          bgColor="green"
        />
      </div>
    </div>
  );
}

export default Step3;
