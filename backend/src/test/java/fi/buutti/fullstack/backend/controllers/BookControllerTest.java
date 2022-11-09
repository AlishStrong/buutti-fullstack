package fi.buutti.fullstack.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Objects;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import fi.buutti.fullstack.backend.models.Book;
import fi.buutti.fullstack.backend.repositories.BookRepository;
import fi.buutti.fullstack.backend.testutils.SpringDataPageImpl;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class BookControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private BookRepository repository;

    @LocalServerPort
    int randomServerPort;

    @Test
    public void it_should_get_books_paged_with_default_page_parameters() throws Exception {
        String baseUrl = "http://localhost:" + randomServerPort + "/api/books";
        ParameterizedTypeReference<SpringDataPageImpl<Book>> responseType = new ParameterizedTypeReference<SpringDataPageImpl<Book>>() {};
        ResponseEntity<SpringDataPageImpl<Book>> response = restTemplate.exchange(baseUrl, HttpMethod.GET, null, responseType);
        Page<Book> booksPage = response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(booksPage.hasContent());
        assertThat(booksPage.getContent().size()).isGreaterThan(0);
        assertThat(booksPage.getSize()).isEqualTo(10);
        assertThat(booksPage.getNumber()).isEqualTo(0);
        assertTrue(booksPage.isFirst());
    }

    @Test
    public void it_should_get_books_paged_with_custom_page_parameters() throws Exception {
        String baseUrl = "http://localhost:" + randomServerPort + "/api/books?page=1&size=1"; // second page, one element per page
        ParameterizedTypeReference<SpringDataPageImpl<Book>> responseType = new ParameterizedTypeReference<SpringDataPageImpl<Book>>() {};
        ResponseEntity<SpringDataPageImpl<Book>> response = restTemplate.exchange(baseUrl, HttpMethod.GET, null, responseType);
        Page<Book> booksPage = response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(booksPage.hasContent());
        assertThat(booksPage.getContent().size()).isGreaterThan(0);
        assertThat(booksPage.getSize()).isEqualTo(1);
        assertThat(booksPage.getNumber()).isEqualTo(1);
        assertFalse(booksPage.isFirst());
    }

    @Test
    public void it_should_return_nothing_and_status_no_content() throws Exception {
        String baseUrl = "http://localhost:" + randomServerPort + "/api/books?page=101"; // 100th page
        ParameterizedTypeReference<SpringDataPageImpl<Book>> responseType = new ParameterizedTypeReference<SpringDataPageImpl<Book>>() {};
        ResponseEntity<SpringDataPageImpl<Book>> response = restTemplate.exchange(baseUrl, HttpMethod.GET, null, responseType);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertFalse(response.hasBody());
    }

    @ParameterizedTest
    @CsvSource({
            "-1, 1",
            "0, -1",
            "0, 0",
            "0, "
    })
    public void it_should_return_bad_request_status(Integer page, Integer size) {
        String baseUrl = "http://localhost:" + randomServerPort + "/api/books?page=" + page + "&size=" + size;
        ResponseEntity<String> response = restTemplate.exchange(baseUrl, HttpMethod.GET, null, String.class);

        if (Objects.isNull(page) || page < 0) {
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        if (Objects.isNull(size) || page < 1) {
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }
    }

    @Test
    public void it_should_get_book() {
        Book existingBook = repository.findAll().stream().findAny().get();
        Long existingId = existingBook.getId();

        String baseUrl = "http://localhost:" + randomServerPort + "/api/books/" + existingId;
        ResponseEntity<Book> response = restTemplate.exchange(baseUrl, HttpMethod.GET, null, Book.class);
        Book retrievedBook = response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(existingBook.getId(), retrievedBook.getId());
        assertEquals(existingBook.getTitle(), retrievedBook.getTitle());
        assertEquals(existingBook.getAuthor(), retrievedBook.getAuthor());
        assertEquals(existingBook.getDescription(), retrievedBook.getDescription());
    }

    @ParameterizedTest
    @CsvSource({
            "200, Book with ID 200 does not exist!, 404",
            "-10, Book ID must be a positive integer!, 400",
            ", Book ID must be a positive integer!, 400",
            "efad, Book ID must be a positive integer!, 400",
            "0sad, Book ID must be a positive integer!, 400"
    })
    public void it_should_notify_if_id_is_invalid(String invalidId, String message, Integer status) {
        String baseUrl = "http://localhost:" + randomServerPort + "/api/books/" + invalidId;
        ResponseEntity<String> response = restTemplate.exchange(baseUrl, HttpMethod.GET, null, String.class);

        assertEquals(status, response.getStatusCode().value());
        assertEquals(response.getBody(), message);
    }


}
