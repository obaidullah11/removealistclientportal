import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Package, Home, FileText, Car, Upload, Edit, Eye, Check } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'

import { mockRooms } from '../../data/mockData'

export default function Inventory() {
  const [rooms, setRooms] = useState(mockRooms)

  const addRoom = () => {
    const name = prompt('Enter room name:')
    if (name) {
      const newRoom = {
        id: `room-${Date.now()}`,
        name,
        type: 'other',
        items: [],
        boxes: 0,
        heavyItems: 0,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        packed: false
      }
      setRooms([...rooms, newRoom])
    }
  }

  const toggleRoomPacked = (roomId) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? {...room, packed: !room.packed} : room
    ))
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mr-4">
                <Package className="h-10 w-10" />
              </div>
              <h1 className="text-5xl font-bold">Inventory Manager</h1>
            </div>
            <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
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
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                >
                  <tab.icon className="h-8 w-8 mx-auto mb-2 text-emerald-200" />
                  <div className="text-2xl font-bold">{tab.count}</div>
                  <div className="text-sm text-emerald-100">{tab.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

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
                        src={room.image} 
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{room.name}</h3>
                        <p className="text-sm text-white/80 capitalize">{room.type.replace('_', ' ')}</p>
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
                          <div className="text-2xl font-bold text-primary-600">{room.items.length}</div>
                          <div className="text-xs text-gray-600">Items</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{room.boxes}</div>
                          <div className="text-xs text-gray-600">Boxes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{room.heavyItems}</div>
                          <div className="text-xs text-gray-600">Heavy</div>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
                        <div className="flex flex-wrap gap-1">
                          {room.items.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                              {item}
                            </span>
                          ))}
                          {room.items.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              +{room.items.length - 3} more
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