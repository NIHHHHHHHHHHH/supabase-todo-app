import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TodoItem({ todo, onTodoUpdated }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', todo.id)

      if (error) throw error
      if (onTodoUpdated) onTodoUpdated()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todo.id)

      if (error) throw error
      if (onTodoUpdated) onTodoUpdated()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition duration-200">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={loading}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />
      <span
        className={`flex-1 ${
          todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-600 hover:text-red-700 disabled:opacity-50 px-3 py-1 rounded hover:bg-red-50 transition duration-200"
      >
        Delete
      </button>
    </div>
  )
}