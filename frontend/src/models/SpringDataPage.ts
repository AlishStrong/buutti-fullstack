export interface SpringDataPage<T> {
  content: Array<T>;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: any; // TODO define Pageable interface
  size: number;
  sort: any; // TODO define Sort interface
  totalElements: number;
  totalPages: number
}
