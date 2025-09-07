'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useWebinarStore } from '@/lib/store';
import { MockEverWebinar } from './MockEverWebinar';
import { config } from '@/lib/config';

interface EverWebinarWrapperProps {
  slotId: string;
  everwebinarUrl: string;
  onAttendeeCountChange?: (count: number) => void;
}

export const EverWebinarWrapper: React.FC<EverWebinarWrapperProps> = ({
  slotId,
  everwebinarUrl,
  onAttendeeCountChange,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { addLog } = useWebinarStore();

  const handleLoad = () => {
    setIsLoaded(true);
    addLog({
      slotId,
      timestamp: new Date().toISOString(),
      event: 'attendee_joined',
      details: 'EverWebinar session loaded',
      attendeeCount: 1,
    });
  };

  const handleError = () => {
    setHasError(true);
    addLog({
      slotId,
      timestamp: new Date().toISOString(),
      event: 'error',
      details: 'Failed to load EverWebinar session, using mock',
    });
  };

  const handleCtaClick = (ctaName: string) => {
    addLog({
      slotId,
      timestamp: new Date().toISOString(),
      event: 'cta_clicked',
      details: `CTA clicked: ${ctaName}`,
    });
  };

  // Check if URL is a demo/placeholder URL
  const isDemoUrl = everwebinarUrl.includes('demo.everwebinar.com') || 
                   everwebinarUrl.includes('localhost') ||
                   everwebinarUrl.includes('example.com');

  // Use mock component for demo URLs, when there's an error, or when mock mode is enabled
  if (config.app.useMockEverWebinar || isDemoUrl || hasError) {
    return (
      <div className="webinar-container">
        <MockEverWebinar
          slotId={slotId}
          onAttendeeCountChange={onAttendeeCountChange}
          onCtaClick={handleCtaClick}
        />
      </div>
    );
  }

  useEffect(() => {

    const handleMessage = (event: MessageEvent) => {
      // Handle messages from EverWebinar iframe
      if (event.origin !== new URL(everwebinarUrl).origin) {
        return;
      }

      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'attendee_count') {
          onAttendeeCountChange?.(data.count);
        } else if (data.type === 'cta_clicked') {
          addLog({
            slotId,
            timestamp: new Date().toISOString(),
            event: 'admin_action',
            details: `CTA clicked: ${data.ctaName}`,
          });
        }
      } catch (error) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [slotId, everwebinarUrl, onAttendeeCountChange, addLog]);

  return (
    <div className="webinar-container">
      <iframe
        ref={iframeRef}
        src={everwebinarUrl}
        className="webinar-iframe"
        title="EverWebinar Session"
        allow="autoplay; fullscreen; microphone; camera"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        onLoad={handleLoad}
        onError={handleError}
      />
      {!isLoaded && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading EverWebinar session...</p>
          </div>
        </div>
      )}
    </div>
  );
};