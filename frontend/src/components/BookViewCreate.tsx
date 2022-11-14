import { Dialog, Transition } from '@headlessui/react';
import { BookOpenIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Fragment, useState } from 'react';
import { Book } from '../models/Book';
import { BookViewCreateProps } from '../models/BookViewCreateProps';
import { BookData } from './BookData';
import BookForm from './BookForm';

const BookViewCreate = ({ type, bookId, refetchBooks, notify }: BookViewCreateProps) => {
  const [showModal, setShowModal] = useState(false);
  const [book, setBook] = useState<Book>({} as Book);
  const [editMode, setEditMode] = useState(type === 'view' ? false : true);

  const getBook = () => {
    if (bookId && bookId >= 0) {
      axios.get(`/api/books/${bookId}`)
        .then((response: AxiosResponse<Book, any>) => {
          if (response.status === 200) {
            return response.data;
          }
        })
        .then(book => {
          if (book) {
            setBook(book);
            setShowModal(true);
          }
        })
        .catch((error: AxiosError<string, any>) => {
          notify('red', `An issue was faced while fetching the book ${bookId}.`, error.response?.data);
          // Perhaps the book is already gone
          refetchBooks();
        });
    } else {
      console.error('Book ID is invalid!');
    }
  };

  const openModal = () => {
    if (type === 'view') {
      getBook();
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const editBook = () => {
    setEditMode(true);
  };

  const cancelBookEdit = () => {
    setEditMode(false);
  };

  return (
    <div>
      <button
        id={type === 'view' ? `view-book-button-${bookId}` : 'create-book-button'}
        type='button'
        className='whitespace-nowrap w-full inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        onClick={openModal}
      >
        { type === 'view' ? 'View book' : 'Add book' }
        { type === 'view' ? <BookOpenIcon className='h-7 w-7' aria-hidden='true' /> : <PlusCircleIcon className='h-7 w-7' aria-hidden='true' /> }
      </button>

      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div id='book-modal-backdrop' className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full bg-white transform p-6 text-left align-middle shadow-xl transition-all sm:max-w-xl sm:rounded-2xl">
                  <Dialog.Title
                    className="sr-only"
                  >
                    { type === 'view' ? 'Book detailed information' : 'Add book' }
                  </Dialog.Title>

                  { !editMode && <BookData book={book} closeModal={closeModal} editBook={editBook} refetchBooks={refetchBooks} notify={notify} /> }
                  { editMode && <BookForm currentBook={book} closeModal={closeModal} cancelEdit={cancelBookEdit} refetchBooks={refetchBooks} updateBookState={getBook} notify={notify} /> }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BookViewCreate;
