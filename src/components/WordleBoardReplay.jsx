export default function WordleBoardReplay({ guesses }) {
  const sorted = [...guesses].sort((a, b) => a.row_index - b.row_index)

  return (
    <div className="board-replay">
      {sorted.map((g) => {
        const { letters, statuses } = g.payload
        return (
          <div className="board-replay-row" key={g.id ?? g.row_index}>
            <span className="board-replay-index text-meta">#{g.row_index + 1}</span>
            <div className="board-replay-colors">
              {letters.map((letter, i) => (
                <span key={i} className={`letter-slot letter-slot--display letter-slot--${statuses?.[i] ?? 'gray'}`}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
