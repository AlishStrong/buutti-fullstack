import { Book } from './Book';
import { BookListProps } from './BookListProps';

export interface BookDataProps extends BookListProps {
  book: Book;
  closeModal: () => void;
  editBook: () => void;
  refetchBooks: () => void;
}
