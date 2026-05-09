'use client';

import { useRef, useEffect, useState } from 'react';

export default function HeroVideoBackground() {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const crossfadeDuration = 1.6; // duration in seconds for crossfade

  useEffect(() => {
    // 60% speed
    if (videoRef1.current) videoRef1.current.playbackRate = 0.6;
    if (videoRef2.current) videoRef2.current.playbackRate = 0.6;
  }, []);

  const handleTimeUpdate = (vidNum: 1 | 2) => (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video.duration) return;

    // Calculate time left in the video
    // Note: this is in "video seconds", not real-time seconds.
    const timeLeft = video.duration - video.currentTime;

    if (timeLeft <= crossfadeDuration && activeVideo === vidNum) {
      if (vidNum === 1 && videoRef2.current) {
        videoRef2.current.currentTime = 0;
        videoRef2.current.play().catch(() => {});
        setActiveVideo(2);
      } else if (vidNum === 2 && videoRef1.current) {
        videoRef1.current.currentTime = 0;
        videoRef1.current.play().catch(() => {});
        setActiveVideo(1);
      }
    }
  };

  return (
    <>
      <video
        ref={videoRef1}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate(1)}
        className="absolute inset-0 w-full h-full object-cover z-0 mix-blend-screen transition-opacity ease-in-out"
        style={{
          transitionDuration: `${crossfadeDuration}s`,
          opacity: activeVideo === 1 ? 0.8 : 0
        }}
        src="/hero-bg.mp4"
      />
      <video
        ref={videoRef2}
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate(2)}
        className="absolute inset-0 w-full h-full object-cover z-0 mix-blend-screen transition-opacity ease-in-out"
        style={{
          transitionDuration: `${crossfadeDuration}s`,
          opacity: activeVideo === 2 ? 0.8 : 0
        }}
        src="/hero-bg.mp4"
      />
      <div className="overlay-solid" />
      <div className="overlay-gradient" />
    </>
  );
}
