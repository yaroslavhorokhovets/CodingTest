'use client';

import React, { useState } from 'react';
import { useWebinarStore } from '@/lib/store';
import { WebinarSlot } from '@/types/webinar';
import { 
  Play, 
  Pause, 
  Users, 
  Clock, 
  Settings, 
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const {
    isGoLiveEnabled,
    activeSlotId,
    slots,
    logs,
    setGoLiveEnabled,
    setActiveSlot,
    updateSlot,
  } = useWebinarStore();

  const [selectedSlot, setSelectedSlot] = useState<WebinarSlot | null>(
    slots.find(slot => slot.id === activeSlotId) || null
  );
  const [showLogs, setShowLogs] = useState(false);

  const handleSlotSelect = (slot: WebinarSlot) => {
    setSelectedSlot(slot);
    setActiveSlot(slot.id);
  };

  const handleGoLiveToggle = () => {
    setGoLiveEnabled(!isGoLiveEnabled);
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  const getRecentLogs = () => {
    return logs.slice(-10).reverse();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Webinar Admin Dashboard</h1>
              <p className="text-gray-600">Manage webinar sessions and transitions</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Go Live Control */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Live Control</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isGoLiveEnabled 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isGoLiveEnabled ? 'LIVE' : 'REPLAY'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleGoLiveToggle}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isGoLiveEnabled
                    ? 'bg-danger-500 hover:bg-danger-600 text-white'
                    : 'bg-success-500 hover:bg-success-600 text-white'
                }`}
              >
                {isGoLiveEnabled ? (
                  <>
                    <Pause className="w-5 h-5 inline mr-2" />
                    Stop Live Session
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 inline mr-2" />
                    Go Live Now
                  </>
                )}
              </button>
              
              <p className="text-sm text-gray-600 mt-2">
                {isGoLiveEnabled 
                  ? 'All active slots will switch to live Zoom sessions'
                  : 'Sessions will run in replay mode until scheduled time or manual override'
                }
              </p>
            </div>

            {/* Slot Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Webinar Slots</h2>
              <div className="space-y-3">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSlot?.id === slot.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{slot.name}</h3>
                        <p className="text-sm text-gray-600">
                          Start: {formatTime(slot.scheduledStartTime)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Switch: {formatTime(slot.scheduledSwitchTime)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          slot.currentMode === 'live'
                            ? 'bg-success-100 text-success-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {slot.currentMode === 'live' ? 'LIVE' : 'REPLAY'}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          {slot.attendeeCount}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
              {selectedSlot ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Active Slot</label>
                    <p className="text-gray-900">{selectedSlot.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Current Mode</label>
                    <p className={`font-medium ${
                      selectedSlot.currentMode === 'live' ? 'text-success-600' : 'text-gray-600'
                    }`}>
                      {selectedSlot.currentMode === 'live' ? 'LIVE' : 'REPLAY'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Attendees</label>
                    <p className="text-gray-900">{selectedSlot.attendeeCount}</p>
                  </div>
                  {selectedSlot.lastSwitchTime && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Last Switch</label>
                      <p className="text-gray-900">{formatTime(selectedSlot.lastSwitchTime)}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No slot selected</p>
              )}
            </div>

            {/* Logs */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {showLogs ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {showLogs ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {getRecentLogs().map((log) => (
                    <div key={log.id} className="text-sm border-l-2 border-gray-200 pl-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{log.event}</span>
                        <span className="text-gray-500">{formatTime(log.timestamp)}</span>
                      </div>
                      <p className="text-gray-600">{log.details}</p>
                      {log.attendeeCount && (
                        <p className="text-xs text-gray-500">
                          Attendees: {log.attendeeCount}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Click to view activity logs</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};