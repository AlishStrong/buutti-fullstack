import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { BookListPaginationProps } from '../models/BookListPaginationProps';

const BookListPagination = ({ size, page, totalElements, totalPages, goToPage }: BookListPaginationProps) => {
  return (
    <div id='book-list-pagination' className='flex flex-col gap-y-4 items-center justify-between border-t border-gray-200 bg-white p-4 md:flex-row sm:px-8'>
      <div className='hidden md:flex md:order-first md:basis-1/3'>
        <p>Showing {size} {size > 1 ? 'books' : 'book'} per page</p>
      </div>
      <div className='order-first flex md:order-2 md:basis-1/3 md:justify-center'>
        <nav className='isolate inline-flex -space-x-px rounded-md' aria-label='Pagination'>
          <button id='previous-page' disabled={page < 2} onClick={() => goToPage(page - 1)} className={'order-first inline-flex items-center rounded-l-md border bg-white px-2 py-2 text-sm font-medium ' + (page < 2 ? 'border-white text-white' : 'border-gray-300 hover:bg-gray-50 shadow-sm')}>
            <span className='sr-only'>Previous page</span>
            <ChevronLeftIcon className='h-5 w-5' />
          </button>
          <button id='first-page' disabled={page === 0} onClick={() => goToPage(0)} className={'inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm ' + (page === 1 ? ' order-3 rounded-l-md hover:bg-gray-50 ' : page === 0 ? ' text-white border-white shadow-none ' : ' order-2 hover:bg-gray-50 ')}>1</button>
          <span id='pages-separator-left' className={'inline-flex items-center border bg-white px-4 py-2 text-sm font-medium cursor-default' + (page > 1 ? ' order-3 border-gray-300 shadow-sm ' : ' order-2 text-white border-white')}>...</span>
          <button id='current-page-number' aria-current='page' disabled={true} className={'order-4 shadow-sm z-20 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 ' + (totalPages === 1 ? ' rounded-md ' : page === 0 ? ' rounded-l-md ' : page === (totalPages - 1) ? ' rounded-r-md ' : '')}>{page + 1}</button>
          <span id='pages-separator-right' className={'inline-flex items-center border bg-white px-4 py-2 text-sm font-medium cursor-default ' + (page < (totalPages - 2) ? ' order-5 border-gray-300 shadow-sm ' : ' order-6 border-white text-white')}>...</span>
          <button id='last-page' disabled={page === (totalPages - 1)} onClick={() => goToPage(totalPages - 1)} className={'inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm ' + (page < (totalPages - 2) ? ' order-6 ' : ' order-5 rounded-r-md z-10 ') + (page === (totalPages - 1) ? ' border-white text-white shadow-none' : 'hover:bg-gray-50 ')}>{totalPages}</button>
          <button id='next-page' disabled={page >= (totalPages - 2)} onClick={() => goToPage(page + 1)} className={'order-last inline-flex items-center rounded-r-md border bg-white px-2 py-2 text-sm font-medium ' + (page >= (totalPages - 2) ? 'border-white text-white' : 'border-gray-300 hover:bg-gray-50 shadow-sm')}>
            <span className='sr-only'>Next page</span>
            <ChevronRightIcon className='h-5 w-5' />
          </button>
        </nav>
      </div>
      <div className='hidden md:flex md:order-last md:basis-1/3 md:justify-end'>
        <p>Found {totalElements} book{ totalElements > 1 ? 's': ''}</p>
      </div>
      <div className='flex items-center w-full justify-between md:hidden'>
        <p>Showing {size} {size > 1 ? 'books' : 'book'} per page</p>
        <p>Found {totalElements} book{ totalElements > 1 ? 's': ''}</p>
      </div>
    </div>
  );
};

export default BookListPagination;
