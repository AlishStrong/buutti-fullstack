import { useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { SpringDataPage } from '../models/SpringDataPage';
import { Book } from '../models/Book';
import {
  ExclamationTriangleIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/20/solid';

const BookList = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [books, setBooks] = useState<Array<Book>>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    getBooks();
  }, [page, size]);

  const getBooks = () => {
    axios.get(`/api/books?page=${page}&size=${size}`)
      .then((response: AxiosResponse<SpringDataPage<Book>, any>) => {
        console.log('response', response);
        if (response.status === 200) {
          return response.data;
        } else if (response.status === 204) {
          console.warn('There are no books at the moment');
        }
      })
      .then(bookPage => {
        if (bookPage) {
          setBooks(bookPage.content);
          setTotalPages(bookPage.totalPages);
          setTotalElements(bookPage.totalElements);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 504) {
          console.error('Server error: could not obtain the list of books', error);
        }
      });
  };

  const viewBook = () => {
    console.log('view book');
  };

  const addBook = () => {
    console.log('add book');
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const goToPage = (pageIndex: number) => {
    setPage(pageIndex);
  };

  if (books.length > 0) {
    return (
      <div id='book-list' className='my-4 sm:m-6 lg:m-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
        <table id='book-list-table' className='w-full divide-y divide-gray-300'>
          <thead>
            <tr>
              <th className='p-4 sm:px-8 flex justify-between items-center'>
                <div>
                    Filters here
                </div>
                <button
                  type='button'
                  className='inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'
                >
                    Add book
                  <PlusCircleIcon className='h-7 w-7' aria-hidden='true' />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {books.map((book) => (
              <tr key={book.id}>
                <td className='p-4 flex flex-col gap-4 sm:flex-row sm:px-8 sm:gap-8 justify-between'>
                  <div>
                    <div className='flex flex-wrap gap-1 items-baseline'>
                      <p id='book-title' className='text-lg font-semibold break-words line-clamp-2'><span className='sr-only'>Title</span>{book.title}</p>
                      <p id='book-author' className='font-medium break-words line-clamp-2'><span className='sr-only'>Author</span>by {book.author}</p>
                    </div>
                    <div className='break-words line-clamp-3'>
                      <span className='sr-only'>Description</span>{book.description}
                    </div>
                  </div>
                  <div className='self-center'>
                    <button
                      type='button'
                      className='whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'
                      onClick={viewBook}
                    >
                        View book
                      <BookOpenIcon className='h-7 w-7' aria-hidden='true' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id='book-list-pagination' className='flex flex-col gap-y-4 items-center justify-between border-t border-gray-200 bg-white p-4 md:flex-row sm:px-8'>
          <div className='hidden md:block md:order-first'>
            <p>Show {size} books per page</p>
          </div>
          <div className='order-first md:order-2'>
            <nav className='isolate inline-flex -space-x-px rounded-md shadow-sm' aria-label='Pagination'>
              { page > 1 && <button id='previous-page' onClick={() => goToPage(page - 1)} className='inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium hover:bg-gray-50 focus:z-20'>
                <span className='sr-only'>Previous page</span>
                <ChevronLeftIcon className='h-5 w-5' />
              </button> }
              { page > 0 && <button id='first-page' onClick={() => goToPage(0)} className='inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:z-20'>1</button> }
              { page > 1 && <span id='pages-separator-left' className='inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium cursor-default'>...</span> }
              <button id='current-page-number' aria-current='page' disabled={true} className='z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20'>{page + 1}</button>
              { page < (totalPages - 2) && <span id='pages-separator-right' className='inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium cursor-default'>...</span> }
              { page < (totalPages - 1) && <button id='last-page' onClick={() => goToPage(totalPages - 1)} className='inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:z-20'>{totalPages}</button> }
              { page < (totalPages - 2) && <button id='next-page' onClick={() => goToPage(page + 1)} className='inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium hover:bg-gray-50 focus:z-20'>
                <span className='sr-only'>Next page</span>
                <ChevronRightIcon className='h-5 w-5' />
              </button> }
            </nav>
          </div>
          <div className='hidden md:block md:order-last'>
            <p>Found {totalElements} book{ totalElements > 1 ? 's': ''}</p>
          </div>
          <div className='flex items-center w-full justify-between md:hidden'>
            <p>Show {size} books per page</p>
            <p>Found {totalElements} book{ totalElements > 1 ? 's': ''}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div id='book-list-empty' className='my-4 mx-4 rounded-lg bg-red-50 px-4 pt-5 pb-4 text-left shadow sm:my-8 sm:mx-auto sm:w-full sm:max-w-lg sm:p-6'>
        <div>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50 border-2 border-yellow-400 hover:scale-125'>
            <ExclamationTriangleIcon className='h-8 w-8 text-yellow-400' aria-hidden='true' />
          </div>
          <div className='mt-3 text-center sm:mt-5'>
            <h3 className='text-lg font-medium leading-6'>
              The book list is empty!
            </h3>
            <div className='mt-2'>
              <p>There are no books at the moment.</p>
              <p>Please come later or feel free to add a book.</p>
            </div>
          </div>
        </div>
        <div className='mt-5 grid sm:mt-6 sm:grid-cols-2 gap-3'>
          <button
            type='button'
            className='inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:text-sm'
            onClick={refreshPage}
          >
            Refresh page
            <ArrowPathIcon className='h-8 w-8' aria-hidden='true' />
          </button>
          <button
            type='button'
            className='inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm'
            onClick={addBook}
          >
            Add book
            <PlusCircleIcon className='h-8 w-8' aria-hidden='true' />
          </button>
        </div>
      </div>
    );
  }
};

export default BookList;
