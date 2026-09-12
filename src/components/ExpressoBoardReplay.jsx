export default function ExpressoBoardReplay({ guesses }) {
  if (!guesses || guesses.length === 0) return null

  return (
    <div className="board-replay">
      {guesses.map((g, i) => (
        <div className="board-replay-row" key={i}>
          <span className="board-replay-index text-meta">#{i + 1}</span>
          <div className="board-replay-colors board-replay-colors--wrap">
            {g.words.map((word, wi) => (
              <div className="expresso-word-group" key={wi}>
                {word.map((color, li) => (
                  <span key={li} className={`letter-slot letter-slot--display letter-slot--${color}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
