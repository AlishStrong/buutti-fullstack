import { useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { SpringDataPage } from '../models/SpringDataPage';
import { Book } from '../models/Book';
import {
  PlusCircleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

import BookListPagination from './BookListPagination';
import BookListEmptyNotice from './BookListEmptyNotice';

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
        <BookListPagination page={page} size={size} totalElements={totalElements} totalPages={totalPages} goToPage={goToPage} />
      </div>
    );
  } else {
    return (
      <BookListEmptyNotice addBook={addBook} />
    );
  }
};

export default BookList;
