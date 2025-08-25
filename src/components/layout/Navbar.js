import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Bell } from 'lucide-react'
import { Button } from '../ui/button'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  // Navigation items for non-authenticated users
  const publicNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Tips', href: '/tips' }
  ]

  // Full navigation for authenticated users
  const fullNavigation = [
    { name: 'Home', href: '/' },
    { name: 'My Move', href: '/move' },
    { name: 'Timeline', href: '/timeline' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'Services', href: '/services' },
    { name: 'Tips', href: '/tips' }
  ]

  // Use appropriate navigation based on authentication status
  const navigation = isAuthenticated ? fullNavigation : publicNavigation

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    // Redirect to home page after logout
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="logo" className="w-25 h-12" />
             
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Navigation links for authenticated users */}
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button onClick={handleLogout} variant="ghost" className="text-gray-700 hover:text-red-600">
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Login/Signup buttons for non-authenticated users */}
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-primary-600 font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-sustainableGreen hover:bg-sustainableGreen text-white font-medium px-6">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-4 py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile auth buttons */}
            <div className="pt-3 space-y-3 border-t border-gray-200">
              {isAuthenticated ? (
                <Button 
                  onClick={handleLogout} 
                  variant="ghost" 
                  className="w-full text-gray-700 hover:text-red-600"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full text-gray-700 hover:text-primary-600">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" className="block">
                    <Button className="w-full bg-sustainableGreen hover:bg-sustainableGreen text-white">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
