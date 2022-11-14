import axios, { AxiosError, AxiosResponse } from 'axios';
import { Fragment, useState } from 'react';
import { Book, BookForCreation } from '../models/Book';
import { BookFormProps } from '../models/BookFormProps';
import { BookFormField, FieldError } from '../models/FieldError';

const BookForm = ({ currentBook, closeModal, cancelEdit, refetchBooks, updateBookState, notify }: BookFormProps) => {
  const [newTitle, setNewTitle] = useState(currentBook.title || '');
  const [newAuthor, setNewAuthor] = useState(currentBook.author || '');
  const [newDescription, setNewDescription] = useState(currentBook.description || '');

  const [titleError, setTitleError] = useState(new FieldError('title'));
  const [authorError, setAuthorError] = useState(new FieldError('author'));
  const [descriptionError, setDescriptionError] = useState(new FieldError('description'));

  const [preventSubmit, setPreventSubmit] = useState(true);

  const processInput = <T extends string | BookFormField>(f: T, v: string): void => {
    switch (f) {
      case 'title':
        setNewTitle(v);
        if (v.length > 0 && v.length <= 255) {
          setTitleError(titleError.setError(''));
        } else if (v.length === 0) {
          setTitleError(titleError.setError('Title cannot be empty!'));

        } else {
          setTitleError(titleError.setError('Title cannot be over 255 characters long!'));

        }
        break;
      case 'author':
        setNewAuthor(v);
        if (v.length > 0 && v.length <= 255) {
          setAuthorError(authorError.setError(''));
        } else if (v.length === 0) {
          setAuthorError(authorError.setError('Author cannot be empty!'));

        } else {
          setAuthorError(authorError.setError('Author cannot be over 255 characters long!'));

        }
        break;
      case 'description':
        setNewDescription(v);
        if (v.length <= 500) {
          setDescriptionError(descriptionError.setError(''));

        } else {
          setDescriptionError(descriptionError.setError('Description cannot be over 500 characters long!'));

        }
        break;
      default:
        break;
    }

    checkForCanSubmit();
  };

  const checkForCanSubmit = () => {
    if (titleError.error || authorError.error || descriptionError.error) {
      setPreventSubmit(true);
    } else {
      setPreventSubmit(false);
    }
  };

  const update = () => {
    const bookToUpdate: Book = {
      id: currentBook.id,
      title: newTitle,
      author: newAuthor,
      description: newDescription
    };
    axios.put<Book, AxiosResponse<Book>>('/api/books', bookToUpdate)
      .then((r: AxiosResponse<Book, any>) => {
        if (r.status === 200) {
          return r.data;
        }
      })
      .then((updatedBook: Book | undefined) => {
        notify('green', `Book${updatedBook ? ' ' + updatedBook.id + ' ' : ' '}was updated`);
        refetchBooks();
        updateBookState();
        cancel();
      })
      .catch((error: AxiosError<string, any>) => {
        notify('red', `An issue was faced while deleting the book ${bookToUpdate.id}`, error.response?.data);
        if (error.response?.status === 400) {
          console.error(`An issue was faced while updating the book ${bookToUpdate.id}:`, error.response?.data);
          // TODO: update FieldError states
        }
      });
  };

  const create = () => {
    const bookToCreate: BookForCreation = {
      title: newTitle,
      author: newAuthor,
      description: newDescription
    };
    axios.post<Book, AxiosResponse<Book>>('/api/books', bookToCreate)
      .then((r: AxiosResponse<Book, any>) => {
        if (r.status === 201) {
          return r.data;
        } else {
          console.error('An issue was faced while creating a new book'); // TODO: proper alert
        }
      })
      .then(() => {
        notify('green', 'New book created');
        refetchBooks();
        closeModal();
      })
      .catch((error: AxiosError<string, any>) => {
        notify('red', 'An issue was faced while creating a book', error.response?.data);
        if (error.response?.status === 400) {
          console.error('An issue was faced while creating a book', error.response?.data);
          // TODO: update FieldError states
        }
      });
  };

  const cancel = () => {
    if (currentBook.id) {
      cancelEdit();
    } else {
      closeModal();
    }
  };

  return (
    <Fragment>
      <form id='book-form' className="shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 id='book-form-header' className="text-lg font-medium leading-6">{ currentBook.id ? 'Edit book' : 'Create book' }</h3>
        </div>
        <div id='book-form-field-group' className="border-t border-gray-200 px-4 sm:p-0">
          <div id='book-form-title-field' className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <label htmlFor="book-title" className="text-sm font-medium text-gray-500">Title</label>
            <div className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              <textarea
                id="book-title"
                name="title"
                placeholder="Title of a book"
                className='max-h-max p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:-my-2'
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => processInput(e.target.name, e.target.value)}
                onBlur={(e: React.FocusEvent<HTMLTextAreaElement, Element>) => processInput(e.target.name, e.target.value)}
                value={newTitle}
                minLength={1}
                maxLength={255}
              ></textarea>
              { titleError.error && <p id='book-title-error' className='sm:mt-3 text-red-500 font-semibold'>{titleError.error}</p> }
            </div>
          </div>
          <div id='book-form-author-field' className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <label htmlFor="book-author" className="text-sm font-medium text-gray-500">Author</label>
            <div className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              <textarea
                id="book-author"
                name="author"
                placeholder="Author of a book"
                className='max-h-max p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:-my-2'
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => processInput(e.target.name, e.target.value)}
                onBlur={(e: React.FocusEvent<HTMLTextAreaElement, Element>) => processInput(e.target.name, e.target.value)}
                value={newAuthor}
                minLength={1}
                maxLength={255}
              ></textarea>
              { authorError.error && <p id='book-author-error' className='sm:mt-3 text-red-500 font-semibold'>{authorError.error}</p> }
            </div>
          </div>
          <div id='book-form-description-field' className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <label htmlFor="book-description" className="text-sm font-medium text-gray-500">Description</label>
            <div className="mt-1 text-sm sm:col-span-2 sm:mt-0 h-max">
              <textarea
                id="book-description"
                name="description"
                placeholder="Description of a book"
                className='min-h-[200px] p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:-my-2'
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => processInput(e.target.name, e.target.value)}
                onBlur={(e: React.FocusEvent<HTMLTextAreaElement, Element>) => processInput(e.target.name, e.target.value)}
                value={newDescription}
                maxLength={500}
              ></textarea>
              { descriptionError.error && <p id='book-description-error' className='sm:mt-3 text-red-500 font-semibold'>{descriptionError.error}</p> }
            </div>
          </div>
        </div>
      </form>
      <div id='book-form-action-button-group' className="mt-4 flex justify-between">
        {/* Update book button */}
        { currentBook.id && <button
          id='book-form-update-button'
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={update}
          disabled={preventSubmit}
        >Save changes</button>}

        {/* Create book button */}
        <button
          id='book-form-create-button'
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-900"
          onClick={create}
          disabled={preventSubmit}
        >{ currentBook.id ? 'Save as a new Book' : 'Create book' }</button>

        {/* Cancel button */}
        <button
          id='book-form-cancel-button'
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={cancel}
        >Cancel</button>
      </div>
    </Fragment>


  );
};

export default BookForm;
