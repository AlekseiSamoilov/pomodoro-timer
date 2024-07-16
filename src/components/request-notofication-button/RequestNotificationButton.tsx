import React, { useEffect, useState } from 'react'
import styles from './RequestNotificationButton.module.css'

type TNotificationStatus = 'default' | 'granted' | 'denied';

const RequestNotificationButton: React.FC = () => {
    const [notificationStatus, setNotificationStatus] = useState<TNotificationStatus>('default');

    useEffect(() => {
        if('Notification' in window) {
            setNotificationStatus(Notification.permission as TNotificationStatus);
        }
    }, [])

    const requestPermission = async () => {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        setNotificationStatus(permission as TNotificationStatus);
      }
    };

    const getButtonText = () => {
        switch(notificationStatus) {
            case 'granted':
                return 'Notification Enabled';
            case 'denied':
                return 'Notification blocked';
            default: 
                return 'Enable Notification';
        }
    };

    const getButtonClass = () => {
        switch (notificationStatus) {
            case 'granted':
                return styles.button_enabled;
            case 'denied':
                return styles.button_denied;
            default:
                return styles.button_default;
        }
    }
  
    return <button 
        onClick={requestPermission}
        className={`${styles.button} ${getButtonClass()}`}
        disabled={notificationStatus === 'denied'}
        >
            {getButtonText()}
        </button>;
  }

  export default RequestNotificationButton;