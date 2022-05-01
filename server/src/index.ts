import express from 'express'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

interface Track {
  toFile: string
  fromFile: string
  startTime: `${string}:${string}:${string}`
  endTime: `${string}:${string}:${string}`
}

interface Args {
  tracks: Track[]
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

function tracksAreValid(tracks: unknown): tracks is Track[] {
  return (
    Array.isArray(tracks) &&
    tracks.every(
      (track) =>
        isObject(track) &&
        'toFile' in track &&
        'fromFile' in track &&
        'startTime' in track &&
        'endTime' in track &&
        typeof track.startTime === 'string' &&
        /\d{2}:\d{2}:\d{2}/.test(track.startTime) &&
        typeof track.endTime === 'string' &&
        /\d{2}:\d{2}:\d{2}/.test(track.endTime)
    )
  )
}

function argsAreValid(body: unknown): body is Args {
  return isObject(body) && 'tracks' in body && tracksAreValid(body.tracks)
}

app.post('/splitIntoTracks', async (req, res) => {
  try {
    console.log(req.body)
    const body = (await req.body) as unknown

    if (!argsAreValid(body)) {
      return res.status(400).json({ message: 'Invalid request body' })
    }

    for await (const track of body.tracks) {
      const { toFile, fromFile, startTime, endTime } = track

      if (fs.existsSync(path.resolve(__dirname, '../output/', toFile))) {
        console.log(`File ${toFile} already exists, skipping...`)
        continue
      }

      await new Promise<void>((resolve, reject) =>
        exec(
          `ffmpeg -i "${path.resolve(
            __dirname,
            '../sources/',
            fromFile
          )}" -c copy -ss "${startTime}" -to "${endTime}" "${path.resolve(
            __dirname,
            '../output/',
            toFile
          )}"`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Error creating file ${toFile}`)
              reject()
            }

            resolve()
          }
        )
      )
    }
    res.status(201).json({ message: 'Tracks created' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.listen(4000, () => {
  console.log('Listening on localhost:4000')
})
