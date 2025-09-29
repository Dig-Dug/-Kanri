const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

// Postgres connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost', // use 'db' in Docker Compose
  database: process.env.DB_NAME || 'taskforce',
  password: process.env.DB_PASSWORD || 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
})

// GET tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM tasks ORDER BY id ASC')
    res.json(result.rows)
  } catch (err) {
    console.error('GET error:', err)
    res.status(500).json({ error: 'Database fetch error' })
  }
})

// POST new task
app.post('/api/tasks', async (req, res) => {
  const { name } = req.body
  console.log('POST /api/tasks payload:', req.body)

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Task name is required' })
  }

  try {
    const result = await pool.query('INSERT INTO tasks(name) VALUES($1) RETURNING *', [name.trim()])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('DB insert error:', err)
    res.status(500).json({ error: 'Database insert error' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
