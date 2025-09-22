import React, { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Modal } from '../../components/ui/modal'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { enhancedInventoryAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'

// Box types moved to component level to prevent recreation
const boxTypes = [
  {
    type: 'small',
    name: 'Small Box (30x30x30cm)',
    description: 'Perfect for books, documents, small electronics',
    weight: 'Up to 15kg'
  },
  {
    type: 'medium',
    name: 'Medium Box (40x40x40cm)', 
    description: 'Great for clothes, kitchen items, toys',
    weight: 'Up to 20kg'
  },
  {
    type: 'large',
    name: 'Large Box (50x50x50cm)',
    description: 'Ideal for bedding, pillows, lightweight bulky items',
    weight: 'Up to 25kg'
  },
  {
    type: 'wardrobe',
    name: 'Wardrobe Box',
    description: 'Hanging clothes, suits, dresses',
    weight: 'Up to 30kg'
  }
]

const AddBoxModal = React.memo(({ 
  isOpen, 
  onClose, 
  onBoxAdded, 
  currentMove,
  rooms = []
}) => {
  const [newBox, setNewBox] = useState({
    type: 'medium',
    label: '',
    room: '',
    contents: '',
    weight: '',
    fragile: false,
    packed: false
  })

  // Optimized change handler
  const handleBoxChange = useCallback((field, value) => {
    setNewBox(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAddBox = useCallback(async () => {
    if (!newBox.label.trim() || !currentMove) {
      showError('Box label is required')
      return
    }

    try {
      const boxData = {
        move_id: currentMove.id,
        type: newBox.type,
        label: newBox.label.trim(),
        room_id: newBox.room || null,
        contents: newBox.contents.trim(),
        weight: newBox.weight.trim(),
        fragile: newBox.fragile,
        packed: newBox.packed
      }
      
      const response = await enhancedInventoryAPI.createBox(boxData)
      if (response.success) {
        onBoxAdded(response.data)
        setNewBox({
          type: 'medium',
          label: '',
          room: '',
          contents: '',
          weight: '',
          fragile: false,
          packed: false
        })
        onClose()
        showSuccess('Box added successfully!')
      } else {
        showError('Failed to add box')
      }
    } catch (error) {
      console.error('Error adding box:', error)
      showError('Failed to add box')
    }
  }, [newBox, currentMove, onBoxAdded, onClose])

  const handleClose = useCallback(() => {
    setNewBox({
      type: 'medium',
      label: '',
      room: '',
      contents: '',
      weight: '',
      fragile: false,
      packed: false
    })
    onClose()
  }, [onClose])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Box</h3>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <div className="text-emerald-600 mt-0.5">💡</div>
            <div>
              <p className="text-sm font-medium text-emerald-900">Pro Tips:</p>
              <ul className="text-xs text-emerald-700 mt-1 space-y-1">
                <li>• Use descriptive labels like "Kitchen Dishes & Utensils"</li>
                <li>• Assign to rooms for better organization</li>
                <li>• List detailed contents for easier unpacking</li>
                <li>• Each box gets a unique QR code automatically</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Box Type</label>
              <select
                value={newBox.type}
                onChange={(e) => handleBoxChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {boxTypes.map(type => (
                  <option key={type.type} value={type.type}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Box Label * 
                <span className="text-xs text-gray-500 ml-1">(Be descriptive for easy identification)</span>
              </label>
              <Input
                value={newBox.label}
                onChange={(e) => handleBoxChange('label', e.target.value)}
                placeholder="e.g., Kitchen Dishes & Utensils, Living Room Books"
                className={!newBox.label.trim() ? "border-red-300" : ""}
                autoFocus
              />
              {!newBox.label.trim() && (
                <p className="text-xs text-red-500 mt-1">💡 Box label is required - make it descriptive!</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Assignment
                <span className="text-xs text-gray-500 ml-1">(Helps with organization)</span>
              </label>
              <select
                value={newBox.room}
                onChange={(e) => handleBoxChange('room', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
              {rooms.length === 0 && (
                <p className="text-xs text-blue-500 mt-1">💡 Add rooms first for better organization!</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (optional)</label>
              <Input
                value={newBox.weight}
                onChange={(e) => handleBoxChange('weight', e.target.value)}
                placeholder="e.g., 15kg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contents 
              <span className="text-xs text-gray-500 ml-1">(Detailed list for easier identification)</span>
            </label>
            <textarea
              value={newBox.contents}
              onChange={(e) => handleBoxChange('contents', e.target.value)}
              placeholder="e.g., Plates, bowls, cups, kitchen utensils, coffee maker, dish towels..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">💡 Be specific - it helps during unpacking!</p>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newBox.fragile}
                onChange={(e) => handleBoxChange('fragile', e.target.checked)}
                className="mr-2"
              />
              Fragile Items
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newBox.packed}
                onChange={(e) => handleBoxChange('packed', e.target.checked)}
                className="mr-2"
              />
              Already Packed
            </label>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-xs font-mono">QR</span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">QR Code Generation</p>
              <p className="text-xs text-blue-700">Each box gets a unique QR code for easy tracking</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddBox} disabled={!newBox.label.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Box
          </Button>
        </div>
      </div>
    </Modal>
  )
})

AddBoxModal.displayName = 'AddBoxModal'

export default AddBoxModal


