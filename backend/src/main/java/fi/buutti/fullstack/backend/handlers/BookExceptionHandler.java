package fi.buutti.fullstack.backend.handlers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class BookExceptionHandler {
    
    @ExceptionHandler(BookException.class)
    public ResponseEntity<String> handleBookException(BookException bookException) {
        return new ResponseEntity<>(bookException.getMessage(), bookException.getHttpStatus());
    }
}
