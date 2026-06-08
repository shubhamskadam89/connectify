ALTER TABLE users
    ADD COLUMN email VARCHAR(255) NOT NULL AFTER last_name;

ALTER TABLE users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
