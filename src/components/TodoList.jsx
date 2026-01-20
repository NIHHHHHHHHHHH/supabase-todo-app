import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import TodoItem from './TodoItem'
import AddTodo from './AddTodo'

export default function TodoList({ user }) {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('todos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTodos()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user.id])

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Todos</h1>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Sign Out
            </button>
          </div>

          <AddTodo user={user} onTodoAdded={fetchTodos} />

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No todos yet. Add one above!
            </div>
          ) : (
            <div className="space-y-2">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onTodoUpdated={fetchTodos} />
              ))}
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          {todos.filter((t) => !t.completed).length} of {todos.length} tasks remaining
        </div>
      </div>
    </div>
  )
}