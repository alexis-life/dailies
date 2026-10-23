import assert from 'node:assert/strict'
import test from 'node:test'
import { parseAniguessrShareText } from './aniguessrShareText.js'

const SKIPPED_SHARE = `I got a score of 22,500 on AniGuessr (#1287)
- Guess The Anime: 7500
- Guess The Characters: 10000
- Guess The Opening: 2500
- Guess The Ending: 2500`

test('a share with no Anidle line parses and leaves anidle blank', () => {
  const parsed = parseAniguessrShareText(SKIPPED_SHARE)
  assert.deepEqual(parsed, {
    scores: {
      screenshot_score: 7500,
      characters_score: 10000,
      opening_score: 2500,
      ending_score: 2500,
      anidle_score: '',
    },
    puzzleNumber: 1287,
  })
})

test('a share that includes Anidle keeps that score', () => {
  const parsed = parseAniguessrShareText(`${SKIPPED_SHARE}
- Anidle: 5,000`)
  assert.equal(parsed.scores.anidle_score, 5000)
  assert.equal(parsed.puzzleNumber, 1287)
})

test('a partial paste fills only the lines it contains', () => {
  const parsed = parseAniguessrShareText('- Guess The Anime: 7,500')
  assert.deepEqual(parsed, {
    scores: { screenshot_score: 7500 },
    puzzleNumber: null,
  })
})

test('a line that mentions anidle without a score does not mark it skipped', () => {
  const parsed = parseAniguessrShareText(`${SKIPPED_SHARE}
- Unlimited Anidle: n/a`)
  assert.equal(Object.hasOwn(parsed.scores, 'anidle_score'), false)
})

test('text without a mode line does not parse', () => {
  assert.equal(parseAniguessrShareText('I got a score of 22,500 on AniGuessr (#1287)'), null)
  assert.equal(parseAniguessrShareText('hello'), null)
})
