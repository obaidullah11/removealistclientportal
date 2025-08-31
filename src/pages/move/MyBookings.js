import React, { useEffect, useState } from "react";
import { bookingAPI } from "../../lib/api";
import {
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  User,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await bookingAPI.getUserBookings();
        console.log(response);
        if (response.success) {
          setBookings(response.data || []);
        } else {
          setError(response.message || "Failed to load bookings");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const toggleExpand = (id) => {
    if (expandedBooking === id) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(id);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      const response = await bookingAPI.cancelBooking(id);
      if (response.success) {
        // Update the booking status in the UI instead of removing it
        setBookings((prev) => 
          prev.map((booking) => 
            booking.id === id 
              ? { ...booking, status: 'cancelled' } 
              : booking
          )
        );
        console.log("Booking cancelled successfully:", response.data);
      } else {
        console.error("Failed to cancel booking:", response);
        alert(response.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("An unexpected error occurred while cancelling booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            No bookings yet
          </h3>
          <p className="text-gray-600 mt-2 mb-6">
            You don't have any bookings yet.
          </p>
          <Button
            onClick={() => navigate("/my-move")}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Schedule a Move
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            View and manage your scheduled moves
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 bg-gray-100 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Booking Details</div>
            <div className="col-span-2">Date & Time</div>
            <div className="col-span-3">Move Details</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-2 text-center flex items-center justify-between">
              <span>Status</span>
              <span className="ml-6">Action</span>
            </div>
          </div>

          {/* Bookings List */}
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="transition-colors hover:bg-gray-50"
              >
                {/* Booking Row */}
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 cursor-pointer"
                  onClick={() => toggleExpand(booking.id)}
                >
                  {/* Confirmation Number */}
                  <div className="md:col-span-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">
                          #{booking.confirmation_number}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {booking.move &&
                            `${booking.move.first_name} ${booking.move.last_name}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="md:col-span-2">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {booking.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      {booking.time_slot_display}
                    </div>
                  </div>

                  {/* Move Details */}
                  <div className="md:col-span-3">
                    {booking.move && (
                      <>
                        <div className="text-sm text-gray-900">
                          {booking.move.current_location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <ArrowRight className="h-3 w-3 mx-1" />
                          {booking.move.destination_location}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="md:col-span-2">
                    {booking.move && (
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          {booking.move.first_name} {booking.move.last_name}
                        </div>
                        <div className="text-gray-500 text-sm mt-1 truncate">
                          {booking.move.email}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="md:col-span-2 flex items-center justify-between">
                    <div className="flex items-center space-x-7">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'requested' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        booking.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs px-3 py-1.5"
                        disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(booking.id);
                        }}
                      >
                        {booking.status === 'cancelled' ? 'Cancelled' : 'Cancel'}
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(booking.id);
                      }}
                    >
                      {expandedBooking === booking.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedBooking === booking.id && booking.move && (
                  <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Move Details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex">
                            <div className="w-1/2 text-sm text-gray-500">
                              From:
                            </div>
                            <div className="w-1/2 text-sm text-gray-900">
                              {booking.move.current_location}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-1/2 text-sm text-gray-500">
                              To:
                            </div>
                            <div className="w-1/2 text-sm text-gray-900">
                              {booking.move.destination_location}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-1/2 text-sm text-gray-500">
                              Property Type:
                            </div>
                            <div className="w-1/2 text-sm text-gray-900">
                              {booking.move.from_property_type} →{" "}
                              {booking.move.to_property_type}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-1/2 text-sm text-gray-500">
                              Move Date:
                            </div>
                            <div className="w-1/2 text-sm text-gray-900">
                              {booking.move.move_date}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-1/2 text-sm text-gray-500">
                              Special Items:
                            </div>
                            <div className="w-1/2 text-sm text-gray-900">
                              {booking.move.special_items || "None"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Customer Contact */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Customer Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {booking.move.first_name} {booking.move.last_name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {booking.move.email}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {booking.phone_number}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
