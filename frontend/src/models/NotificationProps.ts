export type NotificationColor = 'green' | 'yellow' | 'red';

export interface NotificationProps {
  open?: boolean // default - false
  color?: NotificationColor; // green - success, yellow - warning, red - error
  heading?: string;
  message?: string;
  autoclose?: boolean; // default - true
  closeTimeout?: number; // in milliseconds, default 3000 ms (3 sec)
  close: () => void;
}
