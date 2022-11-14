package fi.buutti.fullstack.backend.services;

import java.text.MessageFormat;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.RequestMethod;

import fi.buutti.fullstack.backend.handlers.BookException;
import fi.buutti.fullstack.backend.models.Book;
import fi.buutti.fullstack.backend.repositories.BookRepository;

@SpringBootTest
public class BookServiceTest {

    private final String initialTitleOne = "The Lord of the Rings: The Fellowship of the Ring";
    private final String initialAuthor = "J. R. R. Tolkien";

    @Autowired
    private BookService service;

    @Autowired
    private BookRepository repository;

    @Test
    public void it_should_get_page_of_books() {
        Page<Book> booksPage = service.getPageOfBooks(0, 10);
        assertTrue(booksPage.hasContent());
        assertTrue(booksPage.getContent().stream().map(b -> b.getAuthor()).filter(a -> initialAuthor.equals(a))
                .collect(Collectors.toList()).size() > 0);
    }

    @ParameterizedTest
    @CsvSource({
            "page",
            "size"
    })
    public void it_should_fail_if_page_parameters_are_invalid(String parameter) {
        switch (parameter) {
            case "size":
                assertThrows(BookException.class, () -> {
                    service.getPageOfBooks(0, 0);
                }, "Size parameter must be a positive number!");

                assertThrows(BookException.class, () -> {
                    service.getPageOfBooks(0, -1);
                }, "Size parameter must be a positive number!");
            default:
                assertThrows(BookException.class, () -> {
                    service.getPageOfBooks(-1, 10);
                }, "Page parameter cannot be a negative number!");
        }
    }

    @Test
    public void it_should_get_book_by_valid_id() {
        repository.findAll().forEach(initialBook -> {
            Book foundBook = service.getBookById(initialBook.getId());
            assertEquals(initialBook.getTitle(), foundBook.getTitle());
            assertEquals(initialBook.getAuthor(), foundBook.getAuthor());
            assertEquals(initialBook.getDescription(), foundBook.getDescription());
        });
    }

    @Test
    public void when_id_is_invalid_it_should_throw_book_exception() {
        assertThrows(BookException.class, () -> {
            service.getBookById(-1L);
        }, "Book with ID -1 does not exist!");

        Long outOfRange = repository.findAll(Sort.by(Direction.DESC, "id")).get(0).getId() + 1;
        assertThrows(BookException.class, () -> {
            service.getBookById(outOfRange);
        }, MessageFormat.format("Book with ID {0} does not exist!", outOfRange));

        assertThrows(BookException.class, () -> {
            service.getBookById(null);
        }, "Book ID cannot be NULL!");
    }

    @ParameterizedTest
    @CsvSource({
            "description",
            "empty",
            "space",
            "null"
    })
    public void it_should_create_book(String descriptionValueCase) {
        String title = "title " + Math.random();
        String author = "author " + Math.random();
        String description;

        switch (descriptionValueCase) {
            case "empty":
                description = "";
                break;
            case "space":
                description = " ";
                break;
            case "null":
                description = null;
                break;
            default:
                description = descriptionValueCase;
                break;
        }

        Book toCreate = new Book();
        toCreate.setTitle(title);
        toCreate.setAuthor(author);
        toCreate.setDescription(description);

        Book createdBook = service.createBook(toCreate);
        assertNotNull(createdBook.getId());
        assertThat(createdBook.getId()).isGreaterThanOrEqualTo(0);
        assertEquals(createdBook.getTitle(), title);
        assertEquals(createdBook.getAuthor(), author);
        assertEquals(createdBook.getDescription(), Objects.isNull(description) ? description : description.trim());
    }

    @ParameterizedTest
    @CsvSource({
            "id",
            "title",
            "author",
            "description"
    })
    public void it_should_invalidate_invalid_book_at_creation(String issueCase) {
        String title = "title " + Math.random();
        String author = "author " + Math.random();
        String description = "description " + Math.random();

        Book invalidBook = new Book();
        invalidBook.setTitle(title);
        invalidBook.setAuthor(author);
        invalidBook.setDescription(description);

        switch (issueCase) {
            case "id":
                testInvalidIdScenarios(RequestMethod.POST, invalidBook);
                break;
            case "title":
                testInvalidTitleScenarios(RequestMethod.POST, invalidBook);
                break;
            case "author":
                testInvalidAuthorScenarios(RequestMethod.POST, invalidBook);
                break;
            case "description":
                testInvalidDescriptionScenarios(RequestMethod.POST, invalidBook);
                break;
            default:
                assertThrows(BookException.class, () -> {
                    service.createBook(null);
                }, "No book data was provided!");

                assertThrows(BookException.class, () -> {
                    service.createBook(new Book());
                }, "No book data was provided!");
                break;
        }
    }

    @Test
    public void it_should_update_book() {
        String title = "title " + Math.random();
        String author = "author " + Math.random();
        String description = null;

        Book toUpdate = new Book();
        toUpdate.setTitle(title);
        toUpdate.setAuthor(author);
        toUpdate.setDescription(description);

        service.createBook(toUpdate);

        toUpdate.setTitle("updated " + title);
        toUpdate.setAuthor("updated " + author);
        toUpdate.setDescription("some description");

        Book updatedBook = service.updateBook(toUpdate);

        assertNotEquals(updatedBook.getTitle(), title);
        assertNotEquals(updatedBook.getAuthor(), author);
        assertNotEquals(updatedBook.getDescription(), description);
    }

    @ParameterizedTest
    @CsvSource({
            "id",
            "title",
            "author"
    })
    public void it_should_invalidate_invalid_book_at_update(String issueCase) {
        String title = "title " + Math.random();
        String author = "author " + Math.random();
        String description = "description " + Math.random();

        Book invalidBook = new Book();
        invalidBook.setTitle(title);
        invalidBook.setAuthor(author);
        invalidBook.setDescription(description);

        switch (issueCase) {
            case "id":
                testInvalidIdScenarios(RequestMethod.PUT, invalidBook);
                break;
            case "title":
                testInvalidTitleScenarios(RequestMethod.PUT, invalidBook);
                break;
            case "author":
                testInvalidAuthorScenarios(RequestMethod.PUT, invalidBook);
                break;
            case "description":
                testInvalidDescriptionScenarios(RequestMethod.PUT, invalidBook);
                break;
            default:
                assertThrows(BookException.class, () -> {
                    service.createBook(null);
                }, "No book data was provided!");

                
                assertThrows(BookException.class, () -> {
                    service.createBook(new Book());
                }, "No book data was provided!");
                break;
        }
    }

    @Test
    public void it_deletes_book() {
        Long idToDelete = repository.findAll().stream().filter(b -> !b.getTitle().equals(initialTitleOne)).findAny().get().getId();

        service.deleteBookById(idToDelete);

        assertFalse(repository.existsById(idToDelete));
    }

    @ParameterizedTest
    @CsvSource({
            "invalid",
            "does not exist",
            "null"
    })
    public void it_should_fail_to_delete(String reason) {
        switch (reason) {
            case "invalid":
                Long negativeId = -1L;
                assertThrows(BookException.class, () -> {
                    service.deleteBookById(negativeId);;
                }, MessageFormat.format("Book with ID {0} does not exist!", negativeId));

                Long outOfRange = repository.findAll(Sort.by(Direction.DESC, "id")).get(0).getId() + 1;
                assertThrows(BookException.class, () -> {
                    service.deleteBookById(outOfRange);;
                }, MessageFormat.format("Book with ID {0} does not exist!", outOfRange));
                break;
            case "does not exist":
                Long idToDelete = repository.findAll().stream().filter(b -> !b.getTitle().equals(initialTitleOne)).findAny().get().getId();
                service.deleteBookById(idToDelete);
                assertFalse(repository.existsById(idToDelete));

                assertThrows(BookException.class, () -> {
                    service.deleteBookById(idToDelete);;
                }, MessageFormat.format("Book with ID {0} does not exist!", idToDelete));
                break;
            default:
                assertThrows(BookException.class, () -> {
                    service.deleteBookById(null);;
                }, "Book ID was not provided!");
                break;
        }
    }

    private void testInvalidIdScenarios(RequestMethod method, Book invalidBook) {
        if (RequestMethod.POST.equals(method)) {
            invalidBook.setId(Math.round(Math.random()));
            assertThrows(BookException.class, () -> {
                service.createBook(invalidBook);
            }, "Creation payload must not contain ID!");
        }

        if (RequestMethod.PUT.equals(method)) {
            assertThrows(BookException.class, () -> {
                service.updateBook(invalidBook);
            }, "Book ID was not provided!");

            Long outOfRange = repository.findAll(Sort.by(Direction.DESC, "id")).get(0).getId() + 1;
            invalidBook.setId(outOfRange);
            assertThrows(BookException.class, () -> {
                service.updateBook(invalidBook);
            }, MessageFormat.format("Book with ID {0} does not exist!", invalidBook.getId()));
        }
    }

    private void testInvalidTitleScenarios(RequestMethod method, Book invalidBook) {
        invalidBook.setTitle(null);
        assertThrows(BookException.class, () -> {
            if (method.equals(RequestMethod.POST)) {
                service.createBook(invalidBook);
            } else {
                service.updateBook(invalidBook);
            } 
        }, "No title was provided!");

        invalidBook.setTitle("");
        assertThrows(BookException.class, () -> {
            if (method.equals(RequestMethod.POST)) {
                service.createBook(invalidBook);
            } else {
                service.updateBook(invalidBook);
            } 
        }, "No title was provided!");

        invalidBook.setTitle(" ");
        assertThrows(BookException.class, () -> {
            if (method.equals(RequestMethod.POST)) {
                service.createBook(invalidBook);
            } else {
                service.updateBook(invalidBook);
            } 
        }, "No title was provided!");


        String tooBigTitle = Stream.generate(() -> "1").limit(256).collect(Collectors.joining());
        invalidBook.setTitle(tooBigTitle);
        assertThrows(BookException.class, () -> {
            if (method.equals(RequestMethod.POST)) {
                service.createBook(invalidBook);
            } else {
                service.updateBook(invalidBook);
            } 
        }, MessageFormat.format("Title can be maximum 255 characters long! Received title length was {0}", tooBigTitle.length()));


        invalidBook.setTitle(initialTitleOne);
        assertThrows(BookException.class, () -> {
            if (method.equals(RequestMethod.POST)) {
                service.createBook(invalidBook);
            } else {
                service.updateBook(invalidBook);
            } 
        }, MessageFormat.format("Title {0} already exists!", initialAuthor));
    }

    private void testInvalidAuthorScenarios(RequestMethod method, Book invalidBook) {
        invalidBook.setAuthor(null);
        assertThrows(BookException.class, () -> {
            if (method.equals(RequestMethod.POST)) {
                service.createBook(invalidBook);
            } else {
                service.updateBook(invalidBook);
            } 
        }, "No author was provided!");

        invalidBook.setAuthor("");
        assertThrows(BookException.class, () -> {
            if (method.equals(RequestMethod.POST)) {
                service.createBook(invalidBook);
            } else {
                service.updateBook(invalidBook);
            } 
        }, "No author was provided!");

        invalidBook.setAuthor(" ");
        assertThrows(BookException.class, () -> {
            if (method.equals(RequestMethod.POST)) {
                service.createBook(invalidBook);
            } else {
                service.updateBook(invalidBook);
            } 
        }, "No author was provided!");

        String tooBigAuthor = Stream.generate(() -> "1").limit(256).collect(Collectors.joining());
        invalidBook.setAuthor(tooBigAuthor);
        assertThrows(BookException.class, () -> {
            if (method.equals(RequestMethod.POST)) {
                service.createBook(invalidBook);
            } else {
                service.updateBook(invalidBook);
            } 
        }, MessageFormat.format("Author name can be maximum 255 characters long! Received author name length was {0}", tooBigAuthor.length()));
    }

    private void testInvalidDescriptionScenarios(RequestMethod method, Book invalidBook) {
        String tooBigDescription = Stream.generate(() -> "1").limit(501).collect(Collectors.joining());
        invalidBook.setDescription(tooBigDescription);
        assertThrows(BookException.class, () -> {
            if (method.equals(RequestMethod.POST)) {
                service.createBook(invalidBook);
            } else {
                service.updateBook(invalidBook);
            } 
        }, MessageFormat.format("Description can be maximum 500 characters long! Received description length was {0}", tooBigDescription.length()));
    }
}
