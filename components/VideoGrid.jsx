'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import VideoPlayer from './VideoPlayer';
import toast from 'react-hot-toast';

export default function VideoGrid() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get('/api/videos/popular');
      setVideos(res.data);
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading videos...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {videos.map(video => (
        <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
          <VideoPlayer 
            videoUrl={`/api/videos/stream/${video.videoId}`}
            thumbnail={video.thumbnail}
            title={video.title}
          />
          <div className="p-4">
            <h3 className="font-bold text-lg truncate">{video.title}</h3>
            <p className="text-gray-500 text-sm">{video.views} views</p>
            <div className="flex gap-2 mt-2">
              {video.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
