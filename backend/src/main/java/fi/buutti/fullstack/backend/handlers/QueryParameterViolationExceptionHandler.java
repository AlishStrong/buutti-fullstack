package fi.buutti.fullstack.backend.handlers;

import java.util.Iterator;
import java.util.Objects;

import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.HandlerMapping;

@RestControllerAdvice
public class QueryParameterViolationExceptionHandler {

    private final String pageErrorMessage = " Page query parameter must be a positive integer!";
    private final String sizeErrorMessage = " Size query parameter must be an integer bigger than zero!";
    private final String bookIdErrorMessage = " Book ID must be a positive integer!";

    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException exception, WebRequest request) {
        String em = exception.getMessage();

        String errorMessage = "";

        if (em.contains("bookId")) {
            errorMessage += bookIdErrorMessage;
        }

        if (em.contains("page")) {
            errorMessage += pageErrorMessage;
        }

        if (em.contains("size")) {
            errorMessage += sizeErrorMessage;
        }

        return new ResponseEntity<>(errorMessage.trim(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException exception, WebRequest request) throws NoSuchFieldException, IllegalAccessException {
        String errorMessage = "";

        String pathVariableStr = String.valueOf(request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE, 0));
        if (pathVariableStr.contains("id")) {
            errorMessage += bookIdErrorMessage;
        }

        for (Iterator<String> it = request.getParameterNames(); it.hasNext(); ) {
            String pn = it.next();
            String parameterValue = "";
            String[] valueArray = request.getParameterValues(pn);
            if (Objects.nonNull(valueArray)) {
                parameterValue = valueArray[0];
            }
            
            if ("page".equals(pn) && (notInteger(parameterValue) || (!notInteger(parameterValue) && Integer.parseInt(parameterValue) < 0))) {
                errorMessage += pageErrorMessage;
            }

            if ("size".equals(pn) && (notInteger(parameterValue) || (!notInteger(parameterValue) && Integer.parseInt(parameterValue) <= 0))) {
                errorMessage += sizeErrorMessage;
            }
        }

        return new ResponseEntity<>(errorMessage.trim(), HttpStatus.BAD_REQUEST);
    }

    private boolean notInteger(String value) {
        try {
            Integer.parseInt(value);
            return false;
        } catch (NumberFormatException e) {
            return true;
        }
    }
}
