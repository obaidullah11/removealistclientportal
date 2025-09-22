import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserPlanDebug = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-4 bg-red-100 text-red-800">No user data available</div>;
  }

  return (
    <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
      <h3 className="font-bold mb-2">User Plan Debug Info:</h3>
      <div className="text-sm space-y-1">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Pricing Plan:</strong> {user.pricing_plan || 'Not set'}</p>
        <p><strong>Date Changes Used:</strong> {user.date_changes_used || 0}</p>
        <p><strong>Can Change Date:</strong> {user.can_change_date ? 'Yes' : 'No'}</p>
        <p><strong>Remaining Changes:</strong> {user.remaining_date_changes === -1 ? 'Unlimited' : user.remaining_date_changes || 0}</p>
      </div>
    </div>
  );
};

export default UserPlanDebug;





