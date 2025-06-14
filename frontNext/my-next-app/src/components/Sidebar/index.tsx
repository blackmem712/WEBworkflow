'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 text-white">
        <span className="font-bold">Menu</span>
        <button
          aria-label="Toggle sidebar"
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity md:hidden
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transform transition-transform
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static md:w-64`}
      >
        <div className="p-4 bg-gray-800 text-white text-lg font-bold">
          Sua Logo
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/" className="block px-2 py-2 rounded hover:bg-gray-100 transition">
            Home
          </Link>
          <Link href="/about" className="block px-2 py-2 rounded hover:bg-gray-100 transition">
            Sobre
          </Link>
          <Link href="/services" className="block px-2 py-2 rounded hover:bg-gray-100 transition">
            Serviços
          </Link>
          <Link href="/contact" className="block px-2 py-2 rounded hover:bg-gray-100 transition">
            Contato
          </Link>
        </nav>
      </aside>
    </>
  )
}
