import express from 'express'
import path from 'path'
import fs from 'fs'
import { format, differenceInMinutes, differenceInSeconds } from 'date-fns'
import { exec } from 'child_process'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
)

app.use(bodyParser.json())

interface Track {
  name: string
  startTime: `${string}:${string}:${string}`
  endTime: `${string}:${string}:${string}`
}

interface Metadata {
  title?: string
  artist?: string
  album_artist?: string
  album?: string
  year?: string
  genre?: string
  comment?: string
  composer?: string
  original_artist?: string
  copyright?: string
}

interface Args {
  sourceFile: string
  fileFormat: string
  metadata?: Metadata
  tracks: Track[]
}

function padNumber(number: number) {
  return number < 10 ? `0${number}` : number
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
        'name' in track &&
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
  return (
    isObject(body) &&
    'sourceFile' in body &&
    typeof body.sourceFile === 'string' &&
    'fileFormat' in body &&
    typeof body.fileFormat === 'string' &&
    'tracks' in body &&
    tracksAreValid(body.tracks) &&
    (('metadata' in body && isObject(body.metadata)) || !('metadata' in body))
  )
}

app.post('/splitIntoTracks', async (req, res) => {
  try {
    const body = (await req.body) as unknown

    if (!argsAreValid(body)) {
      return res.status(400).json({ message: 'Invalid request body' })
    }

    let trackNumber = 1
    for await (const track of body.tracks) {
      const { name, startTime, endTime } = track

      if (fs.existsSync(path.resolve(__dirname, '../output/', name))) {
        console.log(`File ${name} already exists, skipping...`)
        continue
      }

      const sourcePath = path.resolve(__dirname, '../sources/', body.sourceFile)
      const initialOutputPath = path.resolve(
        __dirname,
        '../output/',
        `copy_${name}.${body.fileFormat}`
      )
      const finalOutputPath = path.resolve(
        __dirname,
        '../output/',
        `${name}.${body.fileFormat}`
      )

      const seconds = differenceInSeconds(
        new Date(`2020-01-01T${endTime}`),
        new Date(`2020-01-01T${startTime}`)
      )
      const trackEndTime = `00:${padNumber(
        Math.floor(seconds / 60)
      )}:${padNumber(seconds % 60)}`

      const defaultMetadata = [
        `-metadata track="${padNumber(trackNumber)}"`,
        `-metadata title="${name}"`,
      ]

      const metadata = body.metadata
        ? Object.keys(body.metadata).reduce((acc, key) => {
            acc.push(`-metadata ${key}="${body.metadata[key]}"`)
            return acc
          }, defaultMetadata)
        : defaultMetadata

      const createTrack = `ffmpeg -i "${sourcePath}" ${metadata.join(
        ' '
      )} -c copy -ss "${startTime}" -to "${endTime}" "${initialOutputPath}"`
      const correctTrackLength = `ffmpeg -i "${initialOutputPath}" -ss 00:00:00 -to "${trackEndTime}" "${finalOutputPath}"`
      const cleanup = `rm "${path.resolve(
        __dirname,
        '../output',
        initialOutputPath
      )}"`

      console.log(`Creating track ${trackNumber} "${name}"...`)

      await new Promise<void>((resolve, reject) => {
        exec(createTrack, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error creating file ${initialOutputPath}`)
            reject()
          }

          resolve()
        })
      })

      console.log(`Correcting track ${trackNumber} "${name}" length...`)

      await new Promise<void>((resolve, reject) => {
        exec(correctTrackLength, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error creating file ${finalOutputPath}`)
            reject()
          }

          resolve()
        })
      })

      console.log(`Cleaning up...`)

      // Cleanup
      await new Promise<void>((resolve, reject) => {
        exec(cleanup, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error removing file ${initialOutputPath}`)
            reject()
          }

          resolve()
        })
      })

      trackNumber++
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
