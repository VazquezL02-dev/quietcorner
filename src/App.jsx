import { useState } from 'react'
import ProfilePicker from './pages/ProfilePicker'
import Home from './pages/Home'
import ColourStudio from './pages/ColourStudio'
import WordSearch from './pages/WordSearch'
import Sketchbook from './pages/Sketchbook'

export default function App() {
  const [student, setStudent] = useState(null)
  const [page, setPage] = useState('home')

  if (!student) {
    return <ProfilePicker onChoose={chosen => {
      setStudent(chosen)
      setPage('home')
    }} />
  }

  if (page === 'colour') {
    return <ColourStudio student={student} onBack={() => setPage('home')} />
  }

  if (page === 'word-search') {
    return <WordSearch student={student} onBack={() => setPage('home')} />
  }

  if (page === 'sketchbook') {
    return <Sketchbook student={student} onBack={() => setPage('home')} />
  }

  return (
    <Home
      student={student}
      onOpen={setPage}
      onExit={() => {
        setStudent(null)
        setPage('home')
      }}
    />
  )
}
