'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useWebinarStore } from '@/lib/store';

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
  const { addLog } = useWebinarStore();

  useEffect(() => {
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