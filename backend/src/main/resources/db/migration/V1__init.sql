-- Example Flyway migration: create a simple table
CREATE TABLE IF NOT EXISTS example_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
); 