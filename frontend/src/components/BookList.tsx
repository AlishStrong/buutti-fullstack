import { useEffect, useState, useRef } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { SpringDataPage } from '../models/SpringDataPage';
import { Book } from '../models/Book';

import BookListPagination from './BookListPagination';
import BookListEmptyNotice from './BookListEmptyNotice';
import BookEditCreate from './BookViewCreate';

const BookList = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [books, setBooks] = useState<Array<Book>>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const pageSizeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getBooks();
  }, [page, size]);

  const getBooks = () => {
    axios.get(`/api/books?page=${page}&size=${size}`)
      .then((response: AxiosResponse<SpringDataPage<Book>, any>) => {
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

  const goToPage = (pageIndex: number) => {
    setPage(pageIndex);
  };

  const setPageSize = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pageSizeInputRef && pageSizeInputRef.current?.value) {
      const newPageSize = +pageSizeInputRef.current.value;
      // reset page index if the current page is bigger or equal than a new total number of pages coming from the newPageSize
      // if that's a case, then set the page to the last index of the new paging system
      if ((totalElements / newPageSize) <= page) {
        setPage(Math.floor(totalElements / newPageSize));
      }
      setSize(newPageSize);
    } else {
      setSize(10);
    }
  };

  if (books.length > 0) {
    return (
      <div id='book-list' className='my-4 sm:m-6 lg:m-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
        <table id='book-list-table' className='w-full divide-y divide-gray-300'>
          <thead>
            <tr>
              <th className='p-4 sm:px-8 flex gap-y-4 flex-col justify-between sm:items-end sm:flex-row'>
                <form id='book-list-set-page-size' onSubmit={(e) => setPageSize(e)} className='flex flex-col min-w-min'>
                  <label htmlFor="book-list-set-page-size-input" className="block font-medium text-left">Set page size</label>
                  <div className="relative mt-1 rounded-md shadow-sm flex">
                    <input
                      type="number"
                      min={1}
                      max={totalElements}
                      name="pageSize"
                      ref={pageSizeInputRef}
                      id="book-list-set-page-size-input"
                      className="block w-full rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:w-40"
                      placeholder={`min 1 - max ${totalElements}`}
                    />
                    <button type='submit' className='px-4 rounded-r-md border border-transparent bg-indigo-600 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                      SET
                    </button>

                  </div>
                </form>

                <BookEditCreate type='create' />
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
                    <BookEditCreate type='view' bookId={book.id} />
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
      <BookListEmptyNotice />
    );
  }
};

export default BookList;
