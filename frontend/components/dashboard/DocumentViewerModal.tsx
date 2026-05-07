'use client'

import { useEffect, useState } from 'react'
import { Document } from '@/types'
import Modal from '@/components/ui/Modal'
import { apiDownloadDocument } from '@/lib/api'

interface DocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  document: Document | null
}

export default function DocumentViewerModal({ isOpen, onClose, document: doc }: DocumentViewerModalProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !doc) {
      setUrl(null)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    apiDownloadDocument(doc.id)
      .then((res) => { if (!cancelled) setUrl(res.url) })
      .catch((e: any) => { if (!cancelled) setError(e?.message ?? 'Failed to load preview') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [isOpen, doc?.id])

  if (!doc) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Document">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{doc.title}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
          <p className="text-gray-900 dark:text-white">{doc.category}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Event</p>
          <p className="text-gray-900 dark:text-white">{doc.event}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Administration</p>
          <p className="text-gray-900 dark:text-white">{doc.administration}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Upload Date</p>
          <p className="text-gray-900 dark:text-white">
            {new Date(doc.uploadDate).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
          <p className="text-gray-900 dark:text-white">
            {doc.is_archived ? 'Archived (Locked)' : 'Active'}
          </p>
        </div>

        {loading && (
          <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg text-center text-gray-500">
            Loading preview...
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-4 rounded-lg text-red-700 dark:text-red-300 text-sm">
            Failed to load preview: {error}
          </div>
        )}

        {url && !loading && doc.fileType === 'pdf' && (
          <iframe
            src={url}
            title={doc.title}
            className="w-full h-[600px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white"
          />
        )}

        {url && !loading && doc.fileType !== 'pdf' && (
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              In-browser preview isn't supported for {doc.fileType.toUpperCase()} files.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
            >
              Open {doc.fileType.toUpperCase()} in new tab
            </a>
          </div>
        )}
      </div>
    </Modal>
  )
}
