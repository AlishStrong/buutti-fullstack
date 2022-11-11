import { useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { SpringDataPage } from '../models/SpringDataPage';
import { Book } from '../models/Book';
import { ExclamationTriangleIcon, PlusCircleIcon, ArrowPathIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const BookList = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [books, setBooks] = useState<Array<Book>>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    getBooks();
  }, [page, size]);

  const getBooks = (): void => {
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
    console.log('Refreshing');
    window.location.reload();
  };

  if (books.length > 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="p-4 sm:px-8 flex justify-between items-center">
                  <div>
                    Filters here
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                  >
                    Add book
                    <PlusCircleIcon className="h-7 w-7" aria-hidden="true" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {books.map((book) => (
                <tr key={book.id}>
                  <td className='p-4 flex flex-col gap-4 sm:flex-row sm:px-8 sm:gap-8'>
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
                        type="button"
                        className="whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                        onClick={viewBook}
                      >
                        View book
                        <BookOpenIcon className="h-7 w-7" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return (
      <div id='book-list-empty' className='rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow sm:my-8 sm:mx-auto sm:w-full sm:max-w-lg sm:p-6'>
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50 border-2 border-yellow-400 hover:scale-125">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              The book list is empty!
            </h3>
            <div className="mt-2">
              <p>There are no books at the moment.</p>
              <p>Please come later or feel free to add a book.</p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid sm:mt-6 sm:grid-cols-2 gap-3">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:text-sm"
            onClick={refreshPage}
          >
            Refresh page
            <ArrowPathIcon className="h-8 w-8" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            onClick={addBook}
          >
            Add book
            <PlusCircleIcon className="h-8 w-8" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }
};

export default BookList;
