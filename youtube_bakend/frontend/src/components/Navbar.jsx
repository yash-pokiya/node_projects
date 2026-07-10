import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlaySquare, LogOut, User as UserIcon, Upload, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <PlaySquare className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">VidStream</span>
          </Link>

          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input-field pl-10 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white"
                placeholder="Search videos..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/upload" className="btn bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Link>
                <div className="relative group cursor-pointer">
                  <Link to="/profile">
                    <img
                      src={user.avatar || 'https://via.placeholder.com/40'}
                      alt={user.username}
                      className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                    />
                  </Link>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 font-medium hover:text-primary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
