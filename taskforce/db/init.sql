CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

INSERT INTO tasks (name) VALUES
('Learn Docker'),
('Build Backend API'),
('Connect Vue Frontend'),
('Test with Postman'),
('Celebrate small wins')
ON CONFLICT DO NOTHING;
