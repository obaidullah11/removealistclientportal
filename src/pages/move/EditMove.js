"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { moveAPI } from "../../lib/api";
import StepProgress from "../../components/EditMoveComponents/StepProgress";
import StepNavigation from "../../components/EditMoveComponents/StepNavigation";
import Step1 from "../../components/EditMoveComponents/Step1";
import Step2 from "../../components/EditMoveComponents/Step2";
import Step3 from "../../components/EditMoveComponents/Step3";
import Step4 from "../../components/EditMoveComponents/Step4";

const steps = [
  {
    id: 1,
    title: "When are you moving?",
    subtitle: "Update your move date",
  },
  {
    id: 2,
    title: "Move Details",
    subtitle: "Update addresses, property types, and ownership details",
  },
  {
    id: 3,
    title: "Who's moving with you?",
    subtitle: "Update family members and special considerations",
  },
  {
    id: 4,
    title: "What's your budget?",
    subtitle: "Update your budget preferences",
  },
];

function EditMove() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    moveDate: "",
    fromAddress: "",
    toAddress: "",
    currentPropertyType: "",
    newPropertyType: "",
    currentPropertySize: "",
    newPropertySize: "",
    currentOwnershipType: "",
    newOwnershipType: "",
    currentFloorPlan: null,
    newFloorPlan: null,
    hasChildren: false,
    hasPets: false,
    hasMovers: false,
    budget: "",
  });

  const progress = (currentStep / steps.length) * 100;

  useEffect(() => {
    const fetchMove = async () => {
      setLoading(true);
      const res = await moveAPI.getMove(id);
      if (res.success) {
        const moveData = res.data;
        setFormData({
          moveDate: moveData.move_date || "",
          fromAddress: moveData.current_location || "",
          toAddress: moveData.destination_location || "",
          currentPropertyType: moveData.from_property_type || "",
          newPropertyType: moveData.to_property_type || "",
          currentPropertySize: moveData.from_property_size || "",
          newPropertySize: moveData.to_property_size || "",
          currentOwnershipType: moveData.current_ownership_type || "",
          newOwnershipType: moveData.new_ownership_type || "",
          currentFloorPlan: null,
          newFloorPlan: null,
          hasChildren:
            moveData.special_items?.includes("Moving with children") || false,
          hasPets:
            moveData.special_items?.includes("Moving with pets") || false,
          hasMovers:
            moveData.special_items?.includes("Professional movers needed") ||
            false,
          budget: moveData.estimated_budget?.toString() || "",
        });
      } else {
        alert(res.message || "Failed to load move");
        navigate("/user-moves");
      }
      setLoading(false);
    };
    fetchMove();
  }, [id, navigate]);

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

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const updateData = {
      move_date: formData.moveDate,
      current_location: formData.fromAddress,
      destination_location: formData.toAddress,
      from_property_type: formData.currentPropertyType,
      from_property_size: formData.currentPropertySize,
      to_property_type: formData.newPropertyType,
      to_property_size: formData.newPropertySize,
      current_ownership_type: formData.currentOwnershipType,
      new_ownership_type: formData.newOwnershipType,
      special_items: [
        formData.hasChildren && "Moving with children",
        formData.hasPets && "Moving with pets",
        formData.hasMovers && "Professional movers needed",
      ]
        .filter(Boolean)
        .join(", "),
      estimated_budget: formData.budget
        ? typeof formData.budget === "string" && formData.budget.includes("-")
          ? Number.parseFloat(formData.budget.split("-")[1])
          : Number.parseFloat(formData.budget)
        : null,
    };

    const res = await moveAPI.updateMove(id, updateData);
    setLoading(false);

    if (res.success) {
      alert("Move updated successfully!");
      navigate("/user-moves");
    } else {
      alert(res.message || "Failed to update move");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData}
            setFormData={setFormData}
            step={steps[0]}
          />
        );
      case 2:
        return (
          <Step2
            formData={formData}
            setFormData={setFormData}
            step={steps[1]}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleFileInput={handleFileInput}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            setFormData={setFormData}
            step={steps[2]}
          />
        );
      case 4:
        return (
          <Step4
            formData={formData}
            setFormData={setFormData}
            step={steps[3]}
          />
        );
      default:
        return null;
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <StepProgress
        currentStep={currentStep}
        steps={steps}
        progress={progress}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {renderStep()}

        <StepNavigation
          currentStep={currentStep}
          steps={steps}
          loading={loading}
          prevStep={prevStep}
          nextStep={nextStep}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default EditMove;
