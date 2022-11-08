/*
    1) Create and use database called buutti;
*/
CREATE DATABASE IF NOT EXISTS buutti
CHARACTER SET utf8mb4 -- setting character set just in case (or if you do the execution in your own DB instance)
COLLATE utf8mb4_swedish_ci; -- setting collation just in case (or if you do the execution in your own DB instance)

USE buutti;

/*
    2) Create a table called books;
        NB! if it already exists, then drop it;
*/
DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title varchar(255) NOT NULL UNIQUE,
    author varchar(255) NOT NULL,
    description varchar(500),
    CONSTRAINT chk_title_and_author_valid CHECK (LENGTH(TRIM(title)) > 0 AND LENGTH(TRIM(author)) > 0)
) DEFAULT CHARSET=utf8mb4; -- setting character set just in case (or if you do the execution in your own DB instance)

/*
    3) If it will be important to find books by author name (or full-text search on name/s), then also execute this command and add this index;
        One note, however, MySQL documentation recommends to add full-text indices after loading the data! 
        So, don't alter books table before you load your data (if you have it, of course);
*/
-- ALTER TABLE books ADD FULLTEXT INDEX ftx_author (author);