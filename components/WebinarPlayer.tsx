'use client';

import React, { useEffect, useState } from 'react';
import { EverWebinarWrapper } from './EverWebinarWrapper';
import { ZoomWrapper } from './ZoomWrapper';
import { CountdownTimer } from './CountdownTimer';
import { useWebinarStore } from '@/lib/store';
import { WebinarSlot, ZoomConfig } from '@/types/webinar';

interface WebinarPlayerProps {
  slot: WebinarSlot;
}

export const WebinarPlayer: React.FC<WebinarPlayerProps> = ({ slot }) => {
  const [currentMode, setCurrentMode] = useState<'replay' | 'live'>(slot.currentMode);
  const [attendeeCount, setAttendeeCount] = useState(slot.attendeeCount);
  const { 
    isGoLiveEnabled, 
    activeSlotId, 
    updateSlot, 
    addLog, 
    setTransitionState,
    transitionState 
  } = useWebinarStore();

  // Check if this slot is active
  const isActiveSlot = activeSlotId === slot.id;

  useEffect(() => {
    // Handle scheduled transition
    const checkScheduledTransition = () => {
      const now = new Date();
      const switchTime = new Date(slot.scheduledSwitchTime);
      
      if (now >= switchTime && currentMode === 'replay' && !isGoLiveEnabled) {
        triggerTransition('live', 'Scheduled transition to live session');
      }
    };

    // Check every minute
    const interval = setInterval(checkScheduledTransition, 60000);
    
    // Initial check
    checkScheduledTransition();

    return () => clearInterval(interval);
  }, [slot.scheduledSwitchTime, currentMode, isGoLiveEnabled]);

  useEffect(() => {
    // Handle admin Go Live toggle
    if (isGoLiveEnabled && isActiveSlot && currentMode === 'replay') {
      triggerTransition('live', 'Admin triggered Go Live');
    } else if (!isGoLiveEnabled && isActiveSlot && currentMode === 'live') {
      triggerTransition('replay', 'Admin disabled Go Live');
    }
  }, [isGoLiveEnabled, isActiveSlot, currentMode]);

  const triggerTransition = (targetMode: 'replay' | 'live', reason: string) => {
    setTransitionState({
      isTransitioning: true,
      transitionMessage: `Switching to ${targetMode} mode...`,
      targetMode,
    });

    addLog({
      slotId: slot.id,
      timestamp: new Date().toISOString(),
      event: 'mode_switched',
      details: reason,
    });

    // Simulate transition delay
    setTimeout(() => {
      setCurrentMode(targetMode);
      updateSlot({
        id: slot.id,
        currentMode: targetMode,
        lastSwitchTime: new Date().toISOString(),
      });
      
      setTransitionState({
        isTransitioning: false,
        transitionMessage: '',
        targetMode: 'replay',
      });
    }, 2000);
  };

  const handleAttendeeCountChange = (count: number) => {
    setAttendeeCount(count);
    updateSlot({
      id: slot.id,
      attendeeCount: count,
    });
  };

  const zoomConfig: ZoomConfig = {
    meetingNumber: extractMeetingNumber(slot.zoomUrl),
    userName: 'Webinar Attendee',
    userEmail: 'attendee@webinar.com',
    passWord: '', // This should be configured per slot
    leaveUrl: window.location.href,
    role: 0, // Attendee role
  };

  return (
    <div className="relative w-full h-screen">
      {/* Transition Overlay */}
      {transitionState.isTransitioning && (
        <div className="transition-overlay">
          <div className="transition-message">
            {transitionState.transitionMessage}
          </div>
        </div>
      )}

      {/* Webinar Content */}
      {currentMode === 'replay' ? (
        <EverWebinarWrapper
          slotId={slot.id}
          everwebinarUrl={slot.everwebinarUrl}
          onAttendeeCountChange={handleAttendeeCountChange}
        />
      ) : (
        <ZoomWrapper
          slotId={slot.id}
          zoomConfig={zoomConfig}
          onAttendeeCountChange={handleAttendeeCountChange}
        />
      )}

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentMode === 'live' ? 'bg-success-500' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium">
            {currentMode === 'live' ? 'LIVE' : 'REPLAY'}
          </span>
          <span className="text-xs text-gray-300">
            ({attendeeCount} attendees)
          </span>
        </div>
      </div>

      {/* Countdown Timer - Only show when in replay mode */}
      {currentMode === 'replay' && (
        <div className="absolute top-4 right-4 mt-16 bg-black bg-opacity-75 text-white px-4 py-3 rounded-lg border border-gray-600">
          <div className="text-center">
            <div className="text-xs text-gray-300 mb-1">Live Session Starts In:</div>
            <CountdownTimer 
              targetTime={new Date(slot.scheduledSwitchTime)}
              onTimeReached={() => {
                // This will be handled by the scheduled transition logic
                console.log('Countdown reached - switching to live mode');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to extract meeting number from Zoom URL
function extractMeetingNumber(zoomUrl: string): string {
  const match = zoomUrl.match(/\/j\/(\d+)/);
  return match ? match[1] : '';
}