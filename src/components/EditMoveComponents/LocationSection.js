import PropertySelector from "../../components/EditMoveComponents/PropertySelector";

function LocationSection({
  title,
  address,
  addressField,
  propertyType,
  propertyTypeField,
  propertySize,
  propertySizeField,
  ownershipType,
  ownershipTypeField,
  floorPlan,
  floorPlanField,
  setFormData,
  handleDrop,
  handleDragOver,
  handleFileInput,
}) {
  const propertyTypeOptions = [
    { value: "apartment", emoji: "🏢", label: "Apartment" },
    { value: "house", emoji: "🏠", label: "House" },
  ];

  const propertySizeOptions = [
    { value: "studio", emoji: "🏠", label: "Studio" },
    { value: "1bedroom", emoji: "🏡", label: "1 Bedroom" },
    { value: "2bedroom", emoji: "🏘️", label: "2 Bedrooms" },
    { value: "3bedroom", emoji: "🏰", label: "3+ Bedrooms" },
  ];

  const ownershipOptions = [
    { value: "renting", emoji: "🔑", label: "Renting" },
    { value: "owner", emoji: "🏡", label: "Owner" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700">
          Address
        </label>
        <div className="relative">
          <input
            placeholder={`Enter your ${title.toLowerCase()} address`}
            className="w-full pl-11 h-12 text-base border border-gray-300 rounded-lg p-2"
            value={address}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [addressField]: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <PropertySelector
        label="Property Type"
        value={propertyType}
        options={propertyTypeOptions}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, [propertyTypeField]: value }))
        }
      />

      <PropertySelector
        label="Property Size"
        value={propertySize}
        options={propertySizeOptions}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, [propertySizeField]: value }))
        }
        compact
      />

      <PropertySelector
        label="Ownership"
        value={ownershipType}
        options={ownershipOptions}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, [ownershipTypeField]: value }))
        }
      />

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Floor Plan (Optional)
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            floorPlan
              ? "border-teal-500 bg-teal-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={(e) => handleDrop(floorPlanField, e)}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            id={`${floorPlanField}-floor-plan`}
            className="hidden"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={(e) => handleFileInput(floorPlanField, e.target.files[0])}
          />
          <label
            htmlFor={`${floorPlanField}-floor-plan`}
            className="cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex justify-center">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {floorPlan ? floorPlan.name : "Drop your floor plan here"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default LocationSection;
