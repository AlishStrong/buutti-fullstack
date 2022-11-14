import { Book } from './Book';
import { BookListProps } from './BookListProps';

export interface BookFormProps extends BookListProps {
  currentBook: Book;
  closeModal: () => void;
  cancelEdit: () => void;
  refetchBooks: () => void;
  updateBookState: () => void;
}
