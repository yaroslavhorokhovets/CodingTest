'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useWebinarStore } from '@/lib/store';
import { ZoomConfig } from '@/types/webinar';

interface ZoomWrapperProps {
  slotId: string;
  zoomConfig: ZoomConfig;
  onAttendeeCountChange?: (count: number) => void;
}

// Declare global ZoomMtg interface for SDK v5.2.42037.1112
declare global {
  interface Window {
    ZoomMtg: {
      setZoomJSLib: (path: string, dir: string) => void;
      preLoadWasm: () => void;
      prepareWebSDK: () => void;
      prepareJssdk: () => void;
      init: (config: any) => void;
      join: (config: any) => void;
      startMeeting: (config: any) => void;
      leaveMeeting: (config: any) => void;
      getAttendeeslist: () => any[];
      muteAll: () => void;
      mute: (userId: string) => void;
      unmute: (userId: string) => void;
      muteAllAudio: () => void;
      muteAllVideo: () => void;
      getCurrentUser: () => any;
      getMeetingInfo: () => any;
    };
  }
}

export const ZoomWrapper: React.FC<ZoomWrapperProps> = ({
  slotId,
  zoomConfig,
  onAttendeeCountChange,
}) => {
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendeeCount, setAttendeeCount] = useState(1);
  const { addLog } = useWebinarStore();

  useEffect(() => {
    const initializeZoom = async () => {
      try {
        // Check if ZoomMtg is already loaded
        if (window.ZoomMtg) {
          initializeZoomSDK();
          return;
        }

        // Load Zoom Web SDK script dynamically
        const script = document.createElement('script');
        script.src = 'https://source.zoom.us/5.2.42037.1112/lib/av/zoom-meeting-5.2.42037.1112.min.js';
        script.async = true;
        
        script.onload = () => {
          initializeZoomSDK();
        };

        script.onerror = () => {
          setError('Failed to load Zoom SDK script. Please check your internet connection.');
        };

        document.head.appendChild(script);

        return () => {
          // Cleanup script
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };

      } catch (error) {
        setError(`Failed to initialize Zoom: ${error}`);
      }
    };

    const initializeZoomSDK = () => {
      try {
        const ZoomMtg = window.ZoomMtg;
        
        if (!ZoomMtg) {
          setError('Failed to load Zoom SDK');
          return;
        }

        // Configure Zoom SDK
        ZoomMtg.setZoomJSLib('https://source.zoom.us/5.2.42037.1112/lib', '/av');
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();
        ZoomMtg.prepareJssdk();

        // Initialize meeting
        ZoomMtg.init({
          leaveUrl: zoomConfig.leaveUrl,
          isSupportAV: true,
          success: () => {
            setIsInitialized(true);
            addLog({
              slotId,
              timestamp: new Date().toISOString(),
              event: 'attendee_joined',
              details: 'Zoom session initialized',
              attendeeCount: 1,
            });
            
            // Join meeting
            ZoomMtg.join({
              meetingNumber: zoomConfig.meetingNumber,
              userName: zoomConfig.userName,
              userEmail: zoomConfig.userEmail,
              passWord: zoomConfig.passWord,
              success: () => {
                addLog({
                  slotId,
                  timestamp: new Date().toISOString(),
                  event: 'attendee_joined',
                  details: 'Successfully joined Zoom meeting',
                });
                
                // Start meeting
                ZoomMtg.startMeeting({
                  meetingNumber: zoomConfig.meetingNumber,
                  userName: zoomConfig.userName,
                  userEmail: zoomConfig.userEmail,
                  passWord: zoomConfig.passWord,
                  success: () => {
                    addLog({
                      slotId,
                      timestamp: new Date().toISOString(),
                      event: 'admin_action',
                      details: 'Zoom meeting started successfully',
                    });
                  },
                  error: (error: any) => {
                    setError(`Failed to start meeting: ${error.message || error}`);
                  },
                });
              },
              error: (error: any) => {
                setError(`Failed to join meeting: ${error.message || error}`);
              },
            });
          },
          error: (error: any) => {
            setError(`Zoom initialization failed: ${error.message || error}`);
            addLog({
              slotId,
              timestamp: new Date().toISOString(),
              event: 'admin_action',
              details: `Zoom initialization error: ${error.message || error}`,
            });
          },
        });

      } catch (error) {
        setError(`Failed to initialize Zoom SDK: ${error}`);
      }
    };

    const cleanup = initializeZoom();

    return () => {
      // Cleanup Zoom session
      if (typeof window !== 'undefined' && window.ZoomMtg) {
        try {
          window.ZoomMtg.leaveMeeting({
            success: () => {
              addLog({
                slotId,
                timestamp: new Date().toISOString(),
                event: 'attendee_left',
                details: 'Left Zoom meeting',
              });
            },
          });
        } catch (error) {
          console.error('Error leaving meeting:', error);
        }
      }
      
      // Run cleanup function if it exists
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then((cleanupFn) => {
          if (cleanupFn) cleanupFn();
        });
      }
    };
  }, [slotId, zoomConfig, addLog]);

  if (error) {
    return (
      <div className="webinar-container flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-danger-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Zoom Session Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="webinar-container">
      <div
        ref={zoomContainerRef}
        id="zmmtg-root"
        className="w-full h-full"
      />
      {!isInitialized && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing Zoom session...</p>
          </div>
        </div>
      )}
    </div>
  );
};