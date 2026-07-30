import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { loadProgress, saveProgress } from '../lib/progress'

const colours = ['#425b50', '#73907e', '#7d98aa', '#c78f8f', '#c7a765', '#6f6259']

export default function Sketchbook({ student, onBack }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const [colour, setColour] = useState(colours[0])
  const [size, setSize] = useState(5)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    loadProgress(student.id, 'sketchbook:main').then(data => {
      if (data?.image) {
        const image = new Image()
        image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        image.src = data.image
      }
      if (data?.colour) setColour(data.colour)
      if (data?.size) setSize(data.size)
      setLoaded(true)
    })
  }, [student.id])

  function point(event) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = event.touches?.[0]?.clientX ?? event.clientX
    const clientY = event.touches?.[0]?.clientY ?? event.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  function start(event) {
    event.preventDefault()
    drawing.current = true
    const ctx = canvasRef.current.getContext('2d')
    const p = point(event)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
  }

  function move(event) {
    if (!drawing.current) return
    event.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const p = point(event)
    ctx.strokeStyle = colour
    ctx.lineWidth = size
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }

  function stop() {
    if (!drawing.current) return
    drawing.current = false
    save()
  }

  function save() {
    const image = canvasRef.current.toDataURL('image/png')
    saveProgress(student.id, 'sketchbook:main', { image, colour, size })
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    saveProgress(student.id, 'sketchbook:main', { image: null, colour, size })
  }

  return (
    <main className="app-shell">
      <Header title="Sketchbook" onBack={onBack} />
      <section className="activity-intro">
        <h2>{student.name}'s Sketchbook</h2>
        <p>Draw anything you like. Your picture will wait here for you.</p>
      </section>

      <div className="drawing-tools">
        {colours.map(item => (
          <button
            key={item}
            className={`colour-dot ${item === colour ? 'selected-dot' : ''}`}
            style={{ background: item }}
            onClick={() => setColour(item)}
            aria-label="Choose drawing colour"
          />
        ))}
        <label>
          Brush
          <input
            type="range"
            min="2"
            max="18"
            value={size}
            onChange={event => setSize(Number(event.target.value))}
          />
        </label>
        <button className="soft-button" onClick={clearCanvas}>Clear page</button>
      </div>

      <canvas
        ref={canvasRef}
        className="sketch-canvas"
        width="900"
        height="520"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={stop}
      />

      <p className="save-note">{loaded ? 'Saved automatically' : 'Opening your sketchbook…'}</p>
    </main>
  )
}
