import React, { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Modal } from '../../components/ui/modal'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { enhancedInventoryAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'

const AddRoomModal = React.memo(({ 
  isOpen, 
  onClose, 
  onRoomAdded, 
  currentMove 
}) => {
  const [newRoom, setNewRoom] = useState({
    name: '',
    type: 'living_room'
  })

  // Optimized handlers
  const handleNameChange = useCallback((e) => {
    setNewRoom(prev => ({ ...prev, name: e.target.value }))
  }, [])

  const handleTypeChange = useCallback((e) => {
    setNewRoom(prev => ({ ...prev, type: e.target.value }))
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && newRoom.name.trim()) {
      handleAddRoom()
    }
  }, [newRoom.name])

  const handleAddRoom = useCallback(async () => {
    if (!newRoom.name.trim() || !currentMove) {
      showError('Room name is required')
      return
    }

    try {
      const roomData = {
        move_id: currentMove.id,
        name: newRoom.name.trim(),
        type: newRoom.type
      }
      
      const response = await enhancedInventoryAPI.createRoom(roomData)
      if (response.success) {
        onRoomAdded(response.data)
        setNewRoom({ name: '', type: 'living_room' })
        onClose()
        showSuccess('Room added successfully!')
      } else {
        showError('Failed to add room')
      }
    } catch (error) {
      console.error('Error adding room:', error)
      showError('Failed to add room')
    }
  }, [newRoom.name, newRoom.type, currentMove, onRoomAdded, onClose])

  const handleClose = useCallback(() => {
    setNewRoom({ name: '', type: 'living_room' })
    onClose()
  }, [onClose])

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Add New Room"
      footer={
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button onClick={handleAddRoom} disabled={!newRoom.name.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
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
            placeholder="Enter room name (e.g., Master Bedroom, Kitchen)"
            value={newRoom.name}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            className="w-full"
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Type
          </label>
          <select
            value={newRoom.type}
            onChange={handleTypeChange}
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
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Choose descriptive room names to make organizing easier. 
                You can add items to rooms later and track packing progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
})

AddRoomModal.displayName = 'AddRoomModal'

export default AddRoomModal

