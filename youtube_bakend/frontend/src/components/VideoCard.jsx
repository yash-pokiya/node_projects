import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="card group hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        )}
      </div>
      <div className="p-4 flex space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            {/* Fallback avatar if owner details aren't populated */}
            <span className="text-gray-500 font-bold">{video.title?.charAt(0)}</span>
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
            {video.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {video.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
