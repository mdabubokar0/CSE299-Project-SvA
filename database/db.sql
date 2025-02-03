-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    role varchar(255) NOT NULL
);