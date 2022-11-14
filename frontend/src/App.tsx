import { useState } from 'react';
import './App.css';
import BookList from './components/BookList';
import Notification from './components/Notification';
import { NotificationColor } from './models/NotificationProps';

const App = () => {

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<NotificationColor>('green');
  const [notificationHeading, setNotificationHeading] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const notify = (type: NotificationColor, heading: string, message = '') => {
    console.log('App notify called');

    setNotificationType(type);
    setNotificationHeading(heading);
    setNotificationMessage(message);
    setShowNotification(true);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className='min-h-screen max-w-5xl mx-auto'>
      <Notification open={showNotification} close={closeNotification} color={notificationType} heading={notificationHeading} message={notificationMessage} />
      <BookList notify={notify} />
    </div>
  );
};

export default App;
