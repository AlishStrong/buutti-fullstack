/* Create identical schema in H2 database for the testing purposes */
SET MODE MYSQL;

DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title varchar(255) NOT NULL UNIQUE,
    author varchar(255) NOT NULL,
    description varchar(500),
    CONSTRAINT chk_title_and_author_valid CHECK (LENGTH(TRIM(title)) > 0 AND LENGTH(TRIM(author)) > 0)
) DEFAULT CHARSET=utf8mb4;
