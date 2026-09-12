export default function LetrecoBoardReplay({ guesses }) {
  if (!guesses || guesses.length === 0) return null

  return (
    <div className="board-replay">
      {guesses.map((g, i) => (
        <div className="board-replay-row" key={i}>
          <span className="board-replay-index text-meta">#{i + 1}</span>
          {g.solved ? (
            <span className="ax-badge badge-won">✅ solved</span>
          ) : (
            <div className="board-replay-colors">
              {g.letters.map((color, j) => (
                <span key={j} className={`letter-slot letter-slot--display letter-slot--${color}`} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
