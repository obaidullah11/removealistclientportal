import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Upload,
  Home,
  Users,
  Baby,
  Heart,
  DollarSign,
  Sparkles,
  Check,
  Image,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { useAuth } from "../../contexts/AuthContext";
import { moveAPI } from "../../lib/api";
import { showSuccess, showError } from "../../lib/snackbar";
import { validateMoveDate, validateAddress, validatePropertyUrl } from "../../lib/validation";
import PlacesAutocomplete from "../../components/PlacesAutocomplete";



const steps = [
  {
    id: 1,
    title: "When are you moving?",
    subtitle: "Select your ideal move date",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    title: "Move Details",
    subtitle: "Addresses, property types, and ownership details",
    icon: MapPin,
    color: "from-green-500 to-green-600",
  },
  {
    id: 3,
    title: "Who's moving with you?",
    subtitle: "Family members and special considerations",
    icon: Users,
    color: "from-pink-500 to-pink-600",
  },
  {
    id: 4,
    title: "What's your budget?",
    subtitle: "Help us recommend the right services",
    icon: DollarSign,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: 5,
    title: "Select Discounts",
    subtitle: "Choose applicable discounts for your move",
    icon: DollarSign,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 6,
    title: "Invite Collaborators",
    subtitle: "Add family and friends to help with your move",
    icon: Users,
    color: "from-orange-500 to-orange-600",
  },
];

export default function MyMove() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    moveDate: "",
    fromAddress: "",
    toAddress: "",
    currentPropertyType: "",
    newPropertyType: "",
    // currentPropertySize: "",
    // newPropertySize: "",
    currentOwnershipType: "",
    newOwnershipType: "",
    currentFloorPlan: null,
    newFloorPlan: null,
    hasChildren: false,
    hasPets: false,
    hasMovers: false,
    budget: "",
    // New fields
    currentPropertyUrl: "",
    newPropertyUrl: "",
    discountType: "none",
    discountPercentage: 0,
    collaborators: [],
  });



  const progress = (currentStep / steps.length) * 100;
  const currentStepData = steps[currentStep - 1];

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        const dateError = validateMoveDate(formData.moveDate);
        if (dateError) {
          showError(dateError);
          return false;
        }
        return true;
      case 2:
        const fromAddressError = validateAddress(formData.fromAddress);
        if (fromAddressError) {
          showError(`From address: ${fromAddressError}`);
          return false;
        }
        const toAddressError = validateAddress(formData.toAddress);
        if (toAddressError) {
          showError(`To address: ${toAddressError}`);
          return false;
        }
        if (!formData.currentPropertyType) {
          showError("Please select your current property type");
          return false;
        }
        if (!formData.newPropertyType) {
          showError("Please select your new property type");
          return false;
        }
        
        // Validate property URLs if provided
        const currentPropertyUrlError = validatePropertyUrl(formData.currentPropertyUrl);
        if (currentPropertyUrlError) {
          showError(`Current property URL: ${currentPropertyUrlError}`);
          return false;
        }
        
        const newPropertyUrlError = validatePropertyUrl(formData.newPropertyUrl);
        if (newPropertyUrlError) {
          showError(`New property URL: ${newPropertyUrlError}`);
          return false;
        }
        
        // if (!formData.currentPropertySize) {
        //   showError("Please select your current property size");
        //   return false;
        // }
        // if (!formData.newPropertySize) {
        //   showError("Please select your new property size");
        //   return false;
        // }
        return true;
      case 3:
        return true; // Optional step
      case 4:
        return true; // Optional step
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Complete the wizard
      await handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const moveData = {
        move_date: formData.moveDate,
        current_location: formData.fromAddress,
        destination_location: formData.toAddress,
        from_property_type: formData.currentPropertyType,
        // from_property_size: formData.currentPropertySize,
        to_property_type: formData.newPropertyType,
        // to_property_size: formData.newPropertySize,
        current_property_url: formData.currentPropertyUrl,
        new_property_url: formData.newPropertyUrl,
        discount_type: formData.discountType,
        discount_percentage: formData.discountPercentage,
        special_items: [
          formData.hasChildren && "Moving with children",
          formData.hasPets && "Moving with pets",
          formData.hasMovers && "Professional movers needed",
        ]
          .filter(Boolean)
          .join(", "),
        estimated_budget: formData.budget
          ? typeof formData.budget === "string" && formData.budget.includes("-")
            ? parseFloat(formData.budget.split("-")[1])
            : parseFloat(formData.budget)
          : null,
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
      };

      const response = await moveAPI.createMove(moveData);
      console.log(response);
      if (response.success) {
        // Send collaborator invitations if any
        if (formData.collaborators && formData.collaborators.length > 0) {
          for (const collaborator of formData.collaborators) {
            try {
              await moveAPI.inviteCollaborator({
                move_id: response.data.id,
                email: collaborator.email,
                first_name: collaborator.firstName,
                last_name: collaborator.lastName || '',
                role: collaborator.role,
                permissions: collaborator.permissions
              });
            } catch (error) {
              console.error('Error inviting collaborator:', error);
              // Continue with other invitations even if one fails
            }
          }
        }

        showSuccess(
          "🎉 Your move project has been created! Redirecting to your dashboard..."
        );

        // Store move ID in session storage
        if (response.data && response.data.id) {
          sessionStorage.setItem("currentMoveId", response.data.id);
        }

        // Redirect to booking page after a short delay
        setTimeout(() => {
          window.location.href = `/book-time?moveId=${response.data.id}`;
        }, 2000);
      } else {
        showError(
          response.message || "Failed to create move. Please try again."
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating move:", error);
      showError(error.message || "Failed to create move. Please try again.");
      setIsLoading(false);
    }
  };



  const handleFileUpload = (field, file) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleDrop = (field, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(field, file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = (field, file) => {
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const renderStep = () => {
    const stepVariants = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    };

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center">
              <div
                className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
              >
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {currentStepData.subtitle}
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <Input
                type="date"
                value={formData.moveDate}
                onChange={(e) =>
                  setFormData({ ...formData, moveDate: e.target.value })
                }
                className="text-center text-lg h-14 text-gray-700 font-semibold"
                min={new Date().toISOString().split("T")[0]}
              />
             
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            {/* Header with teal moving truck icon */}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-lg text-gray-600">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Two-column layout for addresses and property details */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Current Location Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Current Location
                </h3>

                {/* Address Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Address
                  </label>
                  <PlacesAutocomplete
                    value={formData.fromAddress}
                    onChange={(value) => setFormData({ ...formData, fromAddress: value })}
                    placeholder="Enter your current address"
                    onAddressSelect={(address, place) => {
                      setFormData({ ...formData, fromAddress: address });
                    }}
                  />
                </div>

                {/* Property URL Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Property URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.currentPropertyUrl}
                    onChange={(e) => setFormData({ ...formData, currentPropertyUrl: e.target.value })}
                    placeholder="Paste URL from Domain.com.au or Realestate.com.au"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">
                    Accepted from Domain.com.au and Realestate.com.au only
                  </p>
                </div>

                {/* Property Type for Current Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "apartment", emoji: "🏢", label: "Apartment" },
                      { value: "house", emoji: "🏠", label: "House" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.currentPropertyType === option.value
                            ? "border-teal-500 bg-teal-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            currentPropertyType: option.value,
                          })
                        }
                      >
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Size for Current Location */}
                {/* <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Property Size
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "studio", emoji: "🏠", label: "Studio" },
                      { value: "1bedroom", emoji: "🏡", label: "1 Bedroom" },
                      { value: "2bedroom", emoji: "🏘️", label: "2 Bedrooms" },
                      { value: "3bedroom", emoji: "🏰", label: "3+ Bedrooms" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-3 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.currentPropertySize === option.value
                            ? "border-teal-500 bg-teal-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            currentPropertySize: option.value,
                          })
                        }
                      >
                        <div className="text-xl mb-1">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-xs">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div> */}

                {/* Ownership for Current Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ownership
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "renting", emoji: "🔑", label: "Renting" },
                      { value: "owner", emoji: "🏡", label: "Owner" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.currentOwnershipType === option.value
                            ? "border-teal-500 bg-teal-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            currentOwnershipType: option.value,
                          })
                        }
                      >
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floor Plan Upload for Current Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Floor Plan (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      formData.currentFloorPlan
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDrop={(e) => handleDrop("currentFloorPlan", e)}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      id="current-floor-plan"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(e) =>
                        handleFileInput("currentFloorPlan", e.target.files[0])
                      }
                    />
                    <label
                      htmlFor="current-floor-plan"
                      className="cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formData.currentFloorPlan
                              ? formData.currentFloorPlan.name
                              : "Drop your floor plan here"}
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

              {/* New Location Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">
                  New Location
                </h3>

                {/* Address Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Address
                  </label>
                  <PlacesAutocomplete
                    value={formData.toAddress}
                    onChange={(value) => setFormData({ ...formData, toAddress: value })}
                    placeholder="Enter your new address"
                    onAddressSelect={(address, place) => {
                      setFormData({ ...formData, toAddress: address });
                    }}
                  />
                </div>

                {/* Property URL Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Property URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.newPropertyUrl}
                    onChange={(e) => setFormData({ ...formData, newPropertyUrl: e.target.value })}
                    placeholder="Paste URL from Domain.com.au or Realestate.com.au"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">
                    Accepted from Domain.com.au and Realestate.com.au only
                  </p>
                </div>

                {/* Property Type for New Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "apartment", emoji: "🏢", label: "Apartment" },
                      { value: "house", emoji: "🏠", label: "House" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.newPropertyType === option.value
                            ? "border-teal-500 bg-teal-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            newPropertyType: option.value,
                          })
                        }
                      >
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Size for New Location */}
                {/* <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Property Size
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "studio", emoji: "🏠", label: "Studio" },
                      { value: "1bedroom", emoji: "🏡", label: "1 Bedroom" },
                      { value: "2bedroom", emoji: "🏘️", label: "2 Bedrooms" },
                      { value: "3bedroom", emoji: "🏰", label: "3+ Bedrooms" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-3 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.newPropertySize === option.value
                            ? "border-teal-500 bg-teal-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            newPropertySize: option.value,
                          })
                        }
                      >
                        <div className="text-xl mb-1">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-xs">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div> */}

                {/* Ownership for New Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ownership
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "renting", emoji: "🔑", label: "Renting" },
                      { value: "owner", emoji: "🏡", label: "Owner" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.newOwnershipType === option.value
                            ? "border-teal-500 bg-teal-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            newOwnershipType: option.value,
                          })
                        }
                      >
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floor Plan Upload for New Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Floor Plan (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      formData.newFloorPlan
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDrop={(e) => handleDrop("newFloorPlan", e)}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      id="new-floor-plan"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(e) =>
                        handleFileInput("newFloorPlan", e.target.files[0])
                      }
                    />
                    <label htmlFor="new-floor-plan" className="cursor-pointer">
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formData.newFloorPlan
                              ? formData.newFloorPlan.name
                              : "Drop your floor plan here"}
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
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center">
              <div
                className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
              >
                <Users className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {currentStepData.subtitle}
              </p>
            </div>
            <div className="max-w-lg mx-auto space-y-6">
              <Card className="p-6 border-2 hover:border-primary-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Baby className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Moving with Children
                      </div>
                      <div className="text-sm text-gray-600">
                        Special considerations for kids
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        hasChildren: !formData.hasChildren,
                      })
                    }
                    className={`w-12 h-6 rounded-full border-2 transition-colors ${
                      formData.hasChildren
                        ? "bg-primary-600 border-primary-600"
                        : "bg-gray-200 border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        formData.hasChildren ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </Card>

              <Card className="p-6 border-2 hover:border-primary-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                      <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Moving with Pets
                      </div>
                      <div className="text-sm text-gray-600">
                        Pet-friendly moving services
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setFormData({ ...formData, hasPets: !formData.hasPets })
                    }
                    className={`w-12 h-6 rounded-full border-2 transition-colors ${
                      formData.hasPets
                        ? "bg-primary-600 border-primary-600"
                        : "bg-gray-200 border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        formData.hasPets ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </Card>

              <Card className="p-6 border-2 hover:border-primary-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
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
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Moving with Movers
                      </div>
                      <div className="text-sm text-gray-600">
                        Professional moving services
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        hasMovers: !formData.hasMovers,
                      })
                    }
                    className={`w-12 h-6 rounded-full border-2 transition-colors ${
                      formData.hasMovers
                        ? "bg-primary-600 border-primary-600"
                        : "bg-gray-200 border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        formData.hasMovers ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </Card>

              {/* {(formData.hasChildren ||
                formData.hasPets ||
                formData.hasMovers) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-50 p-4 rounded-xl border border-primary-200"
                >
                  <p className="text-sm text-primary-700 font-medium">
                    Great! We'll include specialized services and tips in your
                    moving plan.
                    {formData.hasMovers &&
                      " 🚚 Professional movers will be prioritized."}
                    {formData.hasChildren &&
                      " 👨‍👩‍👧‍👦 Family-friendly considerations included."}
                    {formData.hasPets && " 🐾 Pet-safe moving services added."}
                  </p>
                </motion.div>
              )} */}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center">
              <div
                className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
              >
                <DollarSign className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {currentStepData.subtitle}
              </p>
            </div>
            <div className="max-w-lg mx-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "$1,000 - $2,500",
                    value: "1000-2500",
                    popular: false,
                  },
                  {
                    label: "$2,500 - $5,000",
                    value: "2500-5000",
                    popular: true,
                  },
                  {
                    label: "$5,000 - $10,000",
                    value: "5000-10000",
                    popular: false,
                  },
                  { label: "$10,000+", value: "10000+", popular: false },
                ].map((budget) => (
                  <button
                    key={budget.value}
                    className={`relative p-6 border-2 rounded-2xl text-center transition-all hover:scale-105 ${
                      formData.budget === budget.value
                        ? "border-primary-500 bg-primary-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, budget: budget.value })
                    }
                  >
                    <div className="font-semibold text-gray-900">
                      {budget.label}
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center text-gray-600">
                <p className="mb-3">Or enter a custom amount:</p>
                <div className="relative max-w-xs mx-auto">
                  <DollarSign className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Enter custom budget"
                    className="pl-12 h-14 text-center text-lg font-semibold"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        value === "" ||
                        (Number(value) >= 0 && Number(value) <= 50000)
                      ) {
                        setFormData({ ...formData, budget: value });
                      }
                    }}
                    value={formData.budget}
                    min="0"
                    max="50000"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="discount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center">
              <div
                className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
              >
                <DollarSign className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {currentStepData.subtitle}
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {[
                {
                  id: 'none',
                  title: 'No Discount',
                  description: 'Standard pricing',
                  discount: '0%',
                  percentage: 0
                },
                {
                  id: 'first_home_buyer',
                  title: 'First Home Buyer',
                  description: 'Special discount for first-time home buyers',
                  discount: '15% OFF',
                  percentage: 15
                },
                {
                  id: 'seniors',
                  title: 'Seniors Discount',
                  description: 'Exclusive savings for seniors (65+)',
                  discount: '20% OFF',
                  percentage: 20
                },
                {
                  id: 'single_parent',
                  title: 'Single Parent',
                  description: 'Supporting single-parent families',
                  discount: '18% OFF',
                  percentage: 18
                }
              ].map((option) => (
                <div
                  key={option.id}
                  onClick={() => setFormData(prev => ({
                    ...prev, 
                    discountType: option.id,
                    discountPercentage: option.percentage
                  }))}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:scale-[1.02] ${
                    formData.discountType === option.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${
                        option.id === 'none' ? 'text-gray-500' : 'text-purple-600'
                      }`}>
                        {option.discount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {formData.discountType !== 'none' && formData.budget && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Discount Applied!</h4>
                  <div className="text-sm text-purple-700">
                    <p>Original Budget: ${formData.budget}</p>
                    <p>Discount ({formData.discountPercentage}%): -${(parseFloat(formData.budget) * formData.discountPercentage / 100).toFixed(2)}</p>
                    <p className="font-semibold">Final Amount: ${(parseFloat(formData.budget) * (1 - formData.discountPercentage / 100)).toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="collaborators"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center">
              <div
                className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
              >
                <Users className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {currentStepData.subtitle}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Collaborator List */}
              <div className="space-y-3 mb-6">
                {formData.collaborators.map((collaborator, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">{collaborator.firstName} {collaborator.lastName}</p>
                      <p className="text-sm text-gray-600">{collaborator.email}</p>
                      <p className="text-xs text-gray-500">{collaborator.role} • {collaborator.permissions}</p>
                    </div>
                    <button
                      onClick={() => {
                        const newCollaborators = formData.collaborators.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, collaborators: newCollaborators }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Collaborator Form */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-4">Invite a Collaborator</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="px-3 py-2 border rounded-md"
                    id="collaborator-email"
                  />
                  <input
                    type="text"
                    placeholder="First name"
                    className="px-3 py-2 border rounded-md"
                    id="collaborator-firstname"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <select
                    className="px-3 py-2 border rounded-md"
                    id="collaborator-role"
                    defaultValue="helper"
                  >
                    <option value="family">Family Member</option>
                    <option value="friend">Friend</option>
                    <option value="helper">Helper</option>
                  </select>
                  
                  <select
                    className="px-3 py-2 border rounded-md"
                    id="collaborator-permissions"
                    defaultValue="view_tasks"
                  >
                    <option value="view_tasks">View Tasks Only</option>
                    <option value="edit_tasks">Edit Tasks</option>
                  </select>
                </div>
                
                <button
                  onClick={() => {
                    const email = document.getElementById('collaborator-email').value;
                    const firstName = document.getElementById('collaborator-firstname').value;
                    const role = document.getElementById('collaborator-role').value;
                    const permissions = document.getElementById('collaborator-permissions').value;
                    
                    if (email && firstName) {
                      const newCollaborator = { email, firstName, lastName: '', role, permissions };
                      setFormData(prev => ({ 
                        ...prev, 
                        collaborators: [...prev.collaborators, newCollaborator] 
                      }));
                      
                      // Clear form
                      document.getElementById('collaborator-email').value = '';
                      document.getElementById('collaborator-firstname').value = '';
                    }
                  }}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  Add Collaborator
                </button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Collaborators will be able to view and help with tasks, but won't see budget information.</p>
                <p>You can skip this step and add collaborators later.</p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Landing Page Style */}

      {/* Progress Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Create Your Move
            </h1>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-2" />
            <div className="absolute top-0 left-0 w-full flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white transition-colors ${
                    index + 1 <= currentStep
                      ? "border-primary-500 text-primary-600"
                      : "border-gray-300 text-gray-400"
                  }`}
                  style={{ transform: "translateY(-50%)" }}
                >
                  {index + 1 < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 max-w-lg mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="h-12 px-6"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back
          </Button>

          <Button
            onClick={nextStep}
            disabled={isLoading}
            className="h-12 px-8 font-semibold bg-sustainableGreen hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating...
              </>
            ) : currentStep === steps.length ? (
              <>
                Create My Move
                <Sparkles className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}