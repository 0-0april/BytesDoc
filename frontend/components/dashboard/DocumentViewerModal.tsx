'use client'

import { Document } from '@/types'
import Modal from '@/components/ui/Modal'

interface DocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  document: Document | null
}

export default function DocumentViewerModal({ isOpen, onClose, document }: DocumentViewerModalProps) {
  if (!document) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Document">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{document.title}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
          <p className="text-gray-900 dark:text-white">{document.category}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Event</p>
          <p className="text-gray-900 dark:text-white">{document.event}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Administration</p>
          <p className="text-gray-900 dark:text-white">{document.administration}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Upload Date</p>
          <p className="text-gray-900 dark:text-white">
            {new Date(document.uploadDate).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
          <p className="text-gray-900 dark:text-white">
            {document.is_archived ? 'Archived (Locked)' : 'Active'}
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">PDF Preview Placeholder</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{document.filePath}</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
            In production, this would display the actual PDF document
          </p>
        </div>
      </div>
    </Modal>
  )
}
