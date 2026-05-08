'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { mockCategories, mockEvents, mockAdministrations } from '@/lib/mockData'
import { toast } from '@/lib/stores/toastStore'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (
    data: { title: string; category: string; event: string; administration: string },
    file?: File | null
  ) => void | Promise<void>
  allowedCategories?: string[]
}

export default function UploadModal({
  isOpen,
  onClose,
  onUpload,
  allowedCategories = mockCategories,
}: UploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: allowedCategories[0] || 'Proposals',
    event: 'Freshmen Orientation',
    administration: '2024-2025',
  })
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }
    setIsUploading(true)
    try {
      await onUpload(formData, file)
      setFormData({
        title: '',
        category: allowedCategories[0] || 'Proposals',
        event: 'Freshmen Orientation',
        administration: '2024-2025',
      })
      setFile(null)
    } finally {
      setIsUploading(false)
    }
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
            onChange={e => setFormData({ ...formData, title: e.target.value })}
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
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {allowedCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Event
          </label>
          <select
            value={formData.event}
            onChange={e => setFormData({ ...formData, event: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {mockEvents.map(evt => (
              <option key={evt} value={evt}>{evt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Administration
          </label>
          <select
            value={formData.administration}
            onChange={e => setFormData({ ...formData, administration: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {mockAdministrations.map(adm => (
              <option key={adm} value={adm}>{adm}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            File <span className="text-gray-400 font-normal">(PDF or DOCX, max 10 MB)</span>
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          {file && (
            <p className="text-xs text-gray-500 mt-1">{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} isLoading={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button onClick={onClose} variant="secondary" disabled={isUploading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}