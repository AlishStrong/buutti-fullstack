package fi.buutti.fullstack.backend.services;

import java.text.MessageFormat;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import fi.buutti.fullstack.backend.handlers.BookException;
import fi.buutti.fullstack.backend.models.Book;
import fi.buutti.fullstack.backend.repositories.BookRepository;

@Service
public class BookService {

    @Autowired
    private BookRepository repository;

    public Page<Book> getPageOfBooks(Integer pageNumber, Integer size) {
        if (Objects.isNull(pageNumber) || pageNumber < 0) {
            throw new BookException(
                "Page parameter cannot be a negative number!",
                HttpStatus.BAD_REQUEST
            );
        }

        if (Objects.isNull(size) || size <= 0) {
            throw new BookException(
                "Size parameter must be a positive number!",
                HttpStatus.BAD_REQUEST
            );
        }

        return repository.findAll(PageRequest.of(pageNumber, size));
    }

    public Book getBookById(Long bookId) throws BookException {
        if (Objects.isNull(bookId)) {
            throw new BookException(
                "Book ID cannot be NULL!",
                HttpStatus.BAD_REQUEST
            );
        }
        return repository.findById(bookId).orElseThrow(() -> {
            return new BookException(
                    MessageFormat.format("Book with ID {0} does not exist!", bookId),
                    HttpStatus.NOT_FOUND
            );
        });
    }

    public Book createBook(Book book) {
        Book toCreate = validateBookForCreation(book);
        return repository.saveAndFlush(toCreate);
    }

    public Book updateBook(Book book) {
        validateBookForUpdate(book);

        Book foundBook = repository.findById(book.getId()).orElseThrow(() -> {
            return new BookException(
                    MessageFormat.format("Book with ID {0} does not exist!", book.getId()),
                    HttpStatus.BAD_REQUEST
            );
        });

        foundBook.setTitle(book.getTitle().trim());
        foundBook.setAuthor(book.getAuthor().trim());
        foundBook.setDescription(Objects.isNull(book.getDescription()) ? book.getDescription() : book.getDescription().trim());

        return repository.saveAndFlush(foundBook);
    }

    public void deleteBookById(Long bookId) {
        if (Objects.isNull(bookId)) {
            throw new BookException(
                    "Book ID was not provided!",
                    HttpStatus.BAD_REQUEST
            );
        } else {
            Book toDelete = repository.findById(bookId).orElseThrow(() -> {
                return new BookException(
                        MessageFormat.format("Book with ID {0} does not exist!", bookId),
                        HttpStatus.NOT_FOUND
                );
            });

            repository.deleteById(toDelete.getId());
        }
    }


    private Book validateBookForCreation(Book book) {
        if (Objects.isNull(book)) {
            throw new BookException(
                    "No book data was provided!",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (Objects.nonNull(book.getId())) {
            throw new BookException(
                    "Creation payload must not contain ID!",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (Objects.isNull(book.getTitle()) || book.getTitle().trim().isEmpty()) {
            throw new BookException(
                    "No title was provided!",
                    HttpStatus.BAD_REQUEST
            );
        } else if (book.getTitle().trim().length() > 255) {
            throw new BookException(
                    MessageFormat.format("Title can be maximum 255 characters long! Received title length was {0}", book.getTitle().trim().length()),
                    HttpStatus.BAD_REQUEST
            );
        } else {
            ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id", "author", "description")
                .withStringMatcher(ExampleMatcher.StringMatcher.EXACT)
                .withIgnoreCase();
            if (repository.exists(Example.of(book, matcher))) {
                throw new BookException(
                        MessageFormat.format("Title {0} already exists!", book.getTitle()),
                        HttpStatus.BAD_REQUEST
                );
            }
        }

        if (Objects.isNull(book.getAuthor()) || book.getAuthor().trim().isEmpty()) {
            throw new BookException(
                    "No author was provided!",
                    HttpStatus.BAD_REQUEST
            );
        } else if (book.getAuthor().trim().length() > 255) {
            throw new BookException(
                    MessageFormat.format("Author name can be maximum 255 characters long! Received author name length was {0}", book.getAuthor().trim().length()),
                    HttpStatus.BAD_REQUEST
            );
        }

        if (Objects.nonNull(book.getDescription())) {
            if (book.getDescription().trim().length() > 500) {
                throw new BookException(
                        MessageFormat.format("Description can be maximum 500 characters long! Received description length was {0}", book.getDescription().trim().length()),
                        HttpStatus.BAD_REQUEST
                );
            } else {
                book.setDescription(book.getDescription().trim());
            }
        } else {
            book.setDescription(book.getDescription());
        }

        book.setTitle(book.getTitle().trim());
        book.setAuthor(book.getAuthor().trim());

        return book;
    }

    private void validateBookForUpdate(Book book) {
        if (Objects.isNull(book)) {
            throw new BookException(
                    "No book data was provided!",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (Objects.isNull(book.getId())) {
            throw new BookException(
                    "Book ID was not provided!",
                    HttpStatus.BAD_REQUEST
            );
        } else if (!repository.existsById(book.getId())) {
            throw new BookException(
                    MessageFormat.format("Book with ID {0} does not exist!", book.getId()),
                    HttpStatus.BAD_REQUEST
            );
        }

        if (Objects.isNull(book.getTitle()) || book.getTitle().trim().isEmpty()) {
            throw new BookException(
                    "No title was provided!",
                    HttpStatus.BAD_REQUEST
            );
        } else {
            ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreCase("title");

            repository.findOne(Example.of(book, matcher)).ifPresent(foundBook -> {
                if (!Objects.equals(foundBook.getId(), book.getId())) {
                    throw new BookException(
                            MessageFormat.format("Title {0} already belongs to another book!", book.getTitle()),
                            HttpStatus.BAD_REQUEST
                    );
                }
            });
        }

        if (Objects.isNull(book.getAuthor()) || book.getAuthor().trim().isEmpty()) {
            throw new BookException(
                    "No author was provided!",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (Objects.nonNull(book.getDescription())) {
            if (book.getDescription().trim().length() > 500) {
                throw new BookException(
                        MessageFormat.format("Description can be maximum 500 characters long! Received description length was {0}", book.getDescription().trim().length()),
                        HttpStatus.BAD_REQUEST
                );
            } else {
                book.setDescription(book.getDescription().trim());
            }
        } else {
            book.setDescription(book.getDescription());
        }
    }
}
