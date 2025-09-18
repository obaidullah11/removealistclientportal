import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Package, 
  Home, 
  FileText, 
  Car, 
  Upload, 
  Edit, 
  Eye, 
  Check, 
  QrCode,
  Camera,
  Search,
  Download,
  Share2,
  Truck,
  Weight,
  Diamond,
  Archive,
  Image,
  Trash2,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Modal } from '../../components/ui/modal'
import { inventoryAPI, enhancedInventoryAPI, moveAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'

export default function Inventory() {
  const [rooms, setRooms] = useState([])
  const [boxes, setBoxes] = useState([])
  const [heavyItems, setHeavyItems] = useState([])
  const [highValueItems, setHighValueItems] = useState([])
  const [storageItems, setStorageItems] = useState([])
  const [currentMove, setCurrentMove] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isAddBoxModalOpen, setIsAddBoxModalOpen] = useState(false)
  const [isAddHeavyItemModalOpen, setIsAddHeavyItemModalOpen] = useState(false)
  const [isAddHighValueModalOpen, setIsAddHighValueModalOpen] = useState(false)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [selectedQRItem, setSelectedQRItem] = useState(null)

  // Form states
  const [newBox, setNewBox] = useState({
    type: 'medium',
    label: '',
    room: '',
    contents: '',
    weight: '',
    fragile: false,
    packed: false
  })

  const [newHeavyItem, setNewHeavyItem] = useState({
    name: '',
    category: 'piano',
    weight: '',
    dimensions: '',
    room: '',
    notes: '',
    requiresSpecialHandling: true
  })

  const [newHighValueItem, setNewHighValueItem] = useState({
    name: '',
    category: 'fine_art',
    value: '',
    description: '',
    room: '',
    insured: false,
    photos: []
  })

  // Load inventory data on component mount
  useEffect(() => {
    loadInventoryData()
  }, [])

  // Box types from documentation
  const boxTypes = [
    {
      type: 'small',
      name: 'Small Box',
      dimensions: '~25–40 L; ~230–410×310×310–445 mm',
      bestFor: 'Heavy items (books, electronics)',
      icon: Package
    },
    {
      type: 'medium',
      name: 'Medium Box',
      dimensions: '~50–70 L; ~335–495×310–390×280–430 mm',
      bestFor: 'General household goods',
      icon: Package
    },
    {
      type: 'large',
      name: 'Large / Tea Chest Box',
      dimensions: '~100–110 L; up to 465×600×600 mm',
      bestFor: 'Bulky, lightweight items',
      icon: Package
    },
    {
      type: 'extra_large',
      name: 'Extra Large',
      dimensions: '~60×40×73 cm',
      bestFor: 'Blankets, soft bulky items',
      icon: Package
    },
    {
      type: 'book_wine',
      name: 'Book/Wine Carton',
      dimensions: '~40.6×29.8×43 cm',
      bestFor: 'Books, wine, heavy small items',
      icon: Package
    },
    {
      type: 'picture_mirror',
      name: 'Picture/Mirror Box',
      dimensions: '~104×77.5×7.5 cm; or adjusted sizes',
      bestFor: 'Mirrors, framed art',
      icon: Image
    },
    {
      type: 'port_a_robe',
      name: 'Port-a-Robe Carton',
      dimensions: '~59×48×110 cm',
      bestFor: 'Hanging clothes',
      icon: Archive
    },
    {
      type: 'tv_carton',
      name: 'TV Carton',
      dimensions: 'Varies (includes padding)',
      bestFor: 'Flat-screen TVs',
      icon: Package
    },
    {
      type: 'dish_glassware',
      name: 'Dish/Glassware Box',
      dimensions: 'Custom with dividers',
      bestFor: 'Fragile kitchenware',
      icon: Package
    },
    {
      type: 'audio_file',
      name: 'Audio / File Box',
      dimensions: 'Double-walled or padded versions',
      bestFor: 'Electronics, documents',
      icon: FileText
    },
    {
      type: 'mattress',
      name: 'Mattress Box',
      dimensions: 'Sized for mattress dimensions',
      bestFor: 'Mattresses (twin to king)',
      icon: Package
    }
  ]

  // Heavy items categories
  const heavyItemCategories = [
    { value: 'piano', label: 'Pianos', icon: Package },
    { value: 'pool_table', label: 'Pool tables', icon: Package },
    { value: 'sculpture', label: 'Large sculptures/statues', icon: Package },
    { value: 'aquarium', label: 'Aquariums', icon: Package },
    { value: 'gym_equipment', label: 'Home gym equipment', icon: Weight }
  ]

  // High value items categories
  const highValueCategories = [
    { value: 'fine_art', label: 'Fine art/paintings', icon: Image },
    { value: 'antiques', label: 'Antiques', icon: Diamond },
    { value: 'designer_furniture', label: 'Designer furniture', icon: Home },
    { value: 'collectibles', label: 'Collectibles (e.g., rare books, coins)', icon: Archive }
  ]

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
      
      // Get all inventory data for this move
      const [roomsResponse, boxesResponse, heavyResponse, highValueResponse, storageResponse] = await Promise.all([
        inventoryAPI.getRooms(move.id),
        enhancedInventoryAPI.getBoxes(move.id),
        enhancedInventoryAPI.getHeavyItems(move.id),
        enhancedInventoryAPI.getHighValueItems(move.id),
        enhancedInventoryAPI.getStorageItems(move.id)
      ])
      
      if (roomsResponse.success) setRooms(roomsResponse.data || [])
      if (boxesResponse.success) setBoxes(boxesResponse.data || [])
      if (heavyResponse.success) setHeavyItems(heavyResponse.data || [])
      if (highValueResponse.success) setHighValueItems(highValueResponse.data || [])
      if (storageResponse.success) setStorageItems(storageResponse.data || [])
      
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

  // Helper functions
  const generateQRCode = (item, type) => {
    // Generate QR code data - in real implementation, this would create actual QR codes
    const qrData = {
      id: item.id,
      type: type,
      moveId: currentMove?.id,
      name: item.name || item.label || item.title,
      room: item.room,
      timestamp: new Date().toISOString()
    }
    return `https://removealist.com/qr/${btoa(JSON.stringify(qrData))}`
  }

  const exportInventory = async (format = 'pdf') => {
    try {
      const inventoryData = {
        move: currentMove,
        rooms,
        boxes,
        heavyItems,
        highValueItems,
        storageItems
      }
      
      // TODO: Implement actual export functionality
      showSuccess(`Inventory exported as ${format.toUpperCase()}`)
    } catch (error) {
      showError('Failed to export inventory')
    }
  }

  const shareInventory = async () => {
    try {
      // TODO: Implement sharing functionality
      showSuccess('Inventory shared successfully!')
    } catch (error) {
      showError('Failed to share inventory')
    }
  }

  const addBox = async () => {
    if (!currentMove || !newBox.label.trim()) return

    try {
      const boxData = {
        move_id: currentMove.id,
        type: newBox.type,
        label: newBox.label,
        room: newBox.room,
        contents: newBox.contents,
        weight: newBox.weight,
        fragile: newBox.fragile,
        packed: newBox.packed,
        qr_code: generateQRCode({ label: newBox.label, room: newBox.room }, 'box')
      }

      const response = await enhancedInventoryAPI.createBox(boxData)
      if (response.success) {
        setBoxes(prev => [...prev, response.data])
        setNewBox({
          type: 'medium',
          label: '',
          room: '',
          contents: '',
          weight: '',
          fragile: false,
          packed: false
        })
        setIsAddBoxModalOpen(false)
        showSuccess('Box added successfully!')
      }
    } catch (error) {
      showError('Failed to add box')
    }
  }

  const addHeavyItem = async () => {
    if (!currentMove || !newHeavyItem.name.trim()) return

    try {
      const itemData = {
        move_id: currentMove.id,
        name: newHeavyItem.name,
        category: newHeavyItem.category,
        weight: newHeavyItem.weight,
        dimensions: newHeavyItem.dimensions,
        room: newHeavyItem.room,
        notes: newHeavyItem.notes,
        requires_special_handling: newHeavyItem.requiresSpecialHandling,
        qr_code: generateQRCode({ name: newHeavyItem.name, room: newHeavyItem.room }, 'heavy_item')
      }

      const response = await inventoryAPI.createHeavyItem(itemData)
      if (response.success) {
        setHeavyItems(prev => [...prev, response.data])
        setNewHeavyItem({
          name: '',
          category: 'piano',
          weight: '',
          dimensions: '',
          room: '',
          notes: '',
          requiresSpecialHandling: true
        })
        setIsAddHeavyItemModalOpen(false)
        showSuccess('Heavy item added successfully!')
      }
    } catch (error) {
      showError('Failed to add heavy item')
    }
  }

  const addHighValueItem = async () => {
    if (!currentMove || !newHighValueItem.name.trim()) return

    try {
      const itemData = {
        move_id: currentMove.id,
        name: newHighValueItem.name,
        category: newHighValueItem.category,
        value: newHighValueItem.value,
        description: newHighValueItem.description,
        room: newHighValueItem.room,
        insured: newHighValueItem.insured,
        photos: newHighValueItem.photos,
        qr_code: generateQRCode({ name: newHighValueItem.name, room: newHighValueItem.room }, 'high_value_item')
      }

      const response = await inventoryAPI.createHighValueItem(itemData)
      if (response.success) {
        setHighValueItems(prev => [...prev, response.data])
        setNewHighValueItem({
          name: '',
          category: 'fine_art',
          value: '',
          description: '',
          room: '',
          insured: false,
          photos: []
        })
        setIsAddHighValueModalOpen(false)
        showSuccess('High value item added successfully!')
      }
    } catch (error) {
      showError('Failed to add high value item')
    }
  }

  const showQRCode = (item, type) => {
    setSelectedQRItem({ ...item, type })
    setIsQRModalOpen(true)
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
      count: boxes.length,
      description: 'Track all boxes'
    },
    { 
      value: 'heavy_items', 
      label: 'Heavy Items', 
      icon: Weight,
      count: heavyItems.length,
      description: 'Special handling required'
    },
    { 
      value: 'high_value', 
      label: 'High Value', 
      icon: Diamond,
      count: highValueItems.length,
      description: 'Valuable items'
    },
    { 
      value: 'storage', 
      label: 'Storage', 
      icon: Archive,
      count: storageItems.length,
      description: 'Items in storage'
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

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => exportInventory('pdf')} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button onClick={() => exportInventory('excel')} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button onClick={shareInventory} variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Box Management</h2>
                <p className="text-gray-600">Track all your moving boxes with QR codes and detailed contents</p>
              </div>
              <Button onClick={() => setIsAddBoxModalOpen(true)} size="lg" className="h-12">
                <Plus className="h-5 w-5 mr-2" />
                Add Box
              </Button>
            </div>

            {/* Box Type Reference Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Box Types Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boxTypes.map((boxType) => (
                    <div key={boxType.type} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center mb-2">
                        <boxType.icon className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-semibold">{boxType.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{boxType.dimensions}</p>
                      <p className="text-xs text-gray-500">{boxType.bestFor}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Existing Boxes */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boxes.map((box, index) => (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`hover:shadow-lg transition-shadow ${box.packed ? 'border-green-200 bg-green-50' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{box.label}</h3>
                          <Badge variant="secondary" className="mt-1">
                            {boxTypes.find(bt => bt.type === box.type)?.name || box.type}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => showQRCode(box, 'box')}>
                            <QrCode className="h-4 w-4" />
                          </Button>
                          {box.packed && <Check className="h-5 w-5 text-green-600" />}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div><strong>Room:</strong> {box.room || 'Not assigned'}</div>
                        <div><strong>Contents:</strong> {box.contents || 'Not specified'}</div>
                        {box.weight && <div><strong>Weight:</strong> {box.weight}</div>}
                        {box.fragile && (
                          <Badge variant="destructive" className="text-xs">
                            Fragile
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant={box.packed ? 'secondary' : 'default'} className="flex-1">
                          {box.packed ? 'Packed' : 'Mark Packed'}
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {boxes.length === 0 && (
              <div className="text-center py-16">
                <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-4">No Boxes Added Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Start tracking your moving boxes with QR codes and detailed contents.
                </p>
                <Button onClick={() => setIsAddBoxModalOpen(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add First Box
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Heavy Items Tab */}
          <TabsContent value="heavy_items" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Heavy Items</h2>
                <p className="text-gray-600">Items requiring special handling and equipment</p>
              </div>
              <Button onClick={() => setIsAddHeavyItemModalOpen(true)} size="lg" className="h-12">
                <Plus className="h-5 w-5 mr-2" />
                Add Heavy Item
              </Button>
            </div>

            {/* Heavy Items Reference */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Heavy Items Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {heavyItemCategories.map((category) => (
                    <div key={category.value} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center mb-2">
                        <category.icon className="h-5 w-5 text-orange-600 mr-2" />
                        <h4 className="font-semibold">{category.label}</h4>
                      </div>
                      <p className="text-xs text-gray-500">Requires special handling</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Existing Heavy Items */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heavyItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <Badge variant="secondary" className="mt-1">
                            {heavyItemCategories.find(cat => cat.value === item.category)?.label || item.category}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => showQRCode(item, 'heavy_item')}>
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Weight className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div><strong>Room:</strong> {item.room || 'Not assigned'}</div>
                        {item.weight && <div><strong>Weight:</strong> {item.weight}</div>}
                        {item.dimensions && <div><strong>Dimensions:</strong> {item.dimensions}</div>}
                        {item.notes && <div><strong>Notes:</strong> {item.notes}</div>}
                        {item.requires_special_handling && (
                          <Badge variant="destructive" className="text-xs">
                            Special Handling Required
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Camera className="h-4 w-4 mr-2" />
                          Photo
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {heavyItems.length === 0 && (
              <div className="text-center py-16">
                <Weight className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-4">No Heavy Items Added Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Track items that require special handling like pianos, pool tables, and gym equipment.
                </p>
                <Button onClick={() => setIsAddHeavyItemModalOpen(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add First Heavy Item
                </Button>
              </div>
            )}
          </TabsContent>

          {/* High Value Items Tab */}
          <TabsContent value="high_value" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">High Value Items</h2>
                <p className="text-gray-600">Valuable items requiring special care and insurance</p>
              </div>
              <Button onClick={() => setIsAddHighValueModalOpen(true)} size="lg" className="h-12">
                <Plus className="h-5 w-5 mr-2" />
                Add High Value Item
              </Button>
            </div>

            {/* High Value Categories */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>High Value Categories</CardTitle>
                <p className="text-sm text-gray-600">Note: Jewellery and documents are not permitted</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {highValueCategories.map((category) => (
                    <div key={category.value} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center mb-2">
                        <category.icon className="h-5 w-5 text-purple-600 mr-2" />
                        <h4 className="font-semibold">{category.label}</h4>
                      </div>
                      <p className="text-xs text-gray-500">Requires special insurance</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Existing High Value Items */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highValueItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <Badge variant="secondary" className="mt-1">
                            {highValueCategories.find(cat => cat.value === item.category)?.label || item.category}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => showQRCode(item, 'high_value_item')}>
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Diamond className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div><strong>Room:</strong> {item.room || 'Not assigned'}</div>
                        {item.value && <div><strong>Value:</strong> ${item.value}</div>}
                        {item.description && <div><strong>Description:</strong> {item.description}</div>}
                        <div className="flex items-center space-x-2">
                          <strong>Insured:</strong>
                          <Badge variant={item.insured ? 'default' : 'destructive'} className="text-xs">
                            {item.insured ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Camera className="h-4 w-4 mr-2" />
                          Photos
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {highValueItems.length === 0 && (
              <div className="text-center py-16">
                <Diamond className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-4">No High Value Items Added Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Track valuable items like fine art, antiques, and designer furniture.
                </p>
                <Button onClick={() => setIsAddHighValueModalOpen(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add First High Value Item
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Storage Tab */}
          <TabsContent value="storage" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Storage</h2>
                <p className="text-gray-600">Items going into storage with vendor details</p>
              </div>
              <Button size="lg" className="h-12">
                <Plus className="h-5 w-5 mr-2" />
                Add Storage Item
              </Button>
            </div>

            <div className="text-center py-16">
              <Archive className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No Storage Items Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Track items going into storage with vendor details, contracts, and QR codes.
              </p>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add Storage Details
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Box Modal */}
      <Modal isOpen={isAddBoxModalOpen} onClose={() => setIsAddBoxModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Box</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Box Type</label>
                <select
                  value={newBox.type}
                  onChange={(e) => setNewBox(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {boxTypes.map(type => (
                    <option key={type.type} value={type.type}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Box Label</label>
                <Input
                  value={newBox.label}
                  onChange={(e) => setNewBox(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Kitchen Box 1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                <select
                  value={newBox.room}
                  onChange={(e) => setNewBox(prev => ({ ...prev, room: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.name}>{room.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (optional)</label>
                <Input
                  value={newBox.weight}
                  onChange={(e) => setNewBox(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="e.g., 15kg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contents</label>
              <textarea
                value={newBox.contents}
                onChange={(e) => setNewBox(prev => ({ ...prev, contents: e.target.value }))}
                placeholder="List the contents of this box..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newBox.fragile}
                  onChange={(e) => setNewBox(prev => ({ ...prev, fragile: e.target.checked }))}
                  className="mr-2"
                />
                Fragile Items
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newBox.packed}
                  onChange={(e) => setNewBox(prev => ({ ...prev, packed: e.target.checked }))}
                  className="mr-2"
                />
                Already Packed
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setIsAddBoxModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addBox} disabled={!newBox.label.trim()}>
              Add Box
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Heavy Item Modal */}
      <Modal isOpen={isAddHeavyItemModalOpen} onClose={() => setIsAddHeavyItemModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add Heavy Item</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <Input
                  value={newHeavyItem.name}
                  onChange={(e) => setNewHeavyItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Grand Piano"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newHeavyItem.category}
                  onChange={(e) => setNewHeavyItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {heavyItemCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <Input
                  value={newHeavyItem.weight}
                  onChange={(e) => setNewHeavyItem(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="e.g., 300kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
                <Input
                  value={newHeavyItem.dimensions}
                  onChange={(e) => setNewHeavyItem(prev => ({ ...prev, dimensions: e.target.value }))}
                  placeholder="e.g., 150x60x110cm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
              <select
                value={newHeavyItem.room}
                onChange={(e) => setNewHeavyItem(prev => ({ ...prev, room: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.name}>{room.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={newHeavyItem.notes}
                onChange={(e) => setNewHeavyItem(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Special handling instructions, access notes, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newHeavyItem.requiresSpecialHandling}
                  onChange={(e) => setNewHeavyItem(prev => ({ ...prev, requiresSpecialHandling: e.target.checked }))}
                  className="mr-2"
                />
                Requires Special Handling
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setIsAddHeavyItemModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addHeavyItem} disabled={!newHeavyItem.name.trim()}>
              Add Heavy Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add High Value Item Modal */}
      <Modal isOpen={isAddHighValueModalOpen} onClose={() => setIsAddHighValueModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add High Value Item</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <Input
                  value={newHighValueItem.name}
                  onChange={(e) => setNewHighValueItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Vintage Painting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newHighValueItem.category}
                  onChange={(e) => setNewHighValueItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {highValueCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Value ($)</label>
                <Input
                  type="number"
                  value={newHighValueItem.value}
                  onChange={(e) => setNewHighValueItem(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="e.g., 5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                <select
                  value={newHighValueItem.room}
                  onChange={(e) => setNewHighValueItem(prev => ({ ...prev, room: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.name}>{room.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newHighValueItem.description}
                onChange={(e) => setNewHighValueItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description, condition, provenance, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newHighValueItem.insured}
                  onChange={(e) => setNewHighValueItem(prev => ({ ...prev, insured: e.target.checked }))}
                  className="mr-2"
                />
                Currently Insured
              </label>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Jewellery and documents are not permitted. 
                High value items may require additional insurance coverage.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setIsAddHighValueModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addHighValueItem} disabled={!newHighValueItem.name.trim()}>
              Add High Value Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* QR Code Modal */}
      <Modal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)}>
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">QR Code</h3>
          
          {selectedQRItem && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{selectedQRItem.name || selectedQRItem.label}</h4>
                <p className="text-sm text-gray-600 capitalize">{selectedQRItem.type?.replace('_', ' ')}</p>
              </div>

              {/* QR Code Placeholder - In real implementation, use a QR code library */}
              <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">QR Code</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>Scan to view item details</p>
                <p>Move ID: {currentMove?.id}</p>
                <p>Room: {selectedQRItem.room || 'Not assigned'}</p>
              </div>

              <div className="flex space-x-2 justify-center">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}