import { Book } from './Book';

export interface BookFormProps {
  currentBook: Book;
  closeModal: () => void;
  cancelEdit: () => void;
}