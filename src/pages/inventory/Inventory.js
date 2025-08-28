import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Package, Home, FileText, Car, Upload, Edit, Eye, Check } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { inventoryAPI, moveAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'

export default function Inventory() {
  const [rooms, setRooms] = useState([])
  const [currentMove, setCurrentMove] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load inventory data on component mount
  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = async () => {
    try {
      setLoading(true)
      
      // Get user's moves first
      const movesResponse = await moveAPI.getUserMoves()
      if (!movesResponse.success || !movesResponse.data || movesResponse.data.length === 0) {
        showError('No moves found. Please create a move first.')
        return
      }
      
      // Use the first move (or you could let user select)
      const move = movesResponse.data[0]
      setCurrentMove(move)
      
      // Get rooms for this move
      const roomsResponse = await inventoryAPI.getRooms(move.id)
      if (roomsResponse.success) {
        setRooms(roomsResponse.data || [])
      } else {
        showError('Failed to load inventory rooms')
      }
    } catch (error) {
      console.error('Error loading inventory data:', error)
      showError('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  const addRoom = async () => {
    const name = prompt('Enter room name:')
    if (name && currentMove) {
      try {
        const roomData = {
          move_id: currentMove.id,
          name,
          room_type: 'other',
          items: [],
          estimated_boxes: 0,
          heavy_items_count: 0,
          packed: false
        }
        
        const response = await inventoryAPI.createRoom(roomData)
        if (response.success) {
          setRooms([...rooms, response.data])
          showSuccess('Room added successfully!')
        } else {
          showError('Failed to add room')
        }
      } catch (error) {
        console.error('Error adding room:', error)
        showError('Failed to add room')
      }
    }
  }

  const toggleRoomPacked = async (roomId) => {
    try {
      const room = rooms.find(r => r.id === roomId)
      if (!room) return
      
      const response = await inventoryAPI.markRoomPacked(roomId, !room.packed)
      if (response.success) {
        setRooms(rooms.map(r => 
          r.id === roomId ? { ...r, packed: !r.packed } : r
        ))
        showSuccess(`Room marked as ${!room.packed ? 'packed' : 'unpacked'}!`)
      } else {
        showError('Failed to update room status')
      }
    } catch (error) {
      console.error('Error updating room:', error)
      showError('Failed to update room status')
    }
  }

  const tabData = [
    { 
      value: 'rooms', 
      label: 'Rooms', 
      icon: Home,
      count: rooms.length,
      description: 'Organize by room'
    },
    { 
      value: 'boxes', 
      label: 'Boxes', 
      icon: Package,
      count: 12,
      description: 'Track all boxes'
    },
    { 
      value: 'documents', 
      label: 'Documents', 
      icon: FileText,
      count: 5,
      description: 'Important papers'
    },
    { 
      value: 'vehicles', 
      label: 'Vehicles', 
      icon: Car,
      count: 2,
      description: 'Cars & transport'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your inventory...</p>
        </div>
      </div>
    )
  }

  if (!currentMove) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Move Found</h2>
          <p className="text-gray-600 mb-6">Please create a move first to manage your inventory.</p>
          <Button onClick={() => window.location.href = '/my-move'}>
            Create Move
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Hero Section - Landing Page Style */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100 rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mr-4">
                <Package className="h-10 w-10 text-emerald-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Inventory Manager</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Keep track of everything you're moving with our smart inventory system. 
              Organize by rooms, track boxes, and never lose track of your belongings.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {tabData.map((tab, index) => (
                <motion.div
                  key={tab.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 shadow-lg"
                >
                  <tab.icon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                  <div className="text-2xl font-bold text-gray-900">{tab.count}</div>
                  <div className="text-sm text-gray-600">{tab.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs defaultValue="rooms" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-4 w-full max-w-3xl h-auto p-2">
              {tabData.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  className="flex flex-col items-center space-y-2 p-4 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  <div className="relative">
                    <tab.icon className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {tab.count}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">{tab.label}</div>
                  <div className="text-xs text-gray-600 text-center">
                    {tab.description}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Your Rooms</h2>
                <p className="text-gray-600">Organize your belongings by room for easier packing</p>
              </div>
              <Button onClick={addRoom} size="lg" className="h-12">
                <Plus className="h-5 w-5 mr-2" />
                Add Room
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`group hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden ${
                    room.packed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}>
                    {/* Room Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={room.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'} 
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{room.name}</h3>
                        <p className="text-sm text-white/80 capitalize">{(room.room_type || room.type || 'other').replace('_', ' ')}</p>
                      </div>
                      {room.packed && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                          <Check className="h-4 w-4 mr-1" />
                          Packed
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      {/* Room Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary-600">{room.items?.length || 0}</div>
                          <div className="text-xs text-gray-600">Items</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{room.estimated_boxes || 0}</div>
                          <div className="text-xs text-gray-600">Boxes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{room.heavy_items_count || 0}</div>
                          <div className="text-xs text-gray-600">Heavy</div>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
                        <div className="flex flex-wrap gap-1">
                          {room.items && room.items.length > 0 ? (
                            <>
                              {room.items.slice(0, 3).map((item, idx) => (
                                <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                  {typeof item === 'string' ? item : item.name || 'Item'}
                                </span>
                              ))}
                              {room.items.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  +{room.items.length - 3} more
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              No items added yet
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => toggleRoomPacked(room.id)}
                          variant={room.packed ? 'secondary' : 'default'}
                          size="sm"
                          className="flex-1"
                        >
                          {room.packed ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Packed
                            </>
                          ) : (
                            'Mark Packed'
                          )}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Boxes Tab */}
          <TabsContent value="boxes" className="space-y-8">
            <div className="text-center py-16">
              <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">Box Tracking Coming Soon!</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We're building an amazing box tracking system with QR codes, photos, and smart categorization.
              </p>
              <Button className="mt-6" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add First Box
              </Button>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Important Documents</h2>
                <p className="text-gray-600">Keep track of all your important papers and documents</p>
              </div>
              <Button size="lg" className="h-12">
                <Upload className="h-5 w-5 mr-2" />
                Upload Document
              </Button>
            </div>

            {/* Upload Area */}
            <Card className="border-2 border-dashed border-primary-200 hover:border-primary-300 transition-colors">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Upload className="h-10 w-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Drag & Drop Documents</h3>
                  <p className="text-gray-600 mb-6">
                    Upload contracts, inventory lists, insurance papers, and more
                  </p>
                  <Button size="lg" variant="outline" className="border-primary-300 text-primary-700">
                    Choose Files
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    Supports PDF, JPG, PNG up to 10MB each
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Vehicles</h2>
                <p className="text-gray-600">Manage vehicles that need to be moved or transported</p>
              </div>
              <Button size="lg" className="h-12">
                <Plus className="h-5 w-5 mr-2" />
                Add Vehicle
              </Button>
            </div>

            <div className="text-center py-16">
              <Car className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No Vehicles Added Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Add cars, motorcycles, boats, or other vehicles that need special moving arrangements.
              </p>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Vehicle
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}