package fi.buutti.fullstack.backend.handlers;

import org.springframework.http.HttpStatus;

import lombok.Getter;

public class BookException extends RuntimeException {

    @Getter
    private HttpStatus httpStatus;
    
    public BookException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
