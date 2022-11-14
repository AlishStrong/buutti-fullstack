import { BookListProps } from './BookListProps';

export interface BookViewCreateProps extends BookListProps {
  type: 'view' | 'create';
  bookId?: number;
  refetchBooks: () => void
}
