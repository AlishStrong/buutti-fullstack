import { BookListProps } from './BookListProps';

export interface BookListEmptyNoticeProps extends BookListProps {
  refetchBooks: () => void;
}
