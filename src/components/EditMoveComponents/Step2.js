import LocationSection from "../../components/EditMoveComponents/LocationSection";

function Step2({
  formData,
  setFormData,
  step,
  handleDrop,
  handleDragOver,
  handleFileInput,
}) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{step.title}</h2>
        <p className="text-lg text-gray-600">{step.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <LocationSection
          title="Current Location"
          address={formData.fromAddress}
          addressField="fromAddress"
          propertyType={formData.currentPropertyType}
          propertyTypeField="currentPropertyType"
          propertySize={formData.currentPropertySize}
          propertySizeField="currentPropertySize"
          ownershipType={formData.currentOwnershipType}
          ownershipTypeField="currentOwnershipType"
          floorPlan={formData.currentFloorPlan}
          floorPlanField="currentFloorPlan"
          setFormData={setFormData}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleFileInput={handleFileInput}
        />

        <LocationSection
          title="New Location"
          address={formData.toAddress}
          addressField="toAddress"
          propertyType={formData.newPropertyType}
          propertyTypeField="newPropertyType"
          propertySize={formData.newPropertySize}
          propertySizeField="newPropertySize"
          ownershipType={formData.newOwnershipType}
          ownershipTypeField="newOwnershipType"
          floorPlan={formData.newFloorPlan}
          floorPlanField="newFloorPlan"
          setFormData={setFormData}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleFileInput={handleFileInput}
        />
      </div>
    </div>
  );
}

export default Step2;
