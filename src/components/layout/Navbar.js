import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Bell } from 'lucide-react'
import { Button } from '../ui/button'
import { mockUser } from '../../data/mockData'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()

  // Check if user is on an authenticated route (simple check for demo)
  useEffect(() => {
    const authRoutes = ['/move', '/timeline', '/checklist', '/tips', '/inventory', '/services']
    setIsAuthenticated(authRoutes.some(route => location.pathname.startsWith(route)))
  }, [location.pathname])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'My Move', href: '/move' },
    { name: 'Timeline', href: '/timeline' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'Services', href: '/services' },
    { name: 'Tips', href: '/tips' }
  ]



  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div 
  className="flex items-center gap-3 cursor-pointer"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {/* Icon */}

    <img src="/images/logo.png" alt="logo" className="w-25 h-12" />
  

  {/* Text with italic A */}
  

  {/* Badge */}
  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
    AU
  </span>
</motion.div>

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full relative hover:bg-primary-50 transition-colors"
                >
                  <Bell className="h-5 w-5 text-gray-600 hover:text-primary-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </Button>

                {/* User Profile */}
                <Link to="/profile">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary-50 transition-colors group">
                    <div className="w-9 h-9 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-white">
                        {mockUser.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-primary-700">
                        {mockUser.name.split(' ')[0]}
                      </span>
                      <span className="text-xs text-gray-500">
                        View Profile
                      </span>
                    </div>
                  </div>
                </Link>
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
                  <Button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6">
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
          className="md:hidden bg-white border-b border-gray-200 shadow-lg"
        >
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile User/Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  {/* Mobile User Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-white">
                        {mockUser.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{mockUser.name}</p>
                      <p className="text-xs text-gray-500">{mockUser.email}</p>
                    </div>
                  </Link>
                  
                  {/* Mobile Notifications */}
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors mt-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center relative">
                      <Bell className="h-5 w-5 text-primary-600" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-800">Notifications</span>
                      <span className="text-xs text-red-500">3 new updates</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile Login/Signup */}
                  <div className="space-y-2">
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
