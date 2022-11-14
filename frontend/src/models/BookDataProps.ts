import { Book } from './Book';

export interface BookDataProps {
  book: Book;
  closeModal: () => void;
  editBook: () => void;
  refetchBooks: () => void;
}
