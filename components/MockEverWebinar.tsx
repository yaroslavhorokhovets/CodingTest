'use client';

import React, { useEffect, useState } from 'react';

interface MockEverWebinarProps {
  slotId: string;
  onAttendeeCountChange?: (count: number) => void;
  onCtaClick?: (ctaName: string) => void;
}

export const MockEverWebinar: React.FC<MockEverWebinarProps> = ({
  slotId,
  onAttendeeCountChange,
  onCtaClick,
}) => {
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(90 * 60); // 90 minutes in seconds

  useEffect(() => {
    // Simulate attendees joining over time
    const attendeeInterval = setInterval(() => {
      const newCount = Math.min(attendeeCount + Math.floor(Math.random() * 3), 150);
      setAttendeeCount(newCount);
      onAttendeeCountChange?.(newCount);
    }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds

    // Simulate video playback
    const playInterval = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(prev => Math.min(prev + 1, duration));
      }
    }, 1000);

    return () => {
      clearInterval(attendeeInterval);
      clearInterval(playInterval);
    };
  }, [attendeeCount, isPlaying, duration, onAttendeeCountChange]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleCtaClick = (ctaName: string) => {
    onCtaClick?.(ctaName);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="mock-everwebinar bg-gray-900 text-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm font-medium">LIVE - {attendeeCount} watching</span>
        </div>
        <div className="text-sm text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Video Area */}
      <div className="relative bg-black aspect-video flex items-center justify-center">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
          >
            ▶ Play Webinar
          </button>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-4">🎥</div>
            <div className="text-xl font-semibold mb-2">EverWebinar Session Playing</div>
            <div className="text-gray-400">Slot: {slotId}</div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div 
            className="h-full bg-red-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chat Simulation */}
      <div className="bg-gray-800 p-4">
        <div className="text-sm text-gray-300 mb-2">Live Chat ({attendeeCount} participants)</div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {attendeeCount > 0 && (
            <>
              <div className="text-sm">
                <span className="text-green-400">Sarah M.:</span> Great presentation so far!
              </div>
              <div className="text-sm">
                <span className="text-blue-400">Mike R.:</span> When will the Q&A start?
              </div>
              <div className="text-sm">
                <span className="text-yellow-400">Lisa K.:</span> Very informative, thank you!
              </div>
              {attendeeCount > 10 && (
                <div className="text-sm">
                  <span className="text-purple-400">John D.:</span> Excited for the live portion!
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="bg-gray-700 p-4">
        <div className="text-sm text-gray-300 mb-3">Special Offers</div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleCtaClick('Get Started Now')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Get Started Now - 50% Off
          </button>
          <button
            onClick={() => handleCtaClick('Download Guide')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Download Free Guide
          </button>
        </div>
      </div>

      {/* Attendee Counter */}
      <div className="bg-gray-600 p-3 text-center">
        <div className="text-sm text-gray-300">
          👥 {attendeeCount} people are watching this webinar
        </div>
      </div>
    </div>
  );
};