import React, { useEffect, useState } from "react";
import { moveAPI } from "../../lib/api";
import { Edit3, Trash2, Calendar, Plus, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { showSuccess, showError } from "../../lib/snackbar";
import { validateMoveDate } from "../../lib/validation";

function UserMoves() {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMove, setCurrentMove] = useState(null);
  const [newMoveDate, setNewMoveDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // Function to fetch moves
  const fetchMoves = async () => {
    setLoading(true);
    const res = await moveAPI.getUserMoves();
    console.log("User Moves API Response:", res);

    if (res.success) {
      setMoves(res.data);
    }
    setLoading(false);
  };

  // Fetch moves on component mount
  useEffect(() => {
    fetchMoves();
  }, []);

  const handleUpdate = (move) => {
    console.log("Opening modal for move:", move);
    setCurrentMove(move);
    // Ensure move date is properly formatted for the date input
    // The date input expects YYYY-MM-DD format
    setNewMoveDate(move.move_date);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this move?")) return;

    const res = await moveAPI.deleteMove(id);
    if (res.success) {
      setMoves((prev) => prev.filter((move) => move.id !== id));
    } else {
      alert(res.message || "Failed to delete move");
    }
  };

  const handleSaveDate = async () => {
    // Validate the date
    const dateError = validateMoveDate(newMoveDate);
    if (dateError) {
      showError(dateError);
      return;
    }

    setIsUpdating(true);

    try {
      console.log("Updating move date for move ID:", currentMove.id, "to:", newMoveDate);
      
      // Only update the move_date field
      const response = await moveAPI.updateMove(currentMove.id, {
        move_date: newMoveDate
      });

      console.log("API response:", response);

      if (response.success) {
        showSuccess("Move date updated successfully");
        setIsEditModalOpen(false);
        
        // Update the local state
        setMoves(moves.map(move => 
          move.id === currentMove.id ? { ...move, move_date: newMoveDate } : move
        ));
        
        // Refresh the list of moves to ensure we have the latest data
        fetchMoves();
      } else {
        showError(response.message || "Failed to update move date");
      }
    } catch (error) {
      console.error("Error updating move date:", error);
      showError("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header row with title/description on left and button on right */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Move Schedule
          </h2>
          <p className="mt-3 text-green-700">
          Your detailed moving itinerary
          </p>
        </div>

        {/* ✅ Button on the right */}
        {/* <button
          onClick={() => navigate("/my-move")}
          className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Create New Move
        </button> */}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading moves...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {moves.length > 0 ? (
            moves.map((move) => (
              <div
                key={move.id}
                className="p-6 rounded-2xl shadow-lg bg-white text-gray-900 hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {move.current_location} → {move.destination_location}
                  </h3>
                  <p className="text-sm flex items-center gap-1 mb-1 text-gray-700">
                    <Calendar className="w-4 h-4" /> {move.move_date}
                  </p>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(move.created_at).toLocaleDateString()}
                  </p>
                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium 
                  ${
                    move.status === "scheduled"
                      ? "bg-blue-100 text-blue-700"
                      : move.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                  >
                    {move.status}
                  </span>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${move.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => navigate(`/move/dashboard/${move.id}`)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    title="View Dashboard"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleUpdate(move)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600 transition"
                    title="Update Move"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(move.id)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-red-600 transition"
                    title="Delete Move"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">
              No moves found.
            </p>
          )}
        </div>
      )}
    </section>

    {/* Edit Move Date Modal */}
    <Modal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      title="Edit Move Date"
      footer={
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsEditModalOpen(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDate}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      {currentMove && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              You can only change the date of your move. Other details are fixed.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="move-date" className="block text-sm font-medium text-gray-700">
              Move Date
            </label>
                          <Input
              id="move-date"
              type="date"
              value={newMoveDate}
              onChange={(e) => setNewMoveDate(e.target.value)}
              className="w-full"
              min={new Date().toISOString().split("T")[0]}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              From
            </label>
            <div className="text-gray-500 text-sm p-2 bg-gray-50 border border-gray-200 rounded">
              {currentMove.current_location}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              To
            </label>
            <div className="text-gray-500 text-sm p-2 bg-gray-50 border border-gray-200 rounded">
              {currentMove.destination_location}
            </div>
          </div>
        </div>
      )}
    </Modal>
    </>
  );
}

export default UserMoves;
