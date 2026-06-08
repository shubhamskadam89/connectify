ALTER TABLE users
    ADD COLUMN role VARCHAR(5) NOT NULL DEFAULT 'USER';

ALTER TABLE users
    ADD CONSTRAINT users_role_check
        CHECK (role IN ('USER', 'ADMIN'));