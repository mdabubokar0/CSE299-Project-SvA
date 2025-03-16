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

-- Create table for photographers
CREATE TABLE photographer_info (
    nid INT PRIMARY KEY, 
    id INT UNIQUE,  
    picture TEXT,  
    bio VARCHAR(250),  
    contact_no VARCHAR(11),  
    experience VARCHAR(250),  
    camera_model VARCHAR(100), 
    hourly_charge DECIMAL(10,2),
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE event_payment (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES event_info(id) ON DELETE SET NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  transaction_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photographer_payment (
  id SERIAL PRIMARY KEY,
  photographer_id INT REFERENCES photographer_info(id) ON DELETE SET NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  transaction_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
