import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Header() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold">FeelGoodReads</span>
        </Link>
        <div>
          {user ? (
            <div className="flex items-center">
              <span className="mr-4">{user.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login">
              <span className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Login</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
