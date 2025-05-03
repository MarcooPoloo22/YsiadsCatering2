import React, { useEffect, useState } from 'react';

const AppointmentNotifications = ({ userId }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let eventSource;
    let reconnectTimer;

    const connectSSE = () => {
      const lastEventId = localStorage.getItem('lastBookingEventId') || 0;
      eventSource = new EventSource(
        `http://localhost/sse.php?userId=${userId}&lastEventId=${lastEventId}`
      );

      eventSource.addEventListener('booking-update', (e) => {
        try {
          const data = JSON.parse(e.data);
          const notificationMessage = `
            ${data.message}
            Date: ${data.details.date}
            Time: ${data.details.time}
          `;
          setNotification(notificationMessage);
          localStorage.setItem('lastBookingEventId', data.id);
          setTimeout(() => setNotification(null), 10000);
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      });

      eventSource.onerror = () => {
        if (eventSource) eventSource.close();
        reconnectTimer = setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [userId]);

  if (!notification) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#ff4444',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      zIndex: 1000,
      maxWidth: '300px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      whiteSpace: 'pre-line'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>Booking Update</strong>
        <button 
          onClick={() => setNotification(null)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>
      </div>
      <div style={{ marginTop: '8px' }}>{notification}</div>
    </div>
  );
};

export default AppointmentNotifications;