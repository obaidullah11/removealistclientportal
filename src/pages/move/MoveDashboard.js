import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Truck, 
  Tag,
  Home,
  Building,
  Edit3,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';
import { useAuth } from '../../contexts/AuthContext';
import { moveAPI } from '../../lib/api';
import { showSuccess, showError } from '../../lib/snackbar';
import UserPlanDebug from '../../components/UserPlanDebug';

const MoveDashboard = () => {
  const { moveId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUserProfile } = useAuth();
  
  const [move, setMove] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [promoCode, setPromoCode] = useState('');

  // Pricing plan configurations
  const pricingPlans = {
    free: { name: 'Free', dateChanges: 0, color: 'gray' },
    plus: { name: 'Plan +', dateChanges: 2, color: 'blue' },
    concierge: { name: 'Concierge +', dateChanges: -1, color: 'purple' } // -1 means unlimited
  };

  // Property type icons
  const propertyIcons = {
    apartment: Building,
    house: Home,
    townhouse: Home,
    office: Building,
    storage: Building,
    other: Building
  };

  // Discount types
  const discountTypes = {
    first_home_buyer: { label: 'First Home Buyer', percentage: 15, color: 'green' },
    seniors: { label: 'Seniors Discount', percentage: 20, color: 'blue' },
    single_parent: { label: 'Single Parent', percentage: 18, color: 'purple' },
    none: { label: 'No Discount', percentage: 0, color: 'gray' }
  };

  useEffect(() => {
    fetchData();
  }, [moveId, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch move data
      const moveResponse = await moveAPI.getMove(moveId);
      
      if (moveResponse.success) {
        setMove(moveResponse.data);
        setNewDate(moveResponse.data.move_date);
      } else {
        showError('Failed to load move data');
        navigate('/user-moves');
        return;
      }
      
      // Use user from context, but refresh if needed
      if (user) {
        setUserProfile(user);
      } else {
        const refreshedUser = await refreshUserProfile();
        if (refreshedUser) {
          setUserProfile(refreshedUser);
        } else {
          showError('Failed to load user profile');
        }
      }
    } catch (error) {
      showError('Error loading data');
      navigate('/user-moves');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysToMove = (moveDate) => {
    const today = new Date();
    const moveDateObj = new Date(moveDate);
    const diffTime = moveDateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const estimateTruckSize = (propertyType, rooms) => {
    // Basic estimation logic
    const baseSize = propertyType === 'apartment' ? 2 : 4;
    const roomMultiplier = rooms || 2;
    return Math.min(baseSize + roomMultiplier, 10); // Cap at 10 tons
  };

  const canChangeDate = () => {
    return userProfile ? userProfile.can_change_date : false;
  };

  const handleDateChange = async () => {
    if (!canChangeDate()) {
      showError('You have reached your date change limit for your current plan');
      return;
    }

    try {
      const response = await moveAPI.updateMove(moveId, { move_date: newDate });
      if (response.success) {
        setMove(prev => ({ ...prev, move_date: newDate }));
        // Refresh user profile to get updated date changes count
        const refreshedUser = await refreshUserProfile();
        if (refreshedUser) {
          setUserProfile(refreshedUser);
        }
        setIsDateModalOpen(false);
        showSuccess('Move date updated successfully');
      } else {
        showError('Failed to update move date');
      }
    } catch (error) {
      showError('Error updating move date');
    }
  };

  const handlePromoCode = async () => {
    // TODO: Implement promo code validation API
    if (promoCode.trim()) {
      showSuccess('Promo code applied successfully!');
      setIsPromoModalOpen(false);
      setPromoCode('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your move...</p>
        </div>
      </div>
    );
  }

  if (!move || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Move not found</p>
          <Button onClick={() => navigate('/user-moves')} className="mt-4">
            Back to Moves
          </Button>
        </div>
      </div>
    );
  }

  const daysToMove = calculateDaysToMove(move.move_date);
  const PropertyIcon = propertyIcons[move.to_property_type] || Home;
  const estimatedTruckSize = estimateTruckSize(move.to_property_type, 3); // Assuming 3 rooms for now
  const discountInfo = discountTypes[move.discount_type] || discountTypes.none;
  const currentPlan = pricingPlans[userProfile.pricing_plan] || pricingPlans.free;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Move</h1>
              <p className="text-gray-600 mt-1">Track and manage your moving journey</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className={`text-${currentPlan.color}-600`}>
                {currentPlan.name}
              </Badge>
              <Button variant="outline" onClick={() => navigate('/user-moves')}>
                All Moves
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <UserPlanDebug />
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Date of Move */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsDateModalOpen(true)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Date of Move</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date(move.move_date).toLocaleDateString()}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600">
                  {daysToMove > 0 ? `${daysToMove} days to go` : daysToMove === 0 ? 'Today!' : 'Past due'}
                </p>
                <Edit3 className="h-4 w-4 text-gray-400" />
              </div>
              {!canChangeDate() && (
                <div className="mt-2 text-xs text-red-600 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  No changes remaining
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Address */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/move/${moveId}/details`)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Address</CardTitle>
              <PropertyIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold truncate">{move.destination_location}</div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className="text-xs">
                  {move.to_property_type.charAt(0).toUpperCase() + move.to_property_type.slice(1)}
                </Badge>
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              {move.new_property_url && (
                <p className="text-xs text-blue-600 mt-1 truncate">Property listing available</p>
              )}
            </CardContent>
          </Card>

          {/* Budget */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${move.estimated_budget || 'TBD'}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600">Estimated cost</p>
                <div className="text-xs text-gray-500">vs $0 spent</div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/timeline`)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysToMove > 0 ? daysToMove : 0}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600">Days to go</p>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-xs text-purple-600 mt-1">View full timeline →</p>
            </CardContent>
          </Card>

          {/* Inventory (Truck) */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/inventory')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory</CardTitle>
              <Truck className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estimatedTruckSize} ton</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600">Estimated truck size</p>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-orange-600 mt-1">Manage inventory →</p>
              <p className="text-xs text-gray-500 mt-1">*Approximate size only</p>
            </CardContent>
          </Card>

          {/* Discount/Promo */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsPromoModalOpen(true)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discounts</CardTitle>
              <Tag className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-pink-600">
                {discountInfo.percentage > 0 ? `${discountInfo.percentage}% OFF` : 'No Discount'}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600">{discountInfo.label}</p>
                <Plus className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-pink-600 mt-1">Add promo code →</p>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Date Change Modal */}
      <Modal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Change Move Date</h3>
          
          {/* Plan Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Plan: {currentPlan.name}</span>
              <Badge variant="outline">
                {userProfile.remaining_date_changes === -1 
                  ? 'Unlimited changes' 
                  : `${userProfile.remaining_date_changes} changes left`
                }
              </Badge>
            </div>
          </div>

          {/* Impact Warning */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Impact of Date Change</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Changing your move date may affect:
                </p>
                <ul className="text-xs text-yellow-700 mt-1 list-disc list-inside">
                  <li>Availability of moving services</li>
                  <li>Pricing and quotes</li>
                  <li>Timeline and task schedules</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Move Date
            </label>
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsDateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDateChange}
              disabled={!canChangeDate() || newDate === move.move_date}
            >
              Update Date
            </Button>
          </div>
        </div>
      </Modal>

      {/* Promo Code Modal */}
      <Modal isOpen={isPromoModalOpen} onClose={() => setIsPromoModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add Promo Code</h3>
          
          {/* Current Discount */}
          {move.discount_type !== 'none' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Current Discount Applied</p>
                  <p className="text-xs text-green-700">{discountInfo.label} - {discountInfo.percentage}% OFF</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promo/Coupon Code
            </label>
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-gray-500 mt-1">
              Promo codes are provided by the Removealist team during marketing campaigns
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsPromoModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePromoCode} disabled={!promoCode.trim()}>
              Apply Code
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MoveDashboard;
