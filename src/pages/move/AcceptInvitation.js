import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Users, Calendar, MapPin } from 'lucide-react';
import { moveAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [moveData, setMoveData] = useState(null);
  const [collaboratorData, setCollaboratorData] = useState(null);

  const invitationToken = searchParams.get('token');

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    if (!invitationToken) {
      setStatus('error');
      setMessage('Invalid invitation link. No token provided.');
      return;
    }

    acceptInvitation();
  }, [isAuthenticated, invitationToken]);

  const acceptInvitation = async () => {
    try {
      setStatus('loading');
      const response = await moveAPI.acceptInvitation(invitationToken);
      
      if (response.success) {
        setStatus('success');
        setMessage('Invitation accepted successfully! You now have access to this move.');
        setMoveData(response.data.move);
        setCollaboratorData(response.data.collaborator);
      } else {
        setStatus('error');
        setMessage(response.message || 'Failed to accept invitation.');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to accept invitation. The invitation may be invalid or expired.');
    }
  };

  const handleViewMove = () => {
    if (moveData) {
      navigate(`/move/dashboard/${moveData.id}`);
    }
  };

  const handleGoHome = () => {
    navigate('/user-moves');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Invitation</h2>
          <p className="text-gray-600">Please wait while we process your invitation...</p>
        </motion.div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Error</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={handleGoHome}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Go to My Moves
          </button>
        </motion.div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full"
        >
          <div className="text-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Move!</h2>
            <p className="text-gray-600">{message}</p>
          </div>

          {moveData && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Move Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Move Date: {new Date(moveData.move_date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-start text-gray-700">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">From: {moveData.current_location}</div>
                    <div className="font-medium">To: {moveData.destination_location}</div>
                  </div>
                </div>

                {collaboratorData && (
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Your Role: {collaboratorData.role.charAt(0).toUpperCase() + collaboratorData.role.slice(1)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleViewMove}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Move Dashboard
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              My Moves
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}


