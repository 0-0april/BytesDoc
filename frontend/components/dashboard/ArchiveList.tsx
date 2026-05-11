'use client'

import { Document } from '@/types'
import { Download, Eye, Archive } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'

interface ArchiveListProps {
  documents: Document[]
  onView: (doc: Document) => void
  onDownload: (doc: Document) => void
  canBulkArchive?: boolean
  onBulkArchive?: (administration: string) => void
  uploaderNames?: Record<string, string>
}

export default function ArchiveList({
  documents,
  onView,
  onDownload,
  canBulkArchive = false,
  onBulkArchive,
  uploaderNames = {},
}: ArchiveListProps) {
  const administrations = [...new Set(documents.map(d => d.administration))]
  
  return (
    <div className="space-y-4">
      {canBulkArchive && onBulkArchive && administrations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Bulk Archive by Administration
          </h3>
          <div className="flex flex-wrap gap-2">
            {administrations.map((admin) => (
              <Button
                key={admin}
                onClick={() => onBulkArchive(admin)}
                variant="secondary"
              >
                Archive All from {admin}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        {documents.length === 0 ? (
          <EmptyState
            icon={Archive}
            title="No archived documents"
            description="Documents that get archived will appear here."
          />
        ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Title</th>
              <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Category</th>
              <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Administration</th>
              <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Uploaded By</th>
              <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Archived Date</th>
              <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-3 px-4 text-gray-900 dark:text-white">{doc.title}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{doc.category}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{doc.administration}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {uploaderNames[doc.uploadedBy] || 'Unknown'}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDownload(doc)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Download"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => onView(doc)}
                      className="text-green-500 hover:text-green-700"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  )
}
