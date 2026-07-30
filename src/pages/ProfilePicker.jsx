import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Leaf, UserRound } from 'lucide-react'

function displayName(student) {
  return (
    student.display_name ||
    student.name ||
    student.full_name ||
    [student.first_name, student.last_name].filter(Boolean).join(' ') ||
    `Student ${student.id}`
  )
}

export default function ProfilePicker({ onChoose }) {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('Loading profiles…')

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setMessage('Add your Supabase details to the .env file.')
        return
      }

      const { data, error } = await supabase.from('students').select('*')

      if (error) {
        setMessage(`Profiles could not load: ${error.message}`)
        return
      }

      const active = (data || []).filter(student =>
        student.active === undefined &&
        student.is_active === undefined
          ? true
          : student.active !== false && student.is_active !== false,
      )

      active.sort((a, b) => displayName(a).localeCompare(displayName(b)))
      setStudents(active)
      setMessage(active.length ? '' : 'No active student profiles were found.')
    }

    load()
  }, [])

  const filtered = useMemo(
    () =>
      students.filter(student =>
        displayName(student).toLowerCase().includes(search.toLowerCase()),
      ),
    [students, search],
  )

  return (
    <main className="profile-page">
      <section className="welcome-card">
        <div className="large-leaf"><Leaf size={42} /></div>
        <p className="eyebrow">A peaceful place for five-minute breaks</p>
        <h1>Quiet Corner</h1>
        <p>Choose your profile to continue where you left off.</p>

        <input
          className="profile-search"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Find your name"
          aria-label="Find your name"
        />

        {message && <p className="status-message">{message}</p>}

        <div className="profile-grid">
          {filtered.map(student => (
            <button
              className="profile-button"
              key={student.id}
              onClick={() =>
                onChoose({ id: student.id, name: displayName(student) })
              }
            >
              <span className="avatar"><UserRound size={24} /></span>
              <span>{displayName(student)}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
