import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileSkeleton } from '../components/SkeletonLoader';

const Profile = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <ProfileSkeleton />;
  if (!user) return <p className="text-center mt-10">Please login to view profile.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
          {user.coverimage ? (
            <img src={user.coverimage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-primary"></div>
          )}
        </div>
        
        {/* Avatar & Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12 space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
            <img 
              src={user.avatar || 'https://via.placeholder.com/150'} 
              alt={user.username} 
              className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-dark"
            />
            <div className="text-center sm:text-left mb-2">
              <h1 className="text-2xl font-bold">{user.fullname}</h1>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Profile Details</h3>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {/* Additional profile editing forms could go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
