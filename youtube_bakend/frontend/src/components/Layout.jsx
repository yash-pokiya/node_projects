import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light dark:bg-darker">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <p>&copy; {new Date().getFullYear()} VidStream. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
