import { create } from 'zustand'
import { Document } from '@/types'
import { mockDocuments } from '@/lib/mockData'

interface DocumentState {
  documents: Document[]
  addDocument: (doc: Omit<Document, 'id'>) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  archiveDocument: (id: string) => void
  bulkArchiveByAdministration: (administration: string) => void
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: mockDocuments,
  addDocument: (doc) =>
    set((state) => ({
      documents: [
        ...state.documents,
        { ...doc, id: `${Date.now()}` },
      ],
    })),
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
  archiveDocument: (id) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, is_archived: true, is_locked: true } : doc
      ),
    })),
  bulkArchiveByAdministration: (administration) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.administration === administration
          ? { ...doc, is_archived: true, is_locked: true }
          : doc
      ),
    })),
}))
