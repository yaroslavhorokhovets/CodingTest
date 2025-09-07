import { WebinarSlot } from '@/types/webinar';

export const sampleWebinarSlots: WebinarSlot[] = [
  {
    id: 'morning_sales_training',
    name: 'Morning Webinar - Sales Training',
    everwebinarUrl: 'https://demo.everwebinar.com/session/sales-training-12345',
    zoomUrl: 'https://zoom.us/j/123456789?pwd=dGVzdHBhc3N3b3Jk',
    scheduledStartTime: new Date().toISOString(),
    scheduledSwitchTime: new Date(Date.now() + 75 * 60 * 1000).toISOString(), // 75 minutes from now
    isActive: true,
    currentMode: 'replay',
    attendeeCount: 0,
  },
  {
    id: 'afternoon_product_demo',
    name: 'Afternoon Webinar - Product Demo',
    everwebinarUrl: 'https://demo.everwebinar.com/session/product-demo-67890',
    zoomUrl: 'https://zoom.us/j/987654321?pwd=cHJvZHVjdGRlbW8=',
    scheduledStartTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    scheduledSwitchTime: new Date(Date.now() + 5 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 5h 15m from now
    isActive: true,
    currentMode: 'replay',
    attendeeCount: 0,
  },
  {
    id: 'evening_qna_session',
    name: 'Evening Webinar - Q&A Session',
    everwebinarUrl: 'https://demo.everwebinar.com/session/qna-session-11111',
    zoomUrl: 'https://zoom.us/j/555666777?pwd=cW5hc2Vzc2lvbg==',
    scheduledStartTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    scheduledSwitchTime: new Date(Date.now() + 9 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 9h 15m from now
    isActive: true,
    currentMode: 'replay',
    attendeeCount: 0,
  },
];

export const sampleZoomConfigs = {
  morning_sales_training: {
    meetingNumber: '123456789',
    userName: 'Sales Training Attendee',
    userEmail: 'attendee@example.com',
    passWord: 'dGVzdHBhc3N3b3Jk',
    leaveUrl: window?.location?.href || 'http://localhost:3000',
    role: 0, // Attendee role
  },
  afternoon_product_demo: {
    meetingNumber: '987654321',
    userName: 'Product Demo Attendee',
    userEmail: 'attendee@example.com',
    passWord: 'cHJvZHVjdGRlbW8=',
    leaveUrl: window?.location?.href || 'http://localhost:3000',
    role: 0, // Attendee role
  },
  evening_qna_session: {
    meetingNumber: '555666777',
    userName: 'Q&A Session Attendee',
    userEmail: 'attendee@example.com',
    passWord: 'cW5hc2Vzc2lvbg==',
    leaveUrl: window?.location?.href || 'http://localhost:3000',
    role: 0, // Attendee role
  },
};