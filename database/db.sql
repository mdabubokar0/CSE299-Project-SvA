-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    role varchar(255) NOT NULL
);

-- Create event table
CREATE TABLE event_info (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(500),
    venue VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL,
    capacity VARCHAR(100) NOT NULL,
    ticket INT NOT NULL
);

-- Create table for discussion
CREATE TABLE discussion_info (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

-- Create table for discussion comment
CREATE TABLE discussion_comment (
    id SERIAL PRIMARY KEY,
    discussion_id INT REFERENCES discussion_info(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL
);
