package fi.buutti.fullstack.backend.repositories;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import fi.buutti.fullstack.backend.models.Book;

@SpringBootTest
public class BookRepositoryTests {

    @Autowired
    private BookRepository repository;

    @ParameterizedTest
    @CsvSource({
            "0, 10",
            "0, 1",
            "-1, 10",
            "0, 0",
            "0, -1",
            "10000, 10"
    })
    public void it_gets_books_paged(Integer page, Integer size) {
        if (page < 0) {
            assertThrows(IllegalArgumentException.class, () -> {
                repository.findAll(PageRequest.of(page, size));
            }, "Page index must not be less than zero");
        } else if (size < 1) {
            assertThrows(IllegalArgumentException.class, () -> {
                repository.findAll(PageRequest.of(page, size));
            }, "Page size must not be less than one");
        } else {
            Page<Book> booksPaged = repository.findAll(PageRequest.of(page, size));
            assertThat(booksPaged.getNumber()).isEqualTo(page);
            assertThat(booksPaged.getSize()).isEqualTo(size);
            if (page < booksPaged.getTotalPages()) {
                assertThat(booksPaged.hasContent()).isTrue();
                assertThat(booksPaged.getContent()).extracting(Book::getAuthor).contains("J. R. R. Tolkien");
            } else {
                assertThat(booksPaged.hasContent()).isFalse();
            }
        }
    }

    @ParameterizedTest
    @CsvSource({
            "title_Length_Under_255, author_Length_Under_255, description_Length_Under_500",

            "title_Length_Equal_255-FgQ9hJKnVE7zUHpejSmgmFk2w68QbpIToiSgO5O48F2VVGJyLWO7aL7Kzr0it6NbsQi6aVcYqPJ50TJT1f0PDbFw3NNixrWz9tGfrHz00rlk4YtqHsfgIAj1eYt1f1SHcDyRMVcVKwbqbWBGcEIRiQUjC6FlWKgfkbAz0BqRfmF1LJyCtnHRCPYbIKqQpzEptRuJvkztQWF2ZJLDrHpDMjq3N7VBLKNbJbelVe5Z,"
                    + "author_Length_Equal_255-FgQ9hJKnVE7zUHpejSmgmFk2w68QbpIToiSgO5O48F2VVGJyLWO7aL7Kzr0it6NbsQi6aVcYqPJ50TJT1f0PDbFw3NNixrWz9tGfrHz00rlk4YtqHsfgIAj1eYt1f1SHcDyRMVcVKwbqbWBGcEIRiQUjC6FlWKgfkbAz0BqRfmF1LJyCtnHRCPYbIKqQpzEptRuJvkztQWF2ZJLDrHpDMjq3N7VBLKNbJbelVe5,"
                    + "description_Length_Equal_500-FgQ9hJKnVE7zUHpejSmgmFk2w68QbpIToiSgO5O48F2VVGJyLWO7aL7Kzr0it6NbsQi6aVcYqPJ50TJT1f0PDbFw3NNixrWz9tGfrHz00rlk4YtqHsfgIAj1eYt1f1SHcDyRMVcVKwbqbWBGcEIRiQUjC6FlWKgfkbAz0BqRfmF1LJyCtnHRCPYbIKqQpzEptRuJvkztQWF2ZJLDrHpDMjq3N7VBLKNbJbelVe5bWBGcEIRiQUjC6FlWKgfkbAz0BqRfmF1LJyCtnHRCPYbIKqQpzEptRuJvkztQWF2ZJLDrHpDMjq3N7VBLKNbJbelVe5bWBGcEIRiQUjC6FlWKgfkbAz0BqRfmF1LJyCtnHRCPYbIKqQpzEptRuJvkztQWF2ZJLDrHpDMjq3N7VBLKNbJbelVe5bWBGcEIRiQUjC6FlWKgfkbAz0BqRfmF1LJyCtnHRCPYbIKqQpzEptRuJvk",

            "title_Length_Under_255_description_NULL, author_Length_Under_255_description_NULL, "
    })
    public void it_inserts_book_with_correct_data(String title, String author, String description) {
        Book toInsert = new Book();
        toInsert.setTitle(title);
        toInsert.setAuthor(author);
        toInsert.setDescription(description);

        Book persistedBook = repository.saveAndFlush(toInsert);

        assertEquals(persistedBook, toInsert);
    }

    @ParameterizedTest
    @CsvSource({
            "title_Length_Beyond_255-FgQ9hJKnVE7zUHpejSmgmFk2w68QbpIToiSgO5O48F2VVGJyoiSgO5O48F2VVGJyLWO7aL7Kzr0it6NbsQi6aVcYqPJ50TJT1f0PDbFw3NNixrWz9tGfrHz00rlk4YtqHsfgIAj1eYt1f1SHcDyRMVcVKwbqbWBGcEIRiQUjC6FlWKgfkbAz0BqRfmF1LJyCtnHRCPYbIKqQpzEptRuJvkztQWF2ZJLDrHpDMjq3N7VBLKNbJbelVe5Z,"
                    + "author_Length_OK,"
                    + "description_Length_OK",

            "title_Length_OK,"
                    + "author_Length_Beyond_255-FgQ9hJKnVE7zUHpejSmgmFk2w68QbFgQ9hJKnVE7zUHpejSmgmFk2w68QbpIToiSgO5O48F2VVGJyLWO7aL7Kzr0it6NbsQi6aVcYqPJ50TJT1f0PDbFw3NNixrWz9tGfrHz00rlk4YtqHsfgIAj1eYt1f1SHcDyRMVcVKwbqbWBGcEIRiQUjC6FlWKgfkbAz0BqRfmF1LJyCtnHRCPYbIKqQpzEptRuJvkztQWF2ZJLDrHpDMjq3N7VBLKNbJbelVe5,"
                    + "description_Length_OK",

            "title_Length_OK,"
                    + "author_Length_OK,"
                    + "description_Length_Beyond_500-FgQ9hJKnVE7zUHpejSmgmFk2w68QbFgQ9hJKnVEFgQ9hJKnVE7zUHpejSmgmFk2w68QbpIToiSgO5O48F2VVGJyLWO7aL7Kzr0it6NbsQi6aVcYqPJ50TJT1f0PDbFw3NNixrWz9tGfrHz00rlk4YtqHsfgIAj1eYt1f1SHcDyRMVcVKwbqbWBGcEIRiQUjC6FlWKgfkbAz0BqRfmF1LJyCtnHRCPYbIKqQpzEptRuJvkztQWF2ZJLDrHpDMjq3N7VBLKNbJbelVe5ZpDMjq3N7VBLKNbJbelVe5ZHz00rlk4YtqHsfgIAj1eYt1f1SHcDyRMVcVKwbqbWBGcEIRiQUjC6FlWKgfkbAz0BqRfmF1LJyCtnHRCPYbIKqQpbAz0BqRfmF1LJyCtnHRCPYbIKqQpzEptRuJvkztQWF2ZJLDrHpDMjq3N7VBLKNbJbAz0BqRfmF1LJyCtnHRCPYbIKq",

                    " ,"
                    + "author_Length_OK,"
                    + "title empty, author OK",

                    "title_Length_OK,"
                    + " ,"
                    + "title OK, author empty",
    })
    public void it_fails_when_values_violate_length_constraint(String title, String author, String description) {
        Book toInsert = new Book();
        toInsert.setTitle(title);
        toInsert.setAuthor(author);
        toInsert.setDescription(description);

        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.saveAndFlush(toInsert);
            assertThat(repository.exists(Example.of(toInsert))).isFalse();
        });
    }

    @ParameterizedTest
    @CsvSource({
            ","
            + "author_Length_OK_title_NULL,"
            + "description_Length_OK_title_NULL",

            "title_Length_OK_author_NULL,"
            + ","
            + "description_Length_OK_author_NULL"
    })
    public void it_fails_when_not_null_constraint_is_violated(String title, String author, String description) {
        Book toInsert = new Book();
        toInsert.setTitle(title);
        toInsert.setAuthor(author);
        toInsert.setDescription(description);

        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.saveAndFlush(toInsert);
            assertThat(repository.exists(Example.of(toInsert))).isFalse();
        });
    }

    @Test
    public void it_fails_when_unique_constraint_is_violated() {
        Book unique = new Book();
        unique.setTitle("unique");
        unique.setAuthor("author");

        repository.saveAndFlush(unique);

        assertThat(repository.exists(Example.of(unique))).isTrue();

        Book duplicateTitle = new Book();
        duplicateTitle.setTitle("unique");
        duplicateTitle.setAuthor("title duplicate");

        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.saveAndFlush(duplicateTitle);
            assertThat(repository.exists(Example.of(duplicateTitle))).isFalse();
        });

        Book duplicateTitleCapital = new Book();
        duplicateTitleCapital.setTitle("unique".toUpperCase());
        duplicateTitleCapital.setAuthor("title duplicate capital");

        repository.saveAndFlush(duplicateTitleCapital);
        assertThat(repository.exists(Example.of(duplicateTitleCapital))).isTrue();
    }

    @ParameterizedTest
    @CsvSource({
            "title",
            "author",
            "description"
    })
    public void it_updates_book(String fieldToUpdate) {
        String originalTitle = "original title " + Math.random();
        String originalAuthor = "original author";
        String originalDescription = "original description";

        Book original = new Book();
        original.setTitle(originalTitle);
        original.setAuthor(originalAuthor);
        original.setDescription(originalDescription);

        Long originalId = repository.saveAndFlush(original).getId();
        assertThat(repository.exists(Example.of(original))).isTrue();

        String newValue = fieldToUpdate + " updated";
        Book toUpdate = repository.findById(originalId).get();

        switch (fieldToUpdate) {
            case "title":
                toUpdate.setTitle(newValue);
                repository.saveAndFlush(toUpdate);
                repository.findById(originalId).ifPresent(b -> {
                    assertFalse(originalTitle.equals(b.getTitle()));
                });
                break;
            case "author":
                toUpdate.setAuthor(newValue);
                repository.saveAndFlush(toUpdate);
                repository.findById(originalId).ifPresent(b -> {
                    assertFalse(originalAuthor.equals(b.getAuthor()));
                });
                break;
            case "description":
                toUpdate.setDescription(newValue);
                repository.saveAndFlush(toUpdate);
                repository.findById(originalId).ifPresent(b -> {
                    assertFalse(originalDescription.equals(b.getDescription()));
                });
                break;

            default:
                break;
        }
    }

    @Test
    public void it_fails_upon_update_with_unique_constraint_violation() {
        String uniqueTitle = "unique title";

        Book first = new Book();
        first.setTitle(uniqueTitle);
        first.setAuthor("some author");
        first.setDescription("some description");

        Book second = new Book();
        second.setTitle("other " + uniqueTitle);
        second.setAuthor("some author");
        second.setDescription("some description");

        List<Book> persistedBooks = repository.saveAllAndFlush(Arrays.asList(first, second));

        Book unique = persistedBooks.get(0);
        Book violator = persistedBooks.get(1);

        assertEquals(unique.getTitle(), uniqueTitle);
        assertEquals(violator.getTitle(), "other " + uniqueTitle);

        violator.setTitle(uniqueTitle);

        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.saveAndFlush(violator);
        });
    }

    @Test
    public void it_fails_upon_update_with_not_null_constraint_violation() {
        String originalTitle = "some title";
        String originalAuthor = "some author";
        String originalDescription = "some description";

        Book original = new Book();
        original.setTitle(originalTitle);
        original.setAuthor(originalAuthor);
        original.setDescription(originalDescription);

        Book violator = repository.saveAndFlush(original);

        // Title NULL
        violator.setTitle(null);
        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.saveAndFlush(violator);
        });

        // Title empty
        violator.setTitle("");
        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.saveAndFlush(violator);
        });

        // Title white space
        violator.setTitle("   ");
        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.saveAndFlush(violator);
        });

        // Author NULL
        violator.setAuthor(null);
        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.saveAndFlush(violator);
        });

        // Author empty
        violator.setAuthor("");
        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.saveAndFlush(violator);
        });

        // Author white space
        violator.setAuthor(" ");
        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.saveAndFlush(violator);
        });

        // Check that persisted values have not changed
        Book toCheck = repository.findById(violator.getId()).get();
        assertEquals(toCheck.getTitle(), originalTitle);
        assertEquals(toCheck.getAuthor(), originalAuthor);
        assertEquals(toCheck.getDescription(), originalDescription);
    }
}
