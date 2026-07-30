import { useEffect, useState } from 'react'

export default function GentleTimer({ minutes = 5 }) {
  const [seconds, setSeconds] = useState(minutes * 60)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (seconds <= 0) {
      setFinished(true)
      return
    }

    const timer = window.setInterval(() => {
      setSeconds(value => value - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [seconds])

  const percent = Math.max(0, (seconds / (minutes * 60)) * 100)

  return (
    <div className="gentle-timer" aria-label="Five minute quiet timer">
      <div className="timer-track">
        <div className="timer-fill" style={{ width: `${percent}%` }} />
      </div>
      <span>
        {finished
          ? 'Quiet time is complete. Finish when you are ready.'
          : 'Take your time.'}
      </span>
    </div>
  )
}
