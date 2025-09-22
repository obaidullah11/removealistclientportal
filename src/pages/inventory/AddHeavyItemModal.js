import React, { useState, useCallback } from 'react'
import { Modal } from '../../components/ui/modal'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { enhancedInventoryAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'

// Heavy item categories moved to component level
const heavyItemCategories = [
  { value: 'piano', label: 'Piano' },
  { value: 'safe', label: 'Safe' },
  { value: 'pool_table', label: 'Pool Table' },
  { value: 'gym_equipment', label: 'Gym Equipment' },
  { value: 'large_appliance', label: 'Large Appliance' },
  { value: 'furniture', label: 'Heavy Furniture' },
  { value: 'machinery', label: 'Machinery' },
  { value: 'sculpture', label: 'Large sculptures/statues' },
  { value: 'aquarium', label: 'Aquariums' },
  { value: 'other', label: 'Other Heavy Item' }
]

const AddHeavyItemModal = React.memo(({ 
  isOpen, 
  onClose, 
  onHeavyItemAdded, 
  currentMove,
  rooms = []
}) => {
  const [newHeavyItem, setNewHeavyItem] = useState({
    name: '',
    category: 'piano',
    weight: '',
    dimensions: '',
    room: '',
    notes: '',
    requiresSpecialHandling: true
  })

  // Optimized change handler
  const handleHeavyItemChange = useCallback((field, value) => {
    setNewHeavyItem(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAddHeavyItem = useCallback(async () => {
    if (!newHeavyItem.name.trim() || !currentMove) {
      showError('Item name is required')
      return
    }

    try {
      const heavyItemData = {
        move_id: currentMove.id,
        name: newHeavyItem.name.trim(),
        category: newHeavyItem.category,
        weight: newHeavyItem.weight.trim(),
        dimensions: newHeavyItem.dimensions.trim(),
        room_id: newHeavyItem.room || null,
        notes: newHeavyItem.notes.trim(),
        requires_special_handling: newHeavyItem.requiresSpecialHandling
      }
      
      const response = await enhancedInventoryAPI.createHeavyItem(heavyItemData)
      if (response.success) {
        onHeavyItemAdded(response.data)
        setNewHeavyItem({
          name: '',
          category: 'piano',
          weight: '',
          dimensions: '',
          room: '',
          notes: '',
          requiresSpecialHandling: true
        })
        onClose()
        showSuccess('Heavy item added successfully!')
      } else {
        showError('Failed to add heavy item')
      }
    } catch (error) {
      console.error('Error adding heavy item:', error)
      showError('Failed to add heavy item')
    }
  }, [newHeavyItem, currentMove, onHeavyItemAdded, onClose])

  const handleClose = useCallback(() => {
    setNewHeavyItem({
      name: '',
      category: 'piano',
      weight: '',
      dimensions: '',
      room: '',
      notes: '',
      requiresSpecialHandling: true
    })
    onClose()
  }, [onClose])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Add Heavy Item</h3>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <div className="text-orange-600 mt-0.5">⚠️</div>
            <div>
              <p className="text-sm font-medium text-orange-900">Heavy Item Tips:</p>
              <ul className="text-xs text-orange-700 mt-1 space-y-1">
                <li>• Include brand/model for accurate identification</li>
                <li>• Specify exact dimensions for moving logistics</li>
                <li>• Note special handling requirements</li>
                <li>• Consider professional moving services</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name * 
                <span className="text-xs text-gray-500 ml-1">(Be specific about the item)</span>
              </label>
              <Input
                value={newHeavyItem.name}
                onChange={(e) => handleHeavyItemChange('name', e.target.value)}
                placeholder="e.g., Steinway Grand Piano, Pool Table 8ft, Marble Sculpture"
                className={!newHeavyItem.name.trim() ? "border-red-300" : ""}
                autoFocus
              />
              {!newHeavyItem.name.trim() && (
                <p className="text-xs text-red-500 mt-1">💡 Item name is required for identification</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newHeavyItem.category}
                onChange={(e) => handleHeavyItemChange('category', e.target.value)}
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
                onChange={(e) => handleHeavyItemChange('weight', e.target.value)}
                placeholder="e.g., 300kg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
              <Input
                value={newHeavyItem.dimensions}
                onChange={(e) => handleHeavyItemChange('dimensions', e.target.value)}
                placeholder="e.g., 150x60x110cm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
            <select
              value={newHeavyItem.room}
              onChange={(e) => handleHeavyItemChange('room', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Room</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={newHeavyItem.notes}
              onChange={(e) => handleHeavyItemChange('notes', e.target.value)}
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
                onChange={(e) => handleHeavyItemChange('requiresSpecialHandling', e.target.checked)}
                className="mr-2"
              />
              Requires Special Handling
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddHeavyItem} disabled={!newHeavyItem.name.trim()}>
            Add Heavy Item
          </Button>
        </div>
      </div>
    </Modal>
  )
})

AddHeavyItemModal.displayName = 'AddHeavyItemModal'

export default AddHeavyItemModal
