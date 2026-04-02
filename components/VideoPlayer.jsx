'use client';
import ReactPlayer from 'react-player';
import { useState } from 'react';

export default function VideoPlayer({ videoUrl, thumbnail, title }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        url={videoUrl}
        playing={playing}
        muted={muted}
        width="100%"
        height="100%"
        controls={true}
        light={thumbnail}
        onStart={() => setPlaying(true)}
        config={{
          file: {
            attributes: {
              poster: thumbnail,
              crossOrigin: 'anonymous'
            }
          }
        }}
      />
      <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded">
        {title}
      </div>
    </div>
  );
}
