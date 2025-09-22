import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import QRCode from 'qrcode'
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
import AddRoomModal from './AddRoomModal'
import AddBoxModal from './AddBoxModal'
import AddHeavyItemModal from './AddHeavyItemModal'
import AddHighValueItemModal from './AddHighValueItemModal'
import AddItemToRoomModal from './AddItemToRoomModal'
import AddStorageModal from './AddStorageModal'
import { inventoryAPI, enhancedInventoryAPI, moveAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'

// Static data moved outside component to prevent recreation on re-renders
const boxTypes = [
  {
    type: 'small',
    name: 'Small Box (30x30x30cm)',
    description: 'Perfect for books, documents, small electronics',
    weight: 'Up to 15kg',
    icon: Package
  },
  {
    type: 'medium',
    name: 'Medium Box (40x40x40cm)', 
    description: 'Great for clothes, kitchen items, toys',
    weight: 'Up to 20kg',
    icon: Package
  },
  {
    type: 'large',
    name: 'Large Box (50x50x50cm)',
    description: 'Ideal for bedding, pillows, lightweight bulky items',
    weight: 'Up to 25kg',
    icon: Package
  },
  {
    type: 'wardrobe',
    name: 'Wardrobe Box',
    description: 'Hanging clothes, suits, dresses',
    weight: 'Up to 30kg',
    icon: Package
  }
]

const heavyItemCategories = [
  { value: 'piano', label: 'Piano', icon: Package },
  { value: 'safe', label: 'Safe', icon: Package },
  { value: 'pool_table', label: 'Pool Table', icon: Package },
  { value: 'gym_equipment', label: 'Gym Equipment', icon: Weight },
  { value: 'large_appliance', label: 'Large Appliance', icon: Package },
  { value: 'furniture', label: 'Heavy Furniture', icon: Home },
  { value: 'machinery', label: 'Machinery', icon: Package },
  { value: 'sculpture', label: 'Large sculptures/statues', icon: Package },
  { value: 'aquarium', label: 'Aquariums', icon: Package },
  { value: 'other', label: 'Other Heavy Item', icon: Package }
]

const highValueCategories = [
  { value: 'fine_art', label: 'Fine art (paintings, sculptures)', icon: Diamond },
  { value: 'jewelry', label: 'Jewelry and watches', icon: Diamond },
  { value: 'electronics', label: 'High-end electronics', icon: Package },
  { value: 'antiques', label: 'Antiques', icon: Diamond },
  { value: 'designer_furniture', label: 'Designer furniture', icon: Home },
  { value: 'collectibles', label: 'Collectibles (e.g., rare books, coins)', icon: Archive }
]

// QR Code Display Component
const QRCodeDisplay = React.memo(({ item, generateQRCodeDataURL }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateQR = async () => {
      if (item) {
        setLoading(true)
        const dataURL = await generateQRCodeDataURL(item)
        setQrCodeDataURL(dataURL)
        setLoading(false)
      }
    }
    generateQR()
  }, [item, generateQRCodeDataURL])

  if (loading) {
    return (
      <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-xs text-gray-600">Generating QR Code...</p>
        </div>
      </div>
    )
  }

  if (!qrCodeDataURL) {
    return (
      <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs text-gray-600">Failed to generate QR Code</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center p-4">
      <div className="text-center">
        <img 
          src={qrCodeDataURL} 
          alt="QR Code" 
          className="w-40 h-40 mx-auto mb-2"
        />
        <p className="text-xs text-gray-600">Scan to view item details</p>
      </div>
    </div>
  )
})

export default function Inventory() {
  const [rooms, setRooms] = useState([])
  const [boxes, setBoxes] = useState([])
  const [heavyItems, setHeavyItems] = useState([])
  const [highValueItems, setHighValueItems] = useState([])
  const [storageItems, setStorageItems] = useState([])
  const [currentMove, setCurrentMove] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isAddBoxModalOpen, setIsAddBoxModalOpen] = useState(false)
  const [isAddHeavyItemModalOpen, setIsAddHeavyItemModalOpen] = useState(false)
  const [isAddHighValueModalOpen, setIsAddHighValueModalOpen] = useState(false)
  const [isAddStorageModalOpen, setIsAddStorageModalOpen] = useState(false)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [selectedQRItem, setSelectedQRItem] = useState(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareData, setShareData] = useState({ email: '', message: '' })
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false)
  const [isViewRoomModalOpen, setIsViewRoomModalOpen] = useState(false)
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false)
  const [editRoom, setEditRoom] = useState({
    name: '',
    type: 'living_room'
  })
  const [isAddItemToRoomModalOpen, setIsAddItemToRoomModalOpen] = useState(false)
  const [selectedRoomForItems, setSelectedRoomForItems] = useState(null)
  
  // Box management states
  const [isViewBoxModalOpen, setIsViewBoxModalOpen] = useState(false)
  const [isEditBoxModalOpen, setIsEditBoxModalOpen] = useState(false)
  const [selectedBox, setSelectedBox] = useState(null)
  const [editBox, setEditBox] = useState({
    type: 'medium',
    label: '',
    room: '',
    contents: '',
    weight: '',
    fragile: false,
    packed: false,
    destination_room: ''
  })
  
  // Heavy Item management states
  const [isViewHeavyItemModalOpen, setIsViewHeavyItemModalOpen] = useState(false)
  const [isEditHeavyItemModalOpen, setIsEditHeavyItemModalOpen] = useState(false)
  const [selectedHeavyItem, setSelectedHeavyItem] = useState(null)
  const [editHeavyItem, setEditHeavyItem] = useState({
    name: '',
    category: 'piano',
    weight: '',
    dimensions: '',
    room: '',
    notes: '',
    requiresSpecialHandling: true
  })
  
  // High Value Item management states
  const [isViewHighValueModalOpen, setIsViewHighValueModalOpen] = useState(false)
  const [isEditHighValueModalOpen, setIsEditHighValueModalOpen] = useState(false)
  const [selectedHighValueItem, setSelectedHighValueItem] = useState(null)
  const [editHighValueItem, setEditHighValueItem] = useState({
    name: '',
    category: 'fine_art',
    value: '',
    description: '',
    room: '',
    insured: false,
    photos: []
  })
  
  // Delete confirmation states
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // { type: 'box'|'heavyItem'|'highValueItem', id: string, name: string }



  // Memoize expensive computations with debounced search
  const filteredBoxes = useMemo(() => {
    if (!debouncedSearchTerm) return boxes
    return boxes.filter(box => 
      box.label?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      box.contents?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      box.room_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [boxes, debouncedSearchTerm])

  const filteredRooms = useMemo(() => {
    if (!debouncedSearchTerm) return rooms
    return rooms.filter(room => 
      room.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      room.type?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [rooms, debouncedSearchTerm])

  const filteredHeavyItems = useMemo(() => {
    if (!debouncedSearchTerm) return heavyItems
    return heavyItems.filter(item => 
      item.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.room_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [heavyItems, debouncedSearchTerm])

  const filteredHighValueItems = useMemo(() => {
    if (!debouncedSearchTerm) return highValueItems
    return highValueItems.filter(item => 
      item.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.room_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [highValueItems, debouncedSearchTerm])

  // Debounced search to prevent excessive filtering
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms delay
    
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Memoize search handler to prevent re-renders
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])



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
      
      // Get all inventory data for this move
      const [roomsResponse, boxesResponse, heavyResponse, highValueResponse, storageResponse] = await Promise.all([
        inventoryAPI.getRooms(move.id),
        enhancedInventoryAPI.getBoxes(move.id),
        enhancedInventoryAPI.getHeavyItems(move.id),
        enhancedInventoryAPI.getHighValueItems(move.id),
        enhancedInventoryAPI.getStorageItems(move.id)
      ])
      
      
      if (roomsResponse.success) {
        console.log('Loaded rooms data:', roomsResponse.data)
        setRooms(roomsResponse.data || [])
      }
      if (boxesResponse.success) setBoxes(boxesResponse.data || [])
      if (heavyResponse.success) setHeavyItems(heavyResponse.data || [])
      if (highValueResponse.success) setHighValueItems(highValueResponse.data || [])
      if (storageResponse.success) {
        console.log('Storage items loaded:', storageResponse.data)
        setStorageItems(storageResponse.data || [])
      } else {
        console.error('Failed to load storage items:', storageResponse)
      }
      
    } catch (error) {
      console.error('Error loading inventory data:', error)
      showError('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  const addRoom = () => {
    setIsAddRoomModalOpen(true)
  }

  const handleRoomAdded = useCallback((newRoomData) => {
    setRooms(prevRooms => [...prevRooms, newRoomData])
  }, [])

  const handleBoxAdded = useCallback((newBoxData) => {
    setBoxes(prevBoxes => [...prevBoxes, newBoxData])
  }, [])

  const handleHeavyItemAdded = useCallback((newHeavyItemData) => {
    setHeavyItems(prevItems => [...prevItems, newHeavyItemData])
  }, [])

  const handleHighValueItemAdded = useCallback((newHighValueItemData) => {
    setHighValueItems(prevItems => [...prevItems, newHighValueItemData])
  }, [])

  const handleItemAddedToRoom = useCallback((updatedRoomData) => {
    console.log('Room item added - updated room data:', updatedRoomData)
    setRooms(prevRooms => {
      const updatedRooms = prevRooms.map(room => 
        room.id === updatedRoomData.id ? updatedRoomData : room
      )
      console.log('Updated rooms state:', updatedRooms)
      return updatedRooms
    })
  }, [])

  const handleStorageItemAdded = useCallback((newStorageItemData) => {
    console.log('Adding storage item to state:', newStorageItemData)
    setStorageItems(prevItems => {
      const updatedItems = [...prevItems, newStorageItemData]
      console.log('Updated storage items:', updatedItems)
      return updatedItems
    })
  }, [])

  const viewRoom = (room) => {
    setSelectedRoom(room)
    setIsViewRoomModalOpen(true)
  }

  const openEditRoom = (room) => {
    setSelectedRoom(room)
    setEditRoom({
      name: room.name,
      type: room.type
    })
    setIsEditRoomModalOpen(true)
  }

  const handleEditRoom = async () => {
    if (!editRoom.name.trim() || !selectedRoom) {
      showError('Room name is required')
      return
    }

    try {
      const roomData = {
        name: editRoom.name.trim(),
        type: editRoom.type
      }
      
      const response = await enhancedInventoryAPI.updateRoom(selectedRoom.id, roomData)
      if (response.success) {
        setRooms(rooms.map(room => 
          room.id === selectedRoom.id ? response.data : room
        ))
        setIsEditRoomModalOpen(false)
        setSelectedRoom(null)
        setEditRoom({ name: '', type: 'living_room' })
        showSuccess('Room updated successfully!')
      } else {
        showError('Failed to update room')
      }
    } catch (error) {
      console.error('Error updating room:', error)
      showError('Failed to update room')
    }
  }

  const openAddItemToRoom = useCallback((room) => {
    setSelectedRoomForItems(room)
    setIsAddItemToRoomModalOpen(true)
  }, [])


  const removeItemFromRoom = async (room, itemIndex) => {
    try {
      const currentItems = room.items || []
      const updatedItems = currentItems.filter((_, index) => index !== itemIndex)
      
      const roomData = {
        items: updatedItems
      }
      
      const response = await enhancedInventoryAPI.updateRoom(room.id, roomData)
      if (response.success) {
        setRooms(rooms.map(r => 
          r.id === room.id ? response.data : r
        ))
        showSuccess('Item removed from room!')
      } else {
        showError('Failed to remove item from room')
      }
    } catch (error) {
      console.error('Error removing item from room:', error)
      showError('Failed to remove item from room')
    }
  }

  // Box management functions
  const viewBox = (box) => {
    setSelectedBox(box)
    setIsViewBoxModalOpen(true)
  }

  const openEditBox = (box) => {
    setSelectedBox(box)
    setEditBox({
      type: box.type,
      label: box.label,
      room: box.room?.id || '',
      contents: box.contents || '',
      weight: box.weight || '',
      fragile: box.fragile || false,
      packed: box.packed || false,
      destination_room: box.destination_room || ''
    })
    setIsEditBoxModalOpen(true)
  }

  const handleEditBox = async () => {
    if (!editBox.label.trim() || !selectedBox) {
      showError('Box label is required')
      return
    }

    try {
      const boxData = {
        type: editBox.type,
        label: editBox.label.trim(),
        contents: editBox.contents,
        weight: editBox.weight,
        fragile: editBox.fragile,
        packed: editBox.packed,
        destination_room: editBox.destination_room
      }
      
      const response = await enhancedInventoryAPI.updateBox(selectedBox.id, boxData)
      if (response.success) {
        setBoxes(boxes.map(box => 
          box.id === selectedBox.id ? response.data : box
        ))
        setIsEditBoxModalOpen(false)
        setSelectedBox(null)
        setEditBox({
          type: 'medium',
          label: '',
          room: '',
          contents: '',
          weight: '',
          fragile: false,
          packed: false,
          destination_room: ''
        })
        showSuccess('Box updated successfully!')
      } else {
        showError('Failed to update box')
      }
    } catch (error) {
      console.error('Error updating box:', error)
      showError('Failed to update box')
    }
  }

  const confirmDeleteBox = (box) => {
    setDeleteTarget({ type: 'box', id: box.id, name: box.label })
    setIsDeleteConfirmModalOpen(true)
  }

  const deleteBox = async (boxId) => {
    try {
      const response = await enhancedInventoryAPI.deleteBox(boxId)
      if (response.success) {
        setBoxes(boxes.filter(box => box.id !== boxId))
        showSuccess('Box deleted successfully!')
      } else {
        showError('Failed to delete box')
      }
    } catch (error) {
      console.error('Error deleting box:', error)
      showError('Failed to delete box')
    }
  }

  // Heavy Item management functions
  const viewHeavyItem = (item) => {
    setSelectedHeavyItem(item)
    setIsViewHeavyItemModalOpen(true)
  }

  const openEditHeavyItem = (item) => {
    setSelectedHeavyItem(item)
    setEditHeavyItem({
      name: item.name,
      category: item.category,
      weight: item.weight || '',
      dimensions: item.dimensions || '',
      room: item.room?.id || '',
      notes: item.notes || '',
      requiresSpecialHandling: item.requires_special_handling || true
    })
    setIsEditHeavyItemModalOpen(true)
  }

  const handleEditHeavyItem = async () => {
    if (!editHeavyItem.name.trim() || !selectedHeavyItem) {
      showError('Item name is required')
      return
    }

    try {
      const itemData = {
        name: editHeavyItem.name.trim(),
        category: editHeavyItem.category,
        weight: editHeavyItem.weight,
        dimensions: editHeavyItem.dimensions,
        notes: editHeavyItem.notes,
        requires_special_handling: editHeavyItem.requiresSpecialHandling
      }
      
      const response = await enhancedInventoryAPI.updateHeavyItem(selectedHeavyItem.id, itemData)
      if (response.success) {
        setHeavyItems(heavyItems.map(item => 
          item.id === selectedHeavyItem.id ? response.data : item
        ))
        setIsEditHeavyItemModalOpen(false)
        setSelectedHeavyItem(null)
        setEditHeavyItem({
          name: '',
          category: 'piano',
          weight: '',
          dimensions: '',
          room: '',
          notes: '',
          requiresSpecialHandling: true
        })
        showSuccess('Heavy item updated successfully!')
      } else {
        showError('Failed to update heavy item')
      }
    } catch (error) {
      console.error('Error updating heavy item:', error)
      showError('Failed to update heavy item')
    }
  }

  const confirmDeleteHeavyItem = (item) => {
    setDeleteTarget({ type: 'heavyItem', id: item.id, name: item.name })
    setIsDeleteConfirmModalOpen(true)
  }

  const deleteHeavyItem = async (itemId) => {
    try {
      const response = await enhancedInventoryAPI.deleteHeavyItem(itemId)
      if (response.success) {
        setHeavyItems(heavyItems.filter(item => item.id !== itemId))
        showSuccess('Heavy item deleted successfully!')
      } else {
        showError('Failed to delete heavy item')
      }
    } catch (error) {
      console.error('Error deleting heavy item:', error)
      showError('Failed to delete heavy item')
    }
  }

  // High Value Item management functions
  const viewHighValueItem = (item) => {
    setSelectedHighValueItem(item)
    setIsViewHighValueModalOpen(true)
  }

  const openEditHighValueItem = (item) => {
    setSelectedHighValueItem(item)
    setEditHighValueItem({
      name: item.name,
      category: item.category,
      value: item.value || '',
      description: item.description || '',
      room: item.room?.id || '',
      insured: item.insured || false,
      photos: item.photos || []
    })
    setIsEditHighValueModalOpen(true)
  }

  const handleEditHighValueItem = async () => {
    if (!editHighValueItem.name.trim() || !selectedHighValueItem) {
      showError('Item name is required')
      return
    }

    try {
      const itemData = {
        name: editHighValueItem.name.trim(),
        category: editHighValueItem.category,
        value: editHighValueItem.value,
        description: editHighValueItem.description,
        insured: editHighValueItem.insured
      }
      
      const response = await enhancedInventoryAPI.updateHighValueItem(selectedHighValueItem.id, itemData)
      if (response.success) {
        setHighValueItems(highValueItems.map(item => 
          item.id === selectedHighValueItem.id ? response.data : item
        ))
        setIsEditHighValueModalOpen(false)
        setSelectedHighValueItem(null)
        setEditHighValueItem({
          name: '',
          category: 'fine_art',
          value: '',
          description: '',
          room: '',
          insured: false,
          photos: []
        })
        showSuccess('High value item updated successfully!')
      } else {
        showError('Failed to update high value item')
      }
    } catch (error) {
      console.error('Error updating high value item:', error)
      showError('Failed to update high value item')
    }
  }

  const confirmDeleteHighValueItem = (item) => {
    setDeleteTarget({ type: 'highValueItem', id: item.id, name: item.name })
    setIsDeleteConfirmModalOpen(true)
  }

  const deleteHighValueItem = async (itemId) => {
    try {
      const response = await enhancedInventoryAPI.deleteHighValueItem(itemId)
      if (response.success) {
        setHighValueItems(highValueItems.filter(item => item.id !== itemId))
        showSuccess('High value item deleted successfully!')
      } else {
        showError('Failed to delete high value item')
      }
    } catch (error) {
      console.error('Error deleting high value item:', error)
      showError('Failed to delete high value item')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    
    setIsDeleteConfirmModalOpen(false)
    
    switch (deleteTarget.type) {
      case 'box':
        await deleteBox(deleteTarget.id)
        break
      case 'heavyItem':
        await deleteHeavyItem(deleteTarget.id)
        break
      case 'highValueItem':
        await deleteHighValueItem(deleteTarget.id)
        break
      default:
        break
    }
    
    setDeleteTarget(null)
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
    console.log('Export inventory called with format:', format)
    console.log('Current move:', currentMove)
    
    if (!currentMove) {
      showError('No move selected')
      return
    }

    try {
      let response
      let filename
      
      console.log('Starting export for move ID:', currentMove.id)
      
      if (format === 'pdf') {
        console.log('Calling PDF export API...')
        response = await enhancedInventoryAPI.exportInventoryPDF(currentMove.id)
        filename = `inventory_${currentMove.id}_${new Date().toISOString().slice(0, 10)}.pdf`
      } else if (format === 'excel') {
        console.log('Calling Excel export API...')
        response = await enhancedInventoryAPI.exportInventoryExcel(currentMove.id)
        filename = `inventory_${currentMove.id}_${new Date().toISOString().slice(0, 10)}.xlsx`
      }

      console.log('Export API response:', response)
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        console.log('Response is OK, creating blob...')
        const blob = await response.blob()
        console.log('Blob created:', blob)
        console.log('Blob size:', blob.size)
        console.log('Blob type:', blob.type)
        
        if (blob.size === 0) {
          showError('Export file is empty')
          return
        }
        
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        showSuccess(`Inventory exported as ${format.toUpperCase()}`)
      } else {
        console.log('Response not OK, status:', response.status)
        console.log('Response headers:', response.headers)
        
        try {
          const errorText = await response.text()
          console.log('Error response text:', errorText)
          
          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch (e) {
            errorData = { message: errorText }
          }
          
          showError(errorData.message || `Export failed with status ${response.status}`)
        } catch (e) {
          console.error('Error reading response:', e)
          showError(`Export failed with status ${response.status}`)
        }
      }
    } catch (error) {
      console.error('Export error:', error)
      showError('Failed to export inventory')
    }
  }

  const shareInventory = async () => {
    if (!currentMove) {
      showError('No move selected')
      return
    }

    setIsShareModalOpen(true)
  }

  const handleShareSubmit = async () => {
    if (!shareData.email.trim()) {
      showError('Email address is required')
      return
    }

    try {
      const response = await enhancedInventoryAPI.shareInventory({
        move_id: currentMove.id,
        email: shareData.email,
        message: shareData.message
      })

      if (response.success) {
        showSuccess(`Inventory shared successfully with ${shareData.email}`)
        setIsShareModalOpen(false)
        setShareData({ email: '', message: '' })
      } else {
        showError(response.message || 'Failed to share inventory')
      }
    } catch (error) {
      console.error('Share error:', error)
      showError('Failed to share inventory')
    }
  }





  const showQRCode = (item, type) => {
    setSelectedQRItem({ ...item, type })
    setIsQRModalOpen(true)
  }

  // Generate QR code data URL
  const generateQRCodeDataURL = useCallback(async (item) => {
    try {
      // Create comprehensive QR code data based on item type and information
      let qrData = {
        id: item.id,
        type: item.type,
        move_id: currentMove?.id,
        timestamp: new Date().toISOString()
      }

      // Add type-specific details
      if (item.type === 'box') {
        qrData = {
          ...qrData,
          label: item.label,
          box_type: item.type,
          contents: item.contents || 'Not specified',
          weight: item.weight || 'Not specified',
          fragile: item.fragile || false,
          packed: item.packed || false,
          room_name: item.room_name || 'Not assigned',
          destination_room: item.destination_room || 'Not specified'
        }
      } else if (item.type === 'room') {
        // For rooms, include all associated items
        const roomBoxes = boxes.filter(box => box.room_name === item.name)
        const roomHeavyItems = heavyItems.filter(heavyItem => heavyItem.room_name === item.name)
        const roomHighValueItems = highValueItems.filter(hvItem => hvItem.room_name === item.name)
        
        qrData = {
          ...qrData,
          name: item.name,
          room_type: item.type,
          total_items: item.items?.length || 0,
          boxes_count: roomBoxes.length,
          heavy_items_count: roomHeavyItems.length,
          high_value_items_count: roomHighValueItems.length,
          items_list: item.items || [],
          boxes: roomBoxes.map(box => ({
            id: box.id,
            label: box.label,
            contents: box.contents,
            packed: box.packed
          })),
          heavy_items: roomHeavyItems.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            weight: item.weight
          })),
          high_value_items: roomHighValueItems.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            value: item.value
          }))
        }
      } else {
        // For other item types (heavy_item, high_value_item, storage)
        qrData = {
          ...qrData,
          name: item.name || item.label,
          category: item.category,
          room_name: item.room_name || 'Not assigned',
          ...(item.weight && { weight: item.weight }),
          ...(item.value && { value: item.value }),
          ...(item.dimensions && { dimensions: item.dimensions }),
          ...(item.description && { description: item.description }),
          ...(item.location && { location: item.location }),
          ...(item.size && { size: item.size })
        }
      }
      
      // If the item has a qr_code field from backend, use it, otherwise create new data
      const dataToEncode = item.qr_code ? 
        (typeof item.qr_code === 'string' ? item.qr_code : JSON.stringify(qrData)) :
        JSON.stringify(qrData)
      
      const qrCodeDataURL = await QRCode.toDataURL(dataToEncode, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      return qrCodeDataURL
    } catch (error) {
      console.error('Error generating QR code:', error)
      return null
    }
  }, [currentMove, boxes, heavyItems, highValueItems])

  // Memoize tab data to use filtered counts when searching
  const tabData = useMemo(() => [
    { 
      value: 'rooms', 
      label: 'Rooms', 
      icon: Home,
      count: debouncedSearchTerm ? filteredRooms.length : rooms.length,
      description: 'Organize by room'
    },
    { 
      value: 'boxes', 
      label: 'Boxes', 
      icon: Package,
      count: debouncedSearchTerm ? filteredBoxes.length : boxes.length,
      description: 'Track all boxes'
    },
    { 
      value: 'heavy_items', 
      label: 'Heavy Items', 
      icon: Weight,
      count: debouncedSearchTerm ? filteredHeavyItems.length : heavyItems.length,
      description: 'Special handling required'
    },
    { 
      value: 'high_value', 
      label: 'High Value', 
      icon: Diamond,
      count: debouncedSearchTerm ? filteredHighValueItems.length : highValueItems.length,
      description: 'Valuable items'
    },
    { 
      value: 'storage', 
      label: 'Storage', 
      icon: Archive,
      count: storageItems.length, // Storage items don't have filtering yet
      description: 'Items in storage'
    }
  ], [debouncedSearchTerm, filteredRooms.length, rooms.length, filteredBoxes.length, boxes.length, filteredHeavyItems.length, heavyItems.length, filteredHighValueItems.length, highValueItems.length, storageItems.length])

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
                  onChange={handleSearchChange}
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
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="boxes">Boxes</TabsTrigger>
            <TabsTrigger value="heavy_items">Heavy Items</TabsTrigger>
            <TabsTrigger value="high_value">High Value</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

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
              {filteredRooms.map((room, index) => (
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
                        <p className="text-sm text-white/80 capitalize">{(room.type || 'other').replace('_', ' ')}</p>
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
                          <div className="text-2xl font-bold text-blue-600">
                            {boxes.filter(box => box.room_name === room.name).length}
                          </div>
                          <div className="text-xs text-gray-600">Boxes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {heavyItems.filter(item => item.room_name === room.name).length}
                          </div>
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
                      <div className="space-y-2">
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
                          <Button variant="ghost" size="sm" onClick={() => showQRCode(room, 'room')}>
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => viewRoom(room)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditRoom(room)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          onClick={() => openAddItemToRoom(room)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item to Room
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
              {filteredBoxes.map((box, index) => (
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
                        <div><strong>Room:</strong> {box.room_name || 'Not assigned'}</div>
                        <div><strong>Contents:</strong> {box.contents || 'Not specified'}</div>
                        {box.weight && <div><strong>Weight:</strong> {box.weight}</div>}
                        {box.fragile && (
                          <Badge variant="destructive" className="text-xs">
                            Fragile
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button 
                          size="sm" 
                          variant={box.packed ? 'secondary' : 'default'} 
                          className="flex-1"
                          onClick={() => showSuccess('Box packing functionality coming soon!')}
                        >
                          {box.packed ? 'Packed' : 'Mark Packed'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => viewBox(box)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openEditBox(box)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => confirmDeleteBox(box)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredBoxes.length === 0 && (
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
              {filteredHeavyItems.map((item, index) => (
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
                        <div><strong>Room:</strong> {item.room_name || 'Not assigned'}</div>
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => showSuccess('Photo upload functionality coming soon!')}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Photo
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => viewHeavyItem(item)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openEditHeavyItem(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => confirmDeleteHeavyItem(item)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredHeavyItems.length === 0 && (
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
              {filteredHighValueItems.map((item, index) => (
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
                        <div><strong>Room:</strong> {item.room_name || 'Not assigned'}</div>
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => showSuccess('Photos upload functionality coming soon!')}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Photos
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => viewHighValueItem(item)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openEditHighValueItem(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => confirmDeleteHighValueItem(item)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredHighValueItems.length === 0 && (
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
              <Button onClick={() => setIsAddStorageModalOpen(true)} size="lg" className="h-12">
                <Plus className="h-5 w-5 mr-2" />
                Add Storage Item
              </Button>
            </div>

            {storageItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storageItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Archive className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <p className="text-sm text-gray-500 capitalize">
                                {item.category_display || item.category?.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => showQRCode(item, 'storage')}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {item.location && <div><strong>Location:</strong> {item.location}</div>}
                          {item.size && <div><strong>Size:</strong> {item.size}</div>}
                          {item.monthly_cost && <div><strong>Monthly Cost:</strong> {item.monthly_cost}</div>}
                          {item.contents && (
                            <div>
                              <strong>Contents:</strong> 
                              <p className="text-gray-600 mt-1">{item.contents}</p>
                            </div>
                          )}
                          {item.start_date && (
                            <div><strong>Start Date:</strong> {new Date(item.start_date).toLocaleDateString()}</div>
                          )}
                          {item.end_date && (
                            <div><strong>End Date:</strong> {new Date(item.end_date).toLocaleDateString()}</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Archive className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-4">No Storage Items Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Track items going into storage with vendor details, contracts, and QR codes.
                </p>
                <Button onClick={() => setIsAddStorageModalOpen(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Storage Details
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Box Modal */}
      <AddBoxModal
        isOpen={isAddBoxModalOpen}
        onClose={() => setIsAddBoxModalOpen(false)}
        onBoxAdded={handleBoxAdded}
        currentMove={currentMove}
        rooms={rooms}
      />

      {/* Add Heavy Item Modal */}
      <AddHeavyItemModal
        isOpen={isAddHeavyItemModalOpen}
        onClose={() => setIsAddHeavyItemModalOpen(false)}
        onHeavyItemAdded={handleHeavyItemAdded}
        currentMove={currentMove}
        rooms={rooms}
      />

      {/* Add High Value Item Modal */}
      <AddHighValueItemModal
        isOpen={isAddHighValueModalOpen}
        onClose={() => setIsAddHighValueModalOpen(false)}
        onHighValueItemAdded={handleHighValueItemAdded}
        currentMove={currentMove}
        rooms={rooms}
      />

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

              {/* QR Code Display */}
              <QRCodeDisplay item={selectedQRItem} generateQRCodeDataURL={generateQRCodeDataURL} />

              <div className="text-xs text-gray-500 space-y-1">
                <p>Scan to view {selectedQRItem.type === 'room' ? 'room inventory' : 'item details'}</p>
                <p>Move ID: {currentMove?.id}</p>
                {selectedQRItem.type === 'room' ? (
                  <div className="space-y-1">
                    <p>Room: {selectedQRItem.name}</p>
                    <p>Type: {selectedQRItem.type?.replace('_', ' ')}</p>
                    <p>Total Items: {selectedQRItem.items?.length || 0}</p>
                  </div>
                ) : selectedQRItem.type === 'box' ? (
                  <div className="space-y-1">
                    <p>Box: {selectedQRItem.label}</p>
                    <p>Contents: {selectedQRItem.contents || 'Not specified'}</p>
                    <p>Room: {selectedQRItem.room_name || 'Not assigned'}</p>
                    {selectedQRItem.weight && <p>Weight: {selectedQRItem.weight}</p>}
                    {selectedQRItem.fragile && <p className="text-red-600">⚠️ Fragile</p>}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p>Item: {selectedQRItem.name}</p>
                    <p>Room: {selectedQRItem.room_name || 'Not assigned'}</p>
                    {selectedQRItem.category && <p>Category: {selectedQRItem.category}</p>}
                  </div>
                )}
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

      {/* Share Inventory Modal */}
      <Modal 
        isOpen={isShareModalOpen} 
        onClose={() => {
          setIsShareModalOpen(false)
          setShareData({ email: '', message: '' })
        }}
        title="Share Inventory"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsShareModalOpen(false)
                setShareData({ email: '', message: '' })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleShareSubmit}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={shareData.email}
              onChange={(e) => setShareData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              placeholder="Add a personal message..."
              value={shareData.message}
              onChange={(e) => setShareData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>
          
          {currentMove && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Sharing:</h4>
              <p className="text-sm text-gray-600">
                Move from <span className="font-medium">{currentMove.current_location}</span> to <span className="font-medium">{currentMove.destination_location}</span>
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                <span>Rooms: {rooms.length}</span>
                <span>Boxes: {boxes.length}</span>
                <span>Heavy Items: {heavyItems.length}</span>
                <span>High Value: {highValueItems.length}</span>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={isAddRoomModalOpen} 
        onClose={() => setIsAddRoomModalOpen(false)}
        onRoomAdded={handleRoomAdded}
        currentMove={currentMove}
      />

      {/* Add Storage Item Modal */}
      <AddStorageModal
        isOpen={isAddStorageModalOpen}
        onClose={() => setIsAddStorageModalOpen(false)}
        onStorageItemAdded={handleStorageItemAdded}
        currentMove={currentMove}
      />

      {/* View Room Modal */}
      <Modal 
        isOpen={isViewRoomModalOpen} 
        onClose={() => {
          setIsViewRoomModalOpen(false)
          setSelectedRoom(null)
        }}
        title="Room Details"
      >
        {selectedRoom && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name
                </label>
                <p className="text-lg font-semibold text-gray-900">{selectedRoom.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <p className="text-lg text-gray-900 capitalize">{selectedRoom.type?.replace('_', ' ')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedRoom.boxes || 0}</div>
                <div className="text-sm text-blue-700">Boxes</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{selectedRoom.heavy_items || 0}</div>
                <div className="text-sm text-green-700">Heavy Items</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{selectedRoom.total_items_count || 0}</div>
                <div className="text-sm text-purple-700">Total Items</div>
              </div>
            </div>
            
            {selectedRoom.items && selectedRoom.items.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items in Room
                </label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="space-y-2">
                    {selectedRoom.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm text-gray-700">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemFromRoom(selectedRoom, index)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Packing Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedRoom.packed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedRoom.packed ? 'Packed' : 'Not Packed'}
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              Created: {new Date(selectedRoom.created_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Room Modal */}
      <Modal 
        isOpen={isEditRoomModalOpen} 
        onClose={() => {
          setIsEditRoomModalOpen(false)
          setSelectedRoom(null)
          setEditRoom({ name: '', type: 'living_room' })
        }}
        title="Edit Room"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditRoomModalOpen(false)
                setSelectedRoom(null)
                setEditRoom({ name: '', type: 'living_room' })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditRoom} disabled={!editRoom.name.trim()}>
              <Edit className="h-4 w-4 mr-2" />
              Update Room
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Name *
            </label>
            <Input
              type="text"
              placeholder="Enter room name"
              value={editRoom.name}
              onChange={(e) => setEditRoom(prev => ({ ...prev, name: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && editRoom.name.trim()) {
                  handleEditRoom()
                }
              }}
              className="w-full"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Type
            </label>
            <select
              value={editRoom.type}
              onChange={(e) => setEditRoom(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="living_room">Living Room</option>
              <option value="kitchen">Kitchen</option>
              <option value="bedroom">Bedroom</option>
              <option value="bathroom">Bathroom</option>
              <option value="office">Office</option>
              <option value="garage">Garage</option>
              <option value="basement">Basement</option>
              <option value="attic">Attic</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {selectedRoom && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Current Room Info</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Boxes: {selectedRoom.boxes || 0}</p>
                <p>Heavy Items: {selectedRoom.heavy_items || 0}</p>
                <p>Status: {selectedRoom.packed ? 'Packed' : 'Not Packed'}</p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Add Item to Room Modal */}
      <AddItemToRoomModal
        isOpen={isAddItemToRoomModalOpen} 
        onClose={() => {
          setIsAddItemToRoomModalOpen(false)
          setSelectedRoomForItems(null)
        }}
        onItemAdded={handleItemAddedToRoom}
        selectedRoom={selectedRoomForItems}
      />

      {/* View Box Modal */}
      <Modal 
        isOpen={isViewBoxModalOpen} 
        onClose={() => {
          setIsViewBoxModalOpen(false)
          setSelectedBox(null)
        }}
        title="Box Details"
      >
        {selectedBox && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Box Label</label>
                <p className="text-lg font-semibold text-gray-900">{selectedBox.label}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Box Type</label>
                <p className="text-lg text-gray-900 capitalize">{selectedBox.type?.replace('_', ' ')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <p className="text-gray-900">{selectedBox.weight || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <p className="text-gray-900">{selectedBox.room?.name || 'Not assigned'}</p>
              </div>
            </div>
            
            {selectedBox.contents && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contents</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedBox.contents}</p>
              </div>
            )}
            
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Fragile:</span>
                <Badge variant={selectedBox.fragile ? 'destructive' : 'secondary'}>
                  {selectedBox.fragile ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Packed:</span>
                <Badge variant={selectedBox.packed ? 'default' : 'secondary'}>
                  {selectedBox.packed ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
            
            {selectedBox.destination_room && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Room</label>
                <p className="text-gray-900">{selectedBox.destination_room}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Box Modal */}
      <Modal 
        isOpen={isEditBoxModalOpen} 
        onClose={() => {
          setIsEditBoxModalOpen(false)
          setSelectedBox(null)
          setEditBox({
            type: 'medium',
            label: '',
            room: '',
            contents: '',
            weight: '',
            fragile: false,
            packed: false,
            destination_room: ''
          })
        }}
        title="Edit Box"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditBoxModalOpen(false)
                setSelectedBox(null)
                setEditBox({
                  type: 'medium',
                  label: '',
                  room: '',
                  contents: '',
                  weight: '',
                  fragile: false,
                  packed: false,
                  destination_room: ''
                })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditBox} disabled={!editBox.label.trim()}>
              <Edit className="h-4 w-4 mr-2" />
              Update Box
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Box Type</label>
              <select
                value={editBox.type}
                onChange={(e) => setEditBox(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="small">Small Box</option>
                <option value="medium">Medium Box</option>
                <option value="large">Large Box</option>
                <option value="extra_large">Extra Large</option>
                <option value="book_wine">Book/Wine Carton</option>
                <option value="picture_mirror">Picture/Mirror Box</option>
                <option value="port_a_robe">Port-a-Robe Carton</option>
                <option value="tv_carton">TV Carton</option>
                <option value="dish_glassware">Dish/Glassware Box</option>
                <option value="audio_file">Audio/File Box</option>
                <option value="mattress">Mattress Box</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Box Label *</label>
              <Input
                type="text"
                placeholder="Enter box label"
                value={editBox.label}
                onChange={(e) => setEditBox(prev => ({ ...prev, label: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contents</label>
            <textarea
              placeholder="Describe what's in this box..."
              value={editBox.contents}
              onChange={(e) => setEditBox(prev => ({ ...prev, contents: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <Input
                type="text"
                placeholder="e.g., 15kg"
                value={editBox.weight}
                onChange={(e) => setEditBox(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination Room</label>
              <Input
                type="text"
                placeholder="Where will this go?"
                value={editBox.destination_room}
                onChange={(e) => setEditBox(prev => ({ ...prev, destination_room: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editBox.fragile}
                onChange={(e) => setEditBox(prev => ({ ...prev, fragile: e.target.checked }))}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Fragile</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editBox.packed}
                onChange={(e) => setEditBox(prev => ({ ...prev, packed: e.target.checked }))}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Packed</span>
            </label>
          </div>
        </div>
      </Modal>

      {/* View Heavy Item Modal */}
      <Modal 
        isOpen={isViewHeavyItemModalOpen} 
        onClose={() => {
          setIsViewHeavyItemModalOpen(false)
          setSelectedHeavyItem(null)
        }}
        title="Heavy Item Details"
      >
        {selectedHeavyItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <p className="text-lg font-semibold text-gray-900">{selectedHeavyItem.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <p className="text-lg text-gray-900 capitalize">{selectedHeavyItem.category?.replace('_', ' ')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <p className="text-gray-900">{selectedHeavyItem.weight || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                <p className="text-gray-900">{selectedHeavyItem.dimensions || 'Not specified'}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <p className="text-gray-900">{selectedHeavyItem.room?.name || 'Not assigned'}</p>
            </div>
            
            {selectedHeavyItem.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedHeavyItem.notes}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Special Handling Required:</span>
              <Badge variant={selectedHeavyItem.requires_special_handling ? 'destructive' : 'secondary'}>
                {selectedHeavyItem.requires_special_handling ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Heavy Item Modal */}
      <Modal 
        isOpen={isEditHeavyItemModalOpen} 
        onClose={() => {
          setIsEditHeavyItemModalOpen(false)
          setSelectedHeavyItem(null)
          setEditHeavyItem({
            name: '',
            category: 'piano',
            weight: '',
            dimensions: '',
            room: '',
            notes: '',
            requiresSpecialHandling: true
          })
        }}
        title="Edit Heavy Item"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditHeavyItemModalOpen(false)
                setSelectedHeavyItem(null)
                setEditHeavyItem({
                  name: '',
                  category: 'piano',
                  weight: '',
                  dimensions: '',
                  room: '',
                  notes: '',
                  requiresSpecialHandling: true
                })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditHeavyItem} disabled={!editHeavyItem.name.trim()}>
              <Edit className="h-4 w-4 mr-2" />
              Update Item
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
              <Input
                type="text"
                placeholder="Enter item name"
                value={editHeavyItem.name}
                onChange={(e) => setEditHeavyItem(prev => ({ ...prev, name: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={editHeavyItem.category}
                onChange={(e) => setEditHeavyItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="piano">Piano</option>
                <option value="pool_table">Pool Table</option>
                <option value="sculpture">Sculpture</option>
                <option value="aquarium">Aquarium</option>
                <option value="gym_equipment">Gym Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <Input
                type="text"
                placeholder="e.g., 300kg"
                value={editHeavyItem.weight}
                onChange={(e) => setEditHeavyItem(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
              <Input
                type="text"
                placeholder="e.g., 150cm x 60cm x 120cm"
                value={editHeavyItem.dimensions}
                onChange={(e) => setEditHeavyItem(prev => ({ ...prev, dimensions: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              placeholder="Special instructions or notes..."
              value={editHeavyItem.notes}
              onChange={(e) => setEditHeavyItem(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editHeavyItem.requiresSpecialHandling}
                onChange={(e) => setEditHeavyItem(prev => ({ ...prev, requiresSpecialHandling: e.target.checked }))}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Requires Special Handling</span>
            </label>
          </div>
        </div>
      </Modal>

      {/* View High Value Item Modal */}
      <Modal 
        isOpen={isViewHighValueModalOpen} 
        onClose={() => {
          setIsViewHighValueModalOpen(false)
          setSelectedHighValueItem(null)
        }}
        title="High Value Item Details"
      >
        {selectedHighValueItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <p className="text-lg font-semibold text-gray-900">{selectedHighValueItem.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <p className="text-lg text-gray-900 capitalize">{selectedHighValueItem.category?.replace('_', ' ')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <p className="text-gray-900">{selectedHighValueItem.value ? `$${selectedHighValueItem.value}` : 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <p className="text-gray-900">{selectedHighValueItem.room?.name || 'Not assigned'}</p>
              </div>
            </div>
            
            {selectedHighValueItem.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedHighValueItem.description}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Insured:</span>
              <Badge variant={selectedHighValueItem.insured ? 'default' : 'secondary'}>
                {selectedHighValueItem.insured ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit High Value Item Modal */}
      <Modal 
        isOpen={isEditHighValueModalOpen} 
        onClose={() => {
          setIsEditHighValueModalOpen(false)
          setSelectedHighValueItem(null)
          setEditHighValueItem({
            name: '',
            category: 'fine_art',
            value: '',
            description: '',
            room: '',
            insured: false,
            photos: []
          })
        }}
        title="Edit High Value Item"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditHighValueModalOpen(false)
                setSelectedHighValueItem(null)
                setEditHighValueItem({
                  name: '',
                  category: 'fine_art',
                  value: '',
                  description: '',
                  room: '',
                  insured: false,
                  photos: []
                })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditHighValueItem} disabled={!editHighValueItem.name.trim()}>
              <Edit className="h-4 w-4 mr-2" />
              Update Item
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
              <Input
                type="text"
                placeholder="Enter item name"
                value={editHighValueItem.name}
                onChange={(e) => setEditHighValueItem(prev => ({ ...prev, name: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={editHighValueItem.category}
                onChange={(e) => setEditHighValueItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="fine_art">Fine Art</option>
                <option value="antiques">Antiques</option>
                <option value="designer_furniture">Designer Furniture</option>
                <option value="collectibles">Collectibles</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value ($)</label>
            <Input
              type="number"
              placeholder="Enter estimated value"
              value={editHighValueItem.value}
              onChange={(e) => setEditHighValueItem(prev => ({ ...prev, value: e.target.value }))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Describe the item..."
              value={editHighValueItem.description}
              onChange={(e) => setEditHighValueItem(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editHighValueItem.insured}
                onChange={(e) => setEditHighValueItem(prev => ({ ...prev, insured: e.target.checked }))}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Insured</span>
            </label>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteConfirmModalOpen} 
        onClose={() => {
          setIsDeleteConfirmModalOpen(false)
          setDeleteTarget(null)
        }}
        title="Confirm Delete"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteConfirmModalOpen(false)
                setDeleteTarget(null)
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      >
        {deleteTarget && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Delete {deleteTarget.type === 'box' ? 'Box' : deleteTarget.type === 'heavyItem' ? 'Heavy Item' : 'High Value Item'}
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{deleteTarget.name}"? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}