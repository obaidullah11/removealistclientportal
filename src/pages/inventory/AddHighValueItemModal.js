import React, { useState, useCallback } from 'react'
import { Modal } from '../../components/ui/modal'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { enhancedInventoryAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'

// High value categories moved to component level
const highValueCategories = [
  { value: 'fine_art', label: 'Fine art/paintings' },
  { value: 'antiques', label: 'Antiques' },
  { value: 'designer_furniture', label: 'Designer furniture' },
  { value: 'collectibles', label: 'Collectibles (e.g., rare books, coins)' }
]

const AddHighValueItemModal = React.memo(({ 
  isOpen, 
  onClose, 
  onHighValueItemAdded, 
  currentMove,
  rooms = []
}) => {
  const [newHighValueItem, setNewHighValueItem] = useState({
    name: '',
    category: 'fine_art',
    value: '',
    description: '',
    room: '',
    insured: false
  })

  // Optimized change handler
  const handleHighValueItemChange = useCallback((field, value) => {
    setNewHighValueItem(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAddHighValueItem = useCallback(async () => {
    if (!newHighValueItem.name.trim() || !currentMove) {
      showError('Item name is required')
      return
    }

    try {
      const highValueItemData = {
        move_id: currentMove.id,
        name: newHighValueItem.name.trim(),
        category: newHighValueItem.category,
        value: newHighValueItem.value ? parseFloat(newHighValueItem.value) : null,
        description: newHighValueItem.description.trim(),
        room_id: newHighValueItem.room || null,
        insured: newHighValueItem.insured
      }
      
      const response = await enhancedInventoryAPI.createHighValueItem(highValueItemData)
      if (response.success) {
        onHighValueItemAdded(response.data)
        setNewHighValueItem({
          name: '',
          category: 'fine_art',
          value: '',
          description: '',
          room: '',
          insured: false
        })
        onClose()
        showSuccess('High value item added successfully!')
      } else {
        showError('Failed to add high value item')
      }
    } catch (error) {
      console.error('Error adding high value item:', error)
      showError('Failed to add high value item')
    }
  }, [newHighValueItem, currentMove, onHighValueItemAdded, onClose])

  const handleClose = useCallback(() => {
    setNewHighValueItem({
      name: '',
      category: 'fine_art',
      value: '',
      description: '',
      room: '',
      insured: false
    })
    onClose()
  }, [onClose])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Add High Value Item</h3>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <div className="text-purple-600 mt-0.5">💎</div>
            <div>
              <p className="text-sm font-medium text-purple-900">High Value Tips:</p>
              <ul className="text-xs text-purple-700 mt-1 space-y-1">
                <li>• Include artist/brand names for authenticity</li>
                <li>• Document estimated value for insurance</li>
                <li>• Take photos before packing (coming soon)</li>
                <li>• Consider specialized moving insurance</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name * 
                <span className="text-xs text-gray-500 ml-1">(Include artist/brand if known)</span>
              </label>
              <Input
                value={newHighValueItem.name}
                onChange={(e) => handleHighValueItemChange('name', e.target.value)}
                placeholder="e.g., Monet Water Lilies Print, Rolex Submariner, Ming Dynasty Vase"
                className={!newHighValueItem.name.trim() ? "border-red-300" : ""}
                autoFocus
              />
              {!newHighValueItem.name.trim() && (
                <p className="text-xs text-red-500 mt-1">💡 Item name is required for insurance purposes</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newHighValueItem.category}
                onChange={(e) => handleHighValueItemChange('category', e.target.value)}
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
                onChange={(e) => handleHighValueItemChange('value', e.target.value)}
                placeholder="e.g., 5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
              <select
                value={newHighValueItem.room}
                onChange={(e) => handleHighValueItemChange('room', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newHighValueItem.description}
              onChange={(e) => handleHighValueItemChange('description', e.target.value)}
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
                onChange={(e) => handleHighValueItemChange('insured', e.target.checked)}
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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddHighValueItem} disabled={!newHighValueItem.name.trim()}>
            Add High Value Item
          </Button>
        </div>
      </div>
    </Modal>
  )
})

AddHighValueItemModal.displayName = 'AddHighValueItemModal'

export default AddHighValueItemModal
