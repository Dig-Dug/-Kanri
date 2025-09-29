const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

// Postgres connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'taskforce',
  password: 'postgres',
  port: 5432,
})

app.get('/api/tasks', async (req, res) => {
  const result = await pool.query('SELECT id, name FROM tasks LIMIT 5')
  res.json(result.rows)
})

//app.listen(3000, () => console.log('Backend listening on port 3000'))

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
