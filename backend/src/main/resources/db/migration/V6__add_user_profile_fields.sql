ALTER TABLE users
    ADD COLUMN bio VARCHAR(500) NULL AFTER last_name,
    ADD COLUMN profile_image_url VARCHAR(255) NULL AFTER bio,
    ADD COLUMN location VARCHAR(255) NULL AFTER profile_image_url,
    ADD COLUMN website VARCHAR(255) NULL AFTER location;
