import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import BookViewCreate from './BookViewCreate';
import { BookListEmptyNoticeProps } from '../models/BookListEmptyNoticeProps';

const BookListEmptyNotice = ({ refetchBooks, notify }: BookListEmptyNoticeProps) => {
  const refreshPage = () => {
    window.location.reload();
  };

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
          <ArrowPathIcon className='h-7 w-7' aria-hidden='true' />
        </button>
        <BookViewCreate notify={notify} type='create' refetchBooks={refetchBooks} />
      </div>
    </div>
  );
};

export default BookListEmptyNotice;
