export interface BookListPaginationProps {
  size: number;
  page: number;
  totalPages: number;
  totalElements: number;
  goToPage: (pageIndex: number) => void
}
