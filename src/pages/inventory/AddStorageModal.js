import React, { useState, useCallback } from 'react'
import { Modal } from '../../components/ui/modal'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { enhancedInventoryAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'

// Storage categories moved to component level
const storageCategories = [
  { value: 'self_storage', label: 'Self Storage' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'climate_controlled', label: 'Climate Controlled' },
  { value: 'document_storage', label: 'Document Storage' },
  { value: 'other', label: 'Other' }
]


const AddStorageModal = React.memo(({ 
  isOpen, 
  onClose, 
  onStorageItemAdded, 
  currentMove
}) => {
  const [newStorageItem, setNewStorageItem] = useState({
    name: '',
    category: 'self_storage',
    size: '',
    monthly_cost: '',
    location: '',
    access_details: '',
    contents: '',
    start_date: '',
    end_date: ''
  })

  // Optimized change handler
  const handleStorageItemChange = useCallback((field, value) => {
    setNewStorageItem(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAddStorageItem = useCallback(async () => {
    if (!newStorageItem.name.trim() || !currentMove) {
      showError('Storage item name is required')
      return
    }

    try {
      const itemData = {
        move_id: currentMove.id,
        name: newStorageItem.name.trim(),
        category: newStorageItem.category,
        size: newStorageItem.size.trim(),
        monthly_cost: newStorageItem.monthly_cost.trim(),
        location: newStorageItem.location.trim(),
        access_details: newStorageItem.access_details.trim(),
        contents: newStorageItem.contents.trim(),
        start_date: newStorageItem.start_date,
        end_date: newStorageItem.end_date
      }

      const response = await enhancedInventoryAPI.createStorageItem(itemData)
      if (response.success) {
        onStorageItemAdded(response.data)
        setNewStorageItem({
          name: '',
          category: 'self_storage',
          size: '',
          monthly_cost: '',
          location: '',
          access_details: '',
          contents: '',
          start_date: '',
          end_date: ''
        })
        onClose()
        showSuccess('Storage item added successfully!')
      } else {
        showError('Failed to add storage item')
      }
    } catch (error) {
      console.error('Error adding storage item:', error)
      showError('Failed to add storage item')
    }
  }, [newStorageItem, currentMove, onStorageItemAdded, onClose])

  const handleClose = useCallback(() => {
    setNewStorageItem({
      name: '',
      category: 'self_storage',
      size: '',
      monthly_cost: '',
      location: '',
      access_details: '',
      contents: '',
      start_date: '',
      end_date: ''
    })
    onClose()
  }, [onClose])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Add Storage Item</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <div className="text-blue-600 mt-0.5">🗄️</div>
            <div>
              <p className="text-sm font-medium text-blue-900">Storage Tips:</p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• Include storage facility details and access information</li>
                <li>• Note monthly costs for budgeting purposes</li>
                <li>• Set start/end dates for contract tracking</li>
                <li>• List contents for easy retrieval later</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Item Name * 
                <span className="text-xs text-gray-500 ml-1">(What you're storing)</span>
              </label>
              <Input
                type="text"
                placeholder="e.g., Seasonal Decorations, Business Documents, Furniture Set"
                value={newStorageItem.name}
                onChange={(e) => handleStorageItemChange('name', e.target.value)}
                className={!newStorageItem.name.trim() ? "border-red-300 w-full" : "w-full"}
                autoFocus
              />
              {!newStorageItem.name.trim() && (
                <p className="text-xs text-red-500 mt-1">💡 Storage item name is required</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newStorageItem.category}
                onChange={(e) => handleStorageItemChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {storageCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
                <span className="text-xs text-gray-500 ml-1">(Storage unit dimensions)</span>
              </label>
              <Input
                type="text"
                placeholder="e.g., 10x10 ft"
                value={newStorageItem.size}
                onChange={(e) => handleStorageItemChange('size', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Cost
                <span className="text-xs text-gray-500 ml-1">(For budgeting)</span>
              </label>
              <Input
                type="text"
                placeholder="e.g., $150, $89.99, Free (family storage)"
                value={newStorageItem.monthly_cost}
                onChange={(e) => handleStorageItemChange('monthly_cost', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">💡 Include any additional fees (insurance, access fees)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <Input
              type="text"
              placeholder="Storage facility address"
              value={newStorageItem.location}
              onChange={(e) => handleStorageItemChange('location', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Details</label>
            <textarea
              placeholder="Access hours, gate codes, contact info..."
              value={newStorageItem.access_details}
              onChange={(e) => handleStorageItemChange('access_details', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contents</label>
            <textarea
              placeholder="What items are being stored..."
              value={newStorageItem.contents}
              onChange={(e) => handleStorageItemChange('contents', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input
                type="date"
                value={newStorageItem.start_date}
                onChange={(e) => handleStorageItemChange('start_date', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input
                type="date"
                value={newStorageItem.end_date}
                onChange={(e) => handleStorageItemChange('end_date', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddStorageItem} disabled={!newStorageItem.name.trim()}>
            Add Storage Item
          </Button>
        </div>
      </div>
    </Modal>
  )
})

AddStorageModal.displayName = 'AddStorageModal'

export default AddStorageModal
