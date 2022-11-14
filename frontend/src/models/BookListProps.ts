import { NotificationColor } from './NotificationProps';

export interface BookListProps {
  notify: (color: NotificationColor, heading: string, message?: string) => void
}
