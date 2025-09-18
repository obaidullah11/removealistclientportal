import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Sparkles, 
  Package, 
  Package2, 
  Trash2, 
  Scissors, 
  Bug, 
  Container, 
  Wrench, 
  Zap,
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  Users,
  Shield,
  Award,
  CheckCircle,
  Plus,
  Car,
  Home,
  Building
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Modal } from '../../components/ui/modal';
import { useAuth } from '../../contexts/AuthContext';
import { serviceAPI, moveAPI } from '../../lib/api';
import { showSuccess, showError } from '../../lib/snackbar';

const ServiceBooking = () => {
  const { user } = useAuth();
  const [currentMove, setCurrentMove] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPropertyAccessModalOpen, setIsPropertyAccessModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    serviceId: '',
    providerId: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    propertyAccess: {}
  });

  // Property access form for movers
  const [propertyAccessForm, setPropertyAccessForm] = useState({
    // Pickup Location
    pickupPropertyType: '',
    pickupFloorLevel: '',
    pickupLiftAccess: false,
    pickupLiftSize: '',
    pickupStairs: '',
    pickupCorridorRestrictions: '',
    pickupDistanceToTruck: '',
    pickupParkingType: '',
    pickupParkingRestrictions: '',
    pickupHeightClearance: '',
    
    // Drop-off Location
    dropoffPropertyType: '',
    dropoffFloorLevel: '',
    dropoffLiftAccess: false,
    dropoffLiftBookingRequired: false,
    dropoffStairs: '',
    dropoffCorridorRestrictions: '',
    dropoffDistanceToTruck: '',
    dropoffParkingType: '',
    dropoffParkingRestrictions: '',
    dropoffHeightClearance: '',
    
    // Other Considerations
    buildingRules: '',
    accessKeys: '',
    obstacles: ''
  });

  // Service categories from documentation
  const serviceCategories = [
    {
      id: 'movers',
      name: 'Removalists (Movers)',
      icon: Truck,
      color: 'blue',
      description: 'Professional moving services',
      services: ['Full service moving', 'Loading/Unloading only', 'Packing service', 'Furniture assembly/disassembly']
    },
    {
      id: 'hire_van',
      name: 'Hire a Van/Truck',
      icon: Car,
      color: 'green',
      description: 'Self-moving vehicle rental',
      services: ['Van rental', 'Truck rental', 'Moving equipment rental']
    },
    {
      id: 'cleaning',
      name: 'Cleaners',
      icon: Sparkles,
      color: 'purple',
      description: 'Professional cleaning services',
      services: ['End-of-lease cleaning', 'Carpet cleaning', 'General house cleaning', 'Deep cleaning']
    },
    {
      id: 'packing',
      name: 'Packing',
      icon: Package,
      color: 'orange',
      description: 'Professional packing services',
      services: ['Full packing service', 'Partial packing', 'Fragile item packing', 'Packing materials supply']
    },
    {
      id: 'unpacking',
      name: 'Unpacking',
      icon: Package2,
      color: 'teal',
      description: 'Unpacking and setup services',
      services: ['Full unpacking', 'Kitchen setup', 'Wardrobe organization', 'Room setup']
    },
    {
      id: 'rubbish_removal',
      name: 'Rubbish Removals',
      icon: Trash2,
      color: 'red',
      description: 'Waste and junk removal',
      services: ['General rubbish removal', 'Furniture disposal', 'Garden waste', 'Construction waste']
    },
    {
      id: 'gardening',
      name: 'Gardening',
      icon: Scissors,
      color: 'green',
      description: 'Garden maintenance and cleanup',
      services: ['Garden cleanup', 'Lawn mowing', 'Hedge trimming', 'Garden maintenance']
    },
    {
      id: 'pest_control',
      name: 'Pest Control',
      icon: Bug,
      color: 'yellow',
      description: 'Pest inspection and treatment',
      services: ['General pest control', 'Termite inspection', 'Rodent control', 'Insect treatment']
    },
    {
      id: 'skip_bins',
      name: 'Skip Bins',
      icon: Container,
      color: 'gray',
      description: 'Waste container rental',
      services: ['Mini skip bins', 'Medium skip bins', 'Large skip bins', 'Construction waste bins']
    },
    {
      id: 'handyman',
      name: 'Handyman',
      icon: Wrench,
      color: 'blue',
      description: 'General maintenance and repairs',
      services: ['Wall mounting', 'Hole patching', 'Minor repairs', 'Assembly services']
    },
    {
      id: 'tradie',
      name: 'Tradie (Plumber/Electrician)',
      icon: Zap,
      color: 'yellow',
      description: 'Licensed trade services',
      services: ['Plumbing services', 'Electrical work', 'Installation services', 'Maintenance']
    }
  ];

  useEffect(() => {
    loadServiceData();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory]);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      
      // Get user's moves first
      const movesResponse = await moveAPI.getUserMoves();
      if (!movesResponse.success || !movesResponse.data || movesResponse.data.length === 0) {
        showError('No moves found. Please create a move first.');
        return;
      }
      
      const move = movesResponse.data[0];
      setCurrentMove(move);
      
      // Get available services
      const servicesResponse = await serviceAPI.getServices(move.id);
      if (servicesResponse.success) {
        setServices(servicesResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading service data:', error);
      showError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  };

  const openBookingModal = (service) => {
    setSelectedService(service);
    setBookingForm({
      serviceId: service.id,
      providerId: service.provider.id,
      preferredDate: '',
      preferredTime: '',
      notes: '',
      propertyAccess: {}
    });
    
    // If it's a mover service, open property access modal first
    if (service.category === 'movers') {
      setIsPropertyAccessModalOpen(true);
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const handlePropertyAccessSubmit = () => {
    setBookingForm(prev => ({ ...prev, propertyAccess: propertyAccessForm }));
    setIsPropertyAccessModalOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async () => {
    if (!bookingForm.preferredDate || !selectedService) return;

    try {
      const bookingData = {
        move_id: currentMove.id,
        service_id: bookingForm.serviceId,
        provider_id: bookingForm.providerId,
        preferred_date: bookingForm.preferredDate,
        preferred_time: bookingForm.preferredTime,
        notes: bookingForm.notes,
        property_access: bookingForm.propertyAccess,
        status: 'pending'
      };

      const response = await serviceAPI.createBooking(bookingData);
      if (response.success) {
        showSuccess('Service booking request submitted successfully!');
        setIsBookingModalOpen(false);
        setSelectedService(null);
        // Refresh bookings or update state as needed
      } else {
        showError('Failed to submit booking request');
      }
    } catch (error) {
      showError('Failed to submit booking request');
    }
  };

  const renderServiceCard = (service) => {
    const category = serviceCategories.find(cat => cat.id === service.category);
    const CategoryIcon = category?.icon || Wrench;

    return (
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl bg-${category?.color || 'gray'}-100 flex items-center justify-center`}>
                  <CategoryIcon className={`h-6 w-6 text-${category?.color || 'gray'}-600`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <p className="text-sm text-gray-600">{service.provider.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{service.rating || '4.8'}</span>
                  <span className="text-xs text-gray-500">({service.reviewCount || '127'})</span>
                </div>
                {service.verified && (
                  <Badge variant="default" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>

            {/* Service Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Services: {service.serviceArea || 'Sydney Metro'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>Available: {service.availability || 'Mon-Sat 7AM-6PM'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>From: ${service.priceFrom || '120'}/hour</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mb-4">
              {(service.features || ['Insured', 'Licensed', 'Same-day service']).map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button 
                onClick={() => openBookingModal(service)}
                className="flex-1"
              >
                Book Now
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4" />
              </Button>
              {service.website && (
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (!currentMove) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Move Found</h2>
          <p className="text-gray-600 mb-6">Please create a move first to book services.</p>
          <Button onClick={() => window.location.href = '/my-move'}>
            Create Move
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book My Service</h1>
              <p className="text-gray-600 mt-1">Find and book trusted service providers for your move</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                Move: {new Date(currentMove.move_date).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {serviceCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Service Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {serviceCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-105 ${
                    selectedCategory === category.id
                      ? `border-${category.color}-500 bg-${category.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CategoryIcon className={`h-8 w-8 mx-auto mb-2 text-${category.color}-600`} />
                  <div className="font-semibold text-sm">{category.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {selectedCategory === 'all' ? 'All Services' : 
               serviceCategories.find(cat => cat.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600">{filteredServices.length} services found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(renderServiceCard)}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <Truck className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No Services Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search terms or browse different categories.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Property Access Modal for Movers */}
      <Modal isOpen={isPropertyAccessModalOpen} onClose={() => setIsPropertyAccessModalOpen(false)}>
        <div className="p-6 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Property Access Information</h3>
          <p className="text-sm text-gray-600 mb-6">
            Please provide access details for both pickup and drop-off locations to help movers prepare.
          </p>

          <Tabs defaultValue="pickup">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pickup">Pickup Location</TabsTrigger>
              <TabsTrigger value="dropoff">Drop-off Location</TabsTrigger>
            </TabsList>

            <TabsContent value="pickup" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={propertyAccessForm.pickupPropertyType}
                    onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, pickupPropertyType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="unit">Unit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floor Level</label>
                  <Input
                    value={propertyAccessForm.pickupFloorLevel}
                    onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, pickupFloorLevel: e.target.value }))}
                    placeholder="e.g., Ground, 3rd floor"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={propertyAccessForm.pickupLiftAccess}
                    onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, pickupLiftAccess: e.target.checked }))}
                    className="mr-2"
                  />
                  Lift access available
                </label>

                {propertyAccessForm.pickupLiftAccess && (
                  <Input
                    value={propertyAccessForm.pickupLiftSize}
                    onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, pickupLiftSize: e.target.value }))}
                    placeholder="Lift size restrictions (if any)"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stairs</label>
                <Input
                  value={propertyAccessForm.pickupStairs}
                  onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, pickupStairs: e.target.value }))}
                  placeholder="Number of flights, narrow staircases, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
                <select
                  value={propertyAccessForm.pickupParkingType}
                  onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, pickupParkingType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select parking type</option>
                  <option value="driveway">Driveway access</option>
                  <option value="street">Street parking</option>
                  <option value="loading_zone">Loading zone</option>
                  <option value="underground">Underground parking</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="dropoff" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={propertyAccessForm.dropoffPropertyType}
                    onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, dropoffPropertyType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="unit">Unit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floor Level</label>
                  <Input
                    value={propertyAccessForm.dropoffFloorLevel}
                    onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, dropoffFloorLevel: e.target.value }))}
                    placeholder="e.g., Ground, 3rd floor"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={propertyAccessForm.dropoffLiftAccess}
                    onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, dropoffLiftAccess: e.target.checked }))}
                    className="mr-2"
                  />
                  Lift access available
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={propertyAccessForm.dropoffLiftBookingRequired}
                    onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, dropoffLiftBookingRequired: e.target.checked }))}
                    className="mr-2"
                  />
                  Lift booking required
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Building Rules</label>
                <textarea
                  value={propertyAccessForm.buildingRules}
                  onChange={(e) => setPropertyAccessForm(prev => ({ ...prev, buildingRules: e.target.value }))}
                  placeholder="Strata rules, move-in times, loading dock booking, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setIsPropertyAccessModalOpen(false)}>
              Skip
            </Button>
            <Button onClick={handlePropertyAccessSubmit}>
              Continue to Booking
            </Button>
          </div>
        </div>
      </Modal>

      {/* Booking Modal */}
      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Book Service</h3>
          
          {selectedService && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{selectedService.name}</h4>
                  <p className="text-sm text-gray-600">{selectedService.provider.name}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <Input
                  type="date"
                  value={bookingForm.preferredDate}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                <select
                  value={bookingForm.preferredTime}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select time</option>
                  <option value="morning">Morning (8AM-12PM)</option>
                  <option value="afternoon">Afternoon (12PM-5PM)</option>
                  <option value="evening">Evening (5PM-8PM)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requirements, access instructions, or additional information..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a booking request. The service provider will contact you 
                to confirm availability and provide a detailed quote.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookingSubmit} disabled={!bookingForm.preferredDate}>
              Submit Booking Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceBooking;

