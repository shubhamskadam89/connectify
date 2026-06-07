CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,

                       first_name VARCHAR(255),
                       last_name VARCHAR(255),

                       username VARCHAR(255) NOT NULL UNIQUE,

                       password VARCHAR(255) NOT NULL,

                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);