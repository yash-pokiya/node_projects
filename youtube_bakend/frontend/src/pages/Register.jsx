import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', email: '', fullname: '', password: ''
  });
  const [files, setFiles] = useState({ avatar: null, coverImage: null });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (files.avatar) data.append('avatar', files.avatar);
      if (files.coverImage) data.append('coverImage', files.coverImage);

      await register(data);
      navigate('/login');
    } catch (error) {
      // Error is handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 card p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input type="text" required className="input-field" 
            value={formData.fullname} onChange={(e) => setFormData({...formData, fullname: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input type="text" required className="input-field" 
            value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" required className="input-field" 
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" required className="input-field" 
            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Avatar (Required)</label>
          <input type="file" required accept="image/*" className="input-field" 
            onChange={(e) => setFiles({...files, avatar: e.target.files[0]})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image (Optional)</label>
          <input type="file" accept="image/*" className="input-field" 
            onChange={(e) => setFiles({...files, coverImage: e.target.files[0]})} />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full flex justify-center items-center">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default Register;
