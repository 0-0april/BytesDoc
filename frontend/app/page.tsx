import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#e5e5e5] flex items-center justify-center p-6 md:p-12">
      
      <div className="absolute inset-0 z-0">
        <Image 
          src="/graybg1.jpg" 
          alt="Background" 
          fill 
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute -left-32 md:-left-60 lg:-left-80 top-1/2 -translate-y-1/2 w-[80%] md:w-[65%] lg:w-[55%] opacity-90 pointer-events-none select-none z-10">
        <Image 
          src="/byteslogo1.png" 
          alt="BYTES Logo Decorative" 
          width={1200} 
          height={1200} 
          className="w-full h-auto drop-shadow-2xl"
          priority 
        />
      </div>

      <div className="relative z-20 w-full max-w-7xl flex flex-col items-end">
        
        <div className="text-right mb-12 lg:mb-20 pr-4 md:pr-12">
          <h1 className="text-6xl md:text-8xl font-bold text-[#1a1a1a] tracking-tight uppercase leading-none">
            BytesDoc
          </h1>
          <p className="text-lg md:text-2xl text-[#333] mt-4 font-medium max-w-md ml-auto">
            Centralized Document Management for <br />
            <span className="font-bold">BYTES Student Council</span>
          </p>
          
          <Link
            href="/login"
            className="inline-block mt-8 bg-[#333131] text-white px-14 py-4 rounded-xl text-lg font-bold hover:bg-black transition-all shadow-xl active:scale-95"
          >
            LOGIN
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          
          <div className="bg-[#1e1e1ec2] backdrop-blur-md p-10 rounded-2xl text-white border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold border-b border-gray-500 pb-2 mb-4">Secure Upload</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Upload and manage documents securely with role-based access control.
            </p>
          </div>

          <div className="bg-[#1e1e1ec2] backdrop-blur-md p-10 rounded-2xl text-white border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold border-b border-gray-500 pb-2 mb-4">Role-based Access</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Different access levels for Chief Minister, Secretary, Finance, and Members.
            </p>
          </div>

          <div className="bg-[#1e1e1ec2] backdrop-blur-md p-10 rounded-2xl text-white border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold border-b border-gray-500 pb-2 mb-4">Document Archiving</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Archive past administration documents for long-term storage and retrieval.
            </p>
          </div>

          <div className="bg-[#1e1e1ec2] backdrop-blur-md p-10 rounded-2xl text-white border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold border-b border-gray-500 pb-2 mb-4">Activity Logs</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Track all document activities with comprehensive audit logs and alerts.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  )
}