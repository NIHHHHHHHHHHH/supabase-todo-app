import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import AddTodo from './components/AddTodo'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      console.log('Session:', session) // ← Debug log
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      console.log('Auth changed:', session) // ← Debug log
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  // If not logged in, show Auth
  if (!session) {
    return <Auth />
  }

  // If logged in, show AddTodo component for testing
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">AddTodo</h1>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg"
            >
              Sign Out
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Logged in as: <strong>{session.user.email}</strong>
          </p>

          {/* Test AddTodo component */}
          <AddTodo 
            user={session.user} 
            onTodoAdded={() => {
              console.log('✅ Todo added callback fired!')
              alert('Todo added successfully!')
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default App