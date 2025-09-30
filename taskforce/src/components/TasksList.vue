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
        {{ t.name }}
        <button @click="deleteTask(t.id)" style="margin-left:0.5rem">Delete</button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Task { id: number; name: string }

const tasks = ref<Task[]>([])
const newTask = ref('')
const loading = ref(false)
const error = ref('')

const API_BASE = '/api' // <-- rely on Vite proxy


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
  const name = newTask.value.trim()
  if (!name) return
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
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
 
 
onMounted(load)
</script>
