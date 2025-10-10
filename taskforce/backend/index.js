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
  console.log('Incoming body:', req.body)
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
// DELETE endpoint
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id])
    res.status(204).send() // No content
  } catch (err) {
    console.error('DELETE error:', err)
    res.status(500).json({ error: 'Database delete error' })
  }
})

// PUT endpoint
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params
  const { title } = req.body
  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *',
      [title, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error('UPDATE error:', err)
    res.status(500).json({ error: 'Database update error' })
  }
})




const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
