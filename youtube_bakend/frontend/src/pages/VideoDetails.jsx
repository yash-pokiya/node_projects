import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideo } from '../context/VideoContext';
import { VideoSkeleton } from '../components/SkeletonLoader';

const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { videos, loading } = useVideo();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (!loading && videos.length > 0) {
      const found = videos.find(v => v._id === id);
      if (found) setVideo(found);
      else navigate('/'); // Video not found, go to home
    }
  }, [id, videos, loading, navigate]);

  if (loading || !video) return <VideoSkeleton />;

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Video Player Area */}
      <div className="flex-1">
        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
          <video 
            src={video.videoFile} 
            poster={video.thumbnail} 
            controls 
            autoPlay
            className="w-full h-full object-contain"
          ></video>
        </div>
        
        <div className="mt-4 card p-6">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          <div className="flex items-center space-x-4 mt-4 py-4 border-y border-gray-200 dark:border-gray-800">
             <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
               {video.title?.charAt(0)}
             </div>
             <div>
               <h3 className="font-semibold">Channel Name</h3>
               <p className="text-sm text-gray-500">1.2M subscribers</p>
             </div>
             <button className="ml-auto btn btn-primary">Subscribe</button>
          </div>
          <div className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {video.description}
          </div>
        </div>
      </div>
      
      {/* Sidebar for related videos could go here */}
      <div className="w-full lg:w-80 space-y-4 hidden lg:block">
        <h3 className="font-semibold text-lg">Up Next</h3>
        {videos.filter(v => v._id !== id).slice(0, 5).map(v => (
          <div key={v._id} onClick={() => navigate(`/video/${v._id}`)} className="flex gap-2 cursor-pointer group">
            <div className="w-40 aspect-video rounded overflow-hidden flex-shrink-0">
              <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold line-clamp-2">{v.title}</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{v.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetails;
