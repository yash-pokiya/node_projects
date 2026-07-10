import React, { useState } from 'react';
import { useVideo } from '../context/VideoContext';
import { useNavigate } from 'react-router-dom';

const UploadVideo = () => {
  const { uploadVideo } = useVideo();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', isPublished: true });
  const [files, setFiles] = useState({ videoFile: null, thumbnail: null });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('isPublished', formData.isPublished);
      if (files.videoFile) data.append('videoFile', files.videoFile);
      if (files.thumbnail) data.append('thumbnail', files.thumbnail);

      await uploadVideo(data);
      navigate('/');
    } catch (error) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto card p-8">
      <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" required className="input-field"
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea required className="input-field min-h-[100px]"
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Video File</label>
            <input type="file" required accept="video/*" className="input-field"
              onChange={(e) => setFiles({...files, videoFile: e.target.files[0]})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <input type="file" required accept="image/*" className="input-field"
              onChange={(e) => setFiles({...files, thumbnail: e.target.files[0]})} />
          </div>
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="isPublished" className="w-4 h-4 text-primary"
            checked={formData.isPublished} onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} />
          <label htmlFor="isPublished" className="ml-2 text-sm">Publish immediately</label>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full flex justify-center items-center">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : null}
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;
