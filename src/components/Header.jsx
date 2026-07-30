import { ArrowLeft, LogOut, Leaf } from 'lucide-react'

export default function Header({ title, onBack, onExit }) {
  return (
    <header className="topbar">
      <div>
        {onBack ? (
          <button className="icon-button" onClick={onBack} aria-label="Back">
            <ArrowLeft size={22} />
          </button>
        ) : (
          <div className="brand-mark"><Leaf size={20} /></div>
        )}
      </div>
      <h1>{title}</h1>
      <div>
        {onExit && (
          <button className="icon-button" onClick={onExit} aria-label="Change profile">
            <LogOut size={21} />
          </button>
        )}
      </div>
    </header>
  )
}
