import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Bell, User, LogOut, Settings, Info } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items for non-authenticated users
  const publicNavigation = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Partners", href: "/partners" },
  ];

  // Full navigation for authenticated users
  const fullNavigation = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/#how-it-works" },
    // { name: "My Move", href: "/my-move" },
    { name: "My Moves", href: "/user-moves" },
    { name: "Timeline", href: "/timeline" },
    { name: "Partners", href: "/partners" },
    { name: "My Bookings", href: "/my-bookings" },
    // { name: "Book Time", href: "/book-time" },
  ];

  // Use appropriate navigation based on authentication status
  const navigation = isAuthenticated ? fullNavigation : publicNavigation;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    navigate("/");
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };

  const handleHowItWorksClick = () => {
    setIsMenuOpen(false); // Close mobile menu if open
    
    if (location.pathname !== "/") {
      // If not on home page, navigate to home first
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById("how-it-works");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // If already on home page, just scroll
      const element = document.getElementById("how-it-works");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };


  // Get user display name
  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user?.first_name) {
      return user.first_name;
    } else if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(
        0
      )}`.toUpperCase();
    } else if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

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
            {navigation.map((item) => {
              if (item.name === "How It Works") {
                return (
                  <button
                    key={item.name}
                    onClick={handleHowItWorksClick}
                    className={`text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-primary-600"
                        : "text-gray-700 hover:text-primary-600"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-primary-600"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Navigation links for authenticated users */}
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Avatar>
                        {user?.avatar ? (
                          <AvatarImage
                            src={user.avatar}
                            alt={getUserDisplayName()}
                          />
                        ) : (
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="hidden md:inline text-sm font-medium">
                        {getUserDisplayName()}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={navigateToProfile}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 hover:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Login/Signup buttons for non-authenticated users */}
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-primary-600 font-medium"
                  >
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
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-4 py-4 space-y-3">
            {navigation.map((item) => {
              if (item.name === "How It Works") {
                return (
                  <button
                    key={item.name}
                    onClick={handleHowItWorksClick}
                    className={`block py-2 text-sm font-medium transition-colors w-full text-left ${
                      isActive(item.href)
                        ? "text-primary-600"
                        : "text-gray-700 hover:text-primary-600"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-primary-600"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile auth buttons */}
            <div className="pt-3 space-y-3 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      {user?.avatar ? (
                        <AvatarImage
                          src={user.avatar}
                          alt={getUserDisplayName()}
                        />
                      ) : (
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-500">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={navigateToProfile}
                    variant="ghost"
                    className="w-full text-gray-700 hover:text-primary-600 justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>

                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full text-gray-700 hover:text-red-600 justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button
                      variant="ghost"
                      className="w-full text-gray-700 hover:text-primary-600"
                    >
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
  );
}
