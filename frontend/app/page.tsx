import Link from 'next/link'
import { FileText, Lock, Archive, Activity } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            BytesDoc
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Centralized Document Management for BYTES Student Council
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
            <FileText className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Upload</h3>
            <p className="text-gray-200">Upload and manage documents securely with role-based access control</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
            <Lock className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
            <p className="text-gray-200">Different access levels for Chief Minister, Secretary, Finance, and Members</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
            <Archive className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Document Archiving</h3>
            <p className="text-gray-200">Archive past administration documents for long-term storage</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
            <Activity className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Activity Logs</h3>
            <p className="text-gray-200">Track all document activities with comprehensive audit logs</p>
          </div>
        </div>

        <footer className="mt-24 text-center text-white">
          <p className="mb-2">Contact: info@bytes.com</p>
          <p>&copy; 2024 BYTES Student Council. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
