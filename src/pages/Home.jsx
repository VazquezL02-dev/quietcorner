import Header from '../components/Header'
import GentleTimer from '../components/GentleTimer'
import { Palette, Search, PencilLine, Flower2, Puzzle, Waves } from 'lucide-react'

const activities = [
  {
    id: 'colour',
    title: 'Colour Studio',
    description: 'Complete a peaceful colour-by-number picture.',
    icon: Palette,
    available: true,
  },
  {
    id: 'word-search',
    title: 'Word Search',
    description: 'Find hidden words at your own pace.',
    icon: Search,
    available: true,
  },
  {
    id: 'sketchbook',
    title: 'Sketchbook',
    description: 'Draw freely and return to your picture later.',
    icon: PencilLine,
    available: true,
  },
  {
    id: 'patterns',
    title: 'Pattern Maker',
    description: 'Create gentle repeating designs.',
    icon: Flower2,
    available: false,
  },
  {
    id: 'puzzles',
    title: 'Puzzle Table',
    description: 'Slow puzzles with no score and no rush.',
    icon: Puzzle,
    available: false,
  },
  {
    id: 'zen',
    title: 'Zen Garden',
    description: 'Make marks, ripples and quiet patterns.',
    icon: Waves,
    available: false,
  },
]

export default function Home({ student, onOpen, onExit }) {
  return (
    <main className="app-shell">
      <Header title="Quiet Corner" onExit={onExit} />
      <section className="home-hero">
        <div>
          <p className="eyebrow">Welcome back, {student.name}</p>
          <h2>What would you like to do today?</h2>
          <p>Choose one quiet activity. There is no rush and nothing to win.</p>
        </div>
        <div className="window-scene" aria-hidden="true">
          <div className="sun" />
          <div className="hill hill-one" />
          <div className="hill hill-two" />
          <div className="plant">🪴</div>
        </div>
      </section>

      <GentleTimer />

      <section className="activity-grid">
        {activities.map(({ id, title, description, icon: Icon, available }) => (
          <button
            key={id}
            className={`activity-card ${available ? '' : 'coming-soon'}`}
            onClick={() => available && onOpen(id)}
            disabled={!available}
          >
            <span className="activity-icon"><Icon size={30} /></span>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
              {!available && <em>Coming soon</em>}
            </span>
          </button>
        ))}
      </section>
    </main>
  )
}
