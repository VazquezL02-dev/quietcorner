import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import { colourPictures } from '../data/colourPictures'
import { loadProgress, saveProgress } from '../lib/progress'

export default function ColourStudio({ student, onBack }) {
  const picture = colourPictures[0]
  const [selected, setSelected] = useState(1)
  const [painted, setPainted] = useState({})

  useEffect(() => {
    loadProgress(student.id, `colour:${picture.id}`).then(data => {
      if (data?.painted) setPainted(data.painted)
      if (data?.selected) setSelected(data.selected)
    })
  }, [student.id, picture.id])

  useEffect(() => {
    const timer = setTimeout(() => {
      saveProgress(student.id, `colour:${picture.id}`, {
        painted,
        selected,
        title: picture.title,
      })
    }, 250)
    return () => clearTimeout(timer)
  }, [painted, selected, student.id, picture.id, picture.title])

  const count = useMemo(
    () => Object.keys(painted).length,
    [painted],
  )

  function paint(row, col, number) {
    if (!number) return
    if (number !== selected) return
    setPainted(current => ({ ...current, [`${row}-${col}`]: number }))
  }

  return (
    <main className="app-shell">
      <Header title="Colour Studio" onBack={onBack} />
      <section className="activity-intro">
        <h2>{picture.title}</h2>
        <p>Choose a number, then gently fill matching spaces.</p>
      </section>

      <div className="palette-row">
        {Object.entries(picture.palette).map(([number, colour]) => (
          <button
            key={number}
            className={`palette-button ${Number(number) === selected ? 'selected' : ''}`}
            style={{ background: colour }}
            onClick={() => setSelected(Number(number))}
          >
            {number}
          </button>
        ))}
        <button className="soft-button" onClick={() => setPainted({})}>
          Start again
        </button>
      </div>

      <section className="colour-board">
        {picture.cells.flatMap((row, rowIndex) =>
          row.map((number, colIndex) => {
            const key = `${rowIndex}-${colIndex}`
            const isPainted = painted[key]
            return (
              <button
                key={key}
                className={`colour-cell ${number === 0 ? 'blank' : ''}`}
                style={{
                  background:
                    number === 0
                      ? 'transparent'
                      : isPainted
                        ? picture.palette[number]
                        : '#fffdf7',
                }}
                onClick={() => paint(rowIndex, colIndex, number)}
                aria-label={number ? `Number ${number}` : 'Blank space'}
              >
                {!isPainted && number ? number : ''}
              </button>
            )
          }),
        )}
      </section>

      <p className="save-note">Saved automatically · {count} spaces coloured</p>
    </main>
  )
}
