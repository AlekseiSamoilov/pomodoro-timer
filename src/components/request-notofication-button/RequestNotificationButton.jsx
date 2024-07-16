import React from 'react'

function RequestNotificationButton() {
    const requestPermission = () => {
      if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
          console.log("Notification permission:", permission);
        });
      }
    };
  
    return <button onClick={requestPermission}>Enable Notifications</button>;
  }

  export default RequestNotificationButton;