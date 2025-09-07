'use client';

import React, { useEffect, useState } from 'react';
import { useWebinarStore } from '@/lib/store';
import { WebinarPlayer } from '@/components/WebinarPlayer';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminAuth } from '@/components/AdminAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WebinarSlot } from '@/types/webinar';
import { sampleWebinarSlots } from '@/lib/sample-data';

export default function HomePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [currentSlotId, setCurrentSlotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { slots, initializeSlots, setActiveSlot } = useWebinarStore();

  useEffect(() => {
    // Initialize with sample data for demo
    initializeSlots(sampleWebinarSlots);
    
    // Check URL parameters for admin mode or slot selection
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    const slotParam = urlParams.get('slot');
    
    if (adminParam === 'true') {
      setNeedsAuth(true);
    }
    
    if (slotParam) {
      setCurrentSlotId(slotParam);
      setActiveSlot(slotParam);
    } else {
      // Default to first slot
      setCurrentSlotId(sampleWebinarSlots[0].id);
      setActiveSlot(sampleWebinarSlots[0].id);
    }
    
    setIsLoading(false);
  }, [initializeSlots, setActiveSlot]);

  const handleAuthSuccess = () => {
    setIsAdmin(true);
    setNeedsAuth(false);
  };

  const handleAuthCancel = () => {
    setNeedsAuth(false);
    // Reset URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setNeedsAuth(false);
    // Reset URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading webinar system...</p>
        </div>
      </div>
    );
  }

  if (needsAuth) {
    return <AdminAuth onSuccess={handleAuthSuccess} onCancel={handleAuthCancel} />;
  }

  if (isAdmin) {
    return (
      <ErrorBoundary>
        <AdminDashboard onLogout={handleLogout} />
      </ErrorBoundary>
    );
  }

  // Participant view
  const currentSlot = slots.find(slot => slot.id === currentSlotId);
  
  if (!currentSlot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Webinar Not Found</h1>
          <p className="text-gray-600 mb-4">The requested webinar slot could not be found.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <WebinarPlayer slot={currentSlot} />
    </ErrorBoundary>
  );
}