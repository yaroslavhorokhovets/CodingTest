'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetTime: Date;
  onTimeReached?: () => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetTime, 
  onTimeReached,
  className = '' 
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetTime).getTime();
      const difference = target - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds, total: difference });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, total: 0 });
        onTimeReached?.();
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onTimeReached]);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const isTimeUp = timeLeft.total <= 0;

  return (
    <div className={`countdown-timer ${className}`}>
      <div className="flex items-center space-x-1">
        {isTimeUp ? (
          <div className="text-sm font-bold text-success-500">NOW!</div>
        ) : (
          <div className="flex items-center space-x-1">
            {timeLeft.hours > 0 && (
              <>
                <span className="text-sm font-mono font-bold text-white">
                  {formatTime(timeLeft.hours)}
                </span>
                <span className="text-xs text-gray-300">h</span>
              </>
            )}
            <span className="text-sm font-mono font-bold text-white">
              {formatTime(timeLeft.minutes)}
            </span>
            <span className="text-xs text-gray-300">m</span>
            <span className="text-sm font-mono font-bold text-white">
              {formatTime(timeLeft.seconds)}
            </span>
            <span className="text-xs text-gray-300">s</span>
          </div>
        )}
      </div>
    </div>
  );
};