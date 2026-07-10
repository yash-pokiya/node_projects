import React from 'react';
import { useVideo } from '../context/VideoContext';
import VideoCard from '../components/VideoCard';
import { VideoSkeleton } from '../components/SkeletonLoader';
import { Film } from 'lucide-react';

const Home = () => {
  const { videos, loading } = useVideo();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Film className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">No videos found</h2>
        <p className="text-gray-500 mt-2">Be the first to upload a video!</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Recommended</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;
