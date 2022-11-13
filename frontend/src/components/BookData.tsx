import { Fragment } from 'react';
import { BookDataProps } from '../models/BookDataProps';

export const BookData = ({ book, closeModal, editBook }: BookDataProps) => {
  return (
    <Fragment>
      <div id='book-data' className="shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6">Book&#39;s detailed information</h3>
        </div>
        <div className="border-t border-gray-200 px-4 sm:p-0">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{book.title}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Author</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{book.author}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{book.description}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div id='book-data-action-button-group' className="mt-4 flex justify-between">
        {/* Edit mode button */}
        <button
          id='book-data-edit-button'
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={editBook}
        >Edit book</button>

        {/* Close modal button */}
        <button
          id='book-data-close-button'
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={closeModal}
        >Close</button>
      </div>
    </Fragment>

  );
};
