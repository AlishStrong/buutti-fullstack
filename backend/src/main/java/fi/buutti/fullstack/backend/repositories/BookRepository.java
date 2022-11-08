package fi.buutti.fullstack.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import fi.buutti.fullstack.backend.models.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
    
}
