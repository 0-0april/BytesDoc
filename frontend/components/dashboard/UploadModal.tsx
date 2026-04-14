'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { mockCategories, mockEvents, mockAdministrations } from '@/lib/mockData'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (data: {
    title: string
    category: string
    event: string
    administration: string
  }) => void
  allowedCategories?: string[]
}

export default function UploadModal({ 
  isOpen, 
  onClose, 
  onUpload,
  allowedCategories = mockCategories 
}: UploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: allowedCategories[0] || 'Proposals',
    event: 'Freshmen Orientation',
    administration: '2024-2025',
  })

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }
    onUpload(formData)
    setFormData({
      title: '',
      category: allowedCategories[0] || 'Proposals',
      event: 'Freshmen Orientation',
      administration: '2024-2025',
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Document">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Enter document title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {allowedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Event
          </label>
          <select
            value={formData.event}
            onChange={(e) => setFormData({ ...formData, event: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {mockEvents.map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Administration
          </label>
          <select
            value={formData.administration}
            onChange={(e) => setFormData({ ...formData, administration: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {mockAdministrations.map((adm) => (
              <option key={adm} value={adm}>
                {adm}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            File
          </label>
          <input
            type="file"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            accept=".pdf,.docx"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit}>Upload</Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
