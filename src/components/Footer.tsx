import React from 'react'
import { Oswald } from 'next/font/google'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

interface FooterProps {
  companyName?: string
  year?: string
  version?: string
}

const Footer: React.FC<FooterProps> = ({
  companyName = 'Payla.id',
  year = "2025",
  version = '1.0.0'
}) => {
  return (
    <footer
      className={`backdrop-blur-xl px-8 py-2 ${oswald.className} md:block hidden border-t-0 shadow-lg`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(0,123,255,0.08) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.3)',
      }}
    >
      <div className="flex items-center justify-end max-w-full">
        {/* Right Section - Copyright & Version */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 text-sm font-semibold">© {companyName} {year}</span>
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#007BFF] to-[#A0F000] rounded-full shadow-sm"></div>
          <span className="text-gray-500 text-sm font-medium">Version {version}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer