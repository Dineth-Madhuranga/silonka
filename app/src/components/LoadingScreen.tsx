import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // When the video ends, fade out and notify parent
    const handleEnded = () => {
      gsap.to(container, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => onComplete(),
      });
    };

    video.addEventListener('ended', handleEnded);

    // Fallback: if video fails to load or play, complete after 5s
    const fallbackTimer = setTimeout(() => {
      gsap.to(container, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => onComplete(),
      });
    }, 5000);

    // Attempt to play
    video.play().catch(() => {
      // Autoplay blocked — complete immediately
      onComplete();
    });

    return () => {
      video.removeEventListener('ended', handleEnded);
      clearTimeout(fallbackTimer);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-charcoal overflow-hidden"
    >
      <video
        ref={videoRef}
        src="/loading_screen.mp4"
        className="w-full h-full object-cover"
        muted
        playsInline
        autoPlay
        preload="auto"
      />
    </div>
  );
}
