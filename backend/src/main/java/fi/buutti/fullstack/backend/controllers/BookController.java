package fi.buutti.fullstack.backend.controllers;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fi.buutti.fullstack.backend.models.Book;
import fi.buutti.fullstack.backend.services.BookService;

@RestController
@RequestMapping("/api/books")
@Validated
public class BookController {

    @Autowired
    private BookService service;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<Book>> getPageOfBooks(
        @RequestParam(name = "page", required = false, defaultValue = "0")
        @NotNull 
        @PositiveOrZero
        Integer pageNumber,

        @RequestParam(name = "size", required = false, defaultValue = "10")
        @NotNull
        @Positive
        Integer size
    ) {
        Page<Book> booksPage = service.getPageOfBooks(pageNumber, size);
        if (booksPage.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(booksPage, HttpStatus.OK);
        }
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Book> getBookById(
        @NotNull 
        @PositiveOrZero
        @PathVariable("id") 
        Long bookId
    ) {
        Book foundBook = service.getBookById(bookId);
        return new ResponseEntity<>(foundBook, HttpStatus.OK);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Book> createBook(@RequestBody(required = true) Book book) {
        Book persistedBook = service.createBook(book);
        return new ResponseEntity<>(persistedBook, HttpStatus.CREATED);
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Book> updateBook(
        @RequestBody(required = true) Book book
    ) {
        Book updatedBook = service.updateBook(book);
        return new ResponseEntity<>(updatedBook, HttpStatus.OK);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteBookById(
        @NotNull 
        @PositiveOrZero
        @PathVariable("id") 
        Long bookId
    ) {
        service.deleteBookById(bookId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
