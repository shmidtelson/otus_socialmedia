CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(50) NOT NULL,
  interests TEXT,
  city VARCHAR(255) NOT NULL,
  password TEXT NOT NULL
);