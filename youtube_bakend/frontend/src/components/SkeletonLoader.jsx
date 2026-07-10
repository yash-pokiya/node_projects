import React from 'react';

export const VideoSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-4 flex space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="flex items-end space-x-4 px-6 -mt-12">
        <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-darker"></div>
        <div className="flex-1 space-y-2 pb-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
};
