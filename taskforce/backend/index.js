// index.js
require('dotenv').config() // <-- load .env variables first

const express = require('express')
const { Pool } = require('pg')

const app = express()
app.use(express.json())

// Database pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1', // Docker mapped to localhost
  database: process.env.DB_NAME || 'tasks',
  password: process.env.DB_PASSWORD || '1234',
  port: Number(process.env.DB_PORT) || 5432,
})

// Test DB connection
pool.connect()
  .then(() => console.log('✅ Connected to Postgres'))
  .catch(err => console.error('❌ DB connection error:', err))

// Example GET endpoint
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks')
    res.json(result.rows)
  } catch (err) {
    console.error('GET error:', err)
    res.status(500).json({ error: 'Database fetch error' })
  }
})

// Example POST endpoint
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO tasks(title) VALUES($1) RETURNING *',
      [title]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('POST error:', err)
    res.status(500).json({ error: 'Database insert error' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
