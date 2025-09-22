import React, { useState, useCallback } from 'react'
import { Plus, Package } from 'lucide-react'
import { Modal } from '../../components/ui/modal'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { enhancedInventoryAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'

const AddItemToRoomModal = React.memo(({ 
  isOpen, 
  onClose, 
  onItemAdded, 
  selectedRoom
}) => {
  const [newItemName, setNewItemName] = useState('')

  // Optimized handlers
  const handleItemNameChange = useCallback((e) => {
    setNewItemName(e.target.value)
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && newItemName.trim()) {
      handleAddItemToRoom()
    }
  }, [newItemName])

  const handleAddItemToRoom = useCallback(async () => {
    if (!newItemName.trim() || !selectedRoom) {
      showError('Item name is required')
      return
    }

    try {
      // Get current items and add the new one
      const currentItems = selectedRoom.items || []
      const updatedItems = [...currentItems, newItemName.trim()]
      
      console.log('Adding item to room:', {
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        currentItems,
        newItem: newItemName.trim(),
        updatedItems
      })
      
      const roomData = {
        items: updatedItems
      }
      
      console.log('Sending room update data:', roomData)
      
      const response = await enhancedInventoryAPI.updateRoom(selectedRoom.id, roomData)
      
      console.log('Room update response:', response)
      
      if (response.success) {
        console.log('Room updated successfully, calling onItemAdded with:', response.data)
        onItemAdded(response.data)
        setNewItemName('')
        onClose()
        showSuccess(`Item "${newItemName.trim()}" added to ${selectedRoom.name}!`)
      } else {
        console.error('Room update failed:', response)
        showError('Failed to add item to room')
      }
    } catch (error) {
      console.error('Error adding item to room:', error)
      showError('Failed to add item to room')
    }
  }, [newItemName, selectedRoom, onItemAdded, onClose])

  const handleClose = useCallback(() => {
    setNewItemName('')
    onClose()
  }, [onClose])

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={`Add Item to ${selectedRoom?.name || 'Room'}`}
      footer={
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button onClick={handleAddItemToRoom} disabled={!newItemName.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Name *
          </label>
          <Input
            type="text"
            placeholder="Enter item name (e.g., Sofa, TV, Coffee Table)"
            value={newItemName}
            onChange={handleItemNameChange}
            onKeyDown={handleKeyDown}
            className="w-full"
            autoFocus
          />
        </div>
        
        {selectedRoom && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Adding to: {selectedRoom.name}</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>Room Type: {selectedRoom.type?.replace('_', ' ')}</p>
              <p>Current Items: {selectedRoom.items?.length || 0}</p>
              {selectedRoom.items && selectedRoom.items.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Existing Items:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRoom.items.slice(0, 5).map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {item}
                      </span>
                    ))}
                    {selectedRoom.items.length > 5 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        +{selectedRoom.items.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Package className="h-5 w-5 text-gray-400 mt-0.5" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-800">Quick Add Tips</h4>
              <p className="text-sm text-gray-600 mt-1">
                Add individual items to track what's in each room. This helps with organization and ensures nothing gets forgotten during the move.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
})

AddItemToRoomModal.displayName = 'AddItemToRoomModal'

export default AddItemToRoomModal
