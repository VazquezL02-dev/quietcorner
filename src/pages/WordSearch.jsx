import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { wordSearches } from '../data/wordSearches'
import { loadProgress, saveProgress } from '../lib/progress'

export default function WordSearch({ student, onBack }) {
  const puzzle = wordSearches[0]
  const [selectedCells, setSelectedCells] = useState({})
  const [foundWords, setFoundWords] = useState([])

  useEffect(() => {
    loadProgress(student.id, `word-search:${puzzle.id}`).then(data => {
      if (data?.selectedCells) setSelectedCells(data.selectedCells)
      if (data?.foundWords) setFoundWords(data.foundWords)
    })
  }, [student.id, puzzle.id])

  useEffect(() => {
    const timer = setTimeout(() => {
      saveProgress(student.id, `word-search:${puzzle.id}`, {
        selectedCells,
        foundWords,
        title: puzzle.title,
      })
    }, 250)
    return () => clearTimeout(timer)
  }, [selectedCells, foundWords, student.id, puzzle.id, puzzle.title])

  function toggleCell(row, col) {
    const key = `${row}-${col}`
    setSelectedCells(current => ({
      ...current,
      [key]: !current[key],
    }))
  }

  function toggleWord(word) {
    setFoundWords(current =>
      current.includes(word)
        ? current.filter(item => item !== word)
        : [...current, word],
    )
  }

  return (
    <main className="app-shell">
      <Header title="Word Search" onBack={onBack} />
      <section className="activity-intro">
        <h2>{puzzle.title}</h2>
        <p>Tap letters as you find each word. Tap the word when it is complete.</p>
      </section>

      <section className="word-layout">
        <div className="word-grid">
          {puzzle.grid.flatMap((row, rowIndex) =>
            row.map((letter, colIndex) => {
              const key = `${rowIndex}-${colIndex}`
              return (
                <button
                  key={key}
                  className={selectedCells[key] ? 'letter selected-letter' : 'letter'}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                >
                  {letter}
                </button>
              )
            }),
          )}
        </div>

        <div className="word-list">
          <h3>Words</h3>
          {puzzle.words.map(word => (
            <button
              key={word}
              className={foundWords.includes(word) ? 'word found' : 'word'}
              onClick={() => toggleWord(word)}
            >
              {word}
            </button>
          ))}
        </div>
      </section>

      <p className="save-note">
        Saved automatically · {foundWords.length} of {puzzle.words.length} words marked
      </p>
    </main>
  )
}
