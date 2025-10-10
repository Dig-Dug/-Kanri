<template>
  <section>
    <h2>Tasks</h2>

    <form @submit.prevent="addTask" style="margin-bottom:1rem">
      <input v-model="newTask" placeholder="New task" />
      <button type="submit">Add</button>
    </form>

    <div v-if="loading">Loading…</div>
    <div v-if="error" style="color:crimson">{{ error }}</div>

    <ul>
      <li v-for="t in tasks" :key="t.id">
        <template v-if="editingId === t.id">
          <input v-model="editText" />
          <button @click="saveEdit(t.id)">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </template>

        <template v-else>
          {{ t.title }}
          <button @click="startEdit(t)">Edit</button>
          <button @click="deleteTask(t.id)" style="margin-left:0.5rem">Delete</button>
        </template>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Task { id: number; title: string }

const tasks = ref<Task[]>([])
const newTask = ref('')
const loading = ref(false)
const error = ref('')
const editingId = ref<number | null>(null)
const editText = ref('')

const API_BASE = '/api' // rely on Vite proxy

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/tasks`)
    if (!res.ok) throw new Error(await res.text())
    tasks.value = await res.json()
  } catch (err: any) {
    error.value = err.message ?? 'Failed to load tasks'
  } finally {
    loading.value = false
  }
}

async function addTask() {
  const title = newTask.value.trim()
  if (!title) return
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
    if (!res.ok) throw new Error(await res.text())
    const created = await res.json()
    tasks.value.unshift(created)
    newTask.value = ''
  } catch (err: any) {
    error.value = err.message ?? 'Failed to create task'
  }
}

async function deleteTask(id: number) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
    tasks.value = tasks.value.filter(t => t.id !== id)
  } catch (err: any) {
    error.value = err.message ?? 'Failed to delete task'
  }
}

function startEdit(task: Task) {
  editingId.value = task.id
  editText.value = task.title
}

function cancelEdit() {
  editingId.value = null
  editText.value = ''
}

async function saveEdit(id: number) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editText.value })
    })
    if (!res.ok) throw new Error(await res.text())
    const updated = await res.json()
    tasks.value = tasks.value.map(t => (t.id === id ? updated : t))
    editingId.value = null
    editText.value = ''
  } catch (err: any) {
    error.value = err.message ?? 'Failed to update task'
  }
}

onMounted(load)
</script>
