ALTER TABLE users
    ADD COLUMN emailVerified boolean NOT NULL AFTER email;
