import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ANIGUESSR_MODES,
  aniguessrDailyTotal,
  aniguessrModeAverage,
  aniguessrModePlayedCount,
  aniguessrScoresForSave,
  validateAniguessrEntry,
} from './aniguessrScores.js'

const anidle = ANIGUESSR_MODES.find((mode) => mode.key === 'anidle_score')
const screenshot = ANIGUESSR_MODES.find((mode) => mode.key === 'screenshot_score')

const skippedDay = {
  screenshot_score: 7500,
  characters_score: 10000,
  opening_score: 2500,
  ending_score: 2500,
  anidle_score: null,
}

const playedDay = {
  screenshot_score: 10000,
  characters_score: 5000,
  opening_score: 2500,
  ending_score: 2500,
  anidle_score: 5000,
}

test('a blank anidle validates and saves as null', () => {
  const scores = { ...skippedDay, anidle_score: '' }
  assert.equal(validateAniguessrEntry({ puzzleNumber: '1287', scores }), null)
  assert.deepEqual(aniguessrScoresForSave(scores), {
    screenshot_score: 7500,
    characters_score: 10000,
    opening_score: 2500,
    ending_score: 2500,
    anidle_score: null,
  })
})

test('a blank required mode still fails validation', () => {
  const scores = { ...playedDay, screenshot_score: '' }
  assert.equal(
    validateAniguessrEntry({ puzzleNumber: '1287', scores }),
    'Enter a score for screenshot.',
  )
})

test('anidle 0 is a played score, not a skip', () => {
  const scores = { ...playedDay, anidle_score: 0 }
  assert.equal(aniguessrScoresForSave(scores).anidle_score, 0)
  assert.equal(aniguessrModeAverage([scores], anidle), 0)
  assert.equal(aniguessrModePlayedCount([scores], anidle), 1)
})

test('daily total sums only the rounds that exist', () => {
  assert.equal(aniguessrDailyTotal(skippedDay), 22500)
  assert.equal(aniguessrDailyTotal({ ...skippedDay, anidle_score: '' }), 22500)
  assert.equal(aniguessrDailyTotal(playedDay), 25000)
})

test('anidle average ignores skipped days and other averages stay on every day', () => {
  const games = [playedDay, skippedDay]
  assert.equal(aniguessrModeAverage(games, anidle), 5000)
  assert.equal(aniguessrModePlayedCount(games, anidle), 1)
  assert.equal(aniguessrModeAverage(games, screenshot), Math.round((10000 + 7500) / 2))
})

test('a null score on a required mode still counts as 0', () => {
  const ending = ANIGUESSR_MODES.find((mode) => mode.key === 'ending_score')
  const games = [{ ...playedDay, ending_score: null }, playedDay]
  assert.equal(aniguessrModeAverage(games, ending), Math.round((0 + 2500) / 2))
  assert.equal(aniguessrDailyTotal(games[0]), 22500)
  assert.equal(aniguessrModeAverage(games, anidle), 5000)
})

test('filled anidle days match the old average over every logged day', () => {
  const games = [playedDay, { ...playedDay, anidle_score: 7500, screenshot_score: 5000 }]
  const oldAnidle = Math.round((5000 + 7500) / games.length)
  const oldScreenshot = Math.round(games.reduce((sum, g) => sum + (g.screenshot_score ?? 0), 0) / games.length)
  assert.equal(aniguessrModeAverage(games, anidle), oldAnidle)
  assert.equal(aniguessrModeAverage(games, screenshot), oldScreenshot)
})

test('no logged days still averages to 0', () => {
  assert.equal(aniguessrModeAverage([], anidle), 0)
  assert.equal(aniguessrModeAverage([], screenshot), 0)
})

test('logged days that all skipped anidle have no anidle average', () => {
  assert.equal(aniguessrModeAverage([skippedDay], anidle), null)
})
